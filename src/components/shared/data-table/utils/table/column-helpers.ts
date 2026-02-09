/**
 * Column Helper Utilities
 * 
 * Helpers for manipulating column definitions and preferences.
 */

import type { ColumnDef } from '@tanstack/react-table';

/**
 * Get visible columns from visibility state
 * 
 * @example
 * ```ts
 * const visibleColumns = getVisibleColumns(allColumns, { email: true, phone: false });
 * // Returns only columns where visibility is true
 * ```
 */
export function getVisibleColumns<TData>(
    columns: ColumnDef<TData, unknown>[],
    visibility: Record<string, boolean>
): ColumnDef<TData, unknown>[] {
    return columns.filter((column) => {
        const columnId = (column as ColumnDef<TData, unknown>).id;
        if (!columnId) return true; // Show columns without ID
        return visibility[columnId] !== false; // Show if not explicitly hidden
    });
}

/**
 * Reorder columns based on order array
 * 
 * @example
 * ```ts
 * const reordered = reorderColumns(columns, ['email', 'name', 'role']);
 * ```
 */
export function reorderColumns<TData>(
    columns: ColumnDef<TData, unknown>[],
    order: string[]
): ColumnDef<TData, unknown>[] {
    if (!order || order.length === 0) return columns;

    // Create a map of columns by ID
    const columnMap = new Map<string, ColumnDef<TData, unknown>>();
    const columnsWithoutId: ColumnDef<TData, unknown>[] = [];

    columns.forEach((column) => {
        const columnId = (column as ColumnDef<TData, unknown>).id;
        if (columnId) {
            columnMap.set(columnId, column);
        } else {
            columnsWithoutId.push(column);
        }
    });

    // Reorder based on order array
    const ordered: ColumnDef<TData, unknown>[] = [];

    order.forEach((id) => {
        const column = columnMap.get(id);
        if (column) {
            ordered.push(column);
            columnMap.delete(id);
        }
    });

    // Add remaining columns (not in order array)
    columnMap.forEach((column) => {
        ordered.push(column);
    });

    // Add columns without ID at the end
    ordered.push(...columnsWithoutId);

    return ordered;
}

/**
 * Get column by ID
 * 
 * @example
 * ```ts
 * const emailColumn = getColumnById(columns, 'email');
 * ```
 */
export function getColumnById<TData>(
    columns: ColumnDef<TData, unknown>[],
    id: string
): ColumnDef<TData, unknown> | undefined {
    return columns.find((column) => {
        const columnId = (column as ColumnDef<TData, unknown>).id;
        return columnId === id;
    });
}

/**
 * Get column IDs from column definitions
 * 
 * @example
 * ```ts
 * const ids = getColumnIds(columns);
 * // → ['email', 'name', 'role']
 * ```
 */
export function getColumnIds<TData>(columns: ColumnDef<TData, unknown>[]): string[] {
    return columns
        .map((column) => (column as ColumnDef<TData, unknown>).id)
        .filter((id): id is string => id !== undefined && id !== '');
}

/**
 * Create default visibility state (all visible)
 * 
 * @example
 * ```ts
 * const visibility = createDefaultVisibility(columns);
 * // → { email: true, name: true, role: true }
 * ```
 */
export function createDefaultVisibility<TData>(
    columns: ColumnDef<TData, unknown>[]
): Record<string, boolean> {
    const visibility: Record<string, boolean> = {};

    columns.forEach((column) => {
        const columnId = (column as ColumnDef<TData, unknown>).id;
        if (columnId) {
            visibility[columnId] = true;
        }
    });

    return visibility;
}

/**
 * Create default column order
 * 
 * @example
 * ```ts
 * const order = createDefaultOrder(columns);
 * // → ['email', 'name', 'role']
 * ```
 */
export function createDefaultOrder<TData>(
    columns: ColumnDef<TData, unknown>[]
): string[] {
    return getColumnIds(columns);
}

/**
 * Create default column sizing
 * 
 * @example
 * ```ts
 * const sizing = createDefaultSizing(columns, 150);
 * // → { email: 150, name: 150, role: 150 }
 * ```
 */
export function createDefaultSizing<TData>(
    columns: ColumnDef<TData, unknown>[],
    defaultSize: number = 150
): Record<string, number> {
    const sizing: Record<string, number> = {};

    columns.forEach((column) => {
        const columnId = (column as ColumnDef<TData, unknown>).id;
        if (columnId) {
            sizing[columnId] = (column as ColumnDef<TData, unknown>).size || defaultSize;
        }
    });

    return sizing;
}

/**
 * Get pinned columns (left and right)
 * 
 * @example
 * ```ts
 * const { left, right } = getPinnedColumns(columns, pinning);
 * ```
 */
export function getPinnedColumns<TData>(
    columns: ColumnDef<TData, unknown>[],
    pinning: { left: string[]; right: string[] }
): {
    left: ColumnDef<TData, unknown>[];
    center: ColumnDef<TData, unknown>[];
    right: ColumnDef<TData, unknown>[];
} {
    const left: ColumnDef<TData, unknown>[] = [];
    const center: ColumnDef<TData, unknown>[] = [];
    const right: ColumnDef<TData, unknown>[] = [];

    columns.forEach((column) => {
        const columnId = (column as ColumnDef<TData, unknown>).id;

        if (columnId && pinning.left.includes(columnId)) {
            left.push(column);
        } else if (columnId && pinning.right.includes(columnId)) {
            right.push(column);
        } else {
            center.push(column);
        }
    });

    return { left, center, right };
}

/**
 * Check if column is pinned
 * 
 * @example
 * ```ts
 * const isPinned = isColumnPinned('email', pinning);
 * // → 'left' | 'right' | false
 * ```
 */
export function isColumnPinned(
    columnId: string,
    pinning: { left: string[]; right: string[] }
): 'left' | 'right' | false {
    if (pinning.left.includes(columnId)) return 'left';
    if (pinning.right.includes(columnId)) return 'right';
    return false;
}

/**
 * Toggle column in pinning state
 * 
 * @example
 * ```ts
 * const newPinning = toggleColumnPin('email', 'left', currentPinning);
 * ```
 */
export function toggleColumnPin(
    columnId: string,
    position: 'left' | 'right',
    currentPinning: { left: string[]; right: string[] }
): { left: string[]; right: string[] } {
    const newPinning = {
        left: [...currentPinning.left],
        right: [...currentPinning.right],
    };

    // Remove from both sides first
    newPinning.left = newPinning.left.filter((id) => id !== columnId);
    newPinning.right = newPinning.right.filter((id) => id !== columnId);

    // Add to specified position
    if (position === 'left') {
        newPinning.left.push(columnId);
    } else {
        newPinning.right.push(columnId);
    }

    return newPinning;
}

/**
 * Unpin column
 * 
 * @example
 * ```ts
 * const newPinning = unpinColumn('email', currentPinning);
 * ```
 */
export function unpinColumn(
    columnId: string,
    currentPinning: { left: string[]; right: string[] }
): { left: string[]; right: string[] } {
    return {
        left: currentPinning.left.filter((id) => id !== columnId),
        right: currentPinning.right.filter((id) => id !== columnId),
    };
}
