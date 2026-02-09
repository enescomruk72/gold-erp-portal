/**
 * TablePagination Component
 * 
 * Main pagination container with page info, page size select, and navigation.
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { PageInfo } from './page-info';
import { PageSizeSelect } from './page-size-select';
import { PageNavigator } from './page-navigator';
import type { UseDataTableReturn } from '../types';

/**
 * ============================================
 * PROPS
 * ============================================
 */

export interface TablePaginationProps<TData> {
    /** DataTable instance from useDataTable */
    table: UseDataTableReturn<TData>;

    /** Show page info */
    showPageInfo?: boolean;

    /** Show page size select */
    showPageSize?: boolean;

    /** Show first/last buttons */
    showFirstLast?: boolean;

    /** Max visible page buttons */
    maxVisiblePages?: number;

    /** Available page sizes */
    pageSizeOptions?: number[];

    /** Custom className */
    className?: string;

    /** Compact mode */
    compact?: boolean;
}

/**
 * ============================================
 * COMPONENT
 * ============================================
 */

/**
 * TablePagination
 * 
 * Complete pagination UI
 * 
 * Layout:
 * ```
 * [Page Info] [Selected Count]          [Page Size] [Page Navigator]
 * ```
 * 
 * @example
 * ```tsx
 * <TablePagination
 *   table={table}
 *   showPageInfo
 *   showPageSize
 * />
 * ```
 */
export function TablePagination<TData>({
    table,
    showPageInfo = true,
    showPageSize = true,
    showFirstLast = true,
    maxVisiblePages = 3,
    pageSizeOptions,
    className,
    compact = false,
}: TablePaginationProps<TData>) {
    // Don't show pagination if no data
    if (table.isEmpty || table.pagination.total === 0) {
        return null;
    }

    return (
        <div
            className={cn(
                'flex items-center justify-between gap-8',
                compact ? 'px-2 py-2' : 'px-4 py-4',
                className
            )}
        >
            <div className="flex-1 flex items-center justify-between gap-4">
                {/* Page size select */}
                {showPageSize && (
                    <PageSizeSelect
                        pageSize={table.pagination.pageSize}
                        onPageSizeChange={table.actions.setPageSize}
                        pageSizeOptions={pageSizeOptions}
                        compact={compact}
                        disabled={table.query.isPending}
                    />
                )}


                {/* Right side: Page size + Navigation */}
                {/* Left side: Page info */}
                {showPageInfo && (
                    <PageInfo
                        pagination={table.pagination}
                        selectedCount={table.state.selectedCount}
                        compact={compact}
                    />
                )}
            </div>

            {/* Page navigator */}
            <PageNavigator
                pagination={table.pagination}
                onPageChange={(page) => table.actions.setPage(page - 1)}
                showFirstLast={showFirstLast}
                maxVisiblePages={maxVisiblePages}
                compact={compact}
                disabled={table.query.isPending}
            />
        </div>
    );
}

/**
 * Memoized version
 */
export const MemoizedTablePagination = React.memo(TablePagination) as typeof TablePagination;
