/**
 * Pagination URL State Hook
 * 
 * Manages pagination state in URL using nuqs.
 * Syncs with TanStack Table pagination state format.
 */

'use client';

import { useCallback, useMemo } from 'react';
import { parseAsInteger, useQueryState } from 'nuqs';
import type { PaginationState } from '../../../types';
import { URL_PARAMS, DEFAULT_PAGE_SIZE } from '../../../config';

/**
 * usePagination Hook
 * 
 * Backend format: ?page=1&pageSize=25 (1-based)
 * TanStack Table format: { pageIndex: 0, pageSize: 25 } (0-based)
 * 
 * @example
 * ```tsx
 * const pagination = usePagination();
 * 
 * // Get current pagination
 * console.log(pagination.value); // { pageIndex: 0, pageSize: 25 }
 * 
 * // Set pagination
 * pagination.set({ pageIndex: 1, pageSize: 50 });
 * 
 * // Set page only
 * pagination.setPage(2);
 * 
 * // Set page size only
 * pagination.setPageSize(100);
 * 
 * // Navigate
 * pagination.nextPage();
 * pagination.previousPage();
 * ```
 */
export function usePagination(prefix: string = '', defaultPageSize: number = DEFAULT_PAGE_SIZE) {
    const pageParam = prefix ? `${prefix}_${URL_PARAMS.PAGE}` : URL_PARAMS.PAGE;
    const pageSizeParam = prefix ? `${prefix}_${URL_PARAMS.PAGE_SIZE}` : URL_PARAMS.PAGE_SIZE;

    // URL state (1-based)
    const [page, setPage] = useQueryState(
        pageParam,
        parseAsInteger.withDefault(1)
    );
    const [pageSize, setPageSize] = useQueryState(
        pageSizeParam,
        parseAsInteger.withDefault(defaultPageSize)
    );

    // Convert URL (1-based) → TanStack Table (0-based)
    const value = useMemo<PaginationState>(() => {
        return {
            pageIndex: Math.max(0, (page || 1) - 1), // 1-based → 0-based
            pageSize: pageSize || defaultPageSize,
        };
    }, [page, pageSize, defaultPageSize]);

    // Set pagination (TanStack Table format → URL)
    const set = useCallback(
        (pagination: PaginationState | ((prev: PaginationState) => PaginationState)) => {
            const newPagination = typeof pagination === 'function' ? pagination(value) : pagination;

            // Convert 0-based → 1-based
            const newPage = newPagination.pageIndex + 1;
            const newPageSize = newPagination.pageSize;

            // Update URL (batch)
            setPage(newPage);
            setPageSize(newPageSize);
        },
        [value, setPage, setPageSize]
    );

    // Set page only
    const setPageOnly = useCallback(
        (pageIndex: number) => {
            const newPage = Math.max(1, pageIndex + 1); // 0-based → 1-based
            setPage(newPage);
        },
        [setPage]
    );

    // Set page size only (resets to page 1)
    const setPageSizeOnly = useCallback(
        (size: number) => {
            setPageSize(size);
            setPage(1); // Reset to first page
        },
        [setPage, setPageSize]
    );

    // Next page
    const nextPage = useCallback(() => {
        setPage((prev) => (prev || 1) + 1);
    }, [setPage]);

    // Previous page
    const previousPage = useCallback(() => {
        setPage((prev) => Math.max(1, (prev || 1) - 1));
    }, [setPage]);

    // Go to first page
    const firstPage = useCallback(() => {
        setPage(1);
    }, [setPage]);

    // Go to last page
    const lastPage = useCallback(
        (totalPages: number) => {
            setPage(totalPages);
        },
        [setPage]
    );

    // Reset to defaults
    const reset = useCallback(() => {
        setPage(1);
        setPageSize(defaultPageSize);
    }, [setPage, setPageSize, defaultPageSize]);

    // Can navigate?
    const canPreviousPage = useMemo(() => value.pageIndex > 0, [value.pageIndex]);
    const canNextPage = useCallback(
        (totalPages: number) => value.pageIndex < totalPages - 1,
        [value.pageIndex]
    );

    return {
        /** Current pagination state (TanStack Table format, 0-based) */
        value,

        /** Set pagination */
        set,

        /** Set page only (0-based) */
        setPage: setPageOnly,

        /** Set page size only */
        setPageSize: setPageSizeOnly,

        /** Go to next page */
        nextPage,

        /** Go to previous page */
        previousPage,

        /** Go to first page */
        firstPage,

        /** Go to last page */
        lastPage,

        /** Reset to defaults */
        reset,

        /** Can go to previous page */
        canPreviousPage,

        /** Can go to next page */
        canNextPage,

        /** Raw URL values (1-based, for debugging) */
        rawPage: page,
        rawPageSize: pageSize,
    };
}

/**
 * Type for usePagination return value
 */
export type UsePaginationReturn = ReturnType<typeof usePagination>;
