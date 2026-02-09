/**
 * RowSelection Component
 * 
 * Selection checkbox for table rows.
 */

'use client';

import * as React from 'react';
import { type Row } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

/**
 * ============================================
 * PROPS
 * ============================================
 */

export interface RowSelectionProps<TData> {
    /** TanStack Table row */
    row: Row<TData>;

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
 * RowSelection
 * 
 * Checkbox for row selection
 * 
 * @example
 * ```tsx
 * // In column definition:
 * {
 *   id: 'select',
 *   header: ({ table }) => (
 *     <Checkbox
 *       checked={table.getIsAllPageRowsSelected()}
 *       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
 *     />
 *   ),
 *   cell: ({ row }) => <RowSelection row={row} />
 * }
 * ```
 */
export function RowSelection<TData>({
    row,
    className,
    compact = false,
    disabled = false,
}: RowSelectionProps<TData>) {
    return (
        <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            disabled={disabled || !row.getCanSelect()}
            aria-label="Satırı seç"
            className={cn(compact && 'h-4 w-4', className)}
        />
    );
}

/**
 * Memoized version
 */
export const MemoizedRowSelection = React.memo(RowSelection) as typeof RowSelection;
