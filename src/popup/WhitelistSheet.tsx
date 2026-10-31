import { Plus, X } from 'lucide-react';
import { useState } from 'react';

import { t } from '@/shared/i18n';
import { addToWhitelist } from '@/shared/whitelist';
import { Button, EmptyState, IconButton, Sheet, TextField } from '@/ui/components';

import { usePopupStore } from './popupStore';

export function WhitelistSheet() {
  const whitelist = usePopupStore(state => state.settings.whitelist);
  const updateSettings = usePopupStore(state => state.updateSettings);
  const closeSheet = usePopupStore(state => state.closeSheet);
  const [draft, setDraft] = useState(whitelist);
  const [input, setInput] = useState('');

  const commitInput = () => {
    setDraft(addToWhitelist(draft, input));
    setInput('');
  };

  const save = async () => {
    await updateSettings({whitelist: addToWhitelist(draft, input)});
    closeSheet();
  };

  const remove = (pattern: string) => setDraft(draft.filter(entry => entry !== pattern));

  return (
    <Sheet
      title={t.whitelistSheet.title}
      hint={t.whitelistSheet.hint}
      onClose={closeSheet}
      onSave={save}
    >
      <div className='flex items-end gap-2'>
        <TextField
          className='flex-1'
          value={input}
          autoFocus
          placeholder='example.com'
          onChange={event => setInput(event.target.value)}
          onKeyDown={event => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            commitInput();
          }}
        />
        <Button onClick={commitInput} disabled={!input.trim()}>
          <Plus className='size-3.5' />
          {t.common.add}
        </Button>
      </div>
      {draft.length === 0
        ? <EmptyState>{t.whitelistSheet.empty}</EmptyState>
        : (
          <div className='flex min-h-0 flex-col divide-y divide-line overflow-y-auto rounded-lg border border-line'>
            {draft.map(pattern => (
              <div key={pattern} className='flex h-9 shrink-0 items-center gap-2 pr-1.5 pl-3'>
                <span className='min-w-0 flex-1 truncate font-mono text-code'>{pattern}</span>
                <IconButton
                  title={t.whitelistSheet.remove}
                  onClick={() => remove(pattern)}
                  className='hover:text-danger'
                >
                  <X className='size-3.5' />
                </IconButton>
              </div>
            ))}
          </div>
        )}
    </Sheet>
  );
}
