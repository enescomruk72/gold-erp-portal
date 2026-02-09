/**
 * Data-Grid Card Types
 *
 * Grid kartı için prop ve alan tanımları.
 * Column def'lerden türetilebilir (meta.label, accessorKey, cell).
 */

import type React from 'react';
import type { ColumnDef } from '@/components/shared/data-table/types';

/**
 * ============================================
 * GRID CARD PROPS
 * ============================================
 */

export interface GridCardProps<TData> {
    /** Row data */
    item: TData;

    /** Index in current page */
    index: number;

    /** Is selected */
    isSelected?: boolean;

    /** Toggle selection callback */
    onToggleSelect?: () => void;

    /** Is selection enabled */
    selectionEnabled?: boolean;

    /** Card click (e.g. open detail) */
    onCardClick?: (item: TData) => void;

    /** Custom className */
    className?: string;

    /** Children (card content) */
    children?: React.ReactNode;
}

/**
 * ============================================
 * GRID FIELD DEF (Kart alanı – column alternatifi)
 * ============================================
 */

export interface GridFieldDef<TData, TValue = unknown> {
    id: string;
    label?: string;
    accessorKey?: keyof TData | string;
    /** Custom render for grid card */
    render?: (value: TValue, item: TData) => React.ReactNode;
    /** Priority on small screens (lower = show first) */
    mobilePriority?: number;
}

/**
 * Column def'lerden grid field listesi türetmek için helper tip
 */
export type GridFieldsFromColumns<TData> = Array<
    ColumnDef<TData, unknown> & { meta?: { label?: string } }
>;
