<template>
	<div class="sp-subview">
		<!-- FILE MANAGER -->
		<section v-if="activeView === 'files'" class="sp-card" aria-label="File Manager">
			<div class="sp-view-header">
				<div>
					<h1 class="sp-view-title">File Manager</h1>
					<p class="sp-view-sub sp-mono">/home/admin/web/siliconpanel.com/public_html</p>
				</div>
				<div style="display: flex; gap: 8px; flex-wrap: wrap;">
					<button type="button" class="sp-btn sp-btn-ghost" @click="$emit('open-modal', 'new-folder')">
						<i class="fa-solid fa-folder-plus" aria-hidden="true"></i> New Folder
					</button>
					<button type="button" class="sp-btn sp-btn-primary" @click="$emit('open-modal', 'new-file')">
						<i class="fa-solid fa-file-circle-plus" aria-hidden="true"></i> New File
					</button>
				</div>
			</div>

			<div class="sp-table-wrap" style="margin-top: 16px;">
				<table class="sp-table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Permissions</th>
							<th>Size</th>
							<th>Modified</th>
							<th style="text-align: right;">Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="file in state.files" :key="file.id">
							<td class="sp-mono">
								<i
									:class="file.type === 'dir' ? 'fa-solid fa-folder' : 'fa-regular fa-file-code'"
									style="margin-right: 8px;"
									aria-hidden="true"
								></i>
								{{ file.name }}
							</td>
							<td class="sp-mono">{{ file.permissions }}</td>
							<td class="sp-mono">{{ file.size }}</td>
							<td class="sp-mono">{{ file.modified }}</td>
							<td style="text-align: right;">
								<div style="display: inline-flex; gap: 6px;">
									<button
										v-if="file.type === 'file'"
										type="button"
										class="sp-btn sp-btn-ghost sp-btn-sm"
										@click="$emit('edit-file', file)"
										:aria-label="`Edit ${file.name}`"
									>
										Edit
									</button>
									<button
										type="button"
										class="sp-btn sp-btn-ghost sp-btn-sm"
										@click="$emit('delete-file', file.id)"
										:aria-label="`Delete ${file.name}`"
									>
										Delete
									</button>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>

		<!-- DATABASES -->
		<section v-else-if="activeView === 'databases'" class="sp-card" aria-label="MySQL Databases">
			<div class="sp-view-header">
				<div>
					<h1 class="sp-view-title">MySQL &amp; MariaDB Databases</h1>
					<p class="sp-view-sub">Manage databases, credentials, and host bindings ({{ state.databases.length }} active)</p>
				</div>
				<button type="button" class="sp-btn sp-btn-primary" @click="$emit('open-modal', 'new-database')">
					<i class="fa-solid fa-plus" aria-hidden="true"></i> Create Database
				</button>
			</div>

			<div class="sp-toolbar" style="margin-top: 16px;">
				<input
					v-model="dbQuery"
					type="search"
					class="sp-input"
					placeholder="Filter databases..."
					aria-label="Filter databases"
				/>
			</div>

			<div class="sp-table-wrap">
				<table class="sp-table">
					<thead>
						<tr>
							<th>Database Name</th>
							<th>DB User</th>
							<th>Host</th>
							<th>Engine</th>
							<th>Size</th>
							<th style="text-align: right;">Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="db in filteredDatabases" :key="db.id">
							<td class="sp-mono">{{ db.name }}</td>
							<td class="sp-mono">{{ db.user }}</td>
							<td class="sp-mono">{{ db.host }}</td>
							<td>{{ db.engine }}</td>
							<td class="sp-mono">{{ db.sizeMb }} MB</td>
							<td style="text-align: right;">
								<button
									type="button"
									class="sp-btn sp-btn-ghost sp-btn-sm"
									@click="$emit('delete-database', db.id)"
									:aria-label="`Delete database ${db.name}`"
								>
									Delete
								</button>
							</td>
						</tr>
						<tr v-if="filteredDatabases.length === 0">
							<td colspan="6" style="text-align: center; padding: 24px;">No databases match "{{ dbQuery }}".</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>

		<!-- DOMAINS -->
		<section v-else-if="activeView === 'domains'" class="sp-card" aria-label="Web Domains">
			<div class="sp-view-header">
				<div>
					<h1 class="sp-view-title">Web Domains</h1>
					<p class="sp-view-sub">NGINX + PHP-FPM virtual hosts and Let's Encrypt SSL certificates</p>
				</div>
				<button type="button" class="sp-btn sp-btn-primary" @click="$emit('open-modal', 'new-domain')">
					<i class="fa-solid fa-plus" aria-hidden="true"></i> Add Domain
				</button>
			</div>

			<div class="sp-toolbar" style="margin-top: 16px;">
				<input
					v-model="domainQuery"
					type="search"
					class="sp-input"
					placeholder="Search domains..."
					aria-label="Search domains"
				/>
				<div class="sp-segmented" role="group" aria-label="Domain status filter">
					<button
						type="button"
						class="sp-seg-btn"
						:class="{ 'is-active': domainFilter === 'all' }"
						@click="domainFilter = 'all'"
					>
						All
					</button>
					<button
						type="button"
						class="sp-seg-btn"
						:class="{ 'is-active': domainFilter === 'active' }"
						@click="domainFilter = 'active'"
					>
						Active
					</button>
					<button
						type="button"
						class="sp-seg-btn"
						:class="{ 'is-active': domainFilter === 'suspended' }"
						@click="domainFilter = 'suspended'"
					>
						Suspended
					</button>
				</div>
			</div>

			<div class="sp-table-wrap">
				<table class="sp-table">
					<thead>
						<tr>
							<th>Domain</th>
							<th>IP Address</th>
							<th>PHP</th>
							<th>SSL</th>
							<th>Status</th>
							<th style="text-align: right;">Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="dom in filteredDomains" :key="dom.id">
							<td>
								<div class="sp-mono" style="font-weight: 600;">{{ dom.domain }}</div>
								<div v-if="dom.subdomains.length" class="sp-mono" style="font-size: 11px; opacity: 0.75;">
									Subdomains: {{ dom.subdomains.join(', ') }}
								</div>
							</td>
							<td class="sp-mono">{{ dom.ip }}</td>
							<td class="sp-mono">PHP {{ dom.phpVersion }}</td>
							<td>
								<button
									type="button"
									class="sp-btn sp-btn-ghost sp-btn-sm"
									@click="$emit('toggle-domain-ssl', dom.id)"
									:aria-label="`Toggle SSL for ${dom.domain}`"
								>
									{{ dom.ssl ? 'TLS Active' : 'Enable TLS' }}
								</button>
							</td>
							<td>
								<span
									class="sp-status-text"
									:class="dom.status === 'active' ? 'sp-status-ok' : 'sp-status-warn'"
								>
									{{ dom.status === 'active' ? 'Active' : 'Suspended' }}
								</span>
							</td>
							<td style="text-align: right;">
								<div style="display: inline-flex; gap: 6px;">
									<button
										type="button"
										class="sp-btn sp-btn-ghost sp-btn-sm"
										@click="$emit('toggle-domain-status', dom.id)"
										:aria-label="`${dom.status === 'active' ? 'Suspend' : 'Unsuspend'} ${dom.domain}`"
									>
										{{ dom.status === 'active' ? 'Suspend' : 'Activate' }}
									</button>
									<button
										type="button"
										class="sp-btn sp-btn-ghost sp-btn-sm"
										@click="$emit('delete-domain', dom.id)"
										:aria-label="`Delete domain ${dom.domain}`"
									>
										Delete
									</button>
								</div>
							</td>
						</tr>
						<tr v-if="filteredDomains.length === 0">
							<td colspan="6" style="text-align: center; padding: 24px;">No domains match the current filter.</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>

		<!-- MAIL ACCOUNTS -->
		<section v-else-if="activeView === 'mail'" class="sp-card" aria-label="Mail Accounts">
			<div class="sp-view-header">
				<div>
					<h1 class="sp-view-title">Mail Accounts</h1>
					<p class="sp-view-sub">Exim4 SMTP &amp; Dovecot IMAP/POP3 mailboxes with per-account rate limits</p>
				</div>
				<button type="button" class="sp-btn sp-btn-primary" @click="$emit('open-modal', 'new-mail')">
					<i class="fa-solid fa-plus" aria-hidden="true"></i> Add Mailbox
				</button>
			</div>

			<div class="sp-table-wrap" style="margin-top: 16px;">
				<table class="sp-table">
					<thead>
						<tr>
							<th>Email Address</th>
							<th>Quota</th>
							<th>Rate Limit</th>
							<th>Status</th>
							<th style="text-align: right;">Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="mail in state.mailAccounts" :key="mail.id">
							<td class="sp-mono">{{ mail.email }}</td>
							<td class="sp-mono">{{ mail.usedMb }} / {{ mail.quotaMb }} MB</td>
							<td class="sp-mono">{{ mail.rateLimit }}/hr</td>
							<td><span class="sp-status-text sp-status-ok">Active</span></td>
							<td style="text-align: right;">
								<button
									type="button"
									class="sp-btn sp-btn-ghost sp-btn-sm"
									@click="$emit('delete-mail', mail.id)"
									:aria-label="`Delete mailbox ${mail.email}`"
								>
									Delete
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>

		<!-- TELEMETRY -->
		<section v-else-if="activeView === 'telemetry'" class="sp-subview-stack">
			<div class="sp-kpi-grid">
				<article class="sp-kpi-card">
					<div class="sp-kpi-label">VISITORS TODAY</div>
					<div class="sp-kpi-value">{{ state.visitorsToday }}</div>
					<div class="sp-kpi-bottom sp-mono" style="font-size: 12px;">NGINX Access Stream</div>
				</article>
				<article class="sp-kpi-card">
					<div class="sp-kpi-label">CPU USAGE</div>
					<div class="sp-kpi-value">{{ state.cpuUsagePct }}%</div>
					<div class="sp-kpi-bottom">
						<div class="sp-progress-track">
							<div class="sp-progress-fill" :style="{ width: `${state.cpuUsagePct}%` }"></div>
						</div>
					</div>
				</article>
				<article class="sp-kpi-card">
					<div class="sp-kpi-label">MEMORY FOOTPRINT</div>
					<div class="sp-kpi-value">
						{{ state.memoryUsedGb.toFixed(1) }}<span class="sp-kpi-unit">/ {{ state.memoryTotalGb.toFixed(1) }} GB</span>
					</div>
					<div class="sp-kpi-bottom">
						<div class="sp-progress-track">
							<div class="sp-progress-fill" :style="{ width: `${Math.round((state.memoryUsedGb / state.memoryTotalGb) * 100)}%` }"></div>
						</div>
					</div>
				</article>
				<article class="sp-kpi-card">
					<div class="sp-kpi-label">RUNTIME STACK</div>
					<div class="sp-kpi-value" style="font-size: 18px;">PHP 8.3 &amp; Node 22</div>
					<div class="sp-kpi-bottom sp-mono" style="font-size: 12px;">{{ state.os }}</div>
				</article>
			</div>

			<div class="sp-card">
				<div class="sp-view-header">
					<div>
						<h1 class="sp-view-title">System Services</h1>
						<p class="sp-view-sub">Core daemons managed via Silicon Panel CLI</p>
					</div>
				</div>
				<div class="sp-table-wrap" style="margin-top: 14px;">
					<table class="sp-table">
						<thead>
							<tr>
								<th>Service</th>
								<th>Description</th>
								<th>CPU</th>
								<th>Memory</th>
								<th>State</th>
								<th style="text-align: right;">Control</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="svc in state.services" :key="svc.id">
								<td class="sp-mono" style="font-weight: 600;">{{ svc.name }}</td>
								<td>{{ svc.label }}</td>
								<td class="sp-mono">{{ svc.cpu }}</td>
								<td class="sp-mono">{{ svc.memory }}</td>
								<td><span class="sp-status-text sp-status-ok">Running</span></td>
								<td style="text-align: right;">
									<button
										type="button"
										class="sp-btn sp-btn-ghost sp-btn-sm"
										@click="$emit('restart-service', svc.id)"
										:aria-label="`Restart ${svc.name}`"
									>
										Restart
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</section>

		<!-- SECURITY -->
		<section v-else-if="activeView === 'security'" class="sp-subview-stack" aria-label="Security and Firewall">
			<div class="sp-card">
				<div class="sp-view-header">
					<div>
						<h1 class="sp-view-title">Security Shield &amp; Firewall</h1>
						<p class="sp-view-sub">Security Shield 2.6 Active · Micro-kernel hardened · iptables &amp; Fail2Ban</p>
					</div>
					<button type="button" class="sp-btn sp-btn-primary" @click="$emit('open-modal', 'new-firewall')">
						<i class="fa-solid fa-plus" aria-hidden="true"></i> Add Firewall Rule
					</button>
				</div>

				<div class="sp-table-wrap" style="margin-top: 16px;">
					<table class="sp-table">
						<thead>
							<tr>
								<th>Action</th>
								<th>Protocol</th>
								<th>Port</th>
								<th>Source CIDR</th>
								<th>Comment</th>
								<th>State</th>
								<th style="text-align: right;">Control</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="rule in state.firewallRules" :key="rule.id">
								<td class="sp-mono">{{ rule.action }}</td>
								<td class="sp-mono">{{ rule.protocol }}</td>
								<td class="sp-mono">{{ rule.port }}</td>
								<td class="sp-mono">{{ rule.source }}</td>
								<td>{{ rule.comment }}</td>
								<td>
									<span class="sp-status-text" :class="rule.enabled ? 'sp-status-ok' : 'sp-status-warn'">
										{{ rule.enabled ? 'Active' : 'Suspended' }}
									</span>
								</td>
								<td style="text-align: right;">
									<button
										type="button"
										class="sp-btn sp-btn-ghost sp-btn-sm"
										@click="$emit('toggle-firewall', rule.id)"
										:aria-label="`${rule.enabled ? 'Suspend' : 'Enable'} firewall rule for port ${rule.port}`"
									>
										{{ rule.enabled ? 'Suspend' : 'Enable' }}
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
	activeView: { type: String, required: true },
	state: { type: Object, required: true },
});

defineEmits([
	'open-modal',
	'edit-file',
	'delete-file',
	'delete-database',
	'toggle-domain-ssl',
	'toggle-domain-status',
	'delete-domain',
	'delete-mail',
	'restart-service',
	'toggle-firewall',
]);

const dbQuery = ref('');
const domainQuery = ref('');
const domainFilter = ref('all');

const filteredDatabases = computed(() => {
	const q = dbQuery.value.trim().toLowerCase();
	if (!q) return props.state.databases;
	return props.state.databases.filter(
		(d) => d.name.toLowerCase().includes(q) || d.user.toLowerCase().includes(q),
	);
});

const filteredDomains = computed(() => {
	const q = domainQuery.value.trim().toLowerCase();
	return props.state.domains.filter((d) => {
		const matchesText = !q || d.domain.toLowerCase().includes(q) || d.ip.includes(q);
		const matchesStatus = domainFilter.value === 'all' || d.status === domainFilter.value;
		return matchesText && matchesStatus;
	});
});
</script>

<style scoped>
.sp-subview,
.sp-subview-stack {
	display: flex;
	flex-direction: column;
	gap: 18px;
}
</style>
