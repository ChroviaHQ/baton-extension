import { Eye, EyeOff, TriangleAlert, X } from 'lucide-react';
import {
  type ButtonHTMLAttributes,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
  useEffect,
  useState,
} from 'react';

import { t } from '@/shared/i18n';

import { cn } from './cn';

export function Card({className, children}: {className?: string; children: ReactNode;}) {
  return (
    <section
      className={cn(
        'flex flex-col rounded-2xl border border-line bg-surface p-4 shadow-card',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionHeader({title, hint}: {title: string; hint: string;}) {
  return (
    <header className='flex flex-col gap-0.5'>
      <h2 className='text-body font-medium'>{title}</h2>
      <p className='text-caption text-muted'>{hint}</p>
    </header>
  );
}

export function EmptyState({children}: {children: ReactNode;}) {
  return <p className='py-3 text-center text-label text-muted'>{children}</p>;
}

export function ErrorNote({children}: {children: ReactNode;}) {
  return (
    <div className='flex items-start gap-2 rounded-lg bg-danger-soft px-3 py-2 text-label text-danger'>
      <TriangleAlert className='my-0.5 size-3.5 shrink-0' />
      <span className='wrap-anywhere'>{children}</span>
    </div>
  );
}

export function Segmented<T extends string>(
  {value, options, onChange}: {
    value: T;
    options: readonly {value: T; label: string;}[];
    onChange: (value: T) => void;
  },
) {
  return (
    <div className='inline-flex self-start rounded-lg bg-surface-2 p-0.5'>
      {options.map(option => (
        <button
          key={option.value}
          type='button'
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-md px-2.5 py-1 text-label font-medium transition',
            option.value === value
              ? 'bg-surface text-text shadow-sm'
              : 'text-muted hover:text-text',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  trailing?: ReactNode;
};

export function TextField({label, className, trailing, ...props}: TextFieldProps) {
  return (
    <label className={cn('flex min-w-0 flex-col gap-1', className)}>
      {label && <span className='text-caption font-medium text-muted'>{label}</span>}
      <span className='flex items-center rounded-lg border border-line bg-surface-2 transition focus-within:border-accent focus-within:ring-3 focus-within:ring-accent-soft'>
        <input
          {...props}
          spellCheck={false}
          autoCorrect='off'
          autoCapitalize='off'
          className='h-8 w-full min-w-0 bg-transparent px-2.5 font-mono text-body text-text outline-none placeholder:text-faint'
        />
        {trailing}
      </span>
    </label>
  );
}

export function PasswordField(props: Omit<TextFieldProps, 'type' | 'trailing'>) {
  const [reveal, setReveal] = useState(false);
  return (
    <TextField
      {...props}
      type={reveal ? 'text' : 'password'}
      trailing={
        <IconButton
          tabIndex={-1}
          title={reveal ? t.common.hidePassword : t.common.showPassword}
          onClick={() => setReveal(value => !value)}
          className='mr-0.5'
        >
          {reveal ? <EyeOff className='size-3.5' /> : <Eye className='size-3.5' />}
        </IconButton>
      }
    />
  );
}

export function Switch(
  {label, checked, onChange}: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  },
) {
  return (
    <button
      type='button'
      role='switch'
      aria-label={label}
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'flex h-5.5 w-9.5 shrink-0 items-center rounded-full p-0.75 transition',
        checked ? 'bg-accent' : 'bg-faint/40',
      )}
    >
      <span
        className={cn(
          'size-4 rounded-full bg-white shadow transition-transform',
          checked && 'translate-x-full',
        )}
      />
    </button>
  );
}

const BUTTON_VARIANTS = {
  primary: 'border-transparent bg-accent font-semibold text-on-accent hover:brightness-110',
  secondary:
    'border-line bg-surface-2 font-medium text-text hover:border-accent/50 hover:text-accent',
};

export function Button(
  {children, variant = 'secondary', className, ...props}:
    & ButtonHTMLAttributes<HTMLButtonElement>
    & {variant?: keyof typeof BUTTON_VARIANTS;},
) {
  return (
    <button
      type='button'
      {...props}
      className={cn(
        'inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border px-3.5 text-body transition disabled:pointer-events-none disabled:opacity-60',
        BUTTON_VARIANTS[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function IconButton(
  {children, className, ...props}: ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button
      type='button'
      aria-label={props.title}
      {...props}
      className={cn(
        'grid size-6.5 shrink-0 place-items-center rounded-md text-muted transition hover:bg-surface-2 hover:text-text',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Sheet(
  {title, hint, children, onClose, onSave}: {
    title: string;
    hint: string;
    children: ReactNode;
    onClose: () => void;
    onSave: () => void;
  },
) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSave();
  };

  return (
    <div className='fixed inset-0 z-10 flex flex-col justify-end'>
      <div className='sheet-fade absolute inset-0 bg-black/35' onClick={onClose} />
      <form
        className='sheet-up relative flex max-h-[88%] flex-col rounded-t-2xl border-t border-line bg-surface shadow-card'
        onSubmit={submit}
      >
        <header className='flex flex-col gap-0.5 px-4 pt-4'>
          <div className='flex items-center justify-between gap-3'>
            <h2 className='text-heading font-semibold tracking-tight'>{title}</h2>
            <IconButton title={t.common.close} onClick={onClose}>
              <X className='size-4' />
            </IconButton>
          </div>
          <p className='text-label text-muted'>{hint}</p>
        </header>
        <div className='flex min-h-0 flex-col gap-3 overflow-y-auto px-4 pt-3.5'>{children}</div>
        <footer className='flex justify-end gap-2 p-4'>
          <Button onClick={onClose}>{t.common.cancel}</Button>
          <Button type='submit' variant='primary'>{t.common.save}</Button>
        </footer>
      </form>
    </div>
  );
}
