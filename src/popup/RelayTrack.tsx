import type { ComponentType } from 'react';

import { cn } from '@/ui/cn';

type RelayNode = {
  icon: ComponentType<{className?: string;}>;
  label: string;
  value: string;
  title?: string;
  onClick?: () => void;
};

function RelayTrackNode(
  {node: {icon: Icon, label, value, title, onClick}, active}: {node: RelayNode; active: boolean;},
) {
  return (
    <button
      type='button'
      title={title}
      onClick={onClick}
      disabled={!onClick}
      className='group row-span-2 grid min-w-0 grid-cols-1 grid-rows-subgrid justify-items-center text-center'
    >
      <span className='rounded-full bg-surface'>
        <span
          className={cn(
            'grid size-10 place-items-center rounded-full border transition group-enabled:group-hover:ring-4 group-enabled:group-hover:ring-accent-soft',
            active
              ? 'border-accent/30 bg-accent-soft text-accent'
              : 'border-line bg-surface-2 text-muted group-enabled:group-hover:text-text',
          )}
        >
          <Icon className='size-4.5' />
        </span>
      </span>
      <span className='flex w-full flex-col items-center gap-0.5'>
        <span className='text-caption font-medium text-muted'>{label}</span>
        <span className='w-full truncate px-0.5 text-caption font-medium text-text tabular-nums'>
          {value}
        </span>
      </span>
    </button>
  );
}

export function RelayTrack(
  {nodes, active}: {nodes: [RelayNode, RelayNode, RelayNode]; active: boolean;},
) {
  return (
    <div className='grid grid-rows-[auto_auto] gap-y-2'>
      <div className='col-start-1 row-start-1 grid grid-cols-6'>
        <svg className='col-start-2 col-end-6 h-px w-full self-center overflow-visible'>
          <line
            x1='0'
            y1='0'
            x2='100%'
            y2='0'
            strokeWidth='2'
            strokeLinecap='round'
            className={active ? 'relay-flow stroke-accent' : 'stroke-line'}
          />
        </svg>
      </div>
      <div className='col-start-1 row-[1/span_2] grid grid-cols-3 grid-rows-subgrid'>
        {nodes.map(node => <RelayTrackNode key={node.label} node={node} active={active} />)}
      </div>
    </div>
  );
}
