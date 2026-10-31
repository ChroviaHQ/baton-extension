import { create } from 'zustand';

import { getLevelOfControl, isProxyActive, type LevelOfControl } from '@/shared/proxyControl';
import { DEFAULT_SETTINGS, type Settings } from '@/shared/settings';
import {
  loadProxyError,
  loadSettings,
  type ProxyError,
  saveSettings,
  watchProxyError,
  watchSettings,
} from '@/shared/storage';

type SheetId = 'proxy' | 'whitelist';

type PopupState = {
  ready: boolean;
  settings: Settings;
  proxyError: ProxyError | null;
  levelOfControl: LevelOfControl | null;
  sheet: SheetId | null;
  initialize: () => () => void;
  updateSettings: (patch: Partial<Settings>) => Promise<void>;
  openSheet: (sheet: SheetId) => void;
  closeSheet: () => void;
};

export const selectProxyActive = (state: PopupState) =>
  isProxyActive(state.settings, state.levelOfControl);

export const usePopupStore = create<PopupState>((set, get) => {
  const refreshLevelOfControl = () =>
    getLevelOfControl().then(levelOfControl => set({levelOfControl}));

  return {
    ready: false,
    settings: DEFAULT_SETTINGS,
    proxyError: null,
    levelOfControl: null,
    sheet: null,

    initialize: () => {
      const loaded = Promise.all([loadSettings(), loadProxyError(), refreshLevelOfControl()]);
      void loaded.then(([settings, proxyError]) => set({ready: true, settings, proxyError}));
      const unwatchSettings = watchSettings(settings => set({settings}));
      const unwatchProxyError = watchProxyError(proxyError => set({proxyError}));
      const onProxySettingsChange = () => void refreshLevelOfControl();
      chrome.proxy.settings.onChange.addListener(onProxySettingsChange);
      return () => {
        unwatchSettings();
        unwatchProxyError();
        chrome.proxy.settings.onChange.removeListener(onProxySettingsChange);
      };
    },

    updateSettings: async patch => {
      const next = {...get().settings, ...patch};
      set({settings: next});
      await saveSettings(next);
    },

    openSheet: sheet => set({sheet}),
    closeSheet: () => set({sheet: null}),
  };
});
