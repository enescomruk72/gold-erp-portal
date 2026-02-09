# 📁 DataTable Folder Structure

## 🎯 Odaklanma Stratejisi

**Sadece `data-table/` feature'ı** - Query, API, global state zaten var.

---

## 📂 Structure

```
src/features/data-table/
│
├─ core/                           # Ana table engine
│  ├─ data-table.tsx               # Main table component (orchestrator)
│  ├─ table-instance.tsx           # TanStack Table wrapper
│  ├─ table-skeleton.tsx           # Loading state
│  ├─ table-empty.tsx              # Empty state
│  ├─ table-error.tsx              # Error state
│  ├─ use-data-table.ts            # Main hook (orchestrates everything)
│  ├─ use-table-state.ts           # State aggregator hook
│  └─ index.ts
│
├─ header/                         # Column header
│  ├─ table-header.tsx             # Header cell component
│  ├─ header-actions.tsx           # Actions dropdown (sort, pin, etc)
│  ├─ header-label.tsx             # Column label
│  ├─ header-sort-button.tsx       # Sort indicator/button
│  ├─ header-pin-button.tsx        # Pin button
│  └─ index.ts
│
├─ toolbar/                        # Table toolbar (global actions)
│  ├─ table-toolbar.tsx            # Main toolbar container
│  ├─ search-input.tsx             # Global search
│  ├─ column-visibility.tsx        # Show/hide columns
│  ├─ view-switcher.tsx            # List ↔ Card view
│  ├─ export-dropdown.tsx          # Export menu
│  ├─ filter-popover.tsx           # Filter UI (future)
│  ├─ toolbar-separator.tsx        # Visual separator
│  └─ index.ts
│
├─ pagination/                     # Pagination controls
│  ├─ table-pagination.tsx         # Main pagination component
│  ├─ page-size-select.tsx         # Rows per page
│  ├─ page-navigator.tsx           # Page buttons
│  ├─ page-info.tsx                # "Showing X-Y of Z"
│  ├─ pagination-config.ts         # Default configs
│  └─ index.ts
│
├─ row/                            # Table row
│  ├─ table-row.tsx                # Row component
│  ├─ row-selection.tsx            # Selection checkbox
│  ├─ row-expander.tsx             # Expand button (future)
│  ├─ row-actions.tsx              # Row action menu
│  └─ index.ts
│
├─ cell/                           # Table cell
│  ├─ table-cell.tsx               # Generic cell wrapper
│  ├─ cell-skeleton.tsx            # Loading cell
│  └─ index.ts
│
├─ hooks/                          # Custom hooks
│  ├─ state/
│  │  ├─ url/                      # URL state (nuqs)
│  │  │  ├─ use-sorting.ts
│  │  │  ├─ use-pagination.ts
│  │  │  ├─ use-search.ts
│  │  │  ├─ use-filters.ts         # (future)
│  │  │  └─ index.ts
│  │  │
│  │  ├─ store/                    # Client state (Zustand)
│  │  │  ├─ use-column-store.ts    # Column visibility, order, sizing, pinning
│  │  │  ├─ use-selection-store.ts # Row selection
│  │  │  ├─ create-table-store.ts  # Store factory
│  │  │  └─ index.ts
│  │  │
│  │  └─ index.ts
│  │
│  ├─ actions/                     # Action hooks
│  │  ├─ use-export.ts             # Export to CSV/Excel/PDF
│  │  ├─ use-bulk-actions.ts       # Bulk operations
│  │  └─ index.ts
│  │
│  └─ index.ts
│
├─ types/                          # TypeScript types
│  ├─ table.types.ts               # Core table types
│  ├─ column.types.ts              # Column meta & definitions
│  ├─ state.types.ts               # State shapes
│  ├─ pagination.types.ts          # Pagination types
│  ├─ export.types.ts              # Export types
│  └─ index.ts
│
├─ utils/                          # Utilities
│  ├─ export/
│  │  ├─ csv.ts                    # CSV export
│  │  ├─ excel.ts                  # Excel export
│  │  ├─ pdf.ts                    # PDF export
│  │  └─ index.ts
│  │
│  ├─ format/
│  │  ├─ date.ts                   # Date formatting
│  │  ├─ number.ts                 # Number formatting
│  │  ├─ currency.ts               # Currency formatting
│  │  └─ index.ts
│  │
│  ├─ query/
│  │  ├─ build-params.ts           # URL state → API params
│  │  ├─ serialize.ts              # State serialization
│  │  └─ index.ts
│  │
│  ├─ table/
│  │  ├─ column-helpers.ts         # Column utilities
│  │  ├─ row-helpers.ts            # Row utilities
│  │  └─ index.ts
│  │
│  └─ index.ts
│
├─ config/                         # Configuration
│  ├─ defaults.ts                  # Default table config
│  ├─ constants.ts                 # Constants
│  └─ index.ts
│
└─ index.ts                        # Public API (barrel export)
```

---

## 🏗️ Implementation Order

### **1. CORE** (`core/`)
En kritik parça. Her şey buradan başlıyor.

**Priority:**
1. `types/` → Type definitions ÖNCE
2. `core/use-data-table.ts` → Main orchestrator hook
3. `core/data-table.tsx` → Main component
4. `core/table-skeleton.tsx` → Loading state
5. `core/table-empty.tsx` → Empty state
6. `core/table-error.tsx` → Error state

**Dependencies:**
- TanStack Table
- TanStack Query (already exists)
- Zustand stores (we'll create)
- nuqs hooks (we'll create)

**Key Responsibilities:**
- TanStack Table instance creation
- State orchestration (URL + Zustand)
- Query state integration
- Render optimization

---

### **2. HEADER, ROW, CELL** (`header/`, `row/`, `cell/`)
UI primitives. **Performance critical.**

**Priority:**
1. `cell/table-cell.tsx` → Base cell (memoized)
2. `row/table-row.tsx` → Row component (virtualization ready)
3. `header/table-header.tsx` → Header cell
4. `header/header-actions.tsx` → Action dropdown
5. `row/row-selection.tsx` → Selection checkbox

**Performance Requirements:**
- ✅ React.memo for cells
- ✅ useMemo for derived values
- ✅ useCallback for handlers
- ✅ CSS-only animations
- ✅ Virtual scrolling ready

**UI Requirements:**
- ✅ Shadcn components
- ✅ Smooth animations
- ✅ Accessible (ARIA)
- ✅ Responsive

---

### **3. PAGINATION** (`pagination/`)
URL-driven pagination controls.

**Priority:**
1. `pagination/pagination-config.ts` → Defaults
2. `pagination/page-info.tsx` → Info display
3. `pagination/page-size-select.tsx` → Page size selector
4. `pagination/page-navigator.tsx` → Page buttons
5. `pagination/table-pagination.tsx` → Container

**Integration:**
- nuqs for URL state
- TanStack Query for isPending
- Shadcn Select, Button

---

### **4. TOOLBAR** (`toolbar/`)
Global table actions.

**Priority:**
1. `toolbar/search-input.tsx` → Debounced search
2. `toolbar/column-visibility.tsx` → Toggle columns
3. `toolbar/export-dropdown.tsx` → Export menu
4. `toolbar/view-switcher.tsx` → View toggle
5. `toolbar/table-toolbar.tsx` → Container

**Features:**
- Debounced search (300ms)
- Zustand column preferences
- Export actions
- Custom toolbar slots

---

### **5. HOOKS** (`hooks/`)
Business logic layer.

**Priority:**
1. `hooks/state/url/` → nuqs adapters (ÖNCE)
2. `hooks/state/store/` → Zustand stores (ÖNCE)
3. `hooks/actions/` → Export & bulk actions
4. `core/use-data-table.ts` → Main orchestrator (uses all hooks)

**Hooks Architecture:**
```typescript
// Main hook
use-data-table.ts
  ├─ uses → use-sorting.ts (nuqs)
  ├─ uses → use-pagination.ts (nuqs)
  ├─ uses → use-search.ts (nuqs)
  ├─ uses → use-column-store.ts (zustand)
  ├─ uses → use-selection-store.ts (zustand)
  └─ returns → { table, state, actions }
```

---

### **6. UTILS** (`utils/`)
Pure functions. Testable.

**Priority:**
1. `utils/query/build-params.ts` → URL to API params
2. `utils/format/` → Date, number, currency formatters
3. `utils/export/` → CSV, Excel, PDF generators
4. `utils/table/` → Column & row helpers

---

## 🎨 Component Architecture

### **Core Pattern: Composition**

```tsx
// ✅ Good: Composition
export function UsersTable() {
  const table = useDataTable({
    columns,
    tableId: 'users',
    apiEndpoint: '/api/users'
  });

  if (table.isLoading) return <TableSkeleton />;
  if (table.error) return <TableError error={table.error} />;
  if (table.isEmpty) return <TableEmpty />;

  return (
    <div>
      <TableToolbar table={table} />
      <DataTable table={table} />
      <TablePagination table={table} />
    </div>
  );
}
```

```tsx
// ❌ Bad: Monolithic
export function DataTable() {
  // 500 lines of code here
}
```

---

## 🔄 State Flow

```
┌──────────────────────────────────────────────────────────┐
│                    URL (nuqs)                            │
│      ?sortBy=cariAdi&sortOrder=asc&page=1&limit=10&search=acme │
└─────────────────┬────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────────┐
│              hooks/state/url/                            │
│    ├─ use-sorting()                                      │
│    ├─ use-pagination()                                   │
│    └─ use-search()                                       │
└─────────────────┬────────────────────────────────────────┘
                  │
                  ├──────────────────────┐
                  │                      │
                  ▼                      ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│  hooks/state/store/     │   │  TanStack Query         │
│  ├─ use-column-store()  │   │  (external)             │
│  └─ use-selection()     │   │                         │
└─────────────┬───────────┘   └───────┬─────────────────┘
              │                       │
              └───────┬───────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│           core/use-data-table.ts                         │
│           (Orchestrates everything)                      │
└─────────────────┬────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────────┐
│           core/data-table.tsx                            │
│           (Renders with TanStack Table)                  │
└──────────────────────────────────────────────────────────┘
```

---

## 📦 File Contents Preview

### `core/use-data-table.ts`
```typescript
export function useDataTable(config) {
  // URL state
  const sorting = useSorting();
  const pagination = usePagination();
  const search = useSearch();
  
  // Zustand state
  const columnStore = useColumnStore(config.tableId);
  const selection = useSelectionStore(config.tableId);
  
  // TanStack Query (external)
  const query = useQuery({
    queryKey: ['table', config.tableId, sorting, pagination, search],
    queryFn: () => fetchTableData(...)
  });
  
  // TanStack Table
  const table = useReactTable({
    data: query.data,
    columns: config.columns,
    state: { sorting, pagination, columnVisibility: columnStore.visibility },
    onSortingChange: sorting.set,
    manualSorting: true,
    manualPagination: true
  });
  
  return {
    table,
    query,
    state: { sorting, pagination, search, columnStore, selection },
    actions: { ... }
  };
}
```

### `header/table-header.tsx`
```typescript
export const TableHeader = React.memo(({ header }) => {
  const meta = header.column.columnDef.meta;
  
  return (
    <div className="flex items-center gap-2">
      <HeaderLabel label={meta?.label} />
      {meta?.sortable && <HeaderSortButton column={header.column} />}
      <HeaderActions header={header} />
    </div>
  );
});
```

### `row/table-row.tsx`
```typescript
export const TableRow = React.memo(({ row }) => {
  return (
    <tr className={cn(
      'border-b transition-colors hover:bg-muted/50',
      row.getIsSelected() && 'bg-muted'
    )}>
      {row.getVisibleCells().map(cell => (
        <TableCell key={cell.id} cell={cell} />
      ))}
    </tr>
  );
});
```

---

## 🔧 TanStack Table Type Extension

TanStack Table'ın built-in type'larını extend etmemiz gerekiyor. Bu sayede `columnDef.meta` içinde custom property'lerimiz type-safe olacak.

### `types/column.types.ts` içinde:

```typescript
import type { ColumnDef as TanStackColumnDef, RowData } from '@tanstack/react-table';

/**
 * Custom column meta
 */
export interface DataTableColumnMeta {
  label?: string;
  sortable?: boolean;
  filterable?: boolean;
  // ... other properties
}

/**
 * Extend TanStack Table's ColumnMeta
 * Bu declaration merging ile TanStack Table'a custom meta'yı enjekte eder
 */
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> extends DataTableColumnMeta {}
}

/**
 * Re-export ColumnDef with our meta
 */
export type ColumnDef<TData, TValue = unknown> = TanStackColumnDef<TData, TValue>;
```

### Kullanım:

```typescript
// Column tanımlarken
const columns: ColumnDef<User>[] = [
  {
    id: 'email',
    accessorKey: 'email',
    meta: {
      label: 'Email Address',  // ✅ Type-safe
      sortable: true,          // ✅ Type-safe
      filterable: true         // ✅ Type-safe
    }
  }
];

// Component'te erişim
function TableHeader({ column }) {
  const meta = column.columnDef.meta;
  // ✅ meta.label → string | undefined (typed)
  // ✅ meta.sortable → boolean | undefined (typed)
}
```

### Neden Önemli?

1. **Type Safety**: Meta property'ler IntelliSense ile gelir
2. **Compile-time Checks**: Yanlış property'ler hata verir
3. **Refactoring**: Rename/delete güvenli hale gelir
4. **Documentation**: Type'lar kendi kendini dokümante eder

---

## 🚀 Implementation Roadmap

### ✅ Completed (Phase 1)
1. ✅ **Folder structure** oluşturuldu
2. ✅ **Types** (`types/`) → Foundation with TanStack Table extension
3. ✅ **Zustand stores** (`hooks/state/store/`) → Client state
4. ✅ **nuqs hooks** (`hooks/state/url/`) → URL state

### ⏭️ Next Steps (Phase 2)
5. ⏭️ **Core hook** (`core/use-data-table.ts`) → Main orchestrator
6. ⏭️ **Utils** (`utils/`) → Query builders, formatters, export
7. ⏭️ **UI Components** → Header, Row, Cell, Toolbar, Pagination
8. ⏭️ **Example Implementation** → Working demo with real data

---

## 📋 Detailed Task List

Detaylı task breakdown için `TASKS.md` dosyasına bakınız.
Kapsamlı PRD için `PRD.md` dosyasına bakınız.
