import Link from 'next/link';
import { getSozlesmeHref } from '@/features/contracts/lib/sozlesme-slug';
import type { SozlesmeDTO } from '@/features/contracts/types';
import { cn } from '@/lib/utils';

type LegalSidebarProps = {
    items: SozlesmeDTO[];
    activeSlug: string;
};

export function LegalSidebar({ items, activeSlug }: LegalSidebarProps) {
    return (
        <nav className="flex flex-col gap-0.5">
            {items.map((item) => {
                const href = getSozlesmeHref(item);
                const slug = href.replace('/yasal/', '');
                const isActive = slug === activeSlug;

                return (
                    <Link
                        key={item.id}
                        href={href}
                        className={cn(
                            'rounded-md px-4 py-3 text-sm font-medium transition-colors',
                            isActive
                                ? 'bg-[#0b57d0] text-white'
                                : 'text-neutral-700 hover:bg-neutral-50 hover:text-[#0b57d0]',
                        )}
                    >
                        {item.baslik}
                    </Link>
                );
            })}
        </nav>
    );
}
