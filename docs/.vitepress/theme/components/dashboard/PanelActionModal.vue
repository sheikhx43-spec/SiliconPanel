<template>
	<div
		v-if="modalType"
		class="sp-modal-backdrop"
		role="dialog"
		aria-modal="true"
		:aria-label="modalTitle"
		@click.self="$emit('close')"
	>
		<div class="sp-modal">
			<div class="sp-modal-header">
				<h2 class="sp-modal-title">{{ modalTitle }}</h2>
				<button type="button" class="sp-btn sp-btn-ghost sp-btn-sm" @click="$emit('close')" aria-label="Close modal">
					<i class="fa-solid fa-xmark" aria-hidden="true"></i>
				</button>
			</div>

			<div v-if="errorMsg" class="sp-error-banner" style="margin-bottom: 12px;">
				{{ errorMsg }}
			</div>

			<!-- NEW DOMAIN -->
			<form v-if="modalType === 'new-domain'" class="sp-form-grid" @submit.prevent="submitDomain">
				<div class="sp-field">
					<label for="dom-name">Domain Name</label>
					<input id="dom-name" v-model="form.domain" class="sp-input" type="text" placeholder="app.siliconempire.com" required />
				</div>
				<div class="sp-field">
					<label for="dom-php">PHP Runtime</label>
					<select id="dom-php" v-model="form.phpVersion" class="sp-input">
						<option value="8.3">PHP 8.3 (Default)</option>
						<option value="8.4">PHP 8.4</option>
						<option value="8.2">PHP 8.2</option>
					</select>
				</div>
				<div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 6px;">
					<button type="button" class="sp-btn sp-btn-ghost" @click="$emit('close')">Cancel</button>
					<button type="submit" class="sp-btn sp-btn-primary">Create Domain</button>
				</div>
			</form>

			<!-- NEW DATABASE -->
			<form v-else-if="modalType === 'new-database'" class="sp-form-grid" @submit.prevent="submitDatabase">
				<div class="sp-field">
					<label for="db-name">Database Name</label>
					<input id="db-name" v-model="form.dbName" class="sp-input" type="text" placeholder="admin_analytics_v2" required />
				</div>
				<div class="sp-field">
					<label for="db-user">Database User</label>
					<input id="db-user" v-model="form.dbUser" class="sp-input" type="text" placeholder="admin_usr" required />
				</div>
				<div class="sp-field">
					<label for="db-engine">Engine</label>
					<select id="db-engine" v-model="form.dbEngine" class="sp-input">
						<option value="MariaDB 10.11">MariaDB 10.11</option>
						<option value="MySQL 8.0">MySQL 8.0</option>
						<option value="PostgreSQL 16">PostgreSQL 16</option>
					</select>
				</div>
				<div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 6px;">
					<button type="button" class="sp-btn sp-btn-ghost" @click="$emit('close')">Cancel</button>
					<button type="submit" class="sp-btn sp-btn-primary">Create Database</button>
				</div>
			</form>

			<!-- NEW MAIL -->
			<form v-else-if="modalType === 'new-mail'" class="sp-form-grid" @submit.prevent="submitMail">
				<div class="sp-field">
					<label for="mail-local">Account Name</label>
					<input id="mail-local" v-model="form.mailLocal" class="sp-input" type="text" placeholder="support" required />
				</div>
				<div class="sp-field">
					<label for="mail-domain">Domain</label>
					<select id="mail-domain" v-model="form.mailDomain" class="sp-input">
						<option v-for="d in state.domains" :key="d.id" :value="d.domain">{{ d.domain }}</option>
					</select>
				</div>
				<div class="sp-field">
					<label for="mail-quota">Quota (MB)</label>
					<input id="mail-quota" v-model="form.mailQuota" class="sp-input" type="number" min="256" step="256" />
				</div>
				<div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 6px;">
					<button type="button" class="sp-btn sp-btn-ghost" @click="$emit('close')">Cancel</button>
					<button type="submit" class="sp-btn sp-btn-primary">Create Mailbox</button>
				</div>
			</form>

			<!-- NEW FILE / FOLDER -->
			<form v-else-if="modalType === 'new-file' || modalType === 'new-folder'" class="sp-form-grid" @submit.prevent="submitFileOrFolder">
				<div class="sp-field">
					<label for="fs-name">{{ modalType === 'new-folder' ? 'Folder Name' : 'File Name' }}</label>
					<input id="fs-name" v-model="form.fileName" class="sp-input" type="text" :placeholder="modalType === 'new-folder' ? 'uploads' : 'config.json'" required />
				</div>
				<div v-if="modalType === 'new-file'" class="sp-field">
					<label for="fs-content">Initial Content</label>
					<textarea id="fs-content" v-model="form.fileContent" class="sp-textarea" placeholder="// File contents"></textarea>
				</div>
				<div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 6px;">
					<button type="button" class="sp-btn sp-btn-ghost" @click="$emit('close')">Cancel</button>
					<button type="submit" class="sp-btn sp-btn-primary">Create</button>
				</div>
			</form>

			<!-- EDIT FILE -->
			<form v-else-if="modalType === 'edit-file' && editingFile" class="sp-form-grid" @submit.prevent="submitEditFile">
				<div class="sp-field">
					<label for="edit-fs-content" class="sp-mono">{{ editingFile.name }}</label>
					<textarea id="edit-fs-content" v-model="form.fileContent" class="sp-textarea"></textarea>
				</div>
				<div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 6px;">
					<button type="button" class="sp-btn sp-btn-ghost" @click="$emit('close')">Cancel</button>
					<button type="submit" class="sp-btn sp-btn-primary">Save Changes</button>
				</div>
			</form>

			<!-- NEW FIREWALL RULE -->
			<form v-else-if="modalType === 'new-firewall'" class="sp-form-grid" @submit.prevent="submitFirewall">
				<div class="sp-field">
					<label for="fw-action">Action</label>
					<select id="fw-action" v-model="form.fwAction" class="sp-input">
						<option value="ACCEPT">ACCEPT</option>
						<option value="DROP">DROP</option>
					</select>
				</div>
				<div class="sp-field">
					<label for="fw-port">Port</label>
					<input id="fw-port" v-model="form.fwPort" class="sp-input" type="text" placeholder="8080" required />
				</div>
				<div class="sp-field">
					<label for="fw-comment">Comment</label>
					<input id="fw-comment" v-model="form.fwComment" class="sp-input" type="text" placeholder="Node API Gateway" />
				</div>
				<div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 6px;">
					<button type="button" class="sp-btn sp-btn-ghost" @click="$emit('close')">Cancel</button>
					<button type="submit" class="sp-btn sp-btn-primary">Add Rule</button>
				</div>
			</form>

			<!-- SITE BUILDER -->
			<form v-else-if="modalType === 'site-builder'" class="sp-form-grid" @submit.prevent="submitSiteBuilder">
				<div class="sp-field">
					<label for="sb-domain">Target Domain</label>
					<select id="sb-domain" v-model="form.selectedDomain" class="sp-input">
						<option v-for="d in state.domains" :key="d.id" :value="d.domain">{{ d.domain }}</option>
					</select>
				</div>
				<div class="sp-field">
					<label for="sb-template">Starter Template</label>
					<select id="sb-template" v-model="form.siteTemplate" class="sp-input">
						<option value="Corporate Landing (Silicon Empire Theme)">Corporate Landing (Silicon Empire Theme)</option>
						<option value="Coming Soon Page">Coming Soon Page</option>
						<option value="Developer Docs Portal">Developer Docs Portal</option>
					</select>
				</div>
				<div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 6px;">
					<button type="button" class="sp-btn sp-btn-ghost" @click="$emit('close')">Cancel</button>
					<button type="submit" class="sp-btn sp-btn-primary">Deploy Template</button>
				</div>
			</form>

			<!-- APP INSTALLER -->
			<form v-else-if="modalType === 'app-installer'" class="sp-form-grid" @submit.prevent="submitAppInstaller">
				<div class="sp-field">
					<label for="app-name">Quick-Install Application</label>
					<select id="app-name" v-model="form.appName" class="sp-input">
						<option value="WordPress">WordPress (PHP 8.3 + FastCGI)</option>
						<option value="Laravel">Laravel (PHP 8.3)</option>
						<option value="NextCloud">NextCloud</option>
						<option value="Drupal">Drupal</option>
						<option value="PrestaShop">PrestaShop</option>
					</select>
				</div>
				<div class="sp-field">
					<label for="app-domain">Target Domain</label>
					<select id="app-domain" v-model="form.selectedDomain" class="sp-input">
						<option v-for="d in state.domains" :key="d.id" :value="d.domain">{{ d.domain }}</option>
					</select>
				</div>
				<div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 6px;">
					<button type="button" class="sp-btn sp-btn-ghost" @click="$emit('close')">Cancel</button>
					<button type="submit" class="sp-btn sp-btn-primary">Install Application</button>
				</div>
			</form>

			<!-- FTP ACCOUNTS -->
			<div v-else-if="modalType === 'ftp-accounts'" class="sp-form-grid">
				<div class="sp-table-wrap">
					<table class="sp-table">
						<thead>
							<tr>
								<th>Username</th>
								<th>Domain</th>
								<th>Home Path</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="ftp in state.ftpAccounts" :key="ftp.id">
								<td class="sp-mono">{{ ftp.username }}</td>
								<td class="sp-mono">{{ ftp.domain }}</td>
								<td class="sp-mono" style="font-size: 11.5px;">{{ ftp.path }}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div style="display: flex; justify-content: flex-end;">
					<button type="button" class="sp-btn sp-btn-primary" @click="$emit('close')">Done</button>
				</div>
			</div>

			<!-- BACKUP MANAGER -->
			<div v-else-if="modalType === 'backup-manager'" class="sp-form-grid">
				<div class="sp-table-wrap">
					<table class="sp-table">
						<thead>
							<tr>
								<th>Archive</th>
								<th>Size</th>
								<th>Created</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="bkp in state.backups" :key="bkp.id">
								<td class="sp-mono" style="font-size: 12px;">{{ bkp.filename }}</td>
								<td class="sp-mono">{{ bkp.size }}</td>
								<td class="sp-mono">{{ bkp.createdAt }}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div style="display: flex; justify-content: flex-end; gap: 8px;">
					<button type="button" class="sp-btn sp-btn-ghost" @click="$emit('close')">Close</button>
					<button type="button" class="sp-btn sp-btn-primary" @click="$emit('create-backup')">
						Create Snapshot Now
					</button>
				</div>
			</div>

			<!-- SUBDOMAINS -->
			<form v-else-if="modalType === 'subdomains'" class="sp-form-grid" @submit.prevent="submitSubdomain">
				<div class="sp-field">
					<label for="sub-parent">Parent Domain</label>
					<select id="sub-parent" v-model="form.subParentId" class="sp-input">
						<option v-for="d in state.domains" :key="d.id" :value="d.id">{{ d.domain }}</option>
					</select>
				</div>
				<div class="sp-field">
					<label for="sub-prefix">Subdomain Prefix</label>
					<input id="sub-prefix" v-model="form.subPrefix" class="sp-input" type="text" placeholder="staging" required />
				</div>
				<div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 6px;">
					<button type="button" class="sp-btn sp-btn-ghost" @click="$emit('close')">Cancel</button>
					<button type="submit" class="sp-btn sp-btn-primary">Create Subdomain</button>
				</div>
			</form>

			<!-- DNS SETTINGS -->
			<div v-else-if="modalType === 'dns-settings'" class="sp-form-grid">
				<div class="sp-table-wrap">
					<table class="sp-table">
						<thead>
							<tr>
								<th>Record</th>
								<th>Type</th>
								<th>Value</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="rec in state.dnsRecords" :key="rec.id">
								<td class="sp-mono">{{ rec.record }}.{{ rec.domain }}</td>
								<td class="sp-mono">{{ rec.type }}</td>
								<td class="sp-mono">{{ rec.value }}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<form class="sp-form-grid" @submit.prevent="submitDns" style="padding-top: 8px; border-top: 1px solid var(--sp-border);">
					<div style="display: grid; grid-template-columns: 1fr 110px 1.3fr; gap: 8px;">
						<input v-model="form.dnsRecord" class="sp-input" style="min-width: 0;" type="text" placeholder="cdn" aria-label="DNS host" required />
						<select v-model="form.dnsType" class="sp-input" style="min-width: 0;" aria-label="DNS record type">
							<option value="A">A</option>
							<option value="CNAME">CNAME</option>
							<option value="TXT">TXT</option>
							<option value="MX">MX</option>
						</select>
						<input v-model="form.dnsValue" class="sp-input" style="min-width: 0;" type="text" placeholder="198.51.100.24" aria-label="DNS value" required />
					</div>
					<div style="display: flex; justify-content: flex-end; gap: 8px;">
						<button type="button" class="sp-btn sp-btn-ghost" @click="$emit('close')">Close</button>
						<button type="submit" class="sp-btn sp-btn-primary">Add Record</button>
					</div>
				</form>
			</div>

			<!-- REDIRECTS -->
			<div v-else-if="modalType === 'redirects'" class="sp-form-grid">
				<div class="sp-table-wrap">
					<table class="sp-table">
						<thead>
							<tr>
								<th>Source</th>
								<th>Target</th>
								<th>Code</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="red in state.redirects" :key="red.id">
								<td class="sp-mono">{{ red.source }}</td>
								<td class="sp-mono">{{ red.target }}</td>
								<td class="sp-mono">{{ red.code }}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<form class="sp-form-grid" @submit.prevent="submitRedirect" style="padding-top: 8px; border-top: 1px solid var(--sp-border);">
					<div class="sp-field">
						<label for="red-src">Source URL</label>
						<input id="red-src" v-model="form.redSource" class="sp-input" type="text" placeholder="http://www.siliconpanel.com" required />
					</div>
					<div class="sp-field">
						<label for="red-tgt">Destination URL</label>
						<input id="red-tgt" v-model="form.redTarget" class="sp-input" type="text" placeholder="https://siliconpanel.com" required />
					</div>
					<div style="display: flex; justify-content: flex-end; gap: 8px;">
						<button type="button" class="sp-btn sp-btn-ghost" @click="$emit('close')">Close</button>
						<button type="submit" class="sp-btn sp-btn-primary">Add Redirect</button>
					</div>
				</form>
			</div>

			<!-- ALERTS -->
			<div v-else-if="modalType === 'alerts'" class="sp-form-grid">
				<div v-for="alert in state.alerts" :key="alert.id" class="sp-feed-item" style="cursor: default;">
					<div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
						<div class="sp-feed-title">{{ alert.title }}</div>
						<span class="sp-mono" style="font-size: 11px; color: var(--sp-text-muted);">{{ alert.time }}</span>
					</div>
					<div class="sp-feed-sub" style="margin-top: 5px;">{{ alert.detail }}</div>
					<div style="margin-top: 8px;">
						<button
							v-if="!alert.acknowledged"
							type="button"
							class="sp-btn sp-btn-ghost sp-btn-sm"
							@click="$emit('ack-alert', alert.id)"
						>
							Acknowledge
						</button>
						<span v-else class="sp-status-text sp-status-ok">Acknowledged</span>
					</div>
				</div>
				<div style="display: flex; justify-content: flex-end;">
					<button type="button" class="sp-btn sp-btn-primary" @click="$emit('close')">Close</button>
				</div>
			</div>

			<!-- ROOT ADMIN & SILICON EMPIRE CREDITS -->
			<div v-else-if="modalType === 'admin'" class="sp-form-grid">
				<div class="sp-feed-item" style="cursor: default;">
					<div class="sp-feed-title">SILICON PANEL · Root Administrator</div>
					<div class="sp-feed-sub" style="margin-top: 6px;">
						Node: {{ state.host }} ({{ state.os }})
					</div>
				</div>
				<div class="sp-feed-item" style="cursor: default;">
					<div class="sp-feed-title">Product Identity &amp; Authorship</div>
					<p style="margin: 6px 0 0; font-size: 13px; color: var(--sp-text-secondary); line-height: 1.55;">
						<strong>SILICON PANEL</strong> is developed and powered by <strong>Silicon Empire Ltd</strong>,
						authored by <strong>Md Mainul Hasan</strong> (GPLv3).
					</p>
				</div>
				<div style="display: flex; justify-content: flex-end; gap: 8px;">
					<a href="/docs/introduction/getting-started" class="sp-btn sp-btn-ghost" style="text-decoration: none;">
						Documentation
					</a>
					<button type="button" class="sp-btn sp-btn-primary" @click="$emit('close')">Done</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue';

const props = defineProps({
	modalType: { type: String, default: null },
	state: { type: Object, required: true },
	editingFile: { type: Object, default: null },
	errorMsg: { type: String, default: '' },
});

const emit = defineEmits([
	'close',
	'submit-domain',
	'submit-database',
	'submit-mail',
	'submit-file',
	'submit-edit-file',
	'submit-firewall',
	'submit-site-builder',
	'submit-app-installer',
	'create-backup',
	'submit-subdomain',
	'submit-dns',
	'submit-redirect',
	'ack-alert',
]);

const form = reactive({
	domain: '',
	phpVersion: '8.3',
	dbName: '',
	dbUser: '',
	dbEngine: 'MariaDB 10.11',
	mailLocal: '',
	mailDomain: 'siliconpanel.com',
	mailQuota: 2048,
	fileName: '',
	fileContent: '',
	fwAction: 'ACCEPT',
	fwPort: '',
	fwComment: '',
	selectedDomain: 'siliconpanel.com',
	siteTemplate: 'Corporate Landing (Silicon Empire Theme)',
	appName: 'WordPress',
	subParentId: 'dom-1',
	subPrefix: '',
	dnsRecord: '',
	dnsType: 'A',
	dnsValue: '',
	redSource: '',
	redTarget: '',
});

watch(
	() => [props.modalType, props.editingFile],
	() => {
		form.domain = '';
		form.dbName = '';
		form.dbUser = '';
		form.mailLocal = '';
		form.fileName = '';
		form.fileContent = props.editingFile ? props.editingFile.content : '';
		form.fwPort = '';
		form.fwComment = '';
		form.subPrefix = '';
		form.dnsRecord = '';
		form.dnsValue = '';
		form.redSource = '';
		form.redTarget = '';
		if (props.state.domains.length) {
			form.mailDomain = props.state.domains[0].domain;
			form.selectedDomain = props.state.domains[0].domain;
			form.subParentId = props.state.domains[0].id;
		}
	},
);

const modalTitle = computed(() => {
	const map = {
		'new-domain': 'Add Web Domain',
		'new-database': 'Create MySQL Database',
		'new-mail': 'Configure Mail Account',
		'new-file': 'Create New File',
		'new-folder': 'Create New Directory',
		'edit-file': 'Edit File',
		'new-firewall': 'Add Firewall Rule',
		'site-builder': 'Site Builder',
		'app-installer': 'One-Click App Installer',
		'ftp-accounts': 'FTP Accounts',
		'backup-manager': 'Backup Manager',
		subdomains: 'Create Subdomain',
		'dns-settings': 'DNS Zone Settings',
		redirects: 'URL Redirects',
		alerts: 'System Alerts',
		admin: 'Root Admin · SILICON PANEL',
	};
	return map[props.modalType] || '';
});

function submitDomain() {
	emit('submit-domain', { domain: form.domain, phpVersion: form.phpVersion });
}
function submitDatabase() {
	emit('submit-database', { name: form.dbName, user: form.dbUser, engine: form.dbEngine });
}
function submitMail() {
	emit('submit-mail', { localPart: form.mailLocal, domain: form.mailDomain, quotaMb: form.mailQuota });
}
function submitFileOrFolder() {
	emit('submit-file', {
		name: form.fileName,
		type: props.modalType === 'new-folder' ? 'dir' : 'file',
		content: form.fileContent,
	});
}
function submitEditFile() {
	emit('submit-edit-file', { id: props.editingFile.id, content: form.fileContent });
}
function submitFirewall() {
	emit('submit-firewall', {
		action: form.fwAction,
		protocol: 'TCP',
		port: form.fwPort,
		comment: form.fwComment,
	});
}
function submitSiteBuilder() {
	emit('submit-site-builder', { domain: form.selectedDomain, template: form.siteTemplate });
}
function submitAppInstaller() {
	emit('submit-app-installer', { appName: form.appName, domain: form.selectedDomain });
}
function submitSubdomain() {
	emit('submit-subdomain', { domainId: form.subParentId, prefix: form.subPrefix });
}
function submitDns() {
	emit('submit-dns', {
		domain: form.selectedDomain,
		record: form.dnsRecord,
		type: form.dnsType,
		value: form.dnsValue,
	});
}
function submitRedirect() {
	emit('submit-redirect', { source: form.redSource, target: form.redTarget, code: '301' });
}
</script>
