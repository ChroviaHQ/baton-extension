import en from './locales/en.json';
import zh from './locales/zh.json';

type Messages = typeof en;

export const isChineseLocale = chrome.i18n.getUILanguage().toLowerCase().startsWith('zh');
export const t: Messages = isChineseLocale ? zh : en;

export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match));
}
