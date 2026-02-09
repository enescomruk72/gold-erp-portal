/**
 * DataTable Component
 *
 * Renders TanStack Table; state (initialLoading, error, empty) tablo içinde yönetilir.
 * - initialLoading → TableSkeleton (tam sayfa)
 * - error / empty → tablo içinde tek satır (row) ile gösterilir
 */

'use client';

import * as React from 'react';
import { flexRender, type Table as TanStackTable } from '@tanstack/react-table';
import { AlertCircle, RefreshCw, Inbox, FileSearch } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader as TableHeaderUI,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TableHeader } from '../header/table-header';
import { TableSkeleton } from './table-skeleton';
import { DEFAULT_PAGE_SIZE } from '../config';

/**
 * ============================================
 * PROPS
 * ============================================
 */

export interface DataTableStateProps {
    /** İlk yükleme (tam sayfa TableSkeleton) */
    isInitialLoading?: boolean;
    /** Sorgu hata verdi */
    isError?: boolean;
    /** Hata objesi (isError true iken) */
    error?: Error | null;
    /** Tekrar dene callback */
    onRetry?: () => void;
    /** Veri yok (tablo içinde empty row) */
    isEmpty?: boolean;
    /** Empty row mesajı */
    emptyMessage?: string;
    /** Empty row aksiyonu (örn. Filtreleri Temizle) */
    emptyAction?: { label: string; onClick: () => void };
}

export interface DataTableProps<TData> {
    /** TanStack Table instance */
    table: TanStackTable<TData>;

    /** State: loading, error, empty — tablo içinde render edilir */
    state?: DataTableStateProps;

    /** Custom className for table wrapper */
    className?: string;

    /** Custom className for table element */
    tableClassName?: string;

    /** Striped rows */
    striped?: boolean;

    /** Compact mode (reduced padding) */
    compact?: boolean;
}

/**
 * ============================================
 * COMPONENT
 * ============================================
 */

/**
 * DataTable
 *
 * - state.isInitialLoading → TableSkeleton (tam sayfa)
 * - state.isError → tablo içinde tek satır: hata mesajı + Tekrar dene
 * - state.isEmpty → tablo içinde tek satır: empty mesajı + opsiyonel aksiyon
 * - aksi halde veri satırları
 */
export function DataTable<TData>({
    table,
    state,
    className,
    tableClassName,
    striped = false,
    compact = false,
}: DataTableProps<TData>) {
    const tableWrapperRef = React.useRef<HTMLDivElement>(null);
    const allColumns = table.getAllColumns();
    const colCount = allColumns.length;
    const rowCount = table.getState().pagination?.pageSize ?? DEFAULT_PAGE_SIZE;
    const hasSelectColumn = allColumns.some((col) => col.id === 'select');

    // İlk yükleme: sadece tablo skeleton (toolbar/pagination sayfada zaten var)
    if (state?.isInitialLoading) {
        return (
            <TableSkeleton
                columns={colCount}
                rows={rowCount}
                showToolbar={false}
                showSelectColumn={hasSelectColumn}
                showFooter={false}
                compact={compact}
                className={className}
            />
        );
    }

    const isError = state?.isError ?? false;
    const isEmpty = state?.isEmpty ?? false;
    const errorMessage =
        typeof state?.error === 'string'
            ? state.error
            : state?.error?.message ?? 'Bir hata oluştu.';

    return (
        <div ref={tableWrapperRef} className={cn(className)}>
            <Table className={cn('w-full', tableClassName)}>
                <TableHeaderUI className='bg-table-body-background dark:bg-table-header-background'>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className='border-table-header-bottom-border border-b hover:bg-table-body-background'>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className={cn(compact && 'h-8 px-2 text-xs')}
                                    style={{
                                        width: header.getSize() !== 150 ? header.getSize() : undefined,
                                    }}
                                >
                                    <TableHeader
                                        header={header}
                                        showActions={true}
                                        compact={compact}
                                    />
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeaderUI>

                <TableBody className='bg-table-body-background'>
                    {isError ? (
                        <TableRow>
                            <TableCell
                                colSpan={colCount}
                                className="h-48 text-center"
                            >
                                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                    <AlertCircle className="h-10 w-10 shrink-0 text-destructive/80" />
                                    <p className="text-sm">{errorMessage}</p>
                                    {state?.onRetry && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={state.onRetry}
                                            className="gap-2"
                                        >
                                            <RefreshCw className="h-4 w-4" />
                                            Tekrar dene
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : isEmpty ? (
                        <TableRow>
                            <TableCell
                                colSpan={colCount}
                                className="h-48 text-center"
                            >
                                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                    <FileSearch className="h-10 w-10 shrink-0" />
                                    <p className="text-sm">
                                        {state?.emptyMessage ?? 'Veri bulunamadı.'}
                                    </p>
                                    {state?.emptyAction && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={state.emptyAction.onClick}
                                        >
                                            {state.emptyAction.label}
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row, index) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                                className={cn(
                                    striped && index % 2 === 1 && 'bg-muted/25',
                                    "group"
                                )}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className={cn(compact && 'p-2 text-xs')}
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={colCount}
                                className="h-48 text-center"
                            >
                                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                    <Inbox className="h-10 w-10 shrink-0" />
                                    <p className="text-sm">Veri bulunamadı.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

/**
 * Memoized version for performance
 */
export const MemoizedDataTable = React.memo(DataTable) as typeof DataTable;
