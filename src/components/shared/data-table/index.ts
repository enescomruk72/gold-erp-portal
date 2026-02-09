/**
 * DataTable System
 * 
 * Production-ready, server-side DataTable system for Next.js applications.
 * 
 * @example
 * ```tsx
 * const table = useDataTable({ tableId, columns, apiEndpoint });
 * return (
 *   <>
 *     <TableToolbar table={table} />
 *     <DataTable table={table.table} state={{
 *       isInitialLoading: table.isInitialLoading,
 *       isError: table.query.isError,
 *       error: table.query.error,
 *       onRetry: table.actions.refetch,
 *       isEmpty: table.isEmpty,
 *       emptyMessage: 'Veri bulunamadı.',
 *       emptyAction: { label: 'Filtreleri Temizle', onClick: table.actions.clearAllFilters },
 *     }} />
 *     <TablePagination table={table} />
 *   </>
 * );
 * ```
 */

// ============================================
// CORE
// ============================================
export * from './core';

// ============================================
// COMPONENTS
// ============================================
export * from './header';
export * from './toolbar';
export * from './pagination';
export * from './row';
export * from './cell';

// ============================================
// HOOKS
// ============================================
export * from './hooks/state/url';
export * from './hooks/state/store';

// ============================================
// UTILITIES
// ============================================
export * from './utils';