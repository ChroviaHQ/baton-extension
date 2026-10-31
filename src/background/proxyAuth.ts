import { normalizeHost } from '@/shared/hosts';
import { loadSettings } from '@/shared/storage';

const ANSWERED_REQUEST_TTL_MS = 60_000;

const answeredRequests = new Set<string>();

async function findProxyCredentials(challenger: {host: string; port: number;}) {
  const {proxy} = await loadSettings();
  const isConfiguredProxy = proxy.host === normalizeHost(challenger.host)
    && proxy.port === challenger.port;
  return isConfiguredProxy && proxy.username !== ''
    ? {username: proxy.username, password: proxy.password}
    : null;
}

export function registerProxyAuth() {
  chrome.webRequest.onAuthRequired.addListener(
    ({isProxy, requestId, challenger}, respond) => {
      if (!isProxy || answeredRequests.has(requestId)) {
        respond?.({});
        return;
      }
      answeredRequests.add(requestId);
      setTimeout(() => answeredRequests.delete(requestId), ANSWERED_REQUEST_TTL_MS);
      void findProxyCredentials(challenger).then(credentials =>
        respond?.(credentials ? {authCredentials: credentials} : {})
      );
    },
    {urls: ['<all_urls>']},
    ['asyncBlocking'],
  );
}
