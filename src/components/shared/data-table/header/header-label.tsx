/**
 * HeaderLabel Component
 * 
 * Column label with optional tooltip description.
 */

'use client';

import * as React from 'react';
import { HelpCircle } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

/**
 * ============================================
 * PROPS
 * ============================================
 */

export interface HeaderLabelProps {
    /** Label text */
    label: string;

    /** Tooltip description */
    description?: string;

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
 * HeaderLabel
 * 
 * Column label with optional tooltip
 * 
 * @example
 * ```tsx
 * <HeaderLabel
 *   label="E-posta"
 *   description="Müşteri e-posta adresi"
 * />
 * ```
 */
export function HeaderLabel({
    label,
    description,
    className,
    compact = false,
}: HeaderLabelProps) {
    const labelClassName = cn(
        'text-muted-foreground text-xs font-semibold uppercase font-[system-ui]',
        className
    );

    // No description - just label
    if (!description) {
        return <span className={labelClassName}>{label}</span>;
    }

    // With description - show tooltip
    return (
        <div className={cn('flex items-center gap-1.5', className)}>
            <span className={labelClassName}>
                {label}
            </span>

            <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <HelpCircle
                            className={cn(
                                'cursor-help text-muted-foreground',
                                compact ? 'h-3 w-3' : 'h-3.5 w-3.5'
                            )}
                        />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="max-w-xs text-xs">{description}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}

/**
 * Memoized version
 */
export const MemoizedHeaderLabel = React.memo(HeaderLabel);
