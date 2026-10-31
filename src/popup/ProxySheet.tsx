import { useState } from 'react';

import { normalizeHost } from '@/shared/hosts';
import { t } from '@/shared/i18n';
import type { ProxyServer } from '@/shared/settings';
import { ErrorNote, PasswordField, Segmented, Sheet, TextField } from '@/ui/components';

import { usePopupStore } from './popupStore';

const SCHEMES = [{value: 'http', label: 'HTTP'}, {value: 'socks5', label: 'SOCKS5'}] as const;

function parsePort(value: string): number | null {
  if (!value) return 0;
  const port = Number(value);
  return Number.isInteger(port) && port >= 1 && port <= 65535 ? port : null;
}

export function ProxySheet() {
  const proxy = usePopupStore(state => state.settings.proxy);
  const updateSettings = usePopupStore(state => state.updateSettings);
  const closeSheet = usePopupStore(state => state.closeSheet);
  const [draft, setDraft] = useState<ProxyServer>(proxy);
  const [showIncomplete, setShowIncomplete] = useState(false);
  const updateDraft = (patch: Partial<ProxyServer>) => {
    setDraft(current => ({...current, ...patch}));
    setShowIncomplete(false);
  };

  const save = async () => {
    if (!draft.host || !draft.port) {
      setShowIncomplete(true);
      return;
    }
    await updateSettings({proxy: {...draft, host: normalizeHost(draft.host)}});
    closeSheet();
  };

  return (
    <Sheet title={t.proxySheet.title} hint={t.proxySheet.hint} onClose={closeSheet} onSave={save}>
      <Segmented
        value={draft.scheme}
        options={SCHEMES}
        onChange={scheme => updateDraft({scheme})}
      />
      <div className='flex gap-2'>
        <TextField
          label={t.proxySheet.host}
          className='flex-1'
          value={draft.host}
          placeholder='127.0.0.1'
          onChange={event => updateDraft({host: event.target.value.trim()})}
        />
        <TextField
          label={t.proxySheet.port}
          className='w-24'
          inputMode='numeric'
          value={draft.port || ''}
          placeholder='7897'
          onChange={event => {
            const port = parsePort(event.target.value.trim());
            if (port !== null) updateDraft({port});
          }}
        />
      </div>
      {draft.scheme === 'http' && (
        <div className='flex gap-2'>
          <TextField
            label={t.proxySheet.username}
            className='flex-1'
            value={draft.username}
            placeholder={t.common.optional}
            autoComplete='off'
            onChange={event => updateDraft({username: event.target.value})}
          />
          <PasswordField
            label={t.proxySheet.password}
            className='flex-1'
            value={draft.password}
            placeholder={t.common.optional}
            autoComplete='new-password'
            onChange={event => updateDraft({password: event.target.value})}
          />
        </div>
      )}
      {showIncomplete && <ErrorNote>{t.proxySheet.incomplete}</ErrorNote>}
    </Sheet>
  );
}
