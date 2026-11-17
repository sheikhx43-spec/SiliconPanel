import assert from 'node:assert/strict';
import test from 'node:test';
import {
	acknowledgeAlert,
	addDatabase,
	addDomain,
	addFileEntry,
	addFirewallRule,
	addMailAccount,
	computeKpis,
	createBackupSnapshot,
	createInitialPanelState,
	deleteDatabase,
	deleteDomain,
	resolveTheme,
	toggleDomainStatus,
} from './panelState.js';

test('initial panel state matches reference dashboard KPIs', () => {
	const state = createInitialPanelState();
	const kpis = computeKpis(state);

	assert.equal(kpis.activeDomains, 3);
	assert.equal(kpis.diskUsedGb, 12.5);
	assert.equal(kpis.diskTotalGb, 50);
	assert.equal(kpis.databasesCount, 5);
	assert.equal(kpis.databaseUsedMb, 374);
	assert.equal(kpis.mailAccountsCount, 3);
	assert.equal(kpis.mailUsedMb, 866);
	assert.equal(kpis.bandwidthUsedGb, 30);
	assert.equal(kpis.bandwidthTotalGb, 200);
	assert.equal(kpis.unreadAlertsCount, 2);
});

test('resolveTheme defaults to dark and honors light preference', () => {
	assert.equal(resolveTheme(null), 'dark');
	assert.equal(resolveTheme('dark'), 'dark');
	assert.equal(resolveTheme('light'), 'light');
});

test('adding, suspending, and deleting a domain updates KPIs and audit log', () => {
	const initial = createInitialPanelState();
	const invalid = addDomain(initial, { domain: 'invalid-domain' });
	assert.equal(invalid.ok, false);

	const added = addDomain(initial, { domain: 'cloud.siliconempire.com' });
	assert.equal(added.ok, true);
	assert.equal(computeKpis(added.state).activeDomains, 4);
	assert.match(added.state.auditLog[0].message, /cloud\.siliconempire\.com/);

	const newId = added.state.domains[0].id;
	const suspended = toggleDomainStatus(added.state, newId);
	assert.equal(computeKpis(suspended).activeDomains, 3);

	const removed = deleteDomain(suspended, newId);
	assert.equal(removed.domains.length, 3);
});

test('adding and deleting a database updates database count and usage KPIs', () => {
	const initial = createInitialPanelState();
	const bad = addDatabase(initial, { name: '', user: '' });
	assert.equal(bad.ok, false);

	const added = addDatabase(initial, { name: 'admin_billing', user: 'admin_bill' });
	assert.equal(added.ok, true);
	assert.equal(computeKpis(added.state).databasesCount, 6);
	assert.equal(computeKpis(added.state).databaseUsedMb, 378);

	const removed = deleteDatabase(added.state, added.state.databases[0].id);
	assert.equal(computeKpis(removed).databasesCount, 5);
	assert.equal(computeKpis(removed).databaseUsedMb, 374);
});

test('adding mail account, file entry, firewall rule, backup, and acknowledging alerts', () => {
	let state = createInitialPanelState();

	const mailRes = addMailAccount(state, { localPart: 'support', domain: 'siliconpanel.com' });
	assert.equal(mailRes.ok, true);
	state = mailRes.state;
	assert.equal(state.mailAccounts[0].email, 'support@siliconpanel.com');
	assert.equal(computeKpis(state).mailAccountsCount, 4);
	assert.equal(computeKpis(state).mailUsedMb, 866);

	const fileRes = addFileEntry(state, { name: 'health.json', type: 'file', content: '{"ok":true}' });
	assert.equal(fileRes.ok, true);
	state = fileRes.state;
	assert.equal(state.files[0].name, 'health.json');

	const fwRes = addFirewallRule(state, { action: 'ACCEPT', protocol: 'TCP', port: '8083' });
	assert.equal(fwRes.ok, true);
	state = fwRes.state;
	assert.equal(state.firewallRules[0].port, '8083');

	state = createBackupSnapshot(state, 'Pre-upgrade');
	assert.equal(state.backups.length, 2);
	assert.equal(state.auditLog[0].message, 'Backup archive created');

	state = acknowledgeAlert(state, 'alt-1');
	assert.equal(computeKpis(state).unreadAlertsCount, 1);
});
