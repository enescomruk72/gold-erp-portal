/**
 * DataTable Configuration
 * 
 * Default configuration values and constants.
 */

import type { DataTableConfig, PaginationConfig } from '../types';

/**
 * ============================================
 * PAGINATION DEFAULTS
 * ============================================
 */

export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const DEFAULT_PAGINATION_CONFIG: PaginationConfig = {
    defaultPageSize: DEFAULT_PAGE_SIZE,
    pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
    showPageSize: true,
    showPageInfo: true,
    showPageNavigator: true,
    showFirstLastButtons: true,
    maxVisiblePages: 5,
};

/**
 * ============================================
 * TABLE DEFAULTS
 * ============================================
 */

export const DEFAULT_TABLE_CONFIG: Partial<DataTableConfig<unknown>> = {
    features: {
        sorting: true,
        filtering: true,
        pagination: true,
        selection: true,
        search: true,
        export: true,
    },
    defaultPageSize: DEFAULT_PAGE_SIZE,
    pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
    enableRowSelection: true,
    enableMultiRowSelection: true,
};

/**
 * ============================================
 * SEARCH DEFAULTS
 * ============================================
 */

/** Debounce delay for search input (ms) */
export const SEARCH_DEBOUNCE_DELAY = 300;

/** Minimum search length to trigger */
export const MIN_SEARCH_LENGTH = 2;

/**
 * ============================================
 * COLUMN DEFAULTS
 * ============================================
 */

/** Default column width (px) */
export const DEFAULT_COLUMN_WIDTH = 150;

/** Minimum column width (px) */
export const MIN_COLUMN_WIDTH = 50;

/** Maximum column width (px) */
export const MAX_COLUMN_WIDTH = 1000;

/**
 * ============================================
 * SELECTION DEFAULTS
 * ============================================
 */

/** Enable multi-row selection by default */
export const DEFAULT_MULTI_ROW_SELECTION = true;

/** Maximum number of selectable rows (0 = unlimited) */
export const DEFAULT_MAX_SELECTIONS = 0;

/**
 * ============================================
 * STORAGE KEYS
 * ============================================
 */

/** LocalStorage key prefix */
export const STORAGE_KEY_PREFIX = 'datatable';

/** Column preferences storage key template */
export const COLUMN_PREFERENCES_KEY = (tableId: string) =>
    `${STORAGE_KEY_PREFIX}.${tableId}.columns`;

/** Selection storage key template (not persisted by default) */
export const SELECTION_KEY = (tableId: string) =>
    `${STORAGE_KEY_PREFIX}.${tableId}.selection`;

/**
 * ============================================
 * URL PARAM NAMES
 * ============================================
 */

export const URL_PARAMS = {
    SORT: 'sort',
    PAGE: 'page',
    PAGE_SIZE: 'pageSize',
    SEARCH: 'search',
    FILTERS: 'filters',
} as const;

/**
 * ============================================
 * SORT PARAMS
 * ============================================
 */

/** Sort param separator (e.g., "name:asc,email:desc") */
export const SORT_SEPARATOR = ',';

/** Sort direction separator (e.g., "name:asc") */
export const SORT_DIRECTION_SEPARATOR = ':';

/** Sort direction values */
export const SORT_DIRECTIONS = {
    ASC: 'asc',
    DESC: 'desc',
} as const;

/**
 * ============================================
 * FILTER PARAMS
 * ============================================
 */

/** Filter param separator (e.g., "status:eq:active|role:in:admin,user") */
export const FILTER_SEPARATOR = '|';

/** Filter parts separator (e.g., "status:eq:active") */
export const FILTER_PARTS_SEPARATOR = ':';

/** Filter value array separator (e.g., "admin,user") */
export const FILTER_ARRAY_SEPARATOR = ',';

/**
 * ============================================
 * EXPORT DEFAULTS
 * ============================================
 */

export const DEFAULT_EXPORT_FILE_NAME = 'export';

export const EXPORT_MIME_TYPES = {
    csv: 'text/csv',
    excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pdf: 'application/pdf',
    json: 'application/json',
} as const;

export const EXPORT_FILE_EXTENSIONS = {
    csv: '.csv',
    excel: '.xlsx',
    pdf: '.pdf',
    json: '.json',
} as const;

/**
 * ============================================
 * ANIMATION DURATIONS (ms)
 * ============================================
 */

export const ANIMATION_DURATION = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
} as const;

/**
 * ============================================
 * RESPONSIVE BREAKPOINTS (px)
 * ============================================
 */

export const BREAKPOINTS = {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
} as const;

/**
 * ============================================
 * Z-INDEX LAYERS
 * ============================================
 */

export const Z_INDEX = {
    DROPDOWN: 50,
    MODAL: 100,
    TOOLTIP: 200,
    TOAST: 300,
} as const;

/**
 * ============================================
 * ARIA LABELS
 * ============================================
 */

export const ARIA_LABELS = {
    TABLE: 'Data table',
    TOOLBAR: 'Table toolbar',
    PAGINATION: 'Table pagination',
    SEARCH: 'Search table',
    SORT_ASC: 'Sort ascending',
    SORT_DESC: 'Sort descending',
    CLEAR_SORT: 'Clear sort',
    FILTER: 'Filter column',
    CLEAR_FILTER: 'Clear filter',
    SELECT_ROW: 'Select row',
    SELECT_ALL: 'Select all rows',
    COLUMN_VISIBILITY: 'Toggle column visibility',
    EXPORT: 'Export data',
    PAGE_SIZE: 'Rows per page',
    NEXT_PAGE: 'Next page',
    PREVIOUS_PAGE: 'Previous page',
    FIRST_PAGE: 'First page',
    LAST_PAGE: 'Last page',
} as const;

/**
 * ============================================
 * ERROR MESSAGES
 * ============================================
 */

export const ERROR_MESSAGES = {
    FETCH_FAILED: 'Failed to fetch table data',
    EXPORT_FAILED: 'Failed to export data',
    INVALID_PAGE: 'Invalid page number',
    INVALID_PAGE_SIZE: 'Invalid page size',
    INVALID_SORT: 'Invalid sort configuration',
    NO_DATA: 'No data available',
} as const;

/**
 * ============================================
 * FEATURE FLAGS
 * ============================================
 */

export const FEATURE_FLAGS = {
    /** Enable virtual scrolling (experimental) */
    VIRTUAL_SCROLLING: false,

    /** Enable row expanding (experimental) */
    ROW_EXPANDING: false,

    /** Enable column grouping */
    COLUMN_GROUPING: false,

    /** Enable server-side filtering UI */
    SERVER_FILTERING: false,

    /** Enable saved views */
    SAVED_VIEWS: false,
} as const;
