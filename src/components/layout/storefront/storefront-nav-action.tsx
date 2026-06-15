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
};

export function StorefrontNavAction({
    href,
    label,
    icon,
    badge,
    onClick,
    className,
}: StorefrontNavActionProps) {
    const content = (
        <>
            <span className="relative flex flex-col items-center gap-0.5">
                <span className="relative inline-flex">
                    {icon}
                    {badge != null && badge > 0 && (
                        <span className="absolute -right-2.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary px-0.5 text-[10px] font-semibold text-primary-foreground">
                            {badge > 99 ? '99+' : badge}
                        </span>
                    )}
                </span>
                <span className="text-[11px] font-medium leading-none">{label}</span>
            </span>
        </>
    );

    const baseClass = cn(
        'inline-flex shrink-0 items-center rounded-md px-2 py-1.5 text-foreground transition-colors hover:text-primary',
        className
    );

    if (href) {
        return (

            <Button variant="ghost" size="lg" onClick={onClick} className={baseClass} asChild>
                <Link href={href} className={baseClass}>
                    {content}
                </Link>
            </Button>
        );
    }

    return (
        <Button variant="ghost" size="lg" asChild onClick={onClick} className={baseClass}>
            {content}
        </Button>
    );
}
