/**
 * Query Builder Utilities
 * 
 * URL state'i backend API query params'a dönüştürür.
 * Mevcut backend API pattern'ine uyumlu: ?page=1&limit=10&sortBy=name&sortOrder=asc&search=john
 */

import type { SortingState, PaginationState, FilterState, QueryParams } from '../../types';
import {
    SORT_SEPARATOR,
    SORT_DIRECTION_SEPARATOR,
    SORT_DIRECTIONS,
    FILTER_SEPARATOR,
    FILTER_PARTS_SEPARATOR,
    FILTER_ARRAY_SEPARATOR,
} from '../../config';

/**
 * ============================================
 * BUILD QUERY PARAMS
 * ============================================
 */

export interface BuildQueryParamsInput {
    /** Sorting state (TanStack Table format) */
    sorting?: SortingState[];

    /** Pagination state */
    pagination?: PaginationState;

    /** Global search term */
    search?: string;

    /** Column filters (future) */
    filters?: FilterState[];

    /** Custom additional params */
    customParams?: Record<string, unknown>;
}

/**
 * Build API query params from table state
 * 
 * TanStack Table state → Backend API query params
 * 
 * @example
 * ```ts
 * const params = buildQueryParams({
 *   sorting: [{ id: 'email', desc: false }],
 *   pagination: { pageIndex: 1, pageSize: 25 },
 *   search: 'john'
 * });
 * // → { sortBy: 'email', sortOrder: 'asc', page: 2, limit: 25, search: 'john' }
 * ```
 */
export function buildQueryParams(input: BuildQueryParamsInput): QueryParams {
    const params: QueryParams = {};

    // ====================================
    // 1. SORTING
    // ====================================
    // Backend format: ?sortBy=name&sortOrder=asc
    // TanStack Table: [{ id: 'name', desc: false }]
    if (input.sorting && input.sorting.length > 0) {
        // İlk sorting'i kullan (backend single-column sort destekliyor)
        const firstSort = input.sorting[0];
        params.sortBy = firstSort.id;
        params.sortOrder = firstSort.desc ? SORT_DIRECTIONS.DESC : SORT_DIRECTIONS.ASC;
    }

    // ====================================
    // 2. PAGINATION
    // ====================================
    // Backend format: ?page=1&limit=25 (1-based)
    // TanStack Table: { pageIndex: 0, pageSize: 25 } (0-based)
    if (input.pagination) {
        params.page = input.pagination.pageIndex + 1; // 0-based → 1-based
        params.limit = input.pagination.pageSize;
    }

    // ====================================
    // 3. SEARCH
    // ====================================
    // Backend format: ?search=john
    if (input.search && input.search.trim()) {
        params.search = input.search.trim();
    }

    // ====================================
    // 4. FILTERS (Future)
    // ====================================
    // Backend format: ?filters=status:eq:active|role:in:admin,user
    if (input.filters && input.filters.length > 0) {
        params.filters = serializeFilters(input.filters);
    }

    // ====================================
    // 5. CUSTOM PARAMS
    // ====================================
    if (input.customParams) {
        Object.entries(input.customParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params[key] = value;
            }
        });
    }

    return params;
}

/**
 * ============================================
 * BUILD QUERY URL
 * ============================================
 */

/**
 * Build full URL with query params
 * 
 * @example
 * ```ts
 * buildQueryURL('/api/users', { page: 1, limit: 25, search: 'john' })
 * // → '/api/users?page=1&limit=25&search=john'
 * ```
 */
export function buildQueryURL(baseUrl: string, params: QueryParams): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * ============================================
 * FILTER SERIALIZATION (Future)
 * ============================================
 */

/**
 * Serialize filters to backend format
 * 
 * Format: "columnId:operator:value|columnId:operator:value1,value2"
 * 
 * @example
 * ```ts
 * serializeFilters([
 *   { id: 'status', value: 'active', operator: 'eq' },
 *   { id: 'role', value: ['admin', 'user'], operator: 'in' }
 * ])
 * // → "status:eq:active|role:in:admin,user"
 * ```
 */
export function serializeFilters(filters: FilterState[]): string {
    return filters
        .map((filter) => {
            const { id, value, operator = 'eq' } = filter;

            // Array değerler (in, notIn operatörleri için)
            if (Array.isArray(value)) {
                const arrayValue = value.join(FILTER_ARRAY_SEPARATOR);
                return `${id}${FILTER_PARTS_SEPARATOR}${operator}${FILTER_PARTS_SEPARATOR}${arrayValue}`;
            }

            // Scalar değerler
            return `${id}${FILTER_PARTS_SEPARATOR}${operator}${FILTER_PARTS_SEPARATOR}${value}`;
        })
        .join(FILTER_SEPARATOR);
}

/**
 * Deserialize filters from backend format
 * 
 * @example
 * ```ts
 * deserializeFilters("status:eq:active|role:in:admin,user")
 * // → [
 * //   { id: 'status', value: 'active', operator: 'eq' },
 * //   { id: 'role', value: ['admin', 'user'], operator: 'in' }
 * // ]
 * ```
 */
export function deserializeFilters(filtersString: string): FilterState[] {
    if (!filtersString || !filtersString.trim()) {
        return [];
    }

    return filtersString.split(FILTER_SEPARATOR).map((filterStr) => {
        const [id, operator, valueStr] = filterStr.split(FILTER_PARTS_SEPARATOR);

        // Array değerler (in, notIn operatörleri)
        if (operator === 'in' || operator === 'notIn') {
            return {
                id,
                operator: operator as FilterState['operator'],
                value: valueStr.split(FILTER_ARRAY_SEPARATOR),
            };
        }

        // Scalar değerler
        return {
            id,
            operator: operator as FilterState['operator'],
            value: valueStr,
        };
    });
}

/**
 * ============================================
 * SORTING SERIALIZATION
 * ============================================
 */

/**
 * Serialize sorting to backend format
 * 
 * Format: "columnId:direction,columnId:direction"
 * 
 * @example
 * ```ts
 * serializeSorting([
 *   { id: 'name', desc: false },
 *   { id: 'email', desc: true }
 * ])
 * // → "name:asc,email:desc"
 * ```
 */
export function serializeSorting(sorting: SortingState[]): string {
    return sorting
        .map((sort) => {
            const direction = sort.desc ? SORT_DIRECTIONS.DESC : SORT_DIRECTIONS.ASC;
            return `${sort.id}${SORT_DIRECTION_SEPARATOR}${direction}`;
        })
        .join(SORT_SEPARATOR);
}

/**
 * Deserialize sorting from backend format
 * 
 * @example
 * ```ts
 * deserializeSorting("name:asc,email:desc")
 * // → [
 * //   { id: 'name', desc: false },
 * //   { id: 'email', desc: true }
 * // ]
 * ```
 */
export function deserializeSorting(sortString: string): SortingState[] {
    if (!sortString || !sortString.trim()) {
        return [];
    }

    return sortString.split(SORT_SEPARATOR).map((sortStr) => {
        const [id, direction] = sortStr.split(SORT_DIRECTION_SEPARATOR);
        return {
            id,
            desc: direction === SORT_DIRECTIONS.DESC,
        };
    });
}

/**
 * ============================================
 * UTILITY HELPERS
 * ============================================
 */

/**
 * Merge query params with existing params
 * 
 * @example
 * ```ts
 * mergeQueryParams(
 *   { page: 1, limit: 10 },
 *   { search: 'john', limit: 25 }
 * )
 * // → { page: 1, limit: 25, search: 'john' }
 * ```
 */
export function mergeQueryParams(
    baseParams: QueryParams,
    newParams: QueryParams
): QueryParams {
    return { ...baseParams, ...newParams };
}

/**
 * Remove empty values from query params
 * 
 * @example
 * ```ts
 * cleanQueryParams({ page: 1, search: '', limit: undefined })
 * // → { page: 1 }
 * ```
 */
export function cleanQueryParams(params: QueryParams): QueryParams {
    const cleaned: QueryParams = {};

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            cleaned[key] = value;
        }
    });

    return cleaned;
}

/**
 * Convert object to URL search params string
 * 
 * @example
 * ```ts
 * toSearchParamsString({ page: 1, limit: 25 })
 * // → "page=1&limit=25"
 * ```
 */
export function toSearchParamsString(params: QueryParams): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
        }
    });

    return searchParams.toString();
}

/**
 * Parse URL search params to object
 * 
 * @example
 * ```ts
 * fromSearchParamsString("page=1&limit=25")
 * // → { page: '1', limit: '25' }
 * ```
 */
export function fromSearchParamsString(searchString: string): QueryParams {
    const params: QueryParams = {};
    const searchParams = new URLSearchParams(searchString);

    searchParams.forEach((value, key) => {
        params[key] = value;
    });

    return params;
}
