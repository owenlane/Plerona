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
    'inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold tracking-tight transition-colors duration-150 ease-out rounded-[2px] select-none';
  const width = full ? 'w-full' : '';
  if (variant === 'primary') {
    // Blue CTA — §16. Hover darken 8%, active 16%.
    return `${base} ${width} bg-blue text-white hover:bg-blue-hover active:bg-blue-active`;
  }
  // Secondary — transparent, hairline border, text color matches surface.
  const sec =
    surface === 'dark'
      ? 'border border-white/30 text-white hover:bg-white/10'
      : 'border border-ink/20 text-ink hover:bg-ink/[0.04]';
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
