/**
 * ColumnVisibility Component
 *
 * Popover to toggle column visibility.
 * Shows/hides columns with checkboxes.
 */

'use client';

import * as React from 'react';
import { RotateCcw, Settings2 } from 'lucide-react';
import { type Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DataTableColumnMeta } from '../types';
import { Switch } from '@/components/ui/switch';
import {
    Popover,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

/**
 * ============================================
 * PROPS
 * ============================================
 */

export interface ColumnVisibilityProps<TData> {
    /** TanStack Table instance */
    table: Table<TData>;

    /** Custom className */
    className?: string;

    /** Compact mode */
    compact?: boolean;

    /** Custom trigger label */
    label?: string;

    /** Show label */
    showLabel?: boolean;

    /** Trigger button variant (toolbar'da ghost kullanımı için) */
    triggerVariant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';

    /** Trigger button className (örn. rounded-full h-9 w-9) */
    triggerClassName?: string;
}

/**
 * ============================================
 * COMPONENT
 * ============================================
 */

/**
 * ColumnVisibility
 *
 * Popover to toggle column visibility
 *
 * @example
 * ```tsx
 * <ColumnVisibility table={table.table} />
 * ```
 */
export function ColumnVisibility<TData>({
    table,
    className,
    compact = false,
    label = 'Kolonlar',
    showLabel = true,
    triggerVariant = 'outline',
    triggerClassName,
}: ColumnVisibilityProps<TData>) {
    const [open, setOpen] = React.useState(false);

    const columns = table
        .getAllColumns()
        .filter((column) => column.getCanHide())
        .map((column) => {
            const meta = column.columnDef.meta as DataTableColumnMeta | undefined;
            return {
                id: column.id,
                label: meta?.label || column.id,
                isVisible: column.getIsVisible(),
                toggleVisibility: () => column.toggleVisibility(),
            };
        });

    const visibleCount = columns.filter((col) => col.isVisible).length;
    const totalCount = columns.length;
    const allVisible = table.getIsAllColumnsVisible();

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <Button
                                variant={triggerVariant}
                                size={compact ? 'icon' : 'default'}
                                className={cn(
                                    'gap-2 rounded-full h-8 w-8 transition-all duration-300',
                                    'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary',
                                    triggerClassName,
                                    className
                                )}
                            >
                                <Settings2 className="size-4" />
                                {showLabel && !compact && (
                                    <span>
                                        {label}
                                        <span className="ml-1 text-xs text-muted-foreground">
                                            ({visibleCount}/{totalCount})
                                        </span>
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="flex items-center gap-2">
                            <Settings2 className="size-3" />
                            <p>Kolonları göster / gizle</p>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <PopoverContent
                align="end"
                sideOffset={8}
                className="w-64 p-0 rounded-lg border bg-popover shadow-lg"
            >
                <PopoverHeader className="px-3 py-2.5 border-b">
                    <PopoverTitle className="text-sm font-medium">
                        Sütun görünürlüğü
                    </PopoverTitle>
                </PopoverHeader>

                <div className="max-h-[min(60vh,320px)] overflow-y-auto">
                    {columns.map((column) => (
                        <label
                            key={column.id}
                            className={cn(
                                'flex items-center justify-between gap-2 cursor-pointer',
                                'px-3 py-2 text-sm hover:bg-muted/60 transition-colors',
                                'border-b border-border/60 last:border-b-0'
                            )}
                        >
                            <span className="truncate capitalize text-foreground">
                                {column.label}
                            </span>
                            <Switch
                                checked={column.isVisible}
                                onCheckedChange={column.toggleVisibility}
                                className="shrink-0"
                            />
                        </label>
                    ))}
                </div>

                <div className="p-2 border-t bg-muted/30 rounded-b-lg">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center gap-1.5 text-muted-foreground hover:text-foreground"
                        disabled={allVisible}
                        onClick={() => {
                            table.resetColumnVisibility();
                        }}
                    >
                        <RotateCcw className="size-3.5" />
                        Sıfırla
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

/**
 * Memoized version
 */
export const MemoizedColumnVisibility = React.memo(ColumnVisibility) as typeof ColumnVisibility;
