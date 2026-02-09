# Data-Grid Mimarisi

**Amaç:** Tablo (satır/kolon) yerine **ürün kartları grid** görünümü; işlevsellik olarak data-table ile aynı (sıralama, sayfalama, arama, filtre, seçim, export).

---

## 1. Data-Table Özet Analizi

### 1.1 Klasör Yapısı (data-table)

```
data-table/
├── core/                    # Ana motor
│   ├── data-table.tsx       # Tablo render (TanStack Table)
│   ├── use-data-table.ts    # Orchestrator hook
│   ├── table-skeleton.tsx
│   ├── table-empty.tsx
│   └── table-error.tsx
├── header/                  # Kolon başlıkları
├── toolbar/                 # Arama, kolon görünürlük, export, view-switcher
├── pagination/              # Sayfa, limit, bilgi
├── row/                     # Satır, seçim, aksiyonlar
├── cell/                    # Hücre
├── hooks/
│   ├── state/
│   │   ├── url/             # nuqs: sorting, pagination, search, filters
│   │   └── store/           # Zustand: column prefs, selection
│   └── actions/             # use-export, use-bulk-actions
├── types/                   # table.types, column.types, state.types, pagination.types, export.types
├── utils/
│   ├── query/               # build-params, serialize
│   ├── format/              # date, number, currency
│   ├── export/              # csv, excel, pdf
│   └── table/               # column-helpers, row-helpers
└── config/                  # defaults, URL_PARAMS
```

### 1.2 State Akışı (data-table)

- **URL (nuqs):** `sortBy`, `sortOrder`, `page`, `limit`, `search`, `filters` → paylaşılabilir, bookmark.
- **Zustand:** Kolon görünürlük/sıra/boyut/pin, satır seçimi (ephemeral).
- **Server:** TanStack Query ile `apiEndpoint` + `buildQueryParams(state)` ile veri çekme.
- **TanStack Table:** Sadece tablo için; grid’de kullanılmayacak.

### 1.3 Ortak Kullanılacak Yapılar (data-grid ile)

| Yapı              | Nerede                       | Kullanım                                                                                       |
| ----------------- | ---------------------------- | ---------------------------------------------------------------------------------------------- |
| URL state         | data-table/hooks/state/url   | useSorting, usePagination, useSearch, useFilters → **data-grid aynı hook’ları kullanacak**     |
| Client state      | data-table/hooks/state/store | useColumnStore (grid’de “kart alanları” için), useSelectionStore                               |
| Query params      | data-table/utils/query       | buildQueryParams → API çağrısı aynı                                                            |
| Types             | data-table/types             | SortingState, PaginationState, QueryParams, PaginationMeta, TableDataResponse, FilterState     |
| Pagination UI     | data-table/pagination        | TablePagination, PageSizeSelect, PageNavigator, PageInfo → **tekrar kullan veya ince wrapper** |
| Toolbar parçaları | data-table/toolbar           | SearchInput, ExportDropdown, DeleteSelected, ViewSwitcher (table ↔ grid)                       |
| Config            | data-table/config            | DEFAULT_PAGE_SIZE, URL_PARAMS, pageSizeOptions                                                 |

---

## 2. Data-Grid Klasör Yapısı

```
data-grid/
├── ARCHITECTURE.md          # Bu dosya
├── index.ts                 # Public API
│
├── core/                    # Grid motoru
│   ├── data-grid.tsx        # Grid layout + kart listesi render
│   ├── use-data-grid.ts     # Orchestrator (URL + store + query, tablo yerine grid)
│   ├── grid-skeleton.tsx    # Grid loading state
│   ├── grid-empty.tsx       # Boş state
│   ├── grid-error.tsx       # Hata state
│   └── index.ts
│
├── card/                    # Grid öğesi = tek “satır” yerine kart
│   ├── grid-card.tsx        # Tek kart wrapper (seçim, aksiyon alanı)
│   ├── grid-card-content.tsx # İçerik slot (ürün kartı vs.)
│   ├── grid-card-actions.tsx
│   ├── grid-card-selection.tsx
│   └── index.ts
│
├── toolbar/                 # Grid’e özel toolbar (veya data-table toolbar’ı compose et)
│   ├── grid-toolbar.tsx     # Arama, sıralama, görünüm, export, bulk
│   ├── grid-sort-select.tsx  # Sıralama dropdown (tek kolon)
│   └── index.ts
│
├── pagination/              # Ortak kullanım veya ince wrapper
│   ├── grid-pagination.tsx  # data-table/TablePagination’a delegate veya aynı bileşen
│   └── index.ts
│
├── types/                   # Grid’e özel tipler
│   ├── grid.types.ts        # DataGridConfig, UseDataGridReturn, GridCardProps
│   ├── card.types.ts        # Kart alan tanımları (column yerine “field”)
│   └── index.ts
│
├── config/
│   ├── defaults.ts          # Grid’e özel varsayılanlar (sütun sayısı, kart boyutu)
│   └── index.ts
│
└── (hooks / utils)          # data-table’dan import; tekrarlanmaz
    → hooks: useSorting, usePagination, useSearch, useFilters, useColumnStore, useSelectionStore
    → utils: buildQueryParams, format, export
```

---

## 3. Mimari Kararlar

### 3.1 Tablo vs Grid

| Özellik     | Data-Table                        | Data-Grid                               |
| ----------- | --------------------------------- | --------------------------------------- |
| Görünüm     | `<table>`, header + row/cell      | CSS Grid/Flex, kart listesi             |
| Veri modeli | TanStack Table (row/cell)         | Aynı API response: `data: TData[]`      |
| Sıralama    | Kolon header tıklanır             | Toolbar’da dropdown (sortBy, sortOrder) |
| Seçim       | Row checkbox                      | Kart üzerinde checkbox / overlay        |
| State       | Aynı URL + aynı Zustand store’lar | Aynı                                    |
| API         | Aynı endpoint, aynı query params  | Aynı                                    |

### 3.2 useDataGrid vs useDataTable

- **useDataTable:** TanStack Table instance döner; header/row/cell render edilir.
- **useDataGrid:** Tablo instance yok; aynı state (sorting, pagination, search, filters) + aynı query (useApiQuery + buildQueryParams) kullanılır. Dönüş tipi:
  - `data: TData[]` (query’den)
  - `state` (sorting, pagination, search, selection, column/card prefs)
  - `actions` (setPage, setSorting, setSearch, toggleSelection, refetch, …)
  - `pagination` (total, totalPages, currentPage, …)
  - `isEmpty`, `hasData`, `isInitialLoading`, `query` (isPending, isError, error)

Böylece tek bir “list state” katmanı olur; UI sadece table mı grid mi ona göre değişir.

### 3.3 Kart Tanımı (Column Yerine)

- Tabloda: `ColumnDef<TData>[]` ile kolonlar tanımlanır.
- Grid’de: Kartın hangi alanları göstereceği “field” veya “slot” ile tanımlanır:
  - **Seçenek A:** Aynı `columns` meta’yı kullan; grid’de sadece “görünür” olanları kart içinde sırayla render et.
  - **Seçenek B:** `gridCardFields: { id, label, accessorKey?, render? }[]` gibi ayrı tanım.
- Öneri: Başta **Seçenek A**; mevcut column tanımlarından `meta.label`, `accessorKey`, `cell` render kullanılır. Böylece tek kaynak (column def) hem table hem grid’i besler.

### 3.4 View Switcher (Table ↔ Grid)

- data-table toolbar’daki **ViewSwitcher** zaten “list / card” geçişi için düşünülmüş.
- Sayfa seviyesinde: aynı `useDataTable` veya `useDataGrid` yerine **tek hook** (ör. `useListData`) kullanılabilir; view mode’a göre `<DataTable>` veya `<DataGrid>` render edilir. İstersen ilk aşamada sadece grid sayfaları için `useDataGrid` kullanılır, table sayfaları aynen `useDataTable` kalır.

---

## 4. Kullanılacak Yapılar (Özet)

### 4.1 data-table’dan Doğrudan Kullanılacaklar

- **Hooks:**  
  `useSorting`, `usePagination`, `useSearch`, `useFilters` (url);  
  `useColumnStore`, `useSelectionStore` (store).
- **Utils:**  
  `buildQueryParams`, `serialize` (query);  
  `format/date`, `format/number`, `format/currency`;  
  export (csv, excel, pdf) – hooks/actions/use-export ile.
- **Types:**  
  `SortingState`, `PaginationState`, `SearchState`, `FilterState`, `QueryParams`, `PaginationMeta`, `TableDataResponse`, `ColumnPreferences`, `SelectionState`, `DataTableConfig` (grid için uyarlanabilir).
- **Bileşenler (isteğe bağlı):**  
  `TablePagination` (veya `GridPagination` içinde aynı bileşen);  
  `SearchInput`, `ExportDropdown`, `DeleteSelected`;  
  `TableSkeleton` benzeri → `GridSkeleton`.

### 4.2 Data-Grid’e Özel

- **core:** `use-data-grid.ts`, `data-grid.tsx`, `grid-skeleton.tsx`, `grid-empty.tsx`, `grid-error.tsx`.
- **card:** `grid-card.tsx`, `grid-card-content.tsx`, `grid-card-selection.tsx`, `grid-card-actions.tsx`.
- **toolbar:** `grid-toolbar.tsx`, `grid-sort-select.tsx` (sıralama tek kolon dropdown).
- **types:** `DataGridConfig`, `UseDataGridReturn`, `GridCardProps`, `GridFieldDef` (gerekirse).
- **config:** Varsayılan grid sütun sayısı (responsive), kart aspect ratio vb.

### 4.3 API Sözleşmesi (Data-Table ile Aynı)

- **İstek:**  
  `GET {apiEndpoint}?sortBy=...&sortOrder=...&page=...&limit=...&search=...&filters=...`
- **Yanıt:**  
  `{ data: TData[], metadata: { pagination: { total, currentPage, totalPages, limit, ... } } }`

Grid, bu contract’ı değiştirmez; sadece veriyi tablo yerine kart listesi olarak gösterir.

---

## 5. Uygulama Sırası Önerisi

1. **types:** `grid.types.ts`, `card.types.ts` (UseDataGridReturn, DataGridConfig, GridCardProps).
2. **core/use-data-grid.ts:** URL hooks + selection/column store + useApiQuery + buildQueryParams; return shape data-table’daki gibi (data, state, actions, pagination, isEmpty, hasData, isInitialLoading, query).
3. **core/data-grid.tsx:** `data` ve `getRowId` + render prop veya `renderCard`; grid layout (css grid) + map over data.
4. **core/grid-skeleton.tsx, grid-empty.tsx, grid-error.tsx:** data-table’dakine benzer.
5. **card/grid-card.tsx:** Seçim checkbox, tıklanabilir alan, aksiyon menüsü slot’ları.
6. **toolbar/grid-toolbar.tsx:** Search + sort dropdown + export + bulk actions; gerekirse data-table toolbar bileşenlerini import et.
7. **pagination/grid-pagination.tsx:** data-table pagination’ı kullan veya aynı state ile sarmala.
8. **index.ts:** Tüm public export’lar.

Bu sıra ile önce state ve veri akışı data-table ile uyumlu olur, sonra sadece görünüm grid’e çekilir.
