import { useEffect } from 'react';

import { cn } from '@/ui/cn';

import { Notices } from './Notices';
import { PageDomainsCard } from './PageDomainsCard';
import { usePopupStore } from './popupStore';
import { ProxySheet } from './ProxySheet';
import { RelayCard } from './RelayCard';
import { TitleBar } from './TitleBar';
import { useActiveTab } from './useActiveTab';
import { WhitelistSheet } from './WhitelistSheet';

export function Popup() {
  const initialize = usePopupStore(state => state.initialize);
  const ready = usePopupStore(state => state.ready);
  const sheet = usePopupStore(state => state.sheet);
  const tab = useActiveTab();
  useEffect(() => initialize(), [initialize]);
  return (
    <div className={cn('flex max-h-[506px] w-100 flex-col', sheet && 'min-h-120')}>
      <TitleBar />
      {ready && (
        <main className='flex min-h-0 flex-1 flex-col gap-3 px-4.5 pb-4.5'>
          <Notices />
          <RelayCard host={tab?.host ?? null} />
          {tab?.host && <PageDomainsCard tabId={tab.id} />}
        </main>
      )}
      {sheet === 'proxy' && <ProxySheet />}
      {sheet === 'whitelist' && <WhitelistSheet />}
    </div>
  );
}
