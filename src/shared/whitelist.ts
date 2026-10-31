import { shouldBypassProxy } from './hostMatcher';

const URL_SCHEME_AND_PATH = /^[a-z][a-z\d+.-]*:\/\/|\/.*$/g;
const EDGE_DOTS = /^\.+|\.+$/g;

const hasWildcard = (pattern: string) => /[*?]/.test(pattern);

function normalizePattern(pattern: string): string {
  const host = pattern.trim().toLowerCase().replace(URL_SCHEME_AND_PATH, '');
  const normalized = host.replace(EDGE_DOTS, '');
  const suffix = normalized.slice(2);
  return normalized.startsWith('*.') && !hasWildcard(suffix) ? suffix : normalized;
}

function globToRegExpSource(glob: string): string {
  return glob.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.');
}

function patternToRegExpSource(pattern: string): string {
  const source = globToRegExpSource(pattern);
  return hasWildcard(pattern) ? `^${source}$` : `(^|\\.)${source}$`;
}

export function toWhitelistRegExpSources(whitelist: readonly string[]): string[] {
  return whitelist.map(patternToRegExpSource);
}

export function createBypassMatcher(whitelist: readonly string[]): (host: string) => boolean {
  const rules = toWhitelistRegExpSources(whitelist).map(source => new RegExp(source));
  return host => shouldBypassProxy(host, rules);
}

export function addToWhitelist(whitelist: string[], pattern: string): string[] {
  const normalized = normalizePattern(pattern);
  if (!normalized || whitelist.includes(normalized)) return whitelist;
  return [...whitelist, normalized].sort();
}
