/**
 * State Serialization Utilities
 * 
 * Helpers for serializing/deserializing complex state objects.
 * Used for URL persistence and cache keys.
 */

import type { SortingState, PaginationState, FilterState, ColumnPreferences } from '../../types';

/**
 * ============================================
 * JSON SERIALIZATION
 * ============================================
 */

/**
 * Safe JSON stringify
 * Handles undefined, Date, and other special values
 */
export function safeStringify(value: unknown): string {
    try {
        return JSON.stringify(value, (_, val) => {
            // Convert undefined to null
            if (val === undefined) return null;
            // Convert Date to ISO string
            if (val instanceof Date) return val.toISOString();
            return val;
        });
    } catch {
        return '';
    }
}

/**
 * Safe JSON parse
 * Returns default value on error
 */
export function safeParse<T>(value: string, defaultValue: T): T {
    try {
        return JSON.parse(value) as T;
    } catch {
        return defaultValue;
    }
}

/**
 * ============================================
 * STATE SERIALIZATION
 * ============================================
 */

/**
 * Serialize table state to string (for cache keys)
 */
export interface SerializableTableState {
    sorting?: SortingState[];
    pagination?: PaginationState;
    search?: string;
    filters?: FilterState[];
}

export function serializeTableState(state: SerializableTableState): string {
    const normalized = {
        sorting: state.sorting?.length ? state.sorting : undefined,
        pagination: state.pagination,
        search: state.search?.trim() || undefined,
        filters: state.filters?.length ? state.filters : undefined,
    };

    return safeStringify(normalized);
}

/**
 * Deserialize table state from string
 */
export function deserializeTableState(serialized: string): SerializableTableState {
    return safeParse<SerializableTableState>(serialized, {});
}

/**
 * ============================================
 * COLUMN PREFERENCES SERIALIZATION
 * ============================================
 */

/**
 * Serialize column preferences for localStorage
 */
export function serializeColumnPreferences(prefs: ColumnPreferences): string {
    return safeStringify({
        visibility: prefs.visibility,
        order: prefs.order,
        sizing: prefs.sizing,
        pinning: prefs.pinning,
        version: 1, // For migration
        updatedAt: Date.now(),
    });
}

/**
 * Deserialize column preferences from localStorage
 */
export function deserializeColumnPreferences(
    serialized: string,
    defaults: ColumnPreferences
): ColumnPreferences {
    const parsed = safeParse<ColumnPreferences>(serialized, {
        order: [],
        visibility: {},
        sizing: {},
        pinning: { left: [], right: [] },
    });

    return {
        visibility: parsed.visibility || defaults.visibility,
        order: parsed.order || defaults.order,
        sizing: parsed.sizing || defaults.sizing,
        pinning: parsed.pinning || defaults.pinning,
    };
}

/**
 * ============================================
 * HASH GENERATION
 * ============================================
 */

/**
 * Generate stable hash from object
 * Useful for cache keys and comparison
 * 
 * @example
 * ```ts
 * generateHash({ page: 1, limit: 25 }) // → "page:1|limit:25"
 * ```
 */
export function generateHash(obj: Record<string, unknown>): string {
    const keys = Object.keys(obj).sort();
    return keys
        .map((key) => `${key}:${obj[key]}`)
        .join('|');
}

/**
 * ============================================
 * DEEP COMPARISON
 * ============================================
 */

/**
 * Deep equality check for objects
 * Used to prevent unnecessary re-renders
 */
export function deepEqual(a: unknown, b: unknown): boolean {
    if (a === b) return true;

    if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
        return false;
    }

    const keysA = Object.keys(a as object);
    const keysB = Object.keys(b as object);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
        if (!keysB.includes(key)) return false;
        if (!deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) return false;
    }

    return true;
}

/**
 * ============================================
 * CACHE KEY GENERATION
 * ============================================
 */

/**
 * Generate TanStack Query cache key from table state
 * 
 * @example
 * ```ts
 * generateCacheKey('users', {
 *   sorting: [{ id: 'name', desc: false }],
 *   pagination: { pageIndex: 0, pageSize: 25 }
 * })
 * // → ['table', 'users', '{"sorting":[{"id":"name","desc":false}],...}']
 * ```
 */
export function generateCacheKey(
    tableId: string,
    state: SerializableTableState
): string[] {
    const serialized = serializeTableState(state);
    return ['table', tableId, serialized];
}

/**
 * ============================================
 * URL ENCODING
 * ============================================
 */

/**
 * Encode object to URL-safe base64 string
 * Useful for complex filter state in URL
 */
export function encodeToBase64(obj: unknown): string {
    try {
        const json = JSON.stringify(obj);
        // Browser'da btoa kullan
        if (typeof window !== 'undefined') {
            return btoa(encodeURIComponent(json));
        }
        // Node'da Buffer kullan
        return Buffer.from(json).toString('base64');
    } catch {
        return '';
    }
}

/**
 * Decode URL-safe base64 string to object
 */
export function decodeFromBase64<T>(encoded: string, defaultValue: T): T {
    try {
        // Browser'da atob kullan
        let json: string;
        if (typeof window !== 'undefined') {
            json = decodeURIComponent(atob(encoded));
        } else {
            // Node'da Buffer kullan
            json = Buffer.from(encoded, 'base64').toString();
        }
        return JSON.parse(json) as T;
    } catch {
        return defaultValue;
    }
}
