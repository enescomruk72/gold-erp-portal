/**
 * HeaderSortButton Component
 * 
 * Sort indicator/button for column headers.
 * Shows current sort direction and allows toggling.
 */

'use client';

import * as React from 'react';
import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';
import { type Column } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * ============================================
 * PROPS
 * ============================================
 */

export interface HeaderSortButtonProps<TData, TValue> {
    /** TanStack Table column */
    column: Column<TData, TValue>;

    /** Custom className */
    className?: string;

    /** Compact mode */
    compact?: boolean;

    /** Icon only (no label) */
    iconOnly?: boolean;
}

/**
 * ============================================
 * COMPONENT
 * ============================================
 */

/**
 * HeaderSortButton
 * 
 * Sort button with visual indicator
 * 
 * Sort cycle: none → asc → desc → none
 * 
 * @example
 * ```tsx
 * <HeaderSortButton column={header.column} />
 * ```
 */
export function HeaderSortButton<TData, TValue>({
    column,
    className,
    compact = false,
    iconOnly = true,
}: HeaderSortButtonProps<TData, TValue>) {
    const isSorted = column.getIsSorted();

    // Determine icon
    const Icon = isSorted === 'asc'
        ? ArrowUp
        : isSorted === 'desc'
        ? ArrowDown
        : ChevronsUpDown;

    // Determine aria label
    const ariaLabel = isSorted === 'asc'
        ? 'Azalan sırala'
        : isSorted === 'desc'
        ? 'Sıralamayı kaldır'
        : 'Artan sırala';

    return (
        <Button
            variant="ghost"
            size={compact ? 'sm' : 'sm'}
            className={cn(
                '-ml-3 h-8 data-[state=open]:bg-accent',
                compact ? 'px-2' : 'px-2',
                className
            )}
            onClick={() => column.toggleSorting()}
            aria-label={ariaLabel}
        >
            <Icon
                className={cn(
                    'transition-colors',
                    compact ? 'h-3 w-3' : 'h-3.5 w-3.5',
                    isSorted ? 'text-foreground' : 'text-muted-foreground'
                )}
            />
            {!iconOnly && isSorted && (
                <span className="ml-1 text-xs font-medium">
                    {isSorted === 'asc' ? 'A-Z' : 'Z-A'}
                </span>
            )}
        </Button>
    );
}

/**
 * Memoized version
 */
export const MemoizedHeaderSortButton = React.memo(HeaderSortButton) as typeof HeaderSortButton;
