import { shouldBypassProxy } from './hostMatcher';
import type { ProxyScheme, ProxyServer, Settings } from './settings';
import { toWhitelistRegExpSources } from './whitelist';

export type LevelOfControl = `${chrome.types.LevelOfControl}`;

const PAC_KEYWORDS: Record<ProxyScheme, string> = {http: 'PROXY', socks5: 'SOCKS5'};

export function formatProxyEndpoint({host, port}: Pick<ProxyServer, 'host' | 'port'>): string {
  return host.includes(':') ? `[${host}]:${port}` : `${host}:${port}`;
}

function buildPacScript(settings: Settings): string {
  const proxy = `${PAC_KEYWORDS[settings.proxy.scheme]} ${formatProxyEndpoint(settings.proxy)}`;
  const sources = JSON.stringify(toWhitelistRegExpSources(settings.whitelist));
  return [
    `var RULES = ${sources}.map(function (source) { return new RegExp(source); });`,
    `var PROXY = ${JSON.stringify(proxy)};`,
    `var shouldBypassProxy = ${shouldBypassProxy.toString()};`,
    'function FindProxyForURL(url, host) {',
    '  return shouldBypassProxy(host, RULES) ? "DIRECT" : PROXY;',
    '}',
  ].join('\n');
}

export function buildProxyConfig(settings: Settings): chrome.proxy.ProxyConfig | null {
  if (!settings.enabled) return null;
  return {mode: 'pac_script', pacScript: {data: buildPacScript(settings)}};
}

export async function getLevelOfControl(): Promise<LevelOfControl> {
  const {levelOfControl} = await chrome.proxy.settings.get({});
  return levelOfControl;
}

function isProxyBlocked(levelOfControl: LevelOfControl | null): boolean {
  return levelOfControl === 'controlled_by_other_extensions'
    || levelOfControl === 'not_controllable';
}

export function isProxyActive(settings: Settings, levelOfControl: LevelOfControl | null): boolean {
  return settings.enabled && !isProxyBlocked(levelOfControl);
}
