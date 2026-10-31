import '@/ui/styles.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { isChineseLocale } from '@/shared/i18n';

import { Popup } from './Popup';

document.documentElement.lang = isChineseLocale ? 'zh-CN' : 'en';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Popup />
  </StrictMode>,
);
