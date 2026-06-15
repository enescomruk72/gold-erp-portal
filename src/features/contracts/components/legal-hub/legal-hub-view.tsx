'use client';

import { notFound } from 'next/navigation';
import { STOREFRONT_CONTENT_CONTAINER_CLASS } from '@/constants/storefront/layout';
import { findSozlesmeBySlug, useGetSozlesmeler } from '@/features/contracts';
import { LegalContent } from './legal-content';
import { LegalHubSkeleton } from './legal-hub-skeleton';
import { LegalSidebar } from './legal-sidebar';

type LegalHubViewProps = {
    slug: string;
};

export function LegalHubView({ slug }: LegalHubViewProps) {
    const { data: sozlesmeler, isLoading, isError } = useGetSozlesmeler();

    if (isLoading) {
        return (
            <div className={STOREFRONT_CONTENT_CONTAINER_CLASS}>
                <LegalHubSkeleton />
            </div>
        );
    }

    if (isError || sozlesmeler.length === 0) {
        return (
            <div className={STOREFRONT_CONTENT_CONTAINER_CLASS}>
                <p className="text-sm text-muted-foreground">
                    Yasal metinler yüklenemedi.
                </p>
            </div>
        );
    }

    const active = findSozlesmeBySlug(sozlesmeler, slug);
    if (!active) {
        notFound();
    }

    return (
        <div className={STOREFRONT_CONTENT_CONTAINER_CLASS}>
            <div className="flex flex-col gap-base py-base sm:py-gutter lg:flex-row lg:items-start lg:gap-gutter">
                <aside className="storefront-legal-sidebar w-full shrink-0 lg:w-72 lg:self-start">
                    <LegalSidebar items={sozlesmeler} activeSlug={slug} />
                </aside>
                <LegalContent sozlesme={active} />
            </div>
        </div>
    );
}
