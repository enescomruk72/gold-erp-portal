/**
 * Data-Grid Configuration
 *
 * Grid'e özel varsayılanlar. Ortak sabitler data-table/config'den kullanılabilir.
 */

import type { DataGridConfig } from '../types';

/**
 * Responsive grid column counts (Tailwind breakpoint isimleri)
 */
export const DEFAULT_GRID_COLUMNS: Record<string, number> = {
    default: 2,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
};

/**
 * Varsayılan grid config
 */
export const DEFAULT_GRID_CONFIG: Partial<DataGridConfig<unknown>> = {
    features: {
        sorting: true,
        filtering: true,
        pagination: true,
        selection: true,
        search: true,
        export: true,
    },
    defaultPageSize: 12,
    pageSizeOptions: [12, 24, 48, 96],
    enableRowSelection: true,
    enableMultiRowSelection: true,
    gridColumns: DEFAULT_GRID_COLUMNS,
};
