<template>
	<div class="sp-shell" :class="theme === 'dark' ? 'sp-theme-dark' : 'sp-theme-light'" :data-theme="theme">
		<!-- Top Window Bar -->
		<header class="sp-topbar">
			<div class="sp-topbar-left">
				<button
					type="button"
					class="sp-mobile-menu-btn"
					@click="mobileNavOpen = !mobileNavOpen"
					:aria-expanded="mobileNavOpen"
					aria-label="Toggle navigation menu"
				>
					<i class="fa-solid fa-bars" aria-hidden="true"></i>
				</button>
				<div class="sp-address-pill" title="Active Silicon Panel Node">
					<i class="fa-solid fa-lock" aria-hidden="true"></i>
					<span>{{ state.panelUrl }}</span>
				</div>
			</div>

			<div class="sp-topbar-right">
				<div class="sp-live-badge" aria-label="Node status live">
					<span class="sp-live-dot" aria-hidden="true"></span>
					<span>LIVE NODE</span>
				</div>
				<button
					type="button"
					class="sp-theme-toggle"
					data-testid="theme-toggle"
					@click="toggleTheme"
					:aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
				>
					<i :class="theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'" aria-hidden="true"></i>
					<span>{{ theme === 'dark' ? 'Light' : 'Dark' }}</span>
				</button>
			</div>
		</header>

		<div class="sp-workspace">
			<!-- Mobile Drawer Backdrop -->
			<div
				v-if="mobileNavOpen"
				class="sp-sidebar-backdrop"
				@click="mobileNavOpen = false"
				aria-hidden="true"
			></div>

			<!-- Left Sidebar -->
			<aside class="sp-sidebar" :class="{ 'is-open': mobileNavOpen }" aria-label="Silicon Panel Navigation">
				<div>
					<div class="sp-brand-block">
						<span class="sp-brand-icon" aria-hidden="true">
							<i class="fa-solid fa-microchip"></i>
						</span>
						<span class="sp-brand-name">Silicon Panel</span>
					</div>

					<nav class="sp-nav-list">
						<button
							v-for="item in navItems"
							:key="item.id"
							type="button"
							class="sp-nav-item"
							:class="{ 'is-active': activeView === item.id }"
							@click="selectView(item.id)"
						>
							<i :class="item.icon" aria-hidden="true"></i>
							<span>{{ item.label }}</span>
						</button>
					</nav>
				</div>

				<div class="sp-sidebar-footer">
					<a href="/docs/introduction/getting-started" class="sp-nav-item">
						<i class="fa-solid fa-book" aria-hidden="true"></i>
						<span>Documentation</span>
					</a>
					<a href="/install" class="sp-nav-item">
						<i class="fa-solid fa-terminal" aria-hidden="true"></i>
						<span>Install Builder</span>
					</a>
					<div class="sp-sidebar-credit">
						<strong>Silicon Empire Ltd</strong>
						<span>Author: Md Mainul Hasan</span>
					</div>
				</div>
			</aside>

			<!-- Main Viewport -->
			<main class="sp-main">
				<DashboardOverview
					v-if="activeView === 'dashboard'"
					:state="state"
					:kpis="kpis"
					@navigate="selectView"
					@open-modal="openModal"
				/>
				<PanelSubViews
					v-else
					:active-view="activeView"
					:state="state"
					@open-modal="openModal"
					@edit-file="handleOpenEditFile"
					@delete-file="handleDeleteFile"
					@delete-database="handleDeleteDatabase"
					@toggle-domain-ssl="handleToggleDomainSsl"
					@toggle-domain-status="handleToggleDomainStatus"
					@delete-domain="handleDeleteDomain"
					@delete-mail="handleDeleteMail"
					@restart-service="handleRestartService"
					@toggle-firewall="handleToggleFirewall"
				/>

				<footer class="sp-footer">
					<span>
						<strong>SILICON PANEL</strong> · Powered by <strong>Silicon Empire Ltd</strong> · Authored by <strong>Md Mainul Hasan</strong> · GPLv3
					</span>
					<span style="display: inline-flex; gap: 14px;">
						<a href="/features">Features</a>
						<a href="/install">Install CLI</a>
						<a href="/team">Team</a>
						<a href="/docs/introduction/getting-started">Docs</a>
					</span>
				</footer>
			</main>
		</div>

		<PanelActionModal
			:modal-type="modalType"
			:state="state"
			:editing-file="editingFile"
			:error-msg="modalError"
			@close="closeModal"
			@submit-domain="handleAddDomain"
			@submit-database="handleAddDatabase"
			@submit-mail="handleAddMail"
			@submit-file="handleAddFile"
			@submit-edit-file="handleEditFile"
			@submit-firewall="handleAddFirewall"
			@submit-site-builder="handleSiteBuilder"
			@submit-app-installer="handleAppInstaller"
			@create-backup="handleCreateBackup"
			@submit-subdomain="handleAddSubdomain"
			@submit-dns="handleAddDns"
			@submit-redirect="handleAddRedirect"
			@ack-alert="handleAckAlert"
		/>

		<div v-if="toastMessage" class="sp-toast" role="status" aria-live="polite">
			{{ toastMessage }}
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import '../styles/dashboard.css';
import {
	acknowledgeAlert,
	addDatabase,
	addDnsRecord,
	addDomain,
	addFileEntry,
	addFirewallRule,
	addMailAccount,
	addRedirectRule,
	addSubdomain,
	computeKpis,
	createBackupSnapshot,
	createInitialPanelState,
	deleteDatabase,
	deleteDomain,
	deleteFileEntry,
	deleteMailAccount,
	installQuickApp,
	resolveTheme,
	restartService,
	THEME_STORAGE_KEY,
	toggleDomainSsl,
	toggleDomainStatus,
	toggleFirewallRule,
	updateFileContent,
} from '../lib/panelState.js';
import DashboardOverview from './dashboard/DashboardOverview.vue';
import PanelActionModal from './dashboard/PanelActionModal.vue';
import PanelSubViews from './dashboard/PanelSubViews.vue';

const navItems = [
	{ id: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-chart-line' },
	{ id: 'files', label: 'File Manager', icon: 'fa-solid fa-folder' },
	{ id: 'databases', label: 'Databases', icon: 'fa-solid fa-database' },
	{ id: 'domains', label: 'Domains', icon: 'fa-solid fa-globe' },
	{ id: 'mail', label: 'Mail Accounts', icon: 'fa-solid fa-envelope' },
	{ id: 'telemetry', label: 'Telemetry', icon: 'fa-solid fa-gauge-high' },
	{ id: 'security', label: 'Security', icon: 'fa-solid fa-shield-halved' },
];

const theme = ref('dark');
const activeView = ref('dashboard');
const mobileNavOpen = ref(false);
const state = ref(createInitialPanelState());
const modalType = ref(null);
const modalError = ref('');
const editingFile = ref(null);
const toastMessage = ref('');
let toastTimer = null;

const kpis = computed(() => computeKpis(state.value));

onMounted(() => {
	try {
		const saved = localStorage.getItem(THEME_STORAGE_KEY);
		theme.value = resolveTheme(saved);
	} catch {
		theme.value = 'dark';
	}
	syncDocumentTheme(theme.value);
});

function syncDocumentTheme(mode) {
	if (typeof document !== 'undefined') {
		document.documentElement.classList.toggle('dark', mode === 'dark');
	}
}

function toggleTheme() {
	const next = theme.value === 'dark' ? 'light' : 'dark';
	theme.value = next;
	syncDocumentTheme(next);
	try {
		localStorage.setItem(THEME_STORAGE_KEY, next);
	} catch {
		// ignore storage restriction
	}
	showToast(`Switched to ${next} theme`);
}

function selectView(viewId) {
	activeView.value = viewId;
	mobileNavOpen.value = false;
}

function openModal(type) {
	modalError.value = '';
	editingFile.value = null;
	modalType.value = type;
}

function closeModal() {
	modalType.value = null;
	modalError.value = '';
	editingFile.value = null;
}

function showToast(msg) {
	toastMessage.value = msg;
	if (toastTimer) clearTimeout(toastTimer);
	toastTimer = setTimeout(() => {
		toastMessage.value = '';
	}, 2600);
}

function handleAddDomain(payload) {
	const res = addDomain(state.value, payload);
	if (!res.ok) {
		modalError.value = res.error;
		return;
	}
	state.value = res.state;
	closeModal();
	showToast(`Domain ${payload.domain} created`);
}

function handleToggleDomainStatus(id) {
	state.value = toggleDomainStatus(state.value, id);
	showToast('Domain status updated');
}

function handleToggleDomainSsl(id) {
	state.value = toggleDomainSsl(state.value, id);
	showToast('SSL setting updated');
}

function handleDeleteDomain(id) {
	state.value = deleteDomain(state.value, id);
	showToast('Domain removed');
}

function handleAddDatabase(payload) {
	const res = addDatabase(state.value, payload);
	if (!res.ok) {
		modalError.value = res.error;
		return;
	}
	state.value = res.state;
	closeModal();
	showToast(`Database ${payload.name} created`);
}

function handleDeleteDatabase(id) {
	state.value = deleteDatabase(state.value, id);
	showToast('Database deleted');
}

function handleAddMail(payload) {
	const res = addMailAccount(state.value, payload);
	if (!res.ok) {
		modalError.value = res.error;
		return;
	}
	state.value = res.state;
	closeModal();
	showToast(`Mailbox ${payload.localPart}@${payload.domain} configured`);
}

function handleDeleteMail(id) {
	state.value = deleteMailAccount(state.value, id);
	showToast('Mailbox deleted');
}

function handleAddFile(payload) {
	const res = addFileEntry(state.value, payload);
	if (!res.ok) {
		modalError.value = res.error;
		return;
	}
	state.value = res.state;
	closeModal();
	showToast(`${payload.type === 'dir' ? 'Directory' : 'File'} ${payload.name} created`);
}

function handleOpenEditFile(file) {
	modalError.value = '';
	editingFile.value = file;
	modalType.value = 'edit-file';
}

function handleEditFile({ id, content }) {
	state.value = updateFileContent(state.value, id, content);
	closeModal();
	showToast('File saved');
}

function handleDeleteFile(id) {
	state.value = deleteFileEntry(state.value, id);
	showToast('Entry removed');
}

function handleAddFirewall(payload) {
	const res = addFirewallRule(state.value, payload);
	if (!res.ok) {
		modalError.value = res.error;
		return;
	}
	state.value = res.state;
	closeModal();
	showToast(`Firewall rule added for port ${payload.port}`);
}

function handleToggleFirewall(id) {
	state.value = toggleFirewallRule(state.value, id);
	showToast('Firewall rule updated');
}

function handleSiteBuilder({ domain, template }) {
	const res = installQuickApp(state.value, { appName: template, domain });
	if (!res.ok) {
		modalError.value = res.error;
		return;
	}
	state.value = res.state;
	closeModal();
	showToast(`Deployed template to ${domain}`);
}

function handleAppInstaller({ appName, domain }) {
	const res = installQuickApp(state.value, { appName, domain });
	if (!res.ok) {
		modalError.value = res.error;
		return;
	}
	state.value = res.state;
	closeModal();
	showToast(`${appName} installed on ${domain}`);
}

function handleCreateBackup() {
	state.value = createBackupSnapshot(state.value, 'Manual Snapshot');
	showToast('Backup archive created');
}

function handleAddSubdomain(payload) {
	const res = addSubdomain(state.value, payload);
	if (!res.ok) {
		modalError.value = res.error;
		return;
	}
	state.value = res.state;
	closeModal();
	showToast(`Subdomain ${payload.prefix} created`);
}

function handleAddDns(payload) {
	const res = addDnsRecord(state.value, payload);
	if (!res.ok) {
		modalError.value = res.error;
		return;
	}
	state.value = res.state;
	showToast(`DNS ${payload.type} record added`);
}

function handleAddRedirect(payload) {
	const res = addRedirectRule(state.value, payload);
	if (!res.ok) {
		modalError.value = res.error;
		return;
	}
	state.value = res.state;
	showToast('Redirect rule added');
}

function handleRestartService(id) {
	state.value = restartService(state.value, id);
	showToast('Service restarted');
}

function handleAckAlert(id) {
	state.value = acknowledgeAlert(state.value, id);
	showToast('Alert acknowledged');
}
</script>
