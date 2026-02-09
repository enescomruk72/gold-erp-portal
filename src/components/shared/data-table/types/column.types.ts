/**
 * Column Types
 * 
 * Column definitions and meta information.
 * Extends TanStack Table's ColumnDef with our custom meta.
 */

import type { FilterOperator } from './table.types';
import type { ColumnDef as TanStackColumnDef } from "@tanstack/react-table"

/**
 * ============================================
 * COLUMN CAPABILITIES (Meta)
 * ============================================
 */

export interface ColumnCapabilities {
    /** Can this column be sorted? */
    sortable?: boolean;

    /** Can this column be filtered? */
    filterable?: boolean;

    /** Filter type (if filterable) */
    filterType?: FilterType;

    /** Default filter operator */
    filterOperator?: FilterOperator;

    /** Can this column be hidden? */
    hideable?: boolean;

    /** Can this column be reordered? */
    orderable?: boolean;

    /** Can this column be resized? */
    resizable?: boolean;

    /** Can this column be pinned? */
    pinnable?: boolean;

    /** Is this column sticky (always visible)? */
    sticky?: boolean;
}

/**
 * ============================================
 * FILTER TYPES
 * ============================================
 */

export type FilterType =
    | 'text'          // Simple text input
    | 'select'        // Single select dropdown
    | 'multi-select'  // Multi-select dropdown
    | 'number'        // Number input
    | 'number-range'  // Number range (min-max)
    | 'date'          // Date picker
    | 'date-range'    // Date range picker
    | 'boolean';      // True/false toggle

/**
 * ============================================
 * COLUMN SIZING
 * ============================================
 */

export interface ColumnSizing {
    /** Minimum width (px) */
    minWidth?: number;

    /** Maximum width (px) */
    maxWidth?: number;

    /** Default width (px) */
    defaultWidth?: number;

    /** Enable auto-sizing */
    enableResizing?: boolean;
}

/**
 * ============================================
 * COLUMN META (Custom)
 * ============================================
 */

export interface DataTableColumnMeta extends ColumnCapabilities, ColumnSizing {
    /** Display label */
    label?: string;

    /** Description/tooltip */
    description?: string;

    /** Header class name */
    headerClassName?: string;

    /** Cell class name */
    cellClassName?: string;

    /** Mobile priority (lower = shown first on mobile) */
    mobilePriority?: number;

    /** Column group (for grouped headers) */
    group?: string;

    /** Custom data for extensions */
    custom?: Record<string, unknown>;
}


/**
 * ============================================
 * COLUMN DEFINITION (Type alias)
 * ============================================
 */

export type ColumnDef<TData, TValue = unknown> = TanStackColumnDef<TData, TValue>;

/**
 * ============================================
 * COLUMN HELPERS
 * ============================================
 */

/**
 * Helper to create a column with meta
 */
export type ColumnDefWithMeta<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
    meta: DataTableColumnMeta;
};

/**
 * Column builder helper type
 */
export interface ColumnBuilder<TData> {
    text: (id: string, accessor: keyof TData, meta?: Partial<DataTableColumnMeta>) => ColumnDef<TData>;
    number: (id: string, accessor: keyof TData, meta?: Partial<DataTableColumnMeta>) => ColumnDef<TData>;
    date: (id: string, accessor: keyof TData, meta?: Partial<DataTableColumnMeta>) => ColumnDef<TData>;
    select: (id: string, accessor: keyof TData, options: SelectOption[], meta?: Partial<DataTableColumnMeta>) => ColumnDef<TData>;
    custom: (id: string, meta?: Partial<DataTableColumnMeta>) => ColumnDef<TData>;
}

/**
 * ============================================
 * SELECT OPTIONS (for select columns)
 * ============================================
 */

export interface SelectOption {
    value: string | number;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
}

/**
 * ============================================
 * COLUMN PRESETS
 * ============================================
 */

/**
 * Predefined column configurations
 */
export interface ColumnPreset {
    sortable: boolean;
    filterable: boolean;
    hideable: boolean;
    orderable: boolean;
    resizable: boolean;
}

export const COLUMN_PRESETS: Record<string, ColumnPreset> = {
    /** Fully interactive column */
    full: {
        sortable: true,
        filterable: true,
        hideable: true,
        orderable: true,
        resizable: true,
    },

    /** Read-only column */
    readonly: {
        sortable: false,
        filterable: false,
        hideable: true,
        orderable: true,
        resizable: true,
    },

    /** Action column (always visible) */
    action: {
        sortable: false,
        filterable: false,
        hideable: false,
        orderable: false,
        resizable: false,
    },

    /** Selection column */
    selection: {
        sortable: false,
        filterable: false,
        hideable: false,
        orderable: false,
        resizable: false,
    },
};

/**
 * ============================================
 * COLUMN GROUP (for multi-level headers)
 * ============================================
 */

export interface ColumnGroup<TData> {
    id: string;
    label: string;
    columns: ColumnDef<TData>[];
    meta?: Partial<DataTableColumnMeta>;
}
