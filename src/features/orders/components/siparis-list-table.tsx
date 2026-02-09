/**
 * Siparişler (Orders) DataTable – Portal
 * Cari kendi siparişlerini görür; tasarım frontend sales/orders ile aynı.
 */

'use client';

import * as React from 'react';
import {
    useDataTable,
    DataTable,
    TableToolbar,
    TablePagination,
    ExportSelected,
    RefreshButton,
} from '@/components/shared/data-table';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useSiparisColumns } from './siparis-columns';
import type { ISiparisListDTO } from '@/features/orders/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function SiparisListTable() {
    const columns = useSiparisColumns();

    const table = useDataTable<ISiparisListDTO>({
        tableId: 'portal-siparisler',
        columns,
        apiEndpoint: '/v1/b2b/orders',
        useProxy: true,
        config: {
            initialState: {
                pagination: { pageIndex: 0, pageSize: 10 },
                sorting: [{ id: 'siparisTarihi', desc: true }],
            },
            enableMultiRowSelection: true,
            enableRowSelection: true,
            getRowId: (row) => row.id,
            features: {
                sorting: true,
                filtering: true,
                pagination: true,
                selection: true,
                search: true,
                export: true,
            },
        },
    });

    const selectedRows = table.table.getSelectedRowModel().rows;
    const hasSelection = selectedRows.length > 0;

    return (
        <>
            <Card
                className={cn(
                    'bg-table-container-background rounded-lg border overflow-hidden py-0! shadow-table-container-shadow relative'
                )}
            >
                <CardContent className="p-0!">
                    <TableToolbar
                        table={table}
                        compact={true}
                        searchPlaceholder="Sipariş no ara..."
                        tabs={[
                            {
                                id: 'sonuclar',
                                label: 'SİPARİŞLER',
                                active: true,
                            },
                        ]}
                        rightActions={
                            <TooltipProvider delayDuration={300}>
                                <div className="flex items-center gap-2">
                                    {hasSelection ? (
                                        <ExportSelected
                                            table={table.table}
                                            filename="siparisler"
                                        />
                                    ) : (
                                        <RefreshButton
                                            onRefresh={() => table.actions.refetch()}
                                            isLoading={table.query.isFetching}
                                        />
                                    )}
                                </div>
                            </TooltipProvider>
                        }
                    />
                    <DataTable
                        table={table.table}
                        state={{
                            isInitialLoading: table.isInitialLoading,
                            isError: table.query.isError,
                            error: table.query.error ?? null,
                            onRetry: table.actions.refetch,
                            isEmpty: table.isEmpty,
                            emptyMessage: 'Sipariş bulunamadı.',
                            emptyAction: {
                                label: 'Filtreleri Temizle',
                                onClick: () => {
                                    table.actions.clearAllFilters();
                                    table.actions.clearSearch();
                                    table.actions.setPage(0);
                                    table.actions.refetch();
                                },
                            },
                        }}
                    />
                </CardContent>
            </Card>
            <TablePagination table={table} maxVisiblePages={3} compact />
        </>
    );
}
