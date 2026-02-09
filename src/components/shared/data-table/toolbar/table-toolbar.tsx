/**
 * TableToolbar Component
 *
 * Main toolbar container for DataTable.
 * Supports tab-style labels (Sonuçlar, Genel Bilgiler vb.) ve sağda ghost/küçük aksiyonlar.
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { SearchInput } from './search-input';
import { ColumnVisibility } from './column-visibility';
import type { UseDataTableReturn } from '../types';

/**
 * ============================================
 * TYPES
 * ============================================
 */

export interface TableToolbarTab {
    id: string;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

/**
 * ============================================
 * PROPS
 * ============================================
 */

export interface TableToolbarProps<TData> {
    /** DataTable instance from useDataTable */
    table: UseDataTableReturn<TData>;

    /** Tab etiketleri (örn. Sonuçlar, Genel Bilgiler) */
    tabs?: TableToolbarTab[];

    /** Show search input */
    showSearch?: boolean;

    /** Show column visibility */
    showColumnVisibility?: boolean;

    /** Custom actions (left side, after search) */
    leftActions?: React.ReactNode;

    /** Custom actions (right side, before column visibility) — ghost, küçük butonlar */
    rightActions?: React.ReactNode;

    /** Search placeholder */
    searchPlaceholder?: string;

    /** Custom className */
    className?: string;

    /** Compact mode */
    compact?: boolean;

    /** Tab click callback */
    onTabClick?: (tab: TableToolbarTab) => void;
}

/**
 * ============================================
 * COMPONENT
 * ============================================
 */

/**
 * TableToolbar
 *
 * Layout: [Tab'lar] … [Right Actions] [Column Visibility]
 * Sağ aksiyonlar ghost + rounded-full h-9 w-9.
 */
export function TableToolbar<TData>({
    table,
    tabs,
    showSearch = true,
    showColumnVisibility = true,
    leftActions,
    rightActions,
    searchPlaceholder = 'Ara...',
    className,
    compact = false,
}: TableToolbarProps<TData>) {
    return (
        <div
            className={cn(
                'relative flex items-center pl-gutter pr-base min-h-12 gap-6 flex-1 w-full bg-table-header-background border-b border-table-header-bottom-border',
                className
            )}
        >
            {/* Tab etiketleri — tam yükseklik, label dikey orta, active çizgi bottom-0 */}
            {tabs && tabs.length > 0 && (
                <div className="flex-1 w-full flex items-stretch gap-6 self-stretch min-h-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            className={cn(
                                'relative flex flex-col h-full text-base tracking-tight font-medium select-none',
                                tab.active
                                    ? 'text-[#0b57d0] dark:text-[#ffffff]'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <span className="flex-1 flex items-center justify-center font-semibold tracking-wide text-xs">
                                {tab.label}
                            </span>
                            {tab.active && (
                                <span
                                    className="absolute bottom-0 left-0 right-0 border-t-4 rounded-tl-sm rounded-tr-sm border-[#0b57d0] dark:border-[#ffffff] w-full"
                                    aria-hidden
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Sol: search + left actions (tabs yoksa flex-1) */}
            {showSearch && false && (
                <div className={cn('flex items-center gap-2', !tabs?.length && 'flex-1')}>
                    <SearchInput
                        search={{
                            value: table.state.search,
                            debouncedValue: table.state.search,
                            set: table.actions.setSearch,
                            clear: table.actions.clearSearch,
                            isSearching: table.query.isLoading,
                            hasSearch: Boolean(table.state.search),
                        }}
                        placeholder={searchPlaceholder}
                        compact={compact}
                        isLoading={table.query.isLoading}
                    />
                    {leftActions}
                </div>
            )}

            {/* Sağ: right actions + column visibility — ghost, küçük */}
            <div className="relative ml-auto flex gap-2 items-center">
                {rightActions}
                {showColumnVisibility && (
                    <ColumnVisibility
                        table={table.table}
                        compact={compact}
                        triggerVariant="ghost"
                    />
                )}
            </div>
        </div>
    );
}

/**
 * Memoized version
 */
export const MemoizedTableToolbar = React.memo(TableToolbar) as typeof TableToolbar;
