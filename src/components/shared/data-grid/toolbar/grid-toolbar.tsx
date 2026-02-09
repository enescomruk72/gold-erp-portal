'use client';

import * as React from 'react';
import {
    PageInfo,
    PageSizeSelect,
    PageNavigator,
} from '@/components/shared/data-table/pagination';
import type { UseDataGridReturn } from '../types';
import { cn } from '@/lib/utils';
import { GridSearchInput } from './grid-search-input';
import { GridSortSelect } from './grid-sort-select';
import type { GridSortOption } from './grid-sort-select';
import { GridFilterPopover } from './grid-filter-popover';
import type { GridFilterField, GridFilterFieldCustom } from './grid-filter-popover';

export interface GridToolbarProps<TData> {
    grid: UseDataGridReturn<TData>;
    /** Sıralama seçenekleri */
    sortOptions?: GridSortOption[];
    /** Filtre alanları (id, label, type, options) */
    filterFields?: GridFilterField[];
    /** Toolbar'da pagination gösterilsin mi */
    showPagination?: boolean;
    /** Arama placeholder */
    searchPlaceholder?: string;
    /** Ek aksiyonlar (sağ tarafa) */
    children?: React.ReactNode;
    className?: string;
}

/**
 * GridToolbar
 *
 * Search (nuqs), Sort (nuqs), Filter (nuqs), Pagination. Tüm state URL ile senkron.
 */
export function GridToolbar<TData>({
    grid,
    sortOptions,
    filterFields = [],
    showPagination = true,
    searchPlaceholder = 'Ara...',
    children,
    className,
}: GridToolbarProps<TData>) {
    const sortBy = grid.state.sorting[0]?.id;
    const sortOrder = grid.state.sorting[0]?.desc ? 'desc' : 'asc';

    const customFilterFields = filterFields.filter(
        (f): f is GridFilterFieldCustom => f.type === 'custom'
    );
    const standardFilterFields = filterFields.filter(
        (f): f is Exclude<GridFilterField, GridFilterFieldCustom> => f.type !== 'custom'
    );

    return (
        <div className={cn('space-y-3', className)}>
            <div className="flex flex-wrap items-center justify-between gap-base">
                <GridSearchInput
                    value={grid.state.search}
                    onChange={grid.actions.setSearch}
                    onClear={grid.actions.clearSearch}
                    placeholder={searchPlaceholder}
                    isSearching={grid.state.isSearching}
                    hasSearch={grid.state.hasSearch}
                    disabled={grid.query.isPending}
                />
                <div className="flex gap-base">
                    {sortOptions && sortOptions.length > 0 && (
                        <GridSortSelect
                            options={sortOptions}
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onSortChange={(id, order) =>
                                grid.actions.setSorting([{ id, desc: order === 'desc' }])
                            }
                            onClear={grid.actions.clearSorting}
                            disabled={grid.query.isPending}
                        />
                    )}
                    {customFilterFields.map((field) => (
                        <React.Fragment key={field.id}>
                            {field.component}
                        </React.Fragment>
                    ))}
                    {standardFilterFields.length > 0 && (
                        <GridFilterPopover
                            fields={standardFilterFields}
                            filters={grid.state.filters}
                            onSetFilter={grid.actions.setFilter}
                            onClearFilter={grid.actions.clearFilter}
                            onClearAll={grid.actions.clearAllFilters}
                            disabled={grid.query.isPending}
                        />
                    )}
                    {children}
                </div>
            </div>
            {showPagination && !grid.isEmpty && grid.pagination.total > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <PageSizeSelect
                        pageSize={grid.pagination.pageSize}
                        onPageSizeChange={grid.actions.setPageSize}
                        disabled={grid.query.isPending}
                    />
                    <PageInfo
                        pagination={grid.pagination}
                        selectedCount={grid.state.selectedCount}
                    />
                    <PageNavigator
                        pagination={grid.pagination}
                        onPageChange={(page) => grid.actions.setPage(page - 1)}
                        showFirstLast
                        maxVisiblePages={5}
                        disabled={grid.query.isPending}
                    />
                </div>
            )}
        </div>
    );
}
