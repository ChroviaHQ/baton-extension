import { Globe, ListChecks, Power, Server } from 'lucide-react';
import { useMemo } from 'react';

import { interpolate, t } from '@/shared/i18n';
import { formatProxyEndpoint } from '@/shared/proxyControl';
import { createBypassMatcher } from '@/shared/whitelist';
import { cn } from '@/ui/cn';
import { Button, Card } from '@/ui/components';

import { selectProxyActive, usePopupStore } from './popupStore';
import { RelayTrack } from './RelayTrack';

export function RelayCard({host}: {host: string | null;}) {
  const settings = usePopupStore(state => state.settings);
  const proxyActive = usePopupStore(selectProxyActive);
  const updateSettings = usePopupStore(state => state.updateSettings);
  const openSheet = usePopupStore(state => state.openSheet);
  const isDirect = useMemo(() => createBypassMatcher(settings.whitelist), [settings.whitelist]);
  const siteDirect = host !== null && isDirect(host);

  return (
    <Card className='gap-4'>
      <RelayTrack
        active={proxyActive && !siteDirect}
        nodes={[{
          icon: Server,
          label: t.relay.proxy,
          value: formatProxyEndpoint(settings.proxy),
          title: t.relay.editProxy,
          onClick: () => openSheet('proxy'),
        }, {
          icon: ListChecks,
          label: t.relay.whitelist,
          value: interpolate(t.relay.whitelistValue, {count: settings.whitelist.length}),
          title: t.relay.editWhitelist,
          onClick: () => openSheet('whitelist'),
        }, {
          icon: Globe,
          label: proxyActive && siteDirect ? t.relay.siteDirect : t.relay.site,
          value: host ?? t.relay.noSite,
          title: host ?? undefined,
        }]}
      />
      <Button
        variant={settings.enabled ? 'secondary' : 'primary'}
        onClick={() => void updateSettings({enabled: !settings.enabled})}
        className={cn(
          'h-11 w-full gap-2 rounded-xl text-title font-semibold active:scale-[0.99]',
          settings.enabled && 'hover:border-danger/40 hover:text-danger',
        )}
      >
        <Power className='size-4' />
        {settings.enabled ? t.relay.stop : t.relay.start}
      </Button>
    </Card>
  );
}
