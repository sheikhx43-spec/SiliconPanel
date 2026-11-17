<template>
	<div class="sp-overview">
		<!-- System Command Center Banner -->
		<section class="sp-card sp-command-center" aria-label="System Command Center">
			<div>
				<h1 class="sp-command-title">System Command Center</h1>
				<p class="sp-command-host">Host: {{ state.host }} ({{ state.os }})</p>
			</div>
			<div class="sp-command-actions">
				<button
					type="button"
					class="sp-header-pill-btn"
					@click="$emit('open-modal', 'alerts')"
					:aria-label="`${kpis.unreadAlertsCount} Alerts`"
				>
					<i class="fa-solid fa-bell" aria-hidden="true"></i>
					<span class="sp-tabular">{{ kpis.unreadAlertsCount }} Alerts</span>
				</button>
				<span class="sp-v-divider" aria-hidden="true"></span>
				<button
					type="button"
					class="sp-header-pill-btn"
					@click="$emit('open-modal', 'admin')"
					aria-label="Root Admin profile and system credits"
				>
					<i class="fa-solid fa-circle-user" aria-hidden="true"></i>
					<span>Root Admin</span>
				</button>
			</div>
		</section>

		<!-- 4-Column KPI Grid -->
		<section class="sp-kpi-grid" aria-label="Node resource summary">
			<article class="sp-kpi-card" data-testid="kpi-domains">
				<div class="sp-kpi-top">
					<div>
						<div class="sp-kpi-label">ACTIVE DOMAINS</div>
						<div class="sp-kpi-value">{{ kpis.activeDomains }}</div>
					</div>
					<span class="sp-kpi-icon-box" aria-hidden="true">
						<i class="fa-solid fa-globe"></i>
					</span>
				</div>
				<div class="sp-kpi-bottom">
					<button type="button" class="sp-link-btn" @click="$emit('navigate', 'domains')">
						View Domains <span aria-hidden="true">&rarr;</span>
					</button>
				</div>
			</article>

			<article class="sp-kpi-card" data-testid="kpi-disk">
				<div class="sp-kpi-top">
					<div>
						<div class="sp-kpi-label">DISK USAGE</div>
						<div class="sp-kpi-value">
							{{ kpis.diskUsedGb }} <span class="sp-kpi-unit">/ {{ kpis.diskTotalGb }} GB</span>
						</div>
					</div>
					<span class="sp-kpi-icon-box" aria-hidden="true">
						<i class="fa-solid fa-hard-drive"></i>
					</span>
				</div>
				<div class="sp-kpi-bottom">
					<div class="sp-progress-track" role="progressbar" :aria-valuenow="kpis.diskPercent" aria-valuemin="0" aria-valuemax="100" aria-label="Disk usage percentage">
						<div class="sp-progress-fill" :style="{ width: `${kpis.diskPercent}%` }"></div>
					</div>
				</div>
			</article>

			<article class="sp-kpi-card" data-testid="kpi-databases">
				<div class="sp-kpi-top">
					<div>
						<div class="sp-kpi-label">MYSQL DATABASES</div>
						<div class="sp-kpi-value">{{ kpis.databasesCount }}</div>
					</div>
					<span class="sp-kpi-icon-box" aria-hidden="true">
						<i class="fa-solid fa-database"></i>
					</span>
				</div>
				<div class="sp-kpi-bottom">
					<button type="button" class="sp-link-btn" @click="$emit('navigate', 'databases')">
						Manage DBs <span aria-hidden="true">&rarr;</span>
					</button>
				</div>
			</article>

			<article class="sp-kpi-card" data-testid="kpi-bandwidth">
				<div class="sp-kpi-top">
					<div>
						<div class="sp-kpi-label">BANDWIDTH</div>
						<div class="sp-kpi-value">
							{{ kpis.bandwidthUsedGb }} <span class="sp-kpi-unit">/ {{ kpis.bandwidthTotalGb }} GB</span>
						</div>
					</div>
					<span class="sp-kpi-icon-box" aria-hidden="true">
						<i class="fa-solid fa-sitemap"></i>
					</span>
				</div>
				<div class="sp-kpi-bottom">
					<div class="sp-progress-track" role="progressbar" :aria-valuenow="kpis.bandwidthPercent" aria-valuemin="0" aria-valuemax="100" aria-label="Bandwidth usage percentage">
						<div class="sp-progress-fill" :style="{ width: `${kpis.bandwidthPercent}%` }"></div>
					</div>
				</div>
			</article>
		</section>

		<!-- Middle 2-Column Grid -->
		<section class="sp-middle-grid" aria-label="Control panel tools and telemetry">
			<div class="sp-col-stack">
				<div class="sp-card">
					<h2 class="sp-section-kicker">WEBSITE MANAGEMENT</h2>
					<div class="sp-tools-grid">
						<button type="button" class="sp-tool-tile" @click="$emit('open-modal', 'site-builder')">
							<i class="fa-solid fa-laptop-code" aria-hidden="true"></i>
							<span>Site Builder</span>
						</button>
						<button type="button" class="sp-tool-tile" @click="$emit('open-modal', 'app-installer')">
							<i class="fa-solid fa-briefcase" aria-hidden="true"></i>
							<span>App Installer</span>
						</button>
						<button type="button" class="sp-tool-tile" @click="$emit('open-modal', 'ftp-accounts')">
							<i class="fa-solid fa-file-lines" aria-hidden="true"></i>
							<span>FTP Accounts</span>
						</button>
						<button type="button" class="sp-tool-tile" @click="$emit('open-modal', 'backup-manager')">
							<i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
							<span>Backup Manager</span>
						</button>
					</div>
				</div>

				<div class="sp-card">
					<h2 class="sp-section-kicker">DOMAIN &amp; MAIL TOOLS</h2>
					<div class="sp-tools-grid">
						<button type="button" class="sp-tool-tile" @click="$emit('navigate', 'mail')">
							<i class="fa-solid fa-at" aria-hidden="true"></i>
							<span>Email Accounts</span>
						</button>
						<button type="button" class="sp-tool-tile" @click="$emit('open-modal', 'subdomains')">
							<i class="fa-solid fa-diagram-project" aria-hidden="true"></i>
							<span>Subdomains</span>
						</button>
						<button type="button" class="sp-tool-tile" @click="$emit('open-modal', 'dns-settings')">
							<i class="fa-solid fa-network-wired" aria-hidden="true"></i>
							<span>DNS Settings</span>
						</button>
						<button type="button" class="sp-tool-tile" @click="$emit('open-modal', 'redirects')">
							<i class="fa-solid fa-shuffle" aria-hidden="true"></i>
							<span>Redirects</span>
						</button>
					</div>
				</div>
			</div>

			<div class="sp-col-stack">
				<div class="sp-card">
					<h2 class="sp-section-kicker">NODE TELEMETRY</h2>
					<div class="sp-telemetry-list">
						<div class="sp-telemetry-row">
							<span class="sp-telemetry-label">Visitors Today</span>
							<span class="sp-telemetry-val">{{ state.visitorsToday }}</span>
						</div>
						<div class="sp-telemetry-row">
							<span class="sp-telemetry-label">CPU Usage</span>
							<span class="sp-telemetry-val">{{ state.cpuUsagePct }}%</span>
						</div>
						<div class="sp-telemetry-row">
							<span class="sp-telemetry-label">Memory Footprint</span>
							<span class="sp-telemetry-val">{{ state.memoryUsedGb.toFixed(1) }} GB / {{ state.memoryTotalGb.toFixed(1) }} GB</span>
						</div>
						<div class="sp-telemetry-row">
							<span class="sp-telemetry-label">Database Used</span>
							<span class="sp-telemetry-val">{{ kpis.databaseUsedMb }} MB ({{ kpis.databasesCount }} DBs)</span>
						</div>
						<div class="sp-telemetry-row">
							<span class="sp-telemetry-label">Email</span>
							<span class="sp-telemetry-val">{{ kpis.mailAccountsCount }} Accts · {{ kpis.mailUsedMb }} MB</span>
						</div>
					</div>
				</div>

				<div class="sp-card">
					<h2 class="sp-section-kicker">EMPIRE FEED</h2>
					<div class="sp-feed-list">
						<button
							type="button"
							class="sp-feed-item"
							@click="$emit('navigate', 'security')"
						>
							<div class="sp-feed-title">{{ state.empireFeed[0].title }}</div>
							<div class="sp-feed-sub">{{ state.empireFeed[0].subtitle }}</div>
						</button>
						<button
							type="button"
							class="sp-feed-item"
							@click="$emit('navigate', 'telemetry')"
						>
							<div class="sp-feed-title">{{ state.empireFeed[1].title }}</div>
							<div class="sp-feed-sub">{{ state.empireFeed[1].subtitle }}</div>
						</button>
					</div>
				</div>

				<section class="sp-card" aria-label="Audit Log">
					<h2 class="sp-section-kicker">AUDIT LOG</h2>
					<div class="sp-audit-list">
						<div v-for="entry in state.auditLog.slice(0, 4)" :key="entry.id" class="sp-audit-row">
							<div class="sp-audit-msg" :title="entry.message">
								<i :class="iconClass(entry.icon)" aria-hidden="true"></i>
								<span>{{ entry.message }}</span>
							</div>
							<span class="sp-audit-time">{{ entry.time }}</span>
						</div>
					</div>
				</section>
			</div>
		</section>
	</div>
</template>

<script setup>
defineProps({
	state: { type: Object, required: true },
	kpis: { type: Object, required: true },
});

defineEmits(['navigate', 'open-modal']);

function iconClass(icon) {
	if (icon === 'user-plus') return 'fa-solid fa-user-plus';
	if (icon === 'globe') return 'fa-solid fa-globe';
	if (icon === 'database') return 'fa-solid fa-database';
	if (icon === 'shield') return 'fa-solid fa-shield-halved';
	return 'fa-regular fa-file-lines';
}
</script>

<style scoped>
.sp-overview {
	display: flex;
	flex-direction: column;
	gap: 12px;
}
</style>
