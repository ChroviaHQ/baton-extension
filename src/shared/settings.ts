export type ProxyScheme = 'http' | 'socks5';

export type ProxyServer = {
  scheme: ProxyScheme;
  host: string;
  port: number;
  username: string;
  password: string;
};

export type Settings = {enabled: boolean; proxy: ProxyServer; whitelist: string[];};

export const DEFAULT_SETTINGS: Settings = {
  enabled: false,
  proxy: {scheme: 'socks5', host: '127.0.0.1', port: 7897, username: '', password: ''},
  whitelist: [],
};
