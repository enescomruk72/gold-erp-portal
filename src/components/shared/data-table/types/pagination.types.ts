/**
 * Pagination Types
 * 
 * Type definitions for pagination functionality.
 */

import type { PaginationState } from './table.types';

/**
 * ============================================
 * PAGINATION CONFIG
 * ============================================
 */

export interface PaginationConfig {
    /** Default page size */
    defaultPageSize: number;

    /** Available page size options */
    pageSizeOptions: number[];

    /** Show page size selector */
    showPageSize: boolean;

    /** Show page info (e.g., "Showing 1-10 of 100") */
    showPageInfo: boolean;

    /** Show page navigator */
    showPageNavigator: boolean;

    /** Show first/last page buttons */
    showFirstLastButtons: boolean;

    /** Maximum visible page buttons */
    maxVisiblePages: number;
}

/**
 * Default pagination config
 */
export const DEFAULT_PAGINATION_CONFIG: PaginationConfig = {
    defaultPageSize: 25,
    pageSizeOptions: [10, 25, 50, 100],
    showPageSize: true,
    showPageInfo: true,
    showPageNavigator: true,
    showFirstLastButtons: true,
    maxVisiblePages: 5,
};

/**
 * ============================================
 * PAGINATION INFO
 * ============================================
 */

export interface PaginationInfo {
    /** Current page (1-based) */
    currentPage: number;

    /** Total pages */
    totalPages: number;

    /** Page size */
    pageSize: number;

    /** Total items */
    total: number;

    /** Start index (1-based for display) */
    startIndex: number;

    /** End index (1-based for display) */
    endIndex: number;

    /** Items on current page */
    currentPageSize: number;

    /** Has next page */
    hasNextPage: boolean;

    /** Has previous page */
    hasPreviousPage: boolean;

    /** Is first page */
    isFirstPage: boolean;

    /** Is last page */
    isLastPage: boolean;
}

/**
 * ============================================
 * PAGE NAVIGATOR
 * ============================================
 */

export interface PageButton {
    /** Page number (1-based) */
    page: number;

    /** Is current page */
    isCurrent: boolean;

    /** Is ellipsis (...) */
    isEllipsis: boolean;

    /** Display label */
    label: string;
}

/**
 * Page navigator state
 */
export interface PageNavigatorState {
    /** Visible page buttons */
    buttons: PageButton[];

    /** Can go to first page */
    canGoToFirst: boolean;

    /** Can go to previous page */
    canGoToPrevious: boolean;

    /** Can go to next page */
    canGoToNext: boolean;

    /** Can go to last page */
    canGoToLast: boolean;
}

/**
 * ============================================
 * PAGINATION ACTIONS
 * ============================================
 */

export interface PaginationActions {
    /** Go to specific page (1-based) */
    goToPage: (page: number) => void;

    /** Go to next page */
    nextPage: () => void;

    /** Go to previous page */
    previousPage: () => void;

    /** Go to first page */
    firstPage: () => void;

    /** Go to last page */
    lastPage: () => void;

    /** Set page size */
    setPageSize: (size: number) => void;

    /** Reset to first page (keeps page size) */
    reset: () => void;
}

/**
 * ============================================
 * PAGINATION HOOK RETURN
 * ============================================
 */

export interface UsePaginationReturn {
    /** Current state */
    state: PaginationState;

    /** Pagination info */
    info: PaginationInfo;

    /** Navigator state */
    navigator: PageNavigatorState;

    /** Actions */
    actions: PaginationActions;

    /** Config */
    config: PaginationConfig;
}

/**
 * ============================================
 * PAGINATION COMPONENT PROPS
 * ============================================
 */

export interface TablePaginationProps {
    /** Total items */
    total: number;

    /** Current pagination state */
    pagination: PaginationState;

    /** On pagination change */
    onPaginationChange: (pagination: PaginationState) => void;

    /** Config overrides */
    config?: Partial<PaginationConfig>;

    /** Custom class name */
    className?: string;

    /** Show loading state */
    isLoading?: boolean;

    /** Disable pagination */
    disabled?: boolean;
}

/**
 * ============================================
 * PAGE SIZE SELECT PROPS
 * ============================================
 */

export interface PageSizeSelectProps {
    /** Current page size */
    value: number;

    /** On change handler */
    onChange: (size: number) => void;

    /** Available options */
    options: number[];

    /** Disabled state */
    disabled?: boolean;

    /** Custom class name */
    className?: string;
}

/**
 * ============================================
 * PAGE INFO PROPS
 * ============================================
 */

export interface PageInfoProps {
    /** Pagination info */
    info: PaginationInfo;

    /** Custom class name */
    className?: string;

    /** Custom format */
    format?: (info: PaginationInfo) => string;
}

/**
 * ============================================
 * PAGE NAVIGATOR PROPS
 * ============================================
 */

export interface PageNavigatorProps {
    /** Navigator state */
    navigator: PageNavigatorState;

    /** Current page */
    currentPage: number;

    /** Total pages */
    totalPages: number;

    /** On page change */
    onPageChange: (page: number) => void;

    /** Show first/last buttons */
    showFirstLast?: boolean;

    /** Disabled state */
    disabled?: boolean;

    /** Custom class name */
    className?: string;
}

/**
 * ============================================
 * UTILITY TYPES
 * ============================================
 */

/**
 * Calculate pagination info from state
 */
export type CalculatePaginationInfo = (
    state: PaginationState,
    total: number
) => PaginationInfo;

/**
 * Generate page buttons for navigator
 */
export type GeneratePageButtons = (
    currentPage: number,
    totalPages: number,
    maxVisible: number
) => PageButton[];
