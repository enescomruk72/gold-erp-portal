/**
 * ExportSelected Component
 *
 * Dropdown for exporting selected rows (CSV, JSON).
 * Table-aware, selection-aware. Renders trigger only when hasSelection.
 */

'use client';

import * as React from 'react';
import { type Table } from '@tanstack/react-table';
import { Download, FileText, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
    exportToCSV,
    exportToJSON,
    type ExportFormat,
} from '../utils/export.utils';

export interface ExportSelectedProps<TData> {
    /** TanStack Table instance */
    table: Table<TData>;

    /** Base filename for exported files */
    filename?: string;

    /** Called when export is triggered. If provided, parent handles export; otherwise built-in CSV/JSON is used. */
    onExport?: (rows: TData[], format: ExportFormat) => void | Promise<void>;

    /** Custom className */
    className?: string;

    /** Compact mode */
    compact?: boolean;

    /** Custom trigger label (tooltip) */
    label?: string;

    /** Show count on button */
    showLabel?: boolean;

    /** Trigger button variant */
    triggerVariant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';

    /** Trigger button className */
    triggerClassName?: string;

    /** Formats to show (default: csv, json) */
    formats?: ExportFormat[];
}

/**
 * ExportSelected
 *
 * Renders a dropdown to export selected rows as CSV or JSON.
 *
 * @example
 * ```tsx
 * <ExportSelected
 *   table={table.table}
 *   filename="markalar"
 * />
 * ```
 */
export function ExportSelected<TData>({
    table,
    filename = 'export',
    onExport,
    className,
    compact = false,
    label = 'Seçilenleri dışa aktar',
    showLabel = false,
    triggerVariant = 'outline',
    triggerClassName,
    formats = ['csv', 'json'],
}: ExportSelectedProps<TData>) {
    const selectedRows = table.getSelectedRowModel().rows;
    const hasSelection = selectedRows.length > 0;
    const rows = React.useMemo(
        () => selectedRows.map((r) => r.original),
        [selectedRows]
    );
    const count = selectedRows.length;

    const handleExport = React.useCallback(
        (format: ExportFormat) => {
            if (rows.length === 0) return;

            if (onExport) {
                void Promise.resolve(onExport(rows, format));
            } else {
                const baseFilename = `${filename}_${new Date().toISOString().slice(0, 10)}`;
                const plainRows = rows as Record<string, unknown>[];
                if (format === 'csv') {
                    exportToCSV(plainRows, baseFilename);
                } else if (format === 'json') {
                    exportToJSON(rows, baseFilename);
                }
            }
        },
        [rows, filename, onExport]
    );

    return (
        <div className={cn(className)}>
            <DropdownMenu>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant={triggerVariant}
                                size={compact ? 'icon' : 'default'}
                                className={cn(
                                    'gap-2 rounded-full h-8 transition-all duration-300',
                                    compact ? 'w-8' : 'px-3',
                                    'bg-[#0b57d0]/10 text-[#0b57d0] hover:bg-[#0b57d0]/20 hover:text-[#0b57d0]',
                                    triggerClassName
                                )}
                                disabled={!hasSelection}
                            >
                                <Download className={cn('size-4', !compact && 'mr-2')} />
                                {(showLabel || hasSelection) && (
                                    <span>{hasSelection ? count : 0}</span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="flex items-center gap-2">
                            <Download className="size-3" />
                            <p>{label}</p>
                        </div>
                    </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuLabel>Format Seçin</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {formats.includes('csv') && (
                        <DropdownMenuItem onClick={() => handleExport('csv')}>
                            <FileText className="mr-2 h-4 w-4" />
                            CSV
                        </DropdownMenuItem>
                    )}
                    {formats.includes('json') && (
                        <DropdownMenuItem onClick={() => handleExport('json')}>
                            <File className="mr-2 h-4 w-4" />
                            JSON
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

/**
 * Memoized version
 */
export const MemoizedExportSelected = React.memo(ExportSelected);