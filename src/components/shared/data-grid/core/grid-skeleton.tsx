'use client';

import { cn } from '@/lib/utils';

export interface GridSkeletonProps {
    columns?: number;
    rows?: number;
    className?: string;
}

/**
 * Grid loading state – kart placeholder'ları
 */
export function GridSkeleton({ columns = 4, rows = 3, className }: GridSkeletonProps) {
    const count = columns * rows;
    return (
        <div
            className={cn(
                'grid gap-3 sm:gap-4',
                'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
                className
            )}
        >
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="flex flex-col overflow-hidden rounded-xl border bg-card"
                >
                    <div className="aspect-square w-full animate-pulse bg-muted" />
                    <div className="flex flex-1 flex-col gap-2 p-4">
                        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                        <div className="mt-2 h-5 w-1/3 animate-pulse rounded bg-muted" />
                    </div>
                </div>
            ))}
        </div>
    );
}
