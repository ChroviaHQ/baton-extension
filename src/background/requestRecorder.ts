import { isLocalHost, normalizeHost } from '@/shared/hosts';
import { loadAllTabHosts, removeTabHosts, saveTabHosts, type TabHosts } from '@/shared/storage';

const FLUSH_DELAY_MS = 400;
const RECORDED_URL_PATTERNS = ['http://*/*', 'https://*/*', 'ws://*/*', 'wss://*/*'];
const IGNORED_ERRORS = new Set([
  'net::ERR_ABORTED',
  'net::ERR_BLOCKED_BY_CLIENT',
  'net::ERR_BLOCKED_BY_RESPONSE',
  'net::ERR_CACHE_MISS',
]);

type RequestDetails = {url: string; tabId: number; type: string;};

let hostsByTab = new Map<number, TabHosts>();
const dirtyTabIds = new Set<number>();
let flushTimer: ReturnType<typeof setTimeout> | undefined;
const restored = loadAllTabHosts().then(stored => {
  hostsByTab = stored;
});

function scheduleFlush() {
  if (flushTimer !== undefined) return;
  flushTimer = setTimeout(() => {
    flushTimer = undefined;
    const dirtyTabs = new Map([...dirtyTabIds].map(tabId => [tabId, hostsByTab.get(tabId)!]));
    dirtyTabIds.clear();
    void saveTabHosts(dirtyTabs);
  }, FLUSH_DELAY_MS);
}

async function recordRequest({url, tabId, type}: RequestDetails, failed: boolean) {
  if (tabId < 0) return;
  await restored;
  const host = normalizeHost(new URL(url).hostname);
  if (isLocalHost(host)) return;
  const hosts = !failed && type === 'main_frame' ? {} : hostsByTab.get(tabId) ?? {};
  const activity = hosts[host] ?? {requests: 0, failed: false};
  hosts[host] = {requests: activity.requests + (failed ? 0 : 1), failed: activity.failed || failed};
  hostsByTab.set(tabId, hosts);
  dirtyTabIds.add(tabId);
  scheduleFlush();
}

async function forgetTab(tabId: number) {
  await restored;
  hostsByTab.delete(tabId);
  dirtyTabIds.delete(tabId);
  await removeTabHosts(tabId);
}

export function registerRequestRecorder() {
  chrome.webRequest.onBeforeRequest.addListener(details => {
    void recordRequest(details, false);
  }, {urls: RECORDED_URL_PATTERNS});
  chrome.webRequest.onErrorOccurred.addListener(details => {
    if (IGNORED_ERRORS.has(details.error)) return;
    void recordRequest(details, true);
  }, {urls: RECORDED_URL_PATTERNS});
  chrome.tabs.onRemoved.addListener(tabId => void forgetTab(tabId));
}
