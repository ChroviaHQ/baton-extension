import { t } from '@/shared/i18n';
import { LOGO_BAR_PATH, LOGO_ROTATION_DEGREES, LOGO_TRACK_PATH } from '@/shared/logo';
import { cn } from '@/ui/cn';

import { selectProxyActive, usePopupStore } from './popupStore';

function Logo({animated}: {animated: boolean;}) {
  return (
    <svg width={22} height={22} viewBox='0 0 24 24' aria-hidden='true'>
      <g
        transform={`rotate(${LOGO_ROTATION_DEGREES} 12 12)`}
        fill='none'
        stroke='var(--accent)'
        strokeWidth='2.2'
        strokeLinecap='round'
      >
        <path d={LOGO_TRACK_PATH} opacity={animated ? 0.3 : 1} />
        {animated && (
          <path d={LOGO_TRACK_PATH} pathLength={100} strokeDasharray='24 76' className='logo-run' />
        )}
        <path d={LOGO_BAR_PATH} />
      </g>
    </svg>
  );
}

function StatusPill({active}: {active: boolean;}) {
  return (
    <div
      className={cn(
        'flex h-6.5 items-center gap-1.5 rounded-md px-2 text-label font-medium',
        active ? 'bg-ok-soft text-ok' : 'bg-surface-2 text-muted',
      )}
    >
      <span className='relative flex size-2'>
        {active && <span className='pulse-ring absolute inset-0 rounded-full bg-ok' />}
        <span className={cn('relative size-2 rounded-full', active ? 'bg-ok' : 'bg-faint')} />
      </span>
      {active ? t.status.running : t.status.stopped}
    </div>
  );
}

export function TitleBar() {
  const active = usePopupStore(selectProxyActive);
  return (
    <header className='flex h-12.5 shrink-0 items-center justify-between pr-3 pl-4.5'>
      <div className='flex items-center gap-1.5'>
        <Logo animated={active} />
        <span className='text-title font-semibold tracking-tight'>Baton</span>
      </div>
      <StatusPill active={active} />
    </header>
  );
}
