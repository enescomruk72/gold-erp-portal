/**
 * PageHeader Component
 * 
 * Advanced page header with Zustand state management.
 * Displays title, description, breadcrumbs, actions, and back button.
 */

'use client';

import * as React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePageHeaderStore } from '@/stores/page-header.store';
import { PageHeaderActions } from '@/components/shared/page-header-actions';
import ImmediateBreadcrumb from '@/components/shared/breadcrumb/immediate-breadcrumb';
import ProgressiveBreadcrumb from '@/components/shared/breadcrumb/progressive-breadcrumb';
import HybridBreadcrumb from '@/components/shared/breadcrumb/hybrid-breadcrumb';
import { cn } from '@/lib/utils';

/**
 * ============================================
 * MAIN COMPONENT
 * ============================================
 */

/**
 * PageHeader
 * 
 * Main page header component that reads from Zustand store
 * 
 * @example
 * ```tsx
 * // In your layout or page:
 * <PageHeader />
 * 
 * // In your page component, set the header:
 * usePageHeader({
 *   title: 'Müşteriler',
 *   breadcrumbs: [
 *     { label: 'Ana Sayfa', href: '/' },
 *     { label: 'Müşteriler' }
 *   ]
 * });
 * ```
 */
export default function PageHeader({ className }: { className?: string }) {
    const {
        title,
        description,
        showBackButton,
        onBack,
        isLoading,
        customContent,
        breadcrumbConfig,
        disabled,
    } = usePageHeaderStore();

    if (disabled) {
        return null;
    }

    // Select breadcrumb component based on strategy (always render, no conditional hooks)
    const strategy = breadcrumbConfig?.strategy || 'immediate';
    const dynamicData = breadcrumbConfig?.dynamicData;
    const dataExtractor = breadcrumbConfig?.dataExtractor;

    // Render appropriate breadcrumb component
    let breadcrumbElement: React.ReactNode;

    if (strategy === 'progressive') {
        breadcrumbElement = (
            <ProgressiveBreadcrumb
                dynamicData={dynamicData}
                dataExtractor={dataExtractor}
            />
        );
    } else if (strategy === 'hybrid') {
        breadcrumbElement = (
            <HybridBreadcrumb
                dynamicData={dynamicData}
                dataExtractor={dataExtractor}
            />
        );
    } else {
        breadcrumbElement = <ImmediateBreadcrumb />;
    }

    return (
        <div
            data-slot="doc-header"
            className={cn(
                "w-full py-[calc(var(--spacing-base)/2)] relative flex flex-col items-start gap-base",
                // "after:content-[''] after:block after:absolute after:h-px after:bg-border after:w-full after:left-0 after:top-[calc(100%-1px)]",
                "lg:flex-row",
                "px-gutter",
                // "bg-card border-b border-border",
                className
            )}
        >
            {/* Main header */}
            {/* Left side: Back button + Title + Description */}
            {/* Breadcrumbs */}
            {breadcrumbElement}

            {/* Title section */}
            {title && (
                <div className="flex items-center gap-3">
                    {/* Back button */}
                    {showBackButton && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onBack}
                            className="h-8 w-8"
                            aria-label="Geri"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}

                    {/* Title */}
                    {isLoading ? (
                        <Skeleton className="h-8 w-48" />
                    ) : (
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            {title}
                        </h1>
                    )
                    }
                </div>
            )

            }

            {/* Description */}
            {description && (
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            )}

            {/* Custom content */}
            {customContent && <div className="mt-2">{customContent}</div>}

            {/* Right side: Actions */}
            <PageHeaderActions />
        </div>
    );
}

/**
 * PageHeaderSkeleton
 * 
 * Loading skeleton for page header
 */
export function PageHeaderSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        </div>
    );
}
