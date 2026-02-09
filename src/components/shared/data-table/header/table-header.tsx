/**
 * TableHeader Component
 *
 * Esnek kolon başlığı: label/custom içerik + sıralama (sortable) + tek dropdown ile
 * tüm aksiyonlar (sırala, sabitle, gizle, ileride filtre vb.). Birden fazla feature
 * head'e sığması için tek "⋯" dropdown kullanılır; sort ise label tıklanabilir veya
 * yanında ikon ile verilir.
 */

'use client';

import * as React from 'react';
import { type Header, flexRender } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HeaderLabel } from './header-label';
import { HeaderActions } from './header-actions';
import type { DataTableColumnMeta } from '../types';

/**
 * ============================================
 * PROPS
 * ============================================
 */

export interface TableHeaderProps<TData, TValue> {
    /** TanStack Table header */
    header: Header<TData, TValue>;

    /** Özel içerik (label yerine). Verilirse sort/actions yine TableHeader tarafından eklenir. */
    children?: React.ReactNode;

    /** Custom className */
    className?: string;

    /** Aksiyon dropdown göster (sırala, sabitle, gizle vb.) */
    showActions?: boolean;

    /** Compact mode */
    compact?: boolean;
}

/**
 * ============================================
 * COMPONENT
 * ============================================
 */

/**
 * TableHeader
 *
 * - columnDef.header string/undefined → varsayılan: meta.label + sort (sortable ise) + actions dropdown
 * - columnDef.header function → custom içerik (flexRender) + actions dropdown
 * - children prop verilirse → children + actions (custom bileşen slot)
 *
 * Sort: sortable kolonlarda label tıklanabilir veya yanında sort ikonu.
 * Diğer tüm aksiyonlar tek HeaderActions dropdown'da (sırala, sabitle, gizle).
 */
export function TableHeader<TData, TValue>({
    header,
    children,
    className,
    showActions = true,
    compact = false,
}: TableHeaderProps<TData, TValue>) {
    const { column } = header;
    const columnDef = column.columnDef;
    const meta = columnDef.meta as DataTableColumnMeta | undefined;

    if (header.isPlaceholder) {
        return null;
    }

    const isCustomHeader = typeof columnDef.header === 'function';
    const canSort = column.getCanSort();
    const label =
        meta?.label ??
        (typeof columnDef.header === 'string' ? columnDef.header : header.id);

    // Ana içerik: custom (flexRender veya children) veya varsayılan (label + sort)
    let mainContent: React.ReactNode;

    if (children !== undefined) {
        // Açık custom slot
        mainContent = children;
    } else if (isCustomHeader) {
        // Kolon tanımındaki header fonksiyonu
        mainContent = flexRender(columnDef.header, header.getContext());
    } else {
        // Varsayılan: label + sort (sortable ise tıklanabilir label)
        if (canSort) {
            const sortDir = column.getIsSorted();
            // Yukarı ok: path d="m7 9 5-5 5 5" — asc iken aktif
            // Aşağı ok: path d="m7 15 5 5 5-5" — desc iken aktif
            const upActive = sortDir === 'asc';
            const downActive = sortDir === 'desc';
            mainContent = (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="w-full min-w-0 -ml-3 h-8 data-[state=open]:bg-accent justify-between font-medium flex-1"
                >
                    <HeaderLabel
                        label={label}
                        description={meta?.description}
                        compact={compact}
                        className='pr-4'
                    />

                    {/* Ethereum-style diamond (◇ + =) — üst asc, alt desc */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="24"
                        viewBox="0 0 22 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="shrink-0"
                    >
                        {/* Üst üçgen (asc) */}
                        <path
                            d="M 11 2 L 17 9 L 5 9 Z"
                            fill="currentColor"
                            stroke="none"
                            className={cn(
                                upActive ? 'text-card-foreground' : 'text-muted-foreground/50'
                            )}
                        />
                        {/* Alt üçgen (desc) */}
                        <path
                            d="M 5 15 L 17 15 L 11 22 Z"
                            fill="currentColor"
                            stroke="none"
                            className={cn(
                                downActive ? 'text-card-foreground' : 'text-muted-foreground/50'
                            )}
                        />
                        {/* Ortadaki iki çizgi (=) */}
                        <path
                            d="M 5 9 L 17 9"
                            stroke="currentColor"
                            fill="none"
                            className={cn(
                                upActive ? 'text-card-foreground' : 'text-muted-foreground/50'
                            )}
                        />
                        <path
                            d="M 5 15 L 17 15"
                            stroke="currentColor"
                            fill="none"
                            className={cn(
                                downActive ? 'text-card-foreground' : 'text-muted-foreground/50'
                            )}
                        />
                    </svg>
                </Button>
            );
        } else {
            mainContent = (
                <HeaderLabel
                    label={label}
                    description={meta?.description}
                    compact={compact}
                    className='pr-4'
                />
            );
        }
    }

    return (
        <div
            className={cn(
                'flex items-center min-w-0 w-full',
                !isCustomHeader && !children && 'flex-1',
                isCustomHeader || children && 'gap-1',
                className
            )}
        >
            <div className="min-w-0 flex-1 w-full flex items-center">{mainContent}</div>
            {showActions && (
                <div className="shrink-0">
                    <HeaderActions header={header} compact={compact} />
                </div>
            )}
        </div>
    );
}

/**
 * Memoized version for performance
 */
export const MemoizedTableHeader = React.memo(TableHeader) as typeof TableHeader;
