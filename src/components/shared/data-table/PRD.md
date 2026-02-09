# 📘 DataTable System - Product Requirements Document (PRD)

**Version:** 2.0  
**Date:** 2024  
**Status:** In Development  

---

## 🎯 Executive Summary

Production-ready, server-side DataTable system for Next.js applications with:
- **URL-driven state** (nuqs) for shareable queries
- **Client state management** (Zustand) for UI preferences
- **Server data fetching** (TanStack Query) with external Express backend
- **Type-safe** (TypeScript) throughout the entire stack
- **Performance-first** design with React memoization and optimization
- **Shadcn UI** components for consistent, accessible design

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    URL (nuqs)                               │
│      ?sortBy=cariAdi&sortOrder=asc&page=1&limit=10&search=acme │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              hooks/state/url/                               │
│         useSorting, usePagination, useSearch                │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ├──────────────────────┐
                 │                      │
                 ▼                      ▼
┌────────────────────────┐   ┌──────────────────────────────┐
│  hooks/state/store/    │   │  TanStack Query              │
│  (Zustand)             │   │  (External API)              │
│  - Column preferences  │   │  - Data fetching             │
│  - Row selection       │   │  - Cache management          │
└────────────┬───────────┘   └───────┬──────────────────────┘
             │                       │
             └───────┬───────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           core/use-data-table.ts                            │
│           (Main Orchestrator)                               │
│           - Combines all state                              │
│           - Creates TanStack Table instance                 │
│           - Returns unified API                             │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│           UI Components (Shadcn)                            │
│           - DataTable (main renderer)                       │
│           - TableHeader, TableRow, TableCell                │
│           - TableToolbar, TablePagination                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Core Principles

### 1. **Separation of Concerns**
- **URL State (nuqs)** → Query parameters (sortBy, sortOrder, filter, pagination, search)
- **Zustand Store** → UI preferences (column visibility, order, sizing, pinning)
- **Local State** → Ephemeral (row selection)
- **Server State** → TanStack Query (data, loading, error)

### 2. **Server-Side First**
- All data operations happen on server (Express API)
- Client only renders and manages UI state
- No client-side sorting/filtering

### 3. **Performance Optimized**
- React.memo for cells/rows
- useMemo/useCallback for derived values
- Debounced search (300ms)
- Virtual scrolling ready

### 4. **Type Safety**
- Full TypeScript coverage
- TanStack Table type extension
- Strict type checking
- IntelliSense support

### 5. **Extensibility**
- Easy to add new features
- Plugin-based architecture
- Custom column types
- Export functionality

---

## 📦 Technology Stack

### Frontend
- **Next.js 15+** - React framework
- **TypeScript** - Type safety
- **TanStack Table v8** - Table rendering engine
- **TanStack Query v5** - Server state management
- **Zustand** - Client state management
- **nuqs** - URL state synchronization
- **Shadcn UI** - Component library

### Backend (External)
- **Node.js** - Runtime
- **Express** - API framework
- **Any Database** - Database agnostic (Postgres, MySQL, MongoDB, etc.)

---

## 🎨 Feature Requirements

### 2.1 Column Features

#### ✅ Sorting (Required)
- **State:** URL (nuqs)
- **Features:**
  - Click header to sort
  - Multi-column sorting support
  - Asc → Desc → None cycle
  - Visual indicators (icons)
- **API:** `GET /api/users?sortBy=email&sortOrder=asc`

#### ✅ Visibility (Required)
- **State:** Zustand (localStorage)
- **Features:**
  - Show/hide columns
  - Persist preferences
  - "Show All" / "Hide All" actions
  - Sticky columns (always visible)
- **UI:** Dropdown in toolbar

#### ✅ Ordering (Required)
- **State:** Zustand (localStorage)
- **Features:**
  - Drag & drop column reordering
  - Persist order
  - Reset to default
- **UI:** Drag handle in header

#### 🔜 Pinning (Optional)
- **State:** Zustand (localStorage)
- **Features:**
  - Pin left/right
  - Unpin
  - Visual indicators
- **Status:** Foundation ready, UI pending

#### 🔜 Sizing (Optional)
- **State:** Zustand (localStorage)
- **Features:**
  - Resize columns
  - Auto-size
  - Min/max width
- **Status:** Foundation ready, UI pending

#### 🔜 Filtering (Soon)
- **State:** URL (nuqs)
- **Features:**
  - Per-column filters
  - Multiple filter types (text, select, range, date)
  - Faceted filters
- **Status:** Foundation ready, UI pending

---

### 2.2 Row Features

#### ✅ Selection (Required)
- **State:** Local (ephemeral)
- **Features:**
  - Single/multi selection
  - Select all
  - Bulk actions
  - Max selection limit
- **UI:** Checkbox column

#### 🔜 Expanding (Soon)
- **State:** Local (ephemeral)
- **Features:**
  - Expandable rows
  - Nested content
  - Lazy loading
- **Status:** Planned

#### 🔜 Virtualization (Soon)
- **State:** N/A
- **Features:**
  - Virtual scrolling for 1000+ rows
  - Performance optimization
- **Status:** Planned

---

### 2.3 Pagination (Required)

- **State:** URL (nuqs)
- **Features:**
  - Page navigation
  - Page size selector
  - Jump to page
  - First/last page buttons
  - Page info display ("Showing 1-25 of 100")
- **API:** `GET /api/users?page=2&limit=25`

---

### 2.4 Table States

#### 1. **Fulfilled (with data)**
```typescript
if (table.hasData) {
  return <DataTable table={table} />;
}
```

#### 2. **Empty (no data)**
```typescript
if (table.isEmpty) {
  return <TableEmpty message="No users found" />;
}
```

#### 3. **Initial Loading**
```typescript
if (table.isLoading) {
  return <TableSkeleton />;
}
```

#### 4. **isPending (paginating, sorting, filtering)**
```typescript
// Show overlay while maintaining table
{table.query.isPending && <LoadingOverlay />}
<DataTable table={table} />
```

#### 5. **Error**
```typescript
if (table.error) {
  return <TableError error={table.error} onRetry={refetch} />;
}
```

---

### 2.5 Components

#### **Core Components**

1. **DataTable** (`core/data-table.tsx`)
   - Main table renderer
   - Dumb component (only renders)
   - Receives table instance as prop

2. **TableSkeleton** (`core/table-skeleton.tsx`)
   - Loading state
   - Animated skeleton

3. **TableEmpty** (`core/table-empty.tsx`)
   - Empty state
   - Custom message support

4. **TableError** (`core/table-error.tsx`)
   - Error state
   - Retry action

#### **Header Components** (`header/`)

1. **TableHeader** (`table-header.tsx`)
   - Header cell renderer
   - Label + actions

2. **HeaderActions** (`header-actions.tsx`)
   - Dropdown menu
   - Sort, pin, filter actions

3. **HeaderLabel** (`header-label.tsx`)
   - Column label display

4. **HeaderSortButton** (`header-sort-button.tsx`)
   - Sort indicator/button

#### **Toolbar Components** (`toolbar/`)

1. **TableToolbar** (`table-toolbar.tsx`)
   - Main toolbar container
   - Global actions

2. **SearchInput** (`search-input.tsx`)
   - Debounced global search

3. **ColumnVisibility** (`column-visibility.tsx`)
   - Show/hide columns dropdown

4. **ViewSwitcher** (`view-switcher.tsx`)
   - List ↔ Card view (future)

5. **ExportDropdown** (`export-dropdown.tsx`)
   - Export to CSV/Excel/PDF

#### **Pagination Components** (`pagination/`)

1. **TablePagination** (`table-pagination.tsx`)
   - Main pagination container

2. **PageSizeSelect** (`page-size-select.tsx`)
   - Rows per page selector

3. **PageNavigator** (`page-navigator.tsx`)
   - Page buttons

4. **PageInfo** (`page-info.tsx`)
   - "Showing X-Y of Z"

#### **Row/Cell Components** (`row/`, `cell/`)

1. **TableRow** (`row/table-row.tsx`)
   - Row renderer (memoized)

2. **RowSelection** (`row/row-selection.tsx`)
   - Selection checkbox

3. **TableCell** (`cell/table-cell.tsx`)
   - Cell wrapper (memoized)

---

## 🔧 API Contract

### Request Format

```
GET /crm/cariler?sortBy=cariAdi&sortOrder=asc&page=1&limit=10&search=acme
```

**Query Parameters:**
- `sortBy` - Sıralanacak kolon (column id) - örn: `cariAdi`
- `sortOrder` - Sıralama yönü (`asc` | `desc`)
- `page` - Sayfa numarası (1-based) - örn: `1`
- `limit` - Sayfa başına kayıt sayısı - örn: `10`
- `search` - Global search term - örn: `acme`
- `filters` - Serialized filters (future) - örn: `cariTipi:eq:MUSTERI|aktifMi:eq:true`
- `filters` - Serialized filters (future)

### Response Format

```typescript
{
  "success": true,
  "message": "List retrieved successfully",
  "data": [{ "id": "1", "email": "john@example.com", ... }, ...],
  "statusCode": 200,
  "type": "SUCCESS",
  "timestamp": "2026-02-01T17:30:36.197Z",
  "requestId": "7cb69b9c-04df-455c-9692-3d938b742f4b",
  "metadata": {
    "pagination": {
      "total": 1,
      "limit": 100,
      "currentPage": 2,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPreviousPage": true,
      "nextPage": null,
      "previousPage": 1
    }
  }
}
```

---

## 🎨 Design System (Shadcn UI)

### Components Used
- Button
- Input
- Select
- Dropdown Menu
- Checkbox
- Skeleton
- Badge
- Separator
- Command (for search)
- Popover

### Theme Support
- Light/Dark mode
- CSS variables
- Tailwind classes
- Custom color schemes

---

## 🚀 Performance Requirements

### Targets
- **Initial Load:** < 500ms
- **Pagination:** < 200ms
- **Search (debounced):** 300ms delay
- **Sort/Filter:** < 300ms
- **Column Toggle:** < 100ms

### Optimizations
- React.memo for expensive components
- useMemo for derived values
- useCallback for event handlers
- Virtual scrolling for 1000+ rows
- Lazy loading for images
- Code splitting for export features

---

## 🔒 Security Considerations

1. **Server-side validation** of all query parameters
2. **Rate limiting** on API endpoints
3. **SQL injection** prevention in backend
4. **XSS protection** in rendered content
5. **CORS** configuration for API
6. **Authentication** checks on endpoints

---

## ♿ Accessibility Requirements

1. **Keyboard Navigation**
   - Tab through interactive elements
   - Arrow keys for table navigation
   - Enter/Space for actions

2. **Screen Reader Support**
   - ARIA labels
   - ARIA descriptions
   - Role attributes
   - Live regions for loading states

3. **Focus Management**
   - Visible focus indicators
   - Focus trapping in modals
   - Logical tab order

4. **Color Contrast**
   - WCAG AA compliant
   - Color-blind friendly
   - High contrast mode support

---

## 📱 Responsive Design

### Breakpoints
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

### Mobile Adaptations
- Horizontal scroll for table
- Collapsible toolbar
- Bottom sheet for filters
- Simplified pagination
- Priority columns shown first

---

## 🧪 Testing Strategy

### Unit Tests
- State hooks (Zustand, nuqs)
- Utility functions
- Type helpers

### Integration Tests
- Component interactions
- State synchronization
- API integration

### E2E Tests
- Full user flows
- Multi-step operations
- Error scenarios

---

## 📈 Success Metrics

### Developer Experience
- ⭐ Time to implement: < 1 hour
- ⭐ Lines of code for basic table: < 100
- ⭐ Type errors: 0
- ⭐ Bundle size: < 50KB (gzipped)

### User Experience
- ⭐ Perceived performance: "instant"
- ⭐ Loading states: clear and informative
- ⭐ Error handling: graceful and actionable
- ⭐ Accessibility: WCAG AA compliant

### Maintainability
- ⭐ Code coverage: > 80%
- ⭐ Documentation: comprehensive
- ⭐ Extensibility: easy to add features
- ⭐ Breaking changes: none in minor versions

---

## 🗺️ Roadmap

### Phase 1: Foundation ✅
- ✅ Types & Config
- ✅ State management (Zustand + nuqs)
- ✅ Folder structure

### Phase 2: Core (Current)
- ⏳ Main hook (`use-data-table.ts`)
- ⏳ Query builders
- ⏳ Basic UI components

### Phase 3: UI
- ⏳ Header components
- ⏳ Row/Cell components
- ⏳ Toolbar
- ⏳ Pagination

### Phase 4: Features
- ⏳ Export (CSV, Excel, PDF)
- ⏳ Column pinning UI
- ⏳ Column resizing UI
- ⏳ Faceted filters

### Phase 5: Advanced
- 🔜 Row expanding
- 🔜 Virtualization
- 🔜 Saved views
- 🔜 Keyboard shortcuts

---

## 📚 Documentation Requirements

### Developer Docs
- ✅ Folder structure
- ⏳ API reference
- ⏳ Type documentation
- ⏳ Hook usage examples
- ⏳ Component props
- ⏳ Migration guide

### User Docs
- ⏳ Quick start guide
- ⏳ Column configuration
- ⏳ State management
- ⏳ Customization
- ⏳ Troubleshooting

### Code Examples
- ⏳ Basic table
- ⏳ Advanced table
- ⏳ Custom columns
- ⏳ Export features
- ⏳ Error handling

---

## 🎓 Learning Resources

### For New Developers
1. TanStack Table docs
2. Zustand docs
3. nuqs docs
4. Shadcn UI docs
5. This PRD + TASKS.md

### Code Comments
- JSDoc for all public APIs
- Inline comments for complex logic
- Examples in docstrings

---

## 🔄 Version Control

### Semantic Versioning
- **Major:** Breaking changes
- **Minor:** New features (backward compatible)
- **Patch:** Bug fixes

### Current Version
- **v2.0.0** - Complete rewrite with new architecture

---

## 📞 Support & Feedback

### Issues
- GitHub Issues for bugs
- Feature requests via discussions

### Community
- Discord for real-time help
- Stack Overflow for Q&A

---

## ✅ Acceptance Criteria

A DataTable implementation is considered complete when:

1. ✅ All required features work
2. ✅ All states are handled (loading, empty, error, pending)
3. ✅ Type-safe throughout
4. ✅ Performance targets met
5. ✅ Accessibility standards met
6. ✅ Documentation complete
7. ✅ Tests passing (>80% coverage)
8. ✅ Code review approved
9. ✅ Production-ready

---

**Last Updated:** 2024  
**Maintained By:** Development Team  
**Status:** 🟡 In Active Development
