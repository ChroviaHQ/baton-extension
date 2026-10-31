import { useEffect, useState } from 'react';

import { loadTabHosts, type TabHosts, watchTabHosts } from '@/shared/storage';

export function useTabHosts(tabId: number): TabHosts {
  const [hosts, setHosts] = useState<TabHosts>({});
  useEffect(() => {
    void loadTabHosts(tabId).then(setHosts);
    return watchTabHosts(tabId, setHosts);
  }, [tabId]);
  return hosts;
}
