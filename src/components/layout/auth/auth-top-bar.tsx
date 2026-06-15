import Link from 'next/link';
import { Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STOREFRONT_CONTENT_CONTAINER_CLASS } from '@/constants/storefront/layout';

const topLinks = [
    { label: 'B2B Başvuru Yap', href: '/b2b-basvuru' },
    { label: 'Hakkımızda', href: '/hakkimizda' },
] as const;

type AuthTopBarProps = {
    className?: string;
    containerClassName?: string;
};

export function AuthTopBar({
    className,
    containerClassName = STOREFRONT_CONTENT_CONTAINER_CLASS,
}: AuthTopBarProps) {
    return (
        <div className={cn('bg-card', className)}>
            <div
                className={cn(
                    'flex h-9 items-center justify-end gap-5 text-xs text-muted-foreground',
                    containerClassName
                )}
            >
                {topLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="transition-colors hover:text-foreground"
                    >
                        {link.label}
                    </Link>
                ))}
                <Link
                    href="/yardim"
                    className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                >
                    <Headphones className="size-3.5" aria-hidden />
                    Yardım &amp; Destek
                </Link>
            </div>
        </div>
    );
}
