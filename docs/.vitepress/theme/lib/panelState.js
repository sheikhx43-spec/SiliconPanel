export const THEME_STORAGE_KEY = 'silicon-panel-theme';

export function resolveTheme(savedTheme) {
	return savedTheme === 'light' ? 'light' : 'dark';
}

export function createInitialPanelState() {
	return {
		host: 'node-01.siliconempire.vps',
		os: 'Ubuntu 24.04 LTS',
		panelUrl: 'https://panel.siliconpanel.com:8443',
		diskTotalGb: 50,
		baseDiskUsedGb: 10.7,
		bandwidthUsedGb: 30,
		bandwidthTotalGb: 200,
		visitorsToday: 452,
		cpuUsagePct: 18,
		memoryUsedGb: 1.2,
		memoryTotalGb: 4.0,
		domains: [
			{
				id: 'dom-1',
				domain: 'siliconpanel.com',
				ip: '198.51.100.24',
				phpVersion: '8.3',
				ssl: true,
				status: 'active',
				diskGb: 0.9,
				subdomains: ['panel.siliconpanel.com', 'docs.siliconpanel.com'],
			},
			{
				id: 'dom-2',
				domain: 'siliconempire.io',
				ip: '198.51.100.24',
				phpVersion: '8.3',
				ssl: true,
				status: 'active',
				diskGb: 0.6,
				subdomains: ['api.siliconempire.io'],
			},
			{
				id: 'dom-3',
				domain: 'demos.siliconpanel.com',
				ip: '198.51.100.24',
				phpVersion: '8.2',
				ssl: true,
				status: 'active',
				diskGb: 0.3,
				subdomains: [],
			},
		],
		databases: [
			{ id: 'db-1', name: 'admin_silicon_core', user: 'admin_core', host: 'localhost', sizeMb: 142, engine: 'MariaDB 10.11' },
			{ id: 'db-2', name: 'admin_empire_crm', user: 'admin_crm', host: 'localhost', sizeMb: 88, engine: 'MariaDB 10.11' },
			{ id: 'db-3', name: 'admin_wp_portal', user: 'admin_wp', host: 'localhost', sizeMb: 64, engine: 'MariaDB 10.11' },
			{ id: 'db-4', name: 'admin_analytics', user: 'admin_metrics', host: 'localhost', sizeMb: 51, engine: 'MariaDB 10.11' },
			{ id: 'db-5', name: 'admin_mail_store', user: 'admin_mail', host: 'localhost', sizeMb: 29, engine: 'MariaDB 10.11' },
		],
		mailAccounts: [
			{ id: 'mail-1', email: 'demos@siliconpanel.com', domain: 'siliconpanel.com', quotaMb: 2048, usedMb: 184, rateLimit: 200, status: 'active' },
			{ id: 'mail-2', email: 'admin@siliconempire.io', domain: 'siliconempire.io', quotaMb: 5120, usedMb: 640, rateLimit: 500, status: 'active' },
			{ id: 'mail-3', email: 'noreply@siliconpanel.com', domain: 'siliconpanel.com', quotaMb: 1024, usedMb: 42, rateLimit: 300, status: 'active' },
		],
		files: [
			{
				id: 'file-1',
				path: '/home/admin/web/siliconpanel.com/public_html',
				name: 'index.html',
				type: 'file',
				permissions: '0644',
				size: '4.2 KB',
				modified: '2h ago',
				content: '<!doctype html>\n<html lang="en">\n  <head><title>Silicon Panel</title></head>\n  <body><h1>Powered by Silicon Empire Ltd</h1></body>\n</html>',
			},
			{
				id: 'file-2',
				path: '/home/admin/web/siliconpanel.com/public_html',
				name: 'robots.txt',
				type: 'file',
				permissions: '0644',
				size: '128 B',
				modified: '1d ago',
				content: 'User-agent: *\nAllow: /',
			},
			{
				id: 'file-3',
				path: '/home/admin/web/siliconpanel.com/public_html',
				name: 'assets',
				type: 'dir',
				permissions: '0755',
				size: '4.0 KB',
				modified: '2d ago',
				content: '',
			},
			{
				id: 'file-4',
				path: '/home/admin/web/siliconpanel.com/public_html',
				name: '.htaccess',
				type: 'file',
				permissions: '0644',
				size: '612 B',
				modified: '3d ago',
				content: 'RewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]',
			},
		],
		ftpAccounts: [
			{ id: 'ftp-1', username: 'admin_web', domain: 'siliconpanel.com', path: '/home/admin/web/siliconpanel.com/public_html' },
			{ id: 'ftp-2', username: 'empire_deploy', domain: 'siliconempire.io', path: '/home/admin/web/siliconempire.io/public_html' },
		],
		dnsRecords: [
			{ id: 'dns-1', domain: 'siliconpanel.com', record: '@', type: 'A', value: '198.51.100.24', ttl: 14400 },
			{ id: 'dns-2', domain: 'siliconpanel.com', record: 'www', type: 'CNAME', value: 'siliconpanel.com.', ttl: 14400 },
			{ id: 'dns-3', domain: 'siliconpanel.com', record: 'mail', type: 'A', value: '198.51.100.24', ttl: 14400 },
			{ id: 'dns-4', domain: 'siliconpanel.com', record: '@', type: 'MX', value: 'mail.siliconpanel.com.', ttl: 14400 },
		],
		redirects: [
			{ id: 'red-1', source: 'http://siliconpanel.com', target: 'https://siliconpanel.com', code: '301' },
		],
		backups: [
			{ id: 'bkp-1', filename: 'admin.2026-11-17_09-00.tar.zst', size: '1.84 GB', createdAt: '2h ago', type: 'Full Snapshot' },
		],
		firewallRules: [
			{ id: 'fw-1', action: 'ACCEPT', protocol: 'TCP', port: '8443', source: '0.0.0.0/0', comment: 'Silicon Panel HTTPS', enabled: true },
			{ id: 'fw-2', action: 'ACCEPT', protocol: 'TCP', port: '80,443', source: '0.0.0.0/0', comment: 'Nginx HTTP/HTTPS', enabled: true },
			{ id: 'fw-3', action: 'ACCEPT', protocol: 'TCP', port: '22', source: '0.0.0.0/0', comment: 'OpenSSH Jailed', enabled: true },
			{ id: 'fw-4', action: 'ACCEPT', protocol: 'TCP', port: '25,465,587,993', source: '0.0.0.0/0', comment: 'Exim & Dovecot Mail', enabled: true },
		],
		services: [
			{ id: 'svc-1', name: 'nginx', label: 'NGINX Reverse Proxy', status: 'running', cpu: '2.4%', memory: '148 MB' },
			{ id: 'svc-2', name: 'php8.3-fpm', label: 'PHP 8.3 FPM Pool', status: 'running', cpu: '4.1%', memory: '312 MB' },
			{ id: 'svc-3', name: 'mariadb', label: 'MariaDB 10.11 Server', status: 'running', cpu: '6.2%', memory: '420 MB' },
			{ id: 'svc-4', name: 'exim4', label: 'Exim4 Mail Transport', status: 'running', cpu: '0.8%', memory: '64 MB' },
			{ id: 'svc-5', name: 'dovecot', label: 'Dovecot IMAP/POP3', status: 'running', cpu: '0.6%', memory: '52 MB' },
			{ id: 'svc-6', name: 'fail2ban', label: 'Fail2Ban Intrusion Shield', status: 'running', cpu: '0.4%', memory: '38 MB' },
		],
		alerts: [
			{
				id: 'alt-1',
				title: 'Automatic snapshot completed',
				detail: 'Archive admin.2026-11-17_09-00.tar.zst verified cleanly on local storage.',
				severity: 'info',
				time: '2h ago',
				acknowledged: false,
			},
			{
				id: 'alt-2',
				title: 'Fail2Ban mitigated 14 SSH probes',
				detail: 'Source IPs added to temporary ipset jail via v-add-firewall-ban.',
				severity: 'warning',
				time: '4h ago',
				acknowledged: false,
			},
		],
		empireFeed: [
			{
				id: 'feed-1',
				title: 'Security Shield 2.6 Active',
				subtitle: 'Micro-kernel hardened',
			},
			{
				id: 'feed-2',
				title: 'PHP 8.3 & Node 22',
				subtitle: 'Runtime updated',
			},
		],
		auditLog: [
			{
				id: 'log-1',
				icon: 'file',
				message: 'Backup archive created',
				time: '2h ago',
			},
			{
				id: 'log-2',
				icon: 'user-plus',
				message: 'Mailbox configured: demos@siliconpanel.com',
				time: '5h ago',
			},
		],
	};
}

export function computeKpis(state) {
	const activeDomains = state.domains.filter((d) => d.status === 'active').length;
	const domainDisk = state.domains.reduce((sum, d) => sum + (Number(d.diskGb) || 0), 0);
	const diskUsedGb = Number((state.baseDiskUsedGb + domainDisk).toFixed(1));
	const diskPercent = Math.min(100, Math.round((diskUsedGb / state.diskTotalGb) * 100));
	const databasesCount = state.databases.length;
	const databaseUsedMb = state.databases.reduce((sum, db) => sum + (Number(db.sizeMb) || 0), 0);
	const mailAccountsCount = state.mailAccounts.length;
	const mailUsedMb = state.mailAccounts.reduce((sum, m) => sum + (Number(m.usedMb) || 0), 0);
	const bandwidthPercent = Math.min(
		100,
		Math.round((state.bandwidthUsedGb / state.bandwidthTotalGb) * 100),
	);
	const unreadAlertsCount = state.alerts.filter((a) => !a.acknowledged).length;

	return {
		activeDomains,
		totalDomains: state.domains.length,
		diskUsedGb,
		diskTotalGb: state.diskTotalGb,
		diskPercent,
		databasesCount,
		databaseUsedMb,
		mailAccountsCount,
		mailUsedMb,
		bandwidthUsedGb: state.bandwidthUsedGb,
		bandwidthTotalGb: state.bandwidthTotalGb,
		bandwidthPercent,
		unreadAlertsCount,
	};
}

function appendAudit(state, message, icon = 'file') {
	const entry = {
		id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
		icon,
		message,
		time: 'Just now',
	};
	return [entry, ...state.auditLog].slice(0, 12);
}

export function addDomain(state, { domain, ip = '198.51.100.24', phpVersion = '8.3', ssl = true }) {
	const clean = String(domain || '').trim().toLowerCase();
	if (!clean?.includes('.')) {
		return { ok: false, error: 'Please enter a valid domain name (e.g. example.com).' };
	}
	if (state.domains.some((d) => d.domain === clean)) {
		return { ok: false, error: `Domain "${clean}" already exists.` };
	}
	const nextDomain = {
		id: `dom-${Date.now()}`,
		domain: clean,
		ip: ip.trim() || '198.51.100.24',
		phpVersion,
		ssl: Boolean(ssl),
		status: 'active',
		diskGb: 0.2,
		subdomains: [],
	};
	return {
		ok: true,
		state: {
			...state,
			domains: [nextDomain, ...state.domains],
			auditLog: appendAudit(state, `Web domain added: ${clean} (v-add-web-domain)`, 'globe'),
		},
	};
}

export function toggleDomainStatus(state, id) {
	const target = state.domains.find((d) => d.id === id);
	if (!target) return state;
	const nextStatus = target.status === 'active' ? 'suspended' : 'active';
	return {
		...state,
		domains: state.domains.map((d) => (d.id === id ? { ...d, status: nextStatus } : d)),
		auditLog: appendAudit(
			state,
			`Domain ${nextStatus}: ${target.domain}`,
			'globe',
		),
	};
}

export function toggleDomainSsl(state, id) {
	const target = state.domains.find((d) => d.id === id);
	if (!target) return state;
	const nextSsl = !target.ssl;
	return {
		...state,
		domains: state.domains.map((d) => (d.id === id ? { ...d, ssl: nextSsl } : d)),
		auditLog: appendAudit(
			state,
			`SSL ${nextSsl ? 'enabled' : 'disabled'} for ${target.domain}`,
			'shield',
		),
	};
}

export function deleteDomain(state, id) {
	const target = state.domains.find((d) => d.id === id);
	if (!target) return state;
	return {
		...state,
		domains: state.domains.filter((d) => d.id !== id),
		auditLog: appendAudit(state, `Web domain removed: ${target.domain}`, 'globe'),
	};
}

export function addSubdomain(state, { domainId, prefix }) {
	const cleanPrefix = String(prefix || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
	const target = state.domains.find((d) => d.id === domainId);
	if (!target) return { ok: false, error: 'Select a valid parent domain.' };
	if (!cleanPrefix) return { ok: false, error: 'Enter a valid subdomain prefix (e.g. blog).' };
	const full = `${cleanPrefix}.${target.domain}`;
	if (target.subdomains.includes(full)) {
		return { ok: false, error: `Subdomain "${full}" already exists.` };
	}
	return {
		ok: true,
		state: {
			...state,
			domains: state.domains.map((d) =>
				d.id === domainId ? { ...d, subdomains: [...d.subdomains, full] } : d,
			),
			auditLog: appendAudit(state, `Subdomain created: ${full}`, 'globe'),
		},
	};
}

export function addDatabase(state, { name, user, engine = 'MariaDB 10.11' }) {
	const cleanName = String(name || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
	const cleanUser = String(user || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
	if (!cleanName || !cleanUser) {
		return { ok: false, error: 'Database name and username are required.' };
	}
	if (state.databases.some((db) => db.name === cleanName)) {
		return { ok: false, error: `Database "${cleanName}" already exists.` };
	}
	const nextDb = {
		id: `db-${Date.now()}`,
		name: cleanName,
		user: cleanUser,
		host: 'localhost',
		sizeMb: 4,
		engine,
	};
	return {
		ok: true,
		state: {
			...state,
			databases: [nextDb, ...state.databases],
			auditLog: appendAudit(state, `Database created: ${cleanName} (v-add-database)`, 'database'),
		},
	};
}

export function deleteDatabase(state, id) {
	const target = state.databases.find((db) => db.id === id);
	if (!target) return state;
	return {
		...state,
		databases: state.databases.filter((db) => db.id !== id),
		auditLog: appendAudit(state, `Database deleted: ${target.name}`, 'database'),
	};
}

export function addMailAccount(state, { localPart, domain, quotaMb = 2048 }) {
	const cleanLocal = String(localPart || '').trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
	const cleanDomain = String(domain || '').trim().toLowerCase();
	if (!cleanLocal || !cleanDomain) {
		return { ok: false, error: 'Account name and domain are required.' };
	}
	const email = `${cleanLocal}@${cleanDomain}`;
	if (state.mailAccounts.some((m) => m.email === email)) {
		return { ok: false, error: `Mailbox "${email}" already exists.` };
	}
	const nextMail = {
		id: `mail-${Date.now()}`,
		email,
		domain: cleanDomain,
		quotaMb: Number(quotaMb) || 2048,
		usedMb: 0,
		rateLimit: 200,
		status: 'active',
	};
	return {
		ok: true,
		state: {
			...state,
			mailAccounts: [nextMail, ...state.mailAccounts],
			auditLog: appendAudit(state, `Mailbox configured: ${email}`, 'user-plus'),
		},
	};
}

export function deleteMailAccount(state, id) {
	const target = state.mailAccounts.find((m) => m.id === id);
	if (!target) return state;
	return {
		...state,
		mailAccounts: state.mailAccounts.filter((m) => m.id !== id),
		auditLog: appendAudit(state, `Mailbox removed: ${target.email}`, 'user-plus'),
	};
}

export function addFileEntry(state, { name, type = 'file', content = '' }) {
	const cleanName = String(name || '').trim();
	if (!cleanName) {
		return { ok: false, error: 'File or folder name is required.' };
	}
	if (state.files.some((f) => f.name === cleanName)) {
		return { ok: false, error: `"${cleanName}" already exists in this directory.` };
	}
	const entry = {
		id: `file-${Date.now()}`,
		path: '/home/admin/web/siliconpanel.com/public_html',
		name: cleanName,
		type,
		permissions: type === 'dir' ? '0755' : '0644',
		size: type === 'dir' ? '4.0 KB' : `${Math.max(1, content.length)} B`,
		modified: 'Just now',
		content,
	};
	return {
		ok: true,
		state: {
			...state,
			files: [entry, ...state.files],
			auditLog: appendAudit(
				state,
				`${type === 'dir' ? 'Directory' : 'File'} created: ${cleanName}`,
				'file',
			),
		},
	};
}

export function updateFileContent(state, id, content) {
	const target = state.files.find((f) => f.id === id);
	if (!target) return state;
	return {
		...state,
		files: state.files.map((f) =>
			f.id === id
				? {
						...f,
						content,
						size: `${Math.max(1, content.length)} B`,
						modified: 'Just now',
					}
				: f,
		),
		auditLog: appendAudit(state, `File saved: ${target.name}`, 'file'),
	};
}

export function deleteFileEntry(state, id) {
	const target = state.files.find((f) => f.id === id);
	if (!target) return state;
	return {
		...state,
		files: state.files.filter((f) => f.id !== id),
		auditLog: appendAudit(state, `Deleted ${target.name}`, 'file'),
	};
}

export function addFirewallRule(state, { action = 'ACCEPT', protocol = 'TCP', port, source = '0.0.0.0/0', comment = '' }) {
	const cleanPort = String(port || '').trim();
	if (!cleanPort) {
		return { ok: false, error: 'Port or port range is required.' };
	}
	const rule = {
		id: `fw-${Date.now()}`,
		action,
		protocol,
		port: cleanPort,
		source: source.trim() || '0.0.0.0/0',
		comment: comment.trim() || 'Custom rule',
		enabled: true,
	};
	return {
		ok: true,
		state: {
			...state,
			firewallRules: [rule, ...state.firewallRules],
			auditLog: appendAudit(state, `Firewall rule added: ${action} ${protocol}/${cleanPort}`, 'shield'),
		},
	};
}

export function toggleFirewallRule(state, id) {
	const target = state.firewallRules.find((r) => r.id === id);
	if (!target) return state;
	return {
		...state,
		firewallRules: state.firewallRules.map((r) =>
			r.id === id ? { ...r, enabled: !r.enabled } : r,
		),
		auditLog: appendAudit(
			state,
			`Firewall rule ${target.enabled ? 'suspended' : 'enabled'}: port ${target.port}`,
			'shield',
		),
	};
}

export function addDnsRecord(state, { domain, record, type = 'A', value, ttl = 14400 }) {
	const cleanRecord = String(record || '').trim();
	const cleanValue = String(value || '').trim();
	if (!cleanRecord || !cleanValue) {
		return { ok: false, error: 'Record host and target value are required.' };
	}
	const next = {
		id: `dns-${Date.now()}`,
		domain: domain || 'siliconpanel.com',
		record: cleanRecord,
		type,
		value: cleanValue,
		ttl: Number(ttl) || 14400,
	};
	return {
		ok: true,
		state: {
			...state,
			dnsRecords: [next, ...state.dnsRecords],
			auditLog: appendAudit(state, `DNS ${type} record added for ${next.domain}`, 'globe'),
		},
	};
}

export function addRedirectRule(state, { source, target, code = '301' }) {
	const cleanSource = String(source || '').trim();
	const cleanTarget = String(target || '').trim();
	if (!cleanSource || !cleanTarget) {
		return { ok: false, error: 'Both source and destination URLs are required.' };
	}
	const next = {
		id: `red-${Date.now()}`,
		source: cleanSource,
		target: cleanTarget,
		code,
	};
	return {
		ok: true,
		state: {
			...state,
			redirects: [next, ...state.redirects],
			auditLog: appendAudit(state, `Redirect ${code} configured: ${cleanSource} → ${cleanTarget}`, 'globe'),
		},
	};
}

export function createBackupSnapshot(state, note = 'Manual Snapshot') {
	const now = new Date();
	const stamp = now.toISOString().slice(0, 16).replace('T', '_').replace(':', '-');
	const backup = {
		id: `bkp-${Date.now()}`,
		filename: `admin.${stamp}.tar.zst`,
		size: '1.86 GB',
		createdAt: 'Just now',
		type: note,
	};
	return {
		...state,
		backups: [backup, ...state.backups],
		auditLog: appendAudit(state, 'Backup archive created', 'file'),
	};
}

export function installQuickApp(state, { appName, domain }) {
	const cleanApp = String(appName || '').trim();
	const cleanDomain = String(domain || '').trim();
	if (!cleanApp || !cleanDomain) {
		return { ok: false, error: 'Select both an application and target domain.' };
	}
	return {
		ok: true,
		state: {
			...state,
			auditLog: appendAudit(
				state,
				`${cleanApp} deployed to ${cleanDomain} (v-quick-install-app)`,
				'file',
			),
		},
	};
}

export function restartService(state, id) {
	const target = state.services.find((s) => s.id === id);
	if (!target) return state;
	return {
		...state,
		auditLog: appendAudit(state, `Service restarted: ${target.name}`, 'shield'),
	};
}

export function acknowledgeAlert(state, id) {
	return {
		...state,
		alerts: state.alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)),
	};
}
