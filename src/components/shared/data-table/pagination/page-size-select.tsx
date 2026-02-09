/**
 * PageSizeSelect Component
 * 
 * Dropdown to select rows per page.
 */

'use client';

import * as React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { DEFAULT_PAGE_SIZE_OPTIONS } from '../config';

/**
 * ============================================
 * PROPS
 * ============================================
 */

export interface PageSizeSelectProps {
    /** Current page size */
    pageSize: number;

    /** Change handler */
    onPageSizeChange: (size: number) => void;

    /** Available page sizes */
    pageSizeOptions?: number[];

    /** Custom className */
    className?: string;

    /** Compact mode */
    compact?: boolean;

    /** Disabled */
    disabled?: boolean;
}

/**
 * ============================================
 * COMPONENT
 * ============================================
 */

/**
 * PageSizeSelect
 * 
 * Select dropdown for rows per page
 * 
 * @example
 * ```tsx
 * <PageSizeSelect
 *   pageSize={table.pagination.pageSize}
 *   onPageSizeChange={table.actions.setPageSize}
 * />
 * ```
 */
export function PageSizeSelect({
    pageSize,
    onPageSizeChange,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    className,
    compact = false,
    disabled = false,
}: PageSizeSelectProps) {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <span
                className={cn(
                    'whitespace-nowrap text-muted-foreground',
                    compact ? 'text-xs' : 'text-sm'
                )}
            >
                Satır sayısı:
            </span>
            <Select
                value={pageSize.toString()}
                onValueChange={(value) => onPageSizeChange(Number(value))}
                disabled={disabled}
            >
                <SelectTrigger
                    className={cn(
                        'w-[70px]',
                        compact ? 'h-8 text-xs' : 'h-9 text-sm'
                    )}
                >
                    <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                    {pageSizeOptions.map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                            {size}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

/**
 * Memoized version
 */
export const MemoizedPageSizeSelect = React.memo(PageSizeSelect);
