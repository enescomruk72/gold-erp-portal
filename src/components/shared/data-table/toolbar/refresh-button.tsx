/**
 * RefreshButton Component
 *
 * Toolbar button to refresh/refetch table data.
 * Styled to match ColumnVisibility and other toolbar buttons.
 */

'use client';

import * as React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface RefreshButtonProps {
    /** Called when clicked */
    onRefresh: () => void;

    /** Loading/refetching state */
    isLoading?: boolean;

    /** Disabled */
    disabled?: boolean;

    /** Custom className */
    className?: string;

    /** Compact mode (icon only) */
    compact?: boolean;

    /** Tooltip label */
    label?: string;

    /** Trigger variant */
    triggerVariant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';

    /** Trigger className */
    triggerClassName?: string;
}

/**
 * RefreshButton
 *
 * @example
 * ```tsx
 * <RefreshButton
 *   onRefresh={() => table.actions.refetch()}
 *   isLoading={table.query.isFetching}
 * />
 * ```
 */
export function RefreshButton({
    onRefresh,
    isLoading = false,
    disabled = false,
    className,
    compact = true,
    label = 'Tabloyu yenile',
    triggerVariant = 'outline',
    triggerClassName,
}: RefreshButtonProps) {
    return (
        <span className={cn(className)}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={triggerVariant}
                        size={compact ? 'icon' : 'default'}
                        className={cn(
                            'gap-2 rounded-full h-8 transition-all duration-300',
                            compact ? 'w-8' : 'px-3',
                            'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary',
                            // 'bg-[#0b57d0]/10 text-[#0b57d0] hover:bg-[#0b57d0]/20 hover:text-[#0b57d0]',
                            triggerClassName
                        )}
                        onClick={onRefresh}
                        disabled={disabled || isLoading}
                    >
                        <RefreshCw
                            className={cn('size-4', isLoading && 'animate-spin')}
                        />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="flex items-center gap-2">
                        <RefreshCw className="size-3" />
                        <p>{label}</p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </span>
    );
}

/**
 * Memoized version
 */
export const MemoizedRefreshButton = React.memo(RefreshButton); 