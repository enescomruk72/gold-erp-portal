/**
 * DataTableCell Component
 * 
 * Generic table cell wrapper using Shadcn UI TableCell.
 * Minimal, performance-optimized component.
 */

'use client';

import * as React from 'react';
import { type Cell, flexRender } from '@tanstack/react-table';
import { TableCell as ShadcnTableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

/**
 * ============================================
 * PROPS
 * ============================================
 */

export interface DataTableCellProps<TData, TValue> {
    /** TanStack Table cell */
    cell: Cell<TData, TValue>;

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
 * DataTableCell
 * 
 * Renders table cell with value using Shadcn UI TableCell
 * 
 * Usually you don't use this directly - it's used internally by DataTableRow.
 * But you can use it for custom rendering if needed.
 * 
 * @example
 * ```tsx
 * <DataTableCell cell={cell} compact />
 * ```
 */
function DataTableCellComponent<TData, TValue>({
    cell,
    className,
    compact = false,
}: DataTableCellProps<TData, TValue>) {
    return (
        <ShadcnTableCell
            className={cn(
                compact && 'p-2 text-xs',
                className
            )}
        >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </ShadcnTableCell>
    );
}

/**
 * Memoized version for performance
 */
export const DataTableCell = React.memo(DataTableCellComponent) as typeof DataTableCellComponent;

/**
 * Default export
 */
export default DataTableCell;
