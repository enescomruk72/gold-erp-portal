'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type StorefrontNavActionProps = {
    href?: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    onClick?: () => void;
    className?: string;
    variant?: 'default' | 'icon';
};

export function StorefrontNavAction({
    href,
    label,
    icon,
    badge,
    onClick,
    className,
    variant = 'default',
}: StorefrontNavActionProps) {
    const badgeEl =
        badge != null && badge > 0 ? (
            <span className="absolute -right-2.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary px-0.5 text-[10px] font-semibold text-primary-foreground">
                {badge > 99 ? '99+' : badge}
            </span>
        ) : null;

    const content =
        variant === 'icon' ? (
            <span className="relative inline-flex">
                {icon}
                {badgeEl}
            </span>
        ) : (
            <span className="relative flex flex-col items-center gap-0.5">
                <span className="relative inline-flex">
                    {icon}
                    {badgeEl}
                </span>
                <span className="text-[11px] font-medium leading-none">{label}</span>
            </span>
        );

    const baseClass = cn(
        'inline-flex shrink-0 items-center rounded-md text-foreground transition-colors hover:text-primary',
        variant === 'icon' ? 'size-10 justify-center p-0' : 'px-2 py-1.5',
        className
    );

    if (href) {
        return (
            <Button
                variant="ghost"
                size={variant === 'icon' ? 'icon' : 'lg'}
                onClick={onClick}
                className={baseClass}
                asChild
            >
                <Link href={href} aria-label={variant === 'icon' ? label : undefined}>
                    {content}
                </Link>
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size={variant === 'icon' ? 'icon' : 'lg'}
            onClick={onClick}
            className={baseClass}
            aria-label={variant === 'icon' ? label : undefined}
        >
            {content}
        </Button>
    );
}
