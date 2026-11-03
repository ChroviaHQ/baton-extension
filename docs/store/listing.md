# Chrome Web Store Listing

## Store listing

**Description (English)**

```
Baton runs Chrome through a single HTTP or SOCKS5 proxy, and lets you pick which sites connect directly instead.

• Set one proxy, with optional username and password for HTTP proxies.
• See every domain the current page connects to, with failed domains highlighted.
• Flip a switch next to a domain to send it straight to the web from then on.
• Whitelist entries match a domain and all of its subdomains, with * and ? wildcards.

Privacy: settings and recorded domains stay in your browser. Baton has no server, collects nothing, and makes no network requests of its own.
```

**Description (Simplified Chinese)**

```
Baton 让 Chrome 通过一个 HTTP 或 SOCKS5 代理上网，并且由你决定哪些网站直接连接。

• 设置一个代理，HTTP 代理可填写用户名和密码。
• 查看当前页面连接的所有域名，连接失败的域名会高亮显示。
• 打开域名旁的开关，此后该域名直接连接，不走代理。
• 白名单匹配域名及其全部子域名，支持 * 和 ? 通配符。

隐私：设置和域名记录只保存在你的浏览器中。Baton 没有服务器，不收集任何数据，自身不发起任何网络请求。
```

- **Category**: Tools
- **Language**: English
- **Store icon**: `public/icons/128.png`
- **Screenshots**:
  1. `docs/store/screenshot-01-page-domains.png`
  2. `docs/store/screenshot-02-proxy-setup.png`
  3. `docs/store/screenshot-03-whitelist.png`
- **Small promo tile**: `docs/store/promo-small-440x280.png`
- **Marquee promo tile**: `docs/store/promo-marquee-1400x560.png`
- **Homepage URL**: `https://github.com/ChroviaHQ/baton-extension`
- **Support URL**: `https://github.com/ChroviaHQ/baton-extension`

## Privacy practices

**Single purpose description**

```
Route Chrome's traffic through one user-configured proxy, while letting the user choose domains that connect directly.
```

**Permission justifications**

| Permission | Justification |
|---|---|
| proxy | `Applies a PAC script that sends traffic through the user's configured proxy and sends whitelisted domains direct. Clears the setting when the user turns Baton off.` |
| storage | `Stores the proxy settings and whitelist locally, and keeps the per-tab list of requested domains in session storage.` |
| webRequest | `Observes request host names per tab so the popup can list the domains the current page connects to and flag failed ones, letting the user whitelist them. Requests are never blocked or modified.` |
| webRequestAuthProvider | `Answers authentication challenges from the user's configured proxy with the username and password the user entered. Challenges from any other server are ignored.` |
| Host permission | `Proxy authentication and the per-page domain list must work on every site the user visits, since any site may be routed through the proxy.` |

**Remote code**: No, I am not using remote code

**Data usage**:

- [x] Authentication information
- [x] Web history
- [x] I do not sell or transfer user data to third parties, outside of the approved use cases
- [x] I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- [x] I do not use or transfer user data to determine creditworthiness or for lending purposes

**Privacy policy URL**

```
https://github.com/ChroviaHQ/baton-extension/blob/main/PRIVACY.md
```

## Distribution

- **Visibility**: Public
- **Regions**: All regions
