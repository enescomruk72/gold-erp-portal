'use client';

import { cn } from '@/lib/utils';
import { StorefrontContainer } from '@/components/layout/storefront/storefront-container';
import type { HomeStoryItem } from '@/constants/storefront/mock-home-sections';

const toneClass: Record<HomeStoryItem['tone'], string> = {
    primary: 'from-primary/20 to-primary/5 ring-primary/30',
    muted: 'from-muted to-muted/50 ring-border',
    accent: 'from-amber-200/60 to-amber-50 ring-amber-300/40',
};

type StoryStripProps = {
    items: HomeStoryItem[];
};

export function StoryStrip({ items }: StoryStripProps) {
    return (
        <section aria-label="Kampanya hikayeleri" className="py-4">
            <StorefrontContainer variant="content">
                <div className="flex gap-base overflow-x-auto py-base scrollbar-none">
                    {items.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            className="group flex w-20 shrink-0 flex-col items-center gap-base"
                        >
                            <span
                                className={cn(
                                    'flex size-18 items-center justify-center rounded-full bg-linear-to-br p-0.5 ring-2 transition-transform group-hover:scale-105',
                                    toneClass[item.tone]
                                )}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.imageUrl}
                                    alt=""
                                    className="size-14 rounded-full object-cover"
                                />
                            </span>
                            <span className="line-clamp-2 text-center text-[11px] leading-tight text-foreground/80">
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>
            </StorefrontContainer>
        </section>
    );
}
