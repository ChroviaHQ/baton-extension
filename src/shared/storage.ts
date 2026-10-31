import { DEFAULT_SETTINGS, type Settings } from './settings';

type StorageArea = 'local' | 'session';

export type HostActivity = {requests: number; failed: boolean;};

export type TabHosts = Record<string, HostActivity>;

export type ProxyError = {message: string; timestamp: number;};

const SETTINGS_KEY = 'settings';
const PROXY_ERROR_KEY = 'proxyError';
const TAB_HOSTS_PREFIX = 'tabHosts:';
const PROXY_ERROR_TTL_MS = 60_000;

const tabHostsKey = (tabId: number) => `${TAB_HOSTS_PREFIX}${tabId}`;

const toSettings = (value: unknown) => (value as Settings | undefined) ?? DEFAULT_SETTINGS;

const toTabHosts = (value: unknown) => (value as TabHosts | undefined) ?? {};

function toRecentProxyError(value: unknown): ProxyError | null {
  const error = value as ProxyError | undefined;
  return error && Date.now() - error.timestamp < PROXY_ERROR_TTL_MS ? error : null;
}

async function readStorageValue(area: StorageArea, key: string): Promise<unknown> {
  const stored = await chrome.storage[area].get(key);
  return stored[key];
}

function watchStorageValue(area: StorageArea, key: string, onChange: (value: unknown) => void) {
  const listener = (changes: Record<string, chrome.storage.StorageChange>, changedArea: string) => {
    if (changedArea === area && key in changes) onChange(changes[key].newValue);
  };
  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
}

export const loadSettings = () => readStorageValue('local', SETTINGS_KEY).then(toSettings);

export const saveSettings = (settings: Settings) =>
  chrome.storage.local.set({[SETTINGS_KEY]: settings});

export const watchSettings = (onChange: (settings: Settings) => void) =>
  watchStorageValue('local', SETTINGS_KEY, value => onChange(toSettings(value)));

export const loadProxyError = () =>
  readStorageValue('session', PROXY_ERROR_KEY).then(toRecentProxyError);

export const saveProxyError = (error: ProxyError | null) =>
  error
    ? chrome.storage.session.set({[PROXY_ERROR_KEY]: error})
    : chrome.storage.session.remove(PROXY_ERROR_KEY);

export const watchProxyError = (onChange: (error: ProxyError | null) => void) =>
  watchStorageValue('session', PROXY_ERROR_KEY, value => onChange(toRecentProxyError(value)));

export const loadTabHosts = (tabId: number) =>
  readStorageValue('session', tabHostsKey(tabId)).then(toTabHosts);

export const watchTabHosts = (tabId: number, onChange: (hosts: TabHosts) => void) =>
  watchStorageValue('session', tabHostsKey(tabId), value => onChange(toTabHosts(value)));

export async function loadAllTabHosts(): Promise<Map<number, TabHosts>> {
  const stored = await chrome.storage.session.get(null);
  const tabHosts = new Map<number, TabHosts>();
  for (const [key, value] of Object.entries(stored)) {
    if (key.startsWith(TAB_HOSTS_PREFIX)) {
      tabHosts.set(Number(key.slice(TAB_HOSTS_PREFIX.length)), toTabHosts(value));
    }
  }
  return tabHosts;
}

export const saveTabHosts = (tabs: ReadonlyMap<number, TabHosts>) =>
  chrome.storage.session.set(
    Object.fromEntries([...tabs].map(([tabId, hosts]) => [tabHostsKey(tabId), hosts])),
  );

export const removeTabHosts = (tabId: number) => chrome.storage.session.remove(tabHostsKey(tabId));
