# 📋 DataTable Implementation Tasks

**Purpose:** Detailed task breakdown for AI-assisted implementation  
**Target:** Production-ready DataTable system  
**Complexity:** High

---

## 🎯 Overview

Bu dokümandaki her task, AI assistant'a verilebilecek şekilde detaylandırılmıştır. Her task:

- ✅ Self-contained (bağımsız)
- ✅ Açık acceptance criteria'ya sahip
- ✅ Implementation notes içerir
- ✅ Dependencies belirtilmiş

---

## ✅ PHASE 1: FOUNDATION (COMPLETED)

### Task 1.1: Type Definitions ✅

**Status:** ✅ DONE  
**Files:** `types/*.ts`

**Completed:**

- Core table types
- Column types with TanStack Table extension
- State types (URL + Zustand)
- Pagination types
- Export types

---

### Task 1.2: Configuration ✅

**Status:** ✅ DONE  
**Files:** `config/*.ts`

**Completed:**

- Default constants
- URL param names
- Storage keys
- Feature flags

---

### Task 1.3: Zustand Stores ✅

**Status:** ✅ DONE  
**Files:** `hooks/state/store/*.ts`

**Completed:**

- Column store factory
- Selection store factory
- React hooks wrappers
- Persistence middleware
- Cache management

---

### Task 1.4: URL State (nuqs) ✅

**Status:** ✅ DONE  
**Files:** `hooks/state/url/*.ts`

**Completed:**

- Sorting hook
- Pagination hook
- Search hook with debouncing
- Filters hook (foundation)

---

## 🚀 PHASE 2: CORE & UTILITIES

### Task 2.1: Query Builder Utilities

**Status:** ⏳ TODO  
**Priority:** HIGH  
**Estimated Time:** 2-3 hours

**Files to Create:**

```
utils/query/
├─ build-query.ts      # URL state → API query params
├─ serialize.ts        # State serialization helpers
└─ index.ts            # Exports
```

**Requirements:**

#### `utils/query/build-query.ts`

```typescript
/**
 * Build API query params from table state
 *
 * @example
 * const params = buildQueryParams({
 *   sorting: [{ id: 'email', desc: false }],
 *   pagination: { pageIndex: 0, pageSize: 25 },
 *   search: 'john'
 * });
 * // → { sortBy: 'email', sortOrder: 'asc', page: 1, limit: 25, search: 'john' }
 */
export function buildQueryParams(state: {
  sorting: SortingState[];
  pagination: PaginationState;
  search?: string;
  filters?: FilterState[];
}): QueryParams;

/**
 * Build API URL with query params
 */
export function buildQueryURL(baseUrl: string, params: QueryParams): string;
```

**Implementation Notes:**

- Use constants from `config/defaults.ts`
- Handle empty states gracefully
- Type-safe return values
- URL encode special characters

**Acceptance Criteria:**

- ✅ Correctly serializes all state types
- ✅ Handles edge cases (empty, null, undefined)
- ✅ URL-safe encoding
- ✅ Fully typed
- ✅ Unit tests pass

---

### Task 2.2: Format Utilities

**Status:** ⏳ TODO  
**Priority:** MEDIUM  
**Estimated Time:** 1-2 hours

**Files to Create:**

```
utils/format/
├─ date.ts             # Date formatting
├─ number.ts           # Number formatting
├─ currency.ts         # Currency formatting
└─ index.ts            # Exports
```

**Requirements:**

#### `utils/format/date.ts`

```typescript
/**
 * Format date for display
 * @example formatDate('2024-01-15') → 'Jan 15, 2024'
 */
export function formatDate(date: string | Date, format?: string): string;

/**
 * Format relative time
 * @example formatRelativeTime('2024-01-15') → '2 days ago'
 */
export function formatRelativeTime(date: string | Date): string;
```

#### `utils/format/number.ts`

```typescript
/**
 * Format number with thousands separator
 * @example formatNumber(1234567) → '1,234,567'
 */
export function formatNumber(num: number, locale?: string): string;

/**
 * Format percentage
 * @example formatPercentage(0.1534) → '15.34%'
 */
export function formatPercentage(num: number, decimals?: number): string;
```

**Acceptance Criteria:**

- ✅ Handles all edge cases (null, undefined, invalid)
- ✅ Locale-aware formatting
- ✅ Customizable formats
- ✅ Type-safe

---

### Task 2.3: Table Utility Helpers

**Status:** ⏳ TODO  
**Priority:** MEDIUM  
**Estimated Time:** 2 hours

**Files to Create:**

```
utils/table/
├─ column-helpers.ts   # Column utilities
├─ row-helpers.ts      # Row utilities
└─ index.ts            # Exports
```

**Requirements:**

#### `utils/table/column-helpers.ts`

```typescript
/**
 * Get visible columns from visibility state
 */
export function getVisibleColumns<TData>(
  columns: ColumnDef<TData>[],
  visibility: Record<string, boolean>
): ColumnDef<TData>[];

/**
 * Reorder columns based on order array
 */
export function reorderColumns<TData>(
  columns: ColumnDef<TData>[],
  order: string[]
): ColumnDef<TData>[];

/**
 * Get column by ID
 */
export function getColumnById<TData>(
  columns: ColumnDef<TData>[],
  id: string
): ColumnDef<TData> | undefined;
```

**Acceptance Criteria:**

- ✅ Handles missing columns gracefully
- ✅ Maintains column references
- ✅ Type-safe operations
- ✅ Performance optimized (memoizable)

---

### Task 2.4: Main Hook - use-data-table

**Status:** ⏳ TODO  
**Priority:** CRITICAL  
**Estimated Time:** 4-6 hours

**File to Create:**

```
core/use-data-table.ts
```

**This is THE MOST IMPORTANT file - it orchestrates everything**

**Requirements:**

```typescript
import { useReactTable } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSorting, usePagination, useSearch } from "../hooks/state/url";
import { useColumnStore, useSelectionStore } from "../hooks/state/store";
import { buildQueryParams, buildQueryURL } from "../utils/query";

export interface UseDataTableProps<TData> {
  /** Unique table identifier */
  tableId: string;

  /** Column definitions */
  columns: ColumnDef<TData>[];

  /** API endpoint */
  apiEndpoint: string;

  /** Additional options */
  options?: Partial<DataTableConfig<TData>>;
}

export function useDataTable<TData>({
  tableId,
  columns,
  apiEndpoint,
  options = {},
}: UseDataTableProps<TData>): UseDataTableReturn<TData> {
  // ====================================
  // 1. URL STATE (nuqs)
  // ====================================
  const sorting = useSorting();
  const pagination = usePagination();
  const search = useSearch();

  // ====================================
  // 2. CLIENT STATE (Zustand)
  // ====================================
  const columnStore = useColumnStore(tableId);
  const selectionStore = useSelectionStore(tableId);

  // ====================================
  // 3. BUILD API QUERY
  // ====================================
  const queryParams = useMemo(() => {
    return buildQueryParams({
      sorting: sorting.value,
      pagination: pagination.value,
      search: search.debouncedValue,
    });
  }, [sorting.value, pagination.value, search.debouncedValue]);

  const queryURL = useMemo(() => {
    return buildQueryURL(apiEndpoint, queryParams);
  }, [apiEndpoint, queryParams]);

  // ====================================
  // 4. FETCH DATA (TanStack Query)
  // ====================================
  const query = useQuery({
    queryKey: ["table", tableId, queryParams],
    queryFn: async () => {
      const response = await fetch(queryURL);
      if (!response.ok) throw new Error("Failed to fetch table data");
      return response.json() as Promise<TableDataResponse<TData>>;
    },
    placeholderData: (previousData) => previousData, // Keep old data while fetching
  });

  // ====================================
  // 5. CREATE TABLE INSTANCE (TanStack Table)
  // ====================================
  const table = useReactTable({
    data: query.data?.data ?? [],
    columns,

    // State
    state: {
      sorting: sorting.value,
      pagination: {
        pageIndex: pagination.value.pageIndex,
        pageSize: pagination.value.limit,
      },
      columnVisibility: columnStore.visibility,
      columnOrder: columnStore.order,
      rowSelection: selectionStore.selection,
    },

    // Manual modes (server-side)
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,

    // Pagination
    pageCount: query.data?.metadata?.pagination?.totalPages ?? 0,

    // Row ID
    getRowId: options.getRowId,

    // Event handlers
    onSortingChange: (updater) => {
      const newSorting = typeof updater === "function" ? updater(sorting.value) : updater;
      sorting.set(newSorting);
    },

    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function" ? updater(pagination.value) : updater;
      pagination.set(newPagination);
    },

    onColumnVisibilityChange: (updater) => {
      const newVisibility =
        typeof updater === "function" ? updater(columnStore.visibility) : updater;
      columnStore.setVisibility(newVisibility);
    },

    onRowSelectionChange: (updater) => {
      const newSelection =
        typeof updater === "function" ? updater(selectionStore.selection) : updater;
      selectionStore.selection = newSelection;
    },

    // Core
    getCoreRowModel: getCoreRowModel(),
  });

  // ====================================
  // 6. DERIVED STATE
  // ====================================
  const isEmpty = !query.isLoading && (!query.data?.data || query.data.data.length === 0);
  const hasData = !!query.data?.data && query.data.data.length > 0;
  const isInitialLoading = query.isLoading && !query.data;

  // ====================================
  // 7. RETURN UNIFIED API
  // ====================================
  return {
    table,
    query: {
      data: query.data?.data,
      isLoading: query.isLoading,
      isPending: query.isPending,
      isError: query.isError,
      error: query.error,
      isFetching: query.isFetching,
      isRefetching: query.isRefetching,
    },
    state: {
      sorting: sorting.value,
      pagination: pagination.value,
      search: search.value,
      filters: [],
      columnPreferences: {
        visibility: columnStore.visibility,
        order: columnStore.order,
        sizing: columnStore.sizing,
        pinning: columnStore.pinning,
      },
      selection: selectionStore.selection,
      selectedCount: selectionStore.getSelectedCount(),
      selectedIds: selectionStore.getSelectedIds(),
    },
    actions: {
      // Sorting
      setSorting: sorting.set,
      toggleSort: sorting.toggle,
      clearSorting: sorting.clear,

      // Pagination
      setPage: pagination.setPage,
      setLimit: pagination.setLimit,
      nextPage: pagination.nextPage,
      previousPage: pagination.previousPage,

      // Search
      setSearch: search.set,
      clearSearch: search.clear,

      // Filters (future)
      setFilter: () => {},
      clearFilter: () => {},
      clearAllFilters: () => {},

      // Column preferences
      toggleColumnVisibility: columnStore.toggleVisibility,
      setColumnOrder: columnStore.setOrder,
      setColumnSize: columnStore.setSize,
      pinColumn: (id, position) => {
        if (position === "left") columnStore.pinLeft(id);
        else columnStore.pinRight(id);
      },
      unpinColumn: columnStore.unpin,
      resetColumnPreferences: columnStore.reset,

      // Selection
      toggleRowSelection: selectionStore.toggleRow,
      toggleAllRowsSelection: () => {
        const allIds =
          query.data?.data.map((row) =>
            options.getRowId ? options.getRowId(row) : (row as any).id
          ) ?? [];
        selectionStore.toggleAll(allIds);
      },
      clearSelection: selectionStore.clearSelection,

      // Utility
      resetTable: () => {
        sorting.clear();
        search.clear();
        pagination.setPage(1);
        selectionStore.clearSelection();
      },
    },
    pagination: {
      total: query.data?.metadata?.pagination?.total ?? 0,
      totalPages: query.data?.metadata?.pagination?.totalPages ?? 0,
      currentPage: query.data?.metadata?.pagination?.currentPage ?? 1,
      limit: query.data?.metadata?.pagination?.limit ?? pagination.value.limit,
      hasNextPage: query.data?.metadata?.pagination?.hasNextPage ?? false,
      hasPreviousPage: query.data?.metadata?.pagination?.hasPreviousPage ?? false,
      nextPage: query.data?.metadata?.pagination?.nextPage ?? null,
      previousPage: query.data?.metadata?.pagination?.previousPage ?? null,
    },
    isEmpty,
    hasData,
    isInitialLoading,
  };
}
```

**Acceptance Criteria:**

- ✅ All state sources integrated (URL + Zustand + Query)
- ✅ TanStack Table instance created correctly
- ✅ All actions work and update appropriate state
- ✅ Type-safe throughout
- ✅ Performance optimized (useMemo, useCallback)
- ✅ Handles loading/error/empty states
- ✅ Query invalidation works correctly

**Dependencies:**

- Task 2.1 (Query builders)
- Phase 1 (All state hooks)

---

## 🎨 PHASE 3: UI COMPONENTS

### Task 3.1: Core Table Components

**Status:** ⏳ TODO  
**Priority:** HIGH  
**Estimated Time:** 3-4 hours

**Files to Create:**

```
core/
├─ data-table.tsx         # Main table renderer
├─ table-skeleton.tsx     # Loading skeleton
├─ table-empty.tsx        # Empty state
├─ table-error.tsx        # Error state
└─ index.ts               # Exports
```

**Requirements:**

#### `core/data-table.tsx`

```typescript
"use client";

import { Table, flexRender } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
  table: Table<TData>;
  className?: string;
}

export function DataTable<TData>({ table, className }: DataTableProps<TData>) {
  return (
    <div className={cn("relative w-full overflow-auto", className)}>
      <table className="w-full caption-bottom text-sm">
        <thead className="border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="h-12 px-4 text-left align-middle font-medium"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className="border-b transition-colors hover:bg-muted/50"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-4 align-middle">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

#### `core/table-skeleton.tsx`

- Animated skeleton loader
- Configurable rows/columns
- Shadcn Skeleton component

#### `core/table-empty.tsx`

- Empty state illustration
- Custom message
- Optional action button

#### `core/table-error.tsx`

- Error message display
- Retry button
- Error details (dev mode)

**Acceptance Criteria:**

- ✅ Clean, minimal code
- ✅ Fully accessible (ARIA)
- ✅ Responsive design
- ✅ Shadcn UI components
- ✅ Performance optimized (React.memo where needed)

---

### Task 3.2: Header Components

**Status:** ⏳ TODO  
**Priority:** HIGH  
**Estimated Time:** 4-5 hours

**Files to Create:**

```
header/
├─ table-header.tsx           # Header cell
├─ header-actions.tsx         # Actions dropdown
├─ header-label.tsx           # Column label
├─ header-sort-button.tsx     # Sort button
├─ header-pin-button.tsx      # Pin button (future)
└─ index.ts                   # Exports
```

**Requirements:**

#### `header/table-header.tsx`

```typescript
"use client";

import { Header, flexRender } from "@tanstack/react-table";
import { HeaderLabel } from "./header-label";
import { HeaderSortButton } from "./header-sort-button";
import { HeaderActions } from "./header-actions";
import type { DataTableColumnMeta } from "../../types";

interface TableHeaderProps<TData, TValue> {
  header: Header<TData, TValue>;
}

export function TableHeader<TData, TValue>({ header }: TableHeaderProps<TData, TValue>) {
  const meta = header.column.columnDef.meta as DataTableColumnMeta | undefined;

  return (
    <div className="flex items-center gap-2">
      <HeaderLabel label={meta?.label || header.id} description={meta?.description} />

      {meta?.sortable && <HeaderSortButton column={header.column} />}

      <HeaderActions header={header} />
    </div>
  );
}
```

#### `header/header-actions.tsx`

- Dropdown menu (Shadcn DropdownMenu)
- Sort ascending/descending
- Pin left/right
- Hide column
- Filter (future)

**Acceptance Criteria:**

- ✅ Declarative (based on column meta)
- ✅ Accessible keyboard navigation
- ✅ Visual feedback
- ✅ Performance optimized (React.memo)

---

### Task 3.3: Toolbar Components

**Status:** ⏳ TODO  
**Priority:** HIGH  
**Estimated Time:** 4-5 hours

**Files to Create:**

```
toolbar/
├─ table-toolbar.tsx          # Main container
├─ search-input.tsx           # Debounced search
├─ column-visibility.tsx      # Column toggle
├─ view-switcher.tsx          # View toggle (future)
├─ export-dropdown.tsx        # Export menu
├─ toolbar-separator.tsx      # Visual separator
└─ index.ts                   # Exports
```

**Requirements:**

#### `toolbar/table-toolbar.tsx`

```typescript
interface TableToolbarProps<TData> {
  table: UseDataTableReturn<TData>;
  showSearch?: boolean;
  showColumnVisibility?: boolean;
  showExport?: boolean;
  customActions?: React.ReactNode;
}

export function TableToolbar<TData>({ ... }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <div className="flex items-center gap-2">
        {showSearch && <SearchInput />}
        {customActions}
      </div>

      <div className="flex items-center gap-2">
        {showColumnVisibility && <ColumnVisibility table={table} />}
        {showExport && <ExportDropdown table={table} />}
      </div>
    </div>
  );
}
```

#### `toolbar/search-input.tsx`

- Shadcn Input
- Debounced (useSearch hook)
- Clear button
- Search icon

#### `toolbar/column-visibility.tsx`

- Shadcn DropdownMenu + Command
- Checkbox list
- Show all / Hide all
- Search columns

**Acceptance Criteria:**

- ✅ Intuitive UX
- ✅ Accessible
- ✅ Responsive
- ✅ Smooth animations

---

### Task 3.4: Pagination Components

**Status:** ⏳ TODO  
**Priority:** HIGH  
**Estimated Time:** 3-4 hours

**Files to Create:**

```
pagination/
├─ table-pagination.tsx       # Main container
├─ page-size-select.tsx       # Rows per page
├─ page-navigator.tsx         # Page buttons
├─ page-info.tsx              # Info display
└─ index.ts                   # Exports
```

**Requirements:**

#### `pagination/table-pagination.tsx`

```typescript
interface TablePaginationProps<TData> {
  table: UseDataTableReturn<TData>;
  showPageSize?: boolean;
  showPageInfo?: boolean;
}

export function TablePagination<TData>({ table, ... }) {
  return (
    <div className="flex items-center justify-between px-4 py-4 border-t">
      {showPageInfo && <PageInfo pagination={table.pagination} />}

      <div className="flex items-center gap-4">
        {showPageSize && <PageSizeSelect />}
        <PageNavigator />
      </div>
    </div>
  );
}
```

#### `pagination/page-navigator.tsx`

- First/Previous/Next/Last buttons
- Page number input
- Ellipsis for many pages

**Acceptance Criteria:**

- ✅ Intuitive controls
- ✅ Keyboard accessible
- ✅ Disabled states handled
- ✅ Responsive

---

### Task 3.5: Row & Cell Components

**Status:** ⏳ TODO  
**Priority:** MEDIUM  
**Estimated Time:** 2-3 hours

**Files to Create:**

```
row/
├─ table-row.tsx              # Row component
├─ row-selection.tsx          # Selection checkbox
└─ index.ts                   # Exports

cell/
├─ table-cell.tsx             # Cell wrapper
└─ index.ts                   # Exports
```

**Requirements:**

#### `row/table-row.tsx`

```typescript
export const TableRow = React.memo(function TableRow<TData>({ row }: { row: Row<TData> }) {
  return (
    <tr
      data-state={row.getIsSelected() && "selected"}
      className={cn(
        "border-b transition-colors hover:bg-muted/50",
        row.getIsSelected() && "bg-muted"
      )}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} cell={cell} />
      ))}
    </tr>
  );
});
```

#### `cell/table-cell.tsx`

- React.memo wrapped
- Minimal rendering

**Acceptance Criteria:**

- ✅ Performance optimized (React.memo)
- ✅ No unnecessary re-renders
- ✅ Clean code

---

## 🔧 PHASE 4: EXPORT & ACTIONS

### Task 4.1: Export Utilities

**Status:** ⏳ TODO (Future)  
**Priority:** MEDIUM

**Files to Create:**

```
utils/export/
├─ csv.ts                     # CSV export
├─ excel.ts                   # Excel export (using exceljs)
├─ pdf.ts                     # PDF export (using jsPDF)
└─ index.ts                   # Exports
```

---

### Task 4.2: Export Hook

**Status:** ⏳ TODO (Future)  
**Priority:** MEDIUM

**File:** `hooks/actions/use-export.ts`

---

## 📚 PHASE 5: DOCUMENTATION & EXAMPLES

### Task 5.1: API Documentation

**Status:** ⏳ TODO

Generate comprehensive API docs for:

- All hooks
- All components
- All utilities
- Type definitions

---

### Task 5.2: Usage Examples

**Status:** ⏳ TODO

Create examples:

1. Basic table
2. Advanced table (all features)
3. Custom columns
4. Server integration
5. Export functionality
6. Error handling

---

### Task 5.3: Migration Guide

**Status:** ⏳ TODO

Document:

- Breaking changes from v1
- Migration steps
- Code examples

---

## ✅ AI IMPLEMENTATION CHECKLIST

When implementing each task:

- [ ] Read PRD.md for context
- [ ] Read CLEAN_STRUCTURE.md for architecture
- [ ] Check dependencies (imports from completed tasks)
- [ ] Follow TypeScript strict mode
- [ ] Use types from `types/` folder
- [ ] Use constants from `config/` folder
- [ ] Add JSDoc comments
- [ ] Include usage examples in comments
- [ ] Handle edge cases (null, undefined, empty)
- [ ] Optimize performance (memo, callback, useMemo)
- [ ] Follow Shadcn UI patterns
- [ ] Ensure accessibility (ARIA)
- [ ] Test all code paths

---

## 🎯 PRIORITY ORDER FOR AI

**Start Here:**

1. ✅ Task 2.1: Query Builder (CRITICAL)
2. ✅ Task 2.4: use-data-table hook (CRITICAL)
3. ✅ Task 3.1: Core Table Components
4. ✅ Task 3.2: Header Components
5. ✅ Task 3.3: Toolbar Components
6. ✅ Task 3.4: Pagination Components

**Then:** 7. Task 2.2: Format Utilities 8. Task 2.3: Table Helpers 9. Task 3.5: Row & Cell Components

**Later:** 10. Task 4.1-4.2: Export Features 11. Task 5.1-5.3: Documentation

---

## 📝 NOTES FOR AI

### Code Style

- Use `'use client'` for client components
- Use TypeScript strict mode
- Use named exports (not default)
- Use const for components: `const MyComponent = () => {}`
- Use React.memo for expensive components
- Use Shadcn UI components

### Performance

- Memoize selectors in Zustand
- Use useCallback for event handlers
- Use useMemo for derived values
- Avoid inline functions in JSX

### Accessibility

- Add ARIA labels
- Support keyboard navigation
- Maintain focus management
- Use semantic HTML

### Testing

- Test happy path
- Test edge cases
- Test error scenarios
- Test loading states

---

**Last Updated:** 2024  
**Status:** 🟡 In Progress  
**Current Phase:** Phase 2 - Core & Utilities
