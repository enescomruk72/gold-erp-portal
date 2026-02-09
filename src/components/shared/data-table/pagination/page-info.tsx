/**
 * PageInfo Component
 * 
 * Displays pagination information ("Showing 1-25 of 100").
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { PaginationMeta } from '../types';

/**
 * ============================================
 * PROPS
 * ============================================
 */

export interface PageInfoProps {
    /** Pagination metadata */
    pagination: PaginationMeta;

    /** Custom className */
    className?: string;

    /** Compact mode */
    compact?: boolean;

    /** Show selected count */
    selectedCount?: number;
}

/**
 * ============================================
 * COMPONENT
 * ============================================
 */

/**
 * PageInfo
 * 
 * Shows "Showing X-Y of Z" and selected count
 * 
 * @example
 * ```tsx
 * <PageInfo
 *   pagination={table.pagination}
 *   selectedCount={table.state.selectedCount}
 * />
 * ```
 */
export function PageInfo({
    pagination,
    className,
    compact = false,
    selectedCount,
}: PageInfoProps) {
    const { total, currentPage, pageSize } = pagination;

    // Calculate range
    const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, total);

    return (
        <div
            className={cn(
                'flex items-center gap-2 text-muted-foreground',
                compact ? 'text-xs' : 'text-sm',
                className
            )}
        >
            {/* Main info */}
            <p>
                <span className="font-medium text-foreground">
                    {start}-{end}
                </span>{' '}
                / {total} kayıt
            </p>

            {/* Selected count */}
            {selectedCount !== undefined && selectedCount > 0 && (
                <>
                    <span>·</span>
                    <p className="font-medium text-foreground">
                        {selectedCount} seçili
                    </p>
                </>
            )}
        </div>
    );
}

/**
 * Memoized version
 */
export const MemoizedPageInfo = React.memo(PageInfo);
