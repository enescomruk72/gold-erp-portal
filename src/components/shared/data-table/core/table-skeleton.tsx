/**
 * TableSkeleton Component
 * 
 * Loading skeleton for DataTable.
 * Shows animated placeholder while data is loading.
 */

'use client';

import * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

/**
 * ============================================
 * PROPS
 * ============================================
 */

export interface TableSkeletonProps {
    /** Number of columns to show */
    columns?: number;

    /** Number of rows to show */
    rows?: number;

    /** Show toolbar (üst bar) skeleton — DataTable içinde false (toolbar zaten var) */
    showToolbar?: boolean;

    /** Show footer (pagination) skeleton — DataTable içinde false (pagination zaten var) */
    showFooter?: boolean;

    /** @deprecated use showToolbar */
    showHeader?: boolean;

    /** Compact mode (reduced padding) */
    compact?: boolean;

    /** İlk kolonda select checkbox skeleton göster */
    showSelectColumn?: boolean;

    /** Custom className */
    className?: string;
}

/**
 * ============================================
 * COMPONENT
 * ============================================
 */

/**
 * TableSkeleton
 * 
 * Animated loading skeleton for tables using Shadcn UI table components
 * 
 * @example
 * ```tsx
 * if (isLoading) {
 *   return <TableSkeleton columns={5} rows={10} />;
 * }
 * ```
 */
export function TableSkeleton({
    columns = 5,
    rows = 10,
    showToolbar,
    showFooter,
    showHeader,
    compact = false,
    showSelectColumn = false,
    className,
}: TableSkeletonProps) {
    const showToolbarSkeleton = showToolbar ?? showHeader ?? true;
    const showFooterSkeleton = showFooter ?? true;

    return (
        <div className={cn('w-full space-y-4', className)}>
            {/* Toolbar skeleton (DataTable içinde false — toolbar zaten render ediliyor) */}
            {showToolbarSkeleton && (
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-[250px]" />
                    <Skeleton className="h-10 w-[150px]" />
                    <div className="ml-auto flex items-center gap-2">
                        <Skeleton className="h-10 w-[100px]" />
                        <Skeleton className="h-10 w-[40px]" />
                    </div>
                </div>
            )}

            {/* Table skeleton */}
            <div className="rounded-b-md border">
                <Table>
                    <TableHeader className='bg-table-body-background dark:bg-table-header-background'>
                        <TableRow>
                            {Array.from({ length: columns }).map((_, i) => (
                                <TableHead
                                    key={i}
                                    className={cn(
                                        compact && 'h-8 px-2',
                                        showSelectColumn && i === 0 && 'min-w-10 w-10'
                                    )}
                                >
                                    {showSelectColumn && i === 0 ? (
                                        <div className="flex items-center justify-center px-4">
                                            <Skeleton className="size-4 shrink-0 rounded-[4px]" />
                                        </div>
                                    ) : (
                                        <Skeleton className="h-4 w-full max-w-[120px]" />
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <TableRow key={rowIndex} className='h-14'>
                                {Array.from({ length: columns }).map((_, colIndex) => (
                                    <TableCell
                                        key={colIndex}
                                        className={cn(
                                            compact && 'p-2',
                                            showSelectColumn && colIndex === 0 && 'w-10 pr-0'
                                        )}
                                    >
                                        {showSelectColumn && colIndex === 0 ? (
                                            <div className="flex items-center justify-center px-4">
                                                <Skeleton className="size-4 shrink-0 rounded-[4px]" />
                                            </div>
                                        ) : (
                                            <Skeleton
                                                className={cn(
                                                    'h-4',
                                                    (showSelectColumn ? colIndex - 1 : colIndex) === 0 && 'w-[80px]',
                                                    (showSelectColumn ? colIndex - 1 : colIndex) === 1 && 'w-[150px]',
                                                    (showSelectColumn ? colIndex - 1 : colIndex) === 2 && 'w-[120px]',
                                                    (showSelectColumn ? colIndex - 1 : colIndex) === 3 && 'w-[100px]',
                                                    (showSelectColumn ? colIndex - 1 : colIndex) >= 4 && 'w-[90px]'
                                                )}
                                            />
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Footer skeleton (DataTable içinde false — pagination zaten render ediliyor) */}
            {showFooterSkeleton && (
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-[200px]" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-[100px]" />
                        <Skeleton className="h-10 w-[120px]" />
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * Compact variant
 */
export function TableSkeletonCompact(props: Omit<TableSkeletonProps, 'compact'>) {
    return <TableSkeleton {...props} compact />;
}
