/**
 * DataTableRow Component
 * 
 * Table row component with selection and styling using Shadcn UI TableRow.
 * Optimized with React.memo for performance.
 */

'use client';

import * as React from 'react';
import { type Row, flexRender } from '@tanstack/react-table';
import { TableRow as ShadcnTableRow, TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

/**
 * ============================================
 * PROPS
 * ============================================
 */

export interface DataTableRowProps<TData> {
    /** TanStack Table row */
    row: Row<TData>;

    /** Custom className */
    className?: string;

    /** Compact mode */
    compact?: boolean;

    /** Striped row */
    striped?: boolean;

    /** Row index (for striping) */
    index?: number;

    /** Click handler */
    onClick?: (row: Row<TData>) => void;
}

/**
 * ============================================
 * COMPONENT
 * ============================================
 */

/**
 * DataTableRow
 * 
 * Renders table row with cells using Shadcn UI components
 * 
 * @example
 * ```tsx
 * {table.getRowModel().rows.map((row, index) => (
 *   <DataTableRow
 *     key={row.id}
 *     row={row}
 *     index={index}
 *     striped
 *   />
 * ))}
 * ```
 */
function DataTableRowComponent<TData>({
    row,
    className,
    compact = false,
    striped = false,
    index,
    onClick,
}: DataTableRowProps<TData>) {
    const isSelected = row.getIsSelected();
    const isStriped = striped && index !== undefined && index % 2 === 1;
    const isClickable = !!onClick;

    return (
        <ShadcnTableRow
            data-state={isSelected && 'selected'}
            onClick={() => onClick?.(row)}
            className={cn(
                isStriped && 'bg-muted/25',
                isClickable && 'cursor-pointer',
                className
            )}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell
                    key={cell.id}
                    className={cn(compact && 'p-2 text-xs')}
                >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </ShadcnTableRow>
    );
}

/**
 * Memoized version for performance
 * Prevents unnecessary re-renders
 */
export const DataTableRow = React.memo(DataTableRowComponent) as typeof DataTableRowComponent;

/**
 * Default export
 */
export default DataTableRow;
