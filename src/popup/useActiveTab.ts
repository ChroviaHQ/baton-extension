import { useEffect, useState } from 'react';

import { getWebPageHost } from '@/shared/hosts';

type ActiveTab = {id: number; host: string | null;};

export function useActiveTab(): ActiveTab | null {
  const [tab, setTab] = useState<ActiveTab | null>(null);
  useEffect(() => {
    void chrome.tabs.query({active: true, currentWindow: true}).then(([current]) => {
      if (current?.id === undefined) return;
      setTab({id: current.id, host: current.url ? getWebPageHost(current.url) : null});
    });
  }, []);
  return tab;
}
