import Link from 'next/link';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'secondary';
type Surface = 'light' | 'dark';

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  surface?: Surface;
  className?: string;
  full?: boolean;
}

interface LinkProps extends BaseProps {
  href: string;
  onClick?: never;
  type?: never;
}

interface ButtonProps extends BaseProps {
  href?: never;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

function classesFor(variant: Variant, surface: Surface, full?: boolean): string {
  const base =
    'inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold tracking-tight transition-colors duration-fast ease-cinematic rounded-sm select-none';
  const width = full ? 'w-full' : '';
  if (variant === 'primary') {
    // Beam CTA — interactive highlights carry the Wordmark's gold (Part IV, Art. 2).
    return `${base} ${width} bg-beam text-space hover:bg-beam-hover active:bg-beam-active`;
  }
  // Secondary — transparent, hairline border. The world is one dark surface
  // now, so both surface variants resolve identically (param kept for API).
  const sec =
    surface === 'dark'
      ? 'border border-snow/30 text-snow hover:bg-snow/10'
      : 'border border-snow/30 text-snow hover:bg-snow/10';
  return `${base} ${width} ${sec}`;
}

export default function CTAButton(props: LinkProps | ButtonProps) {
  const { children, variant = 'primary', surface = 'light', className = '', full } = props;
  const cls = `${classesFor(variant, surface, full)} ${className}`;

  if ('href' in props && props.href) {
    return (
      <Link href={props.href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={props.type ?? 'button'} onClick={props.onClick} className={cls}>
      {children}
    </button>
  );
}
