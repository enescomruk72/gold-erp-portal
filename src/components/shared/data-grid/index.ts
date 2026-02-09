/**
 * Data-Grid
 *
 * Tablo yerine grid (kart listesi) görünümü; data-table ile aynı state ve API contract.
 *
 * @example
 * ```tsx
 * const grid = useDataGrid({
 *   gridId: 'products',
 *   columns: productColumns,
 *   apiEndpoint: '/catalog/products',
 * });
 *
 * return (
 *   <>
 *     <GridToolbar grid={grid} sortOptions={[{ value: 'urunAdi', label: 'Ürün adı' }]} />
 *     <DataGrid
 *       grid={grid}
 *       renderCard={(item) => <ProductCard product={item} />}
 *       state={{
 *         isInitialLoading: grid.isInitialLoading,
 *         isError: grid.query.isError,
 *         error: grid.query.error,
 *         onRetry: grid.actions.refetch,
 *         isEmpty: grid.isEmpty,
 *         emptyMessage: 'Ürün bulunamadı.',
 *       }}
 *     />
 *   </>
 * );
 * ```
 */

// Core
export {
    DataGrid,
    useDataGrid,
    GridSkeleton,
    GridEmpty,
    GridError,
} from './core';
export type { UseDataGridProps } from './core';

// Card
export { GridCard } from './card';

// Toolbar
export { GridToolbar, GridSearchInput, GridSortSelect, GridFilterPopover } from './toolbar';
export type {
    GridToolbarProps,
    GridSearchInputProps,
    GridSortSelectProps,
    GridSortOption,
    GridFilterPopoverProps,
    GridFilterField,
    GridFilterOption,
} from './toolbar';

// Pagination (building blocks; GridToolbar uses them internally)
export { PageInfo, PageSizeSelect, PageNavigator } from './pagination';

// Types
export type {
    DataGridConfig,
    UseDataGridReturn,
    DataGridProps,
    GridCardProps,
    GridFieldDef,
    GridFieldsFromColumns,
} from './types';

// Config
export { DEFAULT_GRID_COLUMNS, DEFAULT_GRID_CONFIG } from './config';
