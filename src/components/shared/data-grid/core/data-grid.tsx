'use client';

import * as React from 'react';
import { AlertCircle, RefreshCw, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GridSkeleton } from './grid-skeleton';
import type { DataGridProps } from '../types';

/**
 * DataGrid
 *
 * Grid layout ile kart listesi render eder. State: loading, error, empty grid içinde gösterilir.
 */
export function DataGrid<TData>({
    grid,
    renderCard,
    getItemKey,
    state,
    className,
}: DataGridProps<TData>) {
    const getKey = getItemKey ?? ((item: TData) => (item as { id?: string | number }).id ?? Math.random());
    const colCount = 4;

    if (state?.isInitialLoading ?? grid.isInitialLoading) {
        return (
            <GridSkeleton
                columns={colCount}
                rows={Math.ceil((grid.pagination?.pageSize ?? 12) / colCount)}
                className={className}
            />
        );
    }

    const isError = state?.isError ?? grid.query.isError;
    const isEmpty = state?.isEmpty ?? grid.isEmpty;
    const errorMessage =
        typeof state?.error === 'string'
            ? state.error
            : state?.error?.message ?? grid.query.error?.message ?? 'Bir hata oluştu.';

    if (isError) {
        return (
            <div
                className={cn(
                    'flex min-h-[280px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/30 p-8 text-center',
                    className
                )}
            >
                <AlertCircle className="h-10 w-10 shrink-0 text-destructive/80" />
                <p className="text-sm text-muted-foreground">{errorMessage}</p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (state?.onRetry ?? grid.actions.refetch)()}
                    className="gap-2"
                >
                    <RefreshCw className="h-4 w-4" />
                    Tekrar dene
                </Button>
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div
                className={cn(
                    'flex min-h-[280px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/30 p-8 text-center',
                    className
                )}
            >
                <FileSearch className="h-10 w-10 shrink-0 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                    {state?.emptyMessage ?? 'Veri bulunamadı.'}
                </p>
                {state?.emptyAction && (
                    <Button variant="outline" size="sm" onClick={state.emptyAction.onClick}>
                        {state.emptyAction.label}
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div
            className={cn(
                'grid gap-3 sm:gap-4',
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
                className
            )}
        >
            {grid.data.map((item, index) => (
                <React.Fragment key={String(getKey(item))}>
                    {renderCard(item, index)}
                </React.Fragment>
            ))}
        </div>
    );
}
