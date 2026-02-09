/**
 * RowActions Component
 * 
 * Actions dropdown menu for table rows.
 * Provides quick access to row-specific actions.
 */

'use client';

import * as React from 'react';
import { MoreHorizontal, Pencil, Trash2, Copy, Eye } from 'lucide-react';
import { type Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

/**
 * ============================================
 * PROPS
 * ============================================
 */

export interface RowAction<TData> {
    /** Action label */
    label: string;

    /** Action icon */
    icon?: React.ComponentType<{ className?: string }>;

    /** Click handler */
    onClick: (row: Row<TData>) => void;

    /** Disabled */
    disabled?: boolean | ((row: Row<TData>) => boolean);

    /** Variant */
    variant?: 'default' | 'destructive';
}

export interface RowActionsProps<TData> {
    /** TanStack Table row */
    row: Row<TData>;

    /** Actions */
    actions?: RowAction<TData>[];

    /** Quick actions (common patterns) */
    quickActions?: {
        onView?: (row: Row<TData>) => void;
        onEdit?: (row: Row<TData>) => void;
        onCopy?: (row: Row<TData>) => void;
        onDelete?: (row: Row<TData>) => void;
    };

    /** Custom className */
    className?: string;

    /** Compact mode */
    compact?: boolean;
}

/**
 * ============================================
 * COMPONENT
 * ============================================
 */

/**
 * RowActions
 * 
 * Dropdown menu with row actions
 * 
 * @example
 * ```tsx
 * // In column definition:
 * {
 *   id: 'actions',
 *   cell: ({ row }) => (
 *     <RowActions
 *       row={row}
 *       quickActions={{
 *         onEdit: (row) => router.push(`/edit/${row.original.id}`),
 *         onDelete: (row) => deleteRow(row.original.id),
 *       }}
 *     />
 *   )
 * }
 * ```
 */
export function RowActions<TData>({
    row,
    actions = [],
    quickActions,
    className,
    compact = false,
}: RowActionsProps<TData>) {
    // Build actions from quick actions
    const builtActions = React.useMemo(() => {
        const result: RowAction<TData>[] = [];

        if (quickActions?.onView) {
            result.push({
                label: 'Görüntüle',
                icon: Eye,
                onClick: quickActions.onView,
            });
        }

        if (quickActions?.onEdit) {
            result.push({
                label: 'Düzenle',
                icon: Pencil,
                onClick: quickActions.onEdit,
            });
        }

        if (quickActions?.onCopy) {
            result.push({
                label: 'Kopyala',
                icon: Copy,
                onClick: quickActions.onCopy,
            });
        }

        if (quickActions?.onDelete) {
            if (result.length > 0) {
                // Add separator before destructive action
            }
            result.push({
                label: 'Sil',
                icon: Trash2,
                onClick: quickActions.onDelete,
                variant: 'destructive',
            });
        }

        return [...result, ...actions];
    }, [actions, quickActions]);

    // Don't render if no actions
    if (builtActions.length === 0) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        'h-8 w-8 p-0 data-[state=open]:bg-accent',
                        className
                    )}
                    aria-label="İşlemler"
                >
                    <MoreHorizontal className={cn(compact ? 'h-3 w-3' : 'h-4 w-4')} />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {builtActions.map((action, index) => {
                    const Icon = action.icon;
                    const isDisabled =
                        typeof action.disabled === 'function'
                            ? action.disabled(row)
                            : action.disabled;

                    // Separator before destructive actions
                    const needsSeparator =
                        index > 0 &&
                        action.variant === 'destructive' &&
                        builtActions[index - 1]?.variant !== 'destructive';

                    return (
                        <React.Fragment key={action.label}>
                            {needsSeparator && <DropdownMenuSeparator />}
                            <DropdownMenuItem
                                onClick={() => action.onClick(row)}
                                disabled={isDisabled}
                                className={cn(
                                    action.variant === 'destructive' &&
                                        'text-destructive focus:text-destructive'
                                )}
                            >
                                {Icon && <Icon className="mr-2 h-4 w-4" />}
                                {action.label}
                            </DropdownMenuItem>
                        </React.Fragment>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/**
 * Memoized version
 */
export const MemoizedRowActions = React.memo(RowActions) as typeof RowActions;
