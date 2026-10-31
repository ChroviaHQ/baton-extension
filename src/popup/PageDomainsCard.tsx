import { CircleAlert } from 'lucide-react';
import { useMemo } from 'react';
import { getDomain } from 'tldts-experimental';

import { interpolate, t } from '@/shared/i18n';
import type { HostActivity } from '@/shared/storage';
import { addToWhitelist, createBypassMatcher } from '@/shared/whitelist';
import { cn } from '@/ui/cn';
import { Card, EmptyState, SectionHeader, Switch } from '@/ui/components';

import { usePopupStore } from './popupStore';
import { useTabHosts } from './useTabHosts';

type DomainActivity = {domain: string; hostCount: number; requestCount: number; failed: boolean;};

function groupByDomain(hosts: [string, HostActivity][]): DomainActivity[] {
  const domains = new Map<string, DomainActivity>();
  for (const [host, activity] of hosts) {
    const domain = getDomain(host) ?? host;
    const entry = domains.get(domain) ?? {domain, hostCount: 0, requestCount: 0, failed: false};
    entry.hostCount += 1;
    entry.requestCount += activity.requests;
    entry.failed ||= activity.failed;
    domains.set(domain, entry);
  }
  return [...domains.values()].sort((a, b) =>
    Number(b.failed) - Number(a.failed) || b.requestCount - a.requestCount
  );
}

function DomainRow({activity, onWhitelist}: {activity: DomainActivity; onWhitelist: () => void;}) {
  const requests = interpolate(t.domains.requests, {count: activity.requestCount});
  const summary = activity.hostCount > 1
    ? `${interpolate(t.domains.hosts, {count: activity.hostCount})} · ${requests}`
    : requests;
  return (
    <div className='flex items-center gap-3 py-2.5 first:pt-0 last:pb-0'>
      <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
        <span
          className={cn(
            'flex items-center gap-1 font-mono text-body',
            activity.failed && 'text-danger',
          )}
        >
          <span className='truncate' title={activity.domain}>{activity.domain}</span>
          {activity.failed && (
            <span title={t.domains.failed}>
              <CircleAlert className='size-3 shrink-0' />
            </span>
          )}
        </span>
        <span className='text-caption text-muted'>{summary}</span>
      </div>
      <Switch label={t.domains.addToWhitelist} checked={false} onChange={onWhitelist} />
    </div>
  );
}

export function PageDomainsCard({tabId}: {tabId: number;}) {
  const hosts = useTabHosts(tabId);
  const whitelist = usePopupStore(state => state.settings.whitelist);
  const updateSettings = usePopupStore(state => state.updateSettings);
  const proxiedDomains = useMemo(() => {
    const isDirect = createBypassMatcher(whitelist);
    return groupByDomain(Object.entries(hosts).filter(([host]) => !isDirect(host)));
  }, [hosts, whitelist]);
  const emptyMessage = Object.keys(hosts).length === 0 ? t.domains.empty : t.domains.allWhitelisted;
  return (
    <Card className='min-h-0 gap-3'>
      <SectionHeader title={t.domains.title} hint={t.domains.hint} />
      {proxiedDomains.length === 0
        ? <EmptyState>{emptyMessage}</EmptyState>
        : (
          <div className='-mr-3 flex min-h-0 flex-col divide-y divide-line overflow-y-auto pr-3'>
            {proxiedDomains.map(activity => (
              <DomainRow
                key={activity.domain}
                activity={activity}
                onWhitelist={() =>
                  void updateSettings({whitelist: addToWhitelist(whitelist, activity.domain)})}
              />
            ))}
          </div>
        )}
    </Card>
  );
}
