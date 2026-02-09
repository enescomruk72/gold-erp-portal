/**
 * HeaderActions Component
 * 
 * Actions dropdown menu for column headers.
 * Provides quick access to sort, pin, hide, and filter actions.
 */

'use client';

import * as React from 'react';
import {
    ArrowUp,
    ArrowDown,
    EyeOff,
    PinOff,
    MoreVertical,
    Pin,
    Check,
} from 'lucide-react';
import { type Header } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { DataTableColumnMeta } from '../types';

/**
 * ============================================
 * PROPS
 * ============================================
 */

export interface HeaderActionsProps<TData, TValue> {
    /** TanStack Table header */
    header: Header<TData, TValue>;

    /** Custom className */
    className?: string;

    /** Compact mode (opsiyonel: daha küçük tetikleyici buton) */
    compact?: boolean;
}

/**
 * ============================================
 * COMPONENT
 * ============================================
 */

/**
 * HeaderActions
 * 
 * Dropdown menu with column actions
 * 
 * Available actions (based on column meta):
 * - Sort ascending/descending (if sortable)
 * - Pin left/right/unpin (if pinnable)
 * - Hide column (always available)
 * 
 * @example
 * ```tsx
 * <HeaderActions header={header} />
 * ```
 */
export function HeaderActions<TData, TValue>({
    header,
    className,
    compact = false,
}: HeaderActionsProps<TData, TValue>) {
    const { column } = header;
    const meta = column.columnDef.meta as DataTableColumnMeta | undefined;

    // Check available actions (meta + column API)
    const canSort = meta?.sortable ?? column.getCanSort();
    const canPin = meta?.pinnable ?? false;
    const canHide = column.getCanHide();

    // Get current state
    const isSorted = column.getIsSorted();
    const isPinned = column.getIsPinned();

    // Don't show if no actions available
    if (!canSort && !canPin && !canHide) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size={compact ? 'icon' : 'sm'}
                    className={cn(
                        '-ml-2 p-0 data-[state=open]:bg-accent',
                        compact ? 'h-7 w-7' : 'h-8 w-8',
                        className
                    )}
                    aria-label="Kolon işlemleri"
                >
                    <MoreVertical className={cn(compact ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className={cn('w-48', compact && 'text-xs')}>
                {/* Sort actions */}
                {canSort && (
                    <>
                        <DropdownMenuItem
                            onClick={() => column.toggleSorting(false)}
                            disabled={isSorted === 'asc'}
                        >
                            <ArrowUp className="mr-2 h-4 w-4" />
                            Artan Sırala
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => column.toggleSorting(true)}
                            disabled={isSorted === 'desc'}
                        >
                            <ArrowDown className="mr-2 h-4 w-4" />
                            Azalan Sırala
                        </DropdownMenuItem>
                    </>
                )}

                {canSort && canHide && <DropdownMenuSeparator />}

                {/* Pin actions — sub menu */}
                {canPin && (
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Pin className="mr-2 h-4 w-4" />
                            Sabitle
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className='w-48'>
                            {/* Sabitlemeyi Kaldır — sadece kolon sabitlenmişse göster */}
                            {isPinned && (
                                <DropdownMenuItem
                                    onClick={() => column.pin(false)}
                                >
                                    <PinOff className="mr-2 h-4 w-4" />
                                    Sabitlemeyi Kaldır
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                                onClick={() => column.pin('left')}
                                disabled={isPinned === 'left'}
                            >
                                <Check
                                    className={cn(
                                        'size-4',
                                        isPinned !== 'left' && 'invisible'
                                    )}
                                    aria-hidden={isPinned !== 'left'}
                                />
                                Sola Sabitle
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => column.pin('right')}
                                disabled={isPinned === 'right'}
                            >
                                <Check
                                    className={cn(
                                        'size-4',
                                        isPinned !== 'right' && 'invisible'
                                    )}
                                    aria-hidden={isPinned !== 'right'}
                                />
                                Sağa Sabitle
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                )}

                {canPin && canHide && <DropdownMenuSeparator />}
                {/* Hide action */}
                {canHide && (
                    <DropdownMenuItem
                        onClick={() => column.toggleVisibility(false)}
                    >
                        <EyeOff className="mr-2 h-4 w-4" />
                        Kolonu Gizle
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/**
 * Memoized version
 */
export const MemoizedHeaderActions = React.memo(HeaderActions) as typeof HeaderActions;
