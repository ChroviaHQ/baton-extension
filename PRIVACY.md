# Baton Privacy Policy

Last updated: November 3, 2026

Baton is a Chrome extension that sends browser traffic through a proxy you configure and lets the domains you choose connect directly. This policy describes the data Baton handles. In short: everything stays in your browser, and Baton makes no network requests of its own.

## Data Baton Handles

**Proxy settings.** The proxy scheme, host, port, and, if you enter them, the username and password for the proxy, along with your whitelist and whether the proxy is turned on. These are stored in `chrome.storage.local` on your device so they persist across browser restarts. The username and password are used only to answer authentication requests from the proxy you configured, and are never given to any other server.

**Domains requested by each tab.** To show which domains the current page connects to, Baton records the host name of each request a tab makes, with a request count and whether any request failed. Full URLs, page content, and request bodies are not recorded. This list is kept in `chrome.storage.session`, is removed when the tab closes, and is cleared entirely when Chrome exits.

## What Baton Does Not Do

- Baton does not send any data to the developer or to any third party. It has no server, analytics, or telemetry.
- Baton does not sell, share, or transfer data, and does not use it for advertising, creditworthiness, or any purpose other than the extension's single function.
- Baton does not load or run remote code.

Your browsing traffic does pass through the proxy server you configure. That server is chosen and operated by you or your provider, not by Baton, and its handling of your traffic is governed by its operator's own policies.

## Removing Your Data

Uninstalling Baton deletes all of its stored data. You can also clear the proxy credentials at any time by emptying them in Baton's proxy settings.

## Contact

Questions about this policy can be filed as an issue at https://github.com/ChroviaHQ/baton-extension/issues.
