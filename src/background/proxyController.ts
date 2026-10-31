import { buildProxyConfig, getLevelOfControl, isProxyActive } from '@/shared/proxyControl';
import type { Settings } from '@/shared/settings';
import { loadSettings, saveProxyError, watchSettings } from '@/shared/storage';

import { updateActionIcon } from './actionIcon';

const PROXY_ERROR_REPEAT_MS = 10_000;

const NO_PROXY_ERROR = {message: '', timestamp: 0};

let lastProxyError = NO_PROXY_ERROR;

async function syncActionIcon(settings: Settings) {
  await updateActionIcon(isProxyActive(settings, await getLevelOfControl()));
}

async function applySettings(settings: Settings) {
  const value = buildProxyConfig(settings);
  if (value) await chrome.proxy.settings.set({value, scope: 'regular'});
  else await chrome.proxy.settings.clear({scope: 'regular'});
}

function recordProxyError(message: string) {
  const timestamp = Date.now();
  const isRepeat = message === lastProxyError.message
    && timestamp - lastProxyError.timestamp < PROXY_ERROR_REPEAT_MS;
  if (isRepeat) return;
  lastProxyError = {message, timestamp};
  void saveProxyError(lastProxyError);
}

export function registerProxyController() {
  void loadSettings().then(syncActionIcon);
  chrome.runtime.onInstalled.addListener(() => void loadSettings().then(applySettings));
  watchSettings(settings => {
    lastProxyError = NO_PROXY_ERROR;
    void saveProxyError(null);
    void applySettings(settings);
  });
  chrome.proxy.settings.onChange.addListener(() => void loadSettings().then(syncActionIcon));
  chrome.proxy.onProxyError.addListener(({error, details}) =>
    recordProxyError(details ? `${error} ${details}` : error)
  );
}
