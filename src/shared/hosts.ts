import { shouldBypassProxy } from './hostMatcher';

export function normalizeHost(host: string): string {
  return host.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, '');
}

export function isLocalHost(host: string): boolean {
  return shouldBypassProxy(host, []);
}

export function getWebPageHost(url: string): string | null {
  if (!URL.canParse(url)) return null;
  const {protocol, hostname} = new URL(url);
  return protocol === 'http:' || protocol === 'https:' ? normalizeHost(hostname) : null;
}
