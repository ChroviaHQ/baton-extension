import { interpolate, t } from '@/shared/i18n';
import type { LevelOfControl } from '@/shared/proxyControl';
import { ErrorNote } from '@/ui/components';

import { usePopupStore } from './popupStore';

const BLOCKED_NOTICES: Partial<Record<LevelOfControl, string>> = {
  controlled_by_other_extensions: t.notice.otherExtension,
  not_controllable: t.notice.notControllable,
};

export function Notices() {
  const proxyError = usePopupStore(state => state.proxyError);
  const levelOfControl = usePopupStore(state => state.levelOfControl);
  const blockedNotice = levelOfControl && BLOCKED_NOTICES[levelOfControl];
  return (
    <>
      {blockedNotice && <ErrorNote>{blockedNotice}</ErrorNote>}
      {proxyError && (
        <ErrorNote>{interpolate(t.notice.proxyError, {message: proxyError.message})}</ErrorNote>
      )}
    </>
  );
}
