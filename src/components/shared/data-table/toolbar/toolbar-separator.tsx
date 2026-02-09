/**
 * ToolbarSeparator Component
 * 
 * Visual separator for toolbar items.
 */

'use client';

import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

/**
 * ============================================
 * PROPS
 * ============================================
 */

export interface ToolbarSeparatorProps {
    /** Orientation */
    orientation?: 'vertical' | 'horizontal';

    /** Custom className */
    className?: string;
}

/**
 * ============================================
 * COMPONENT
 * ============================================
 */

/**
 * ToolbarSeparator
 * 
 * Vertical or horizontal separator
 * 
 * @example
 * ```tsx
 * <div className="flex items-center gap-2">
 *   <Button>Action 1</Button>
 *   <ToolbarSeparator />
 *   <Button>Action 2</Button>
 * </div>
 * ```
 */
export function ToolbarSeparator({
    orientation = 'vertical',
    className,
}: ToolbarSeparatorProps) {
    return (
        <Separator
            orientation={orientation}
            className={cn(
                orientation === 'vertical' ? 'h-6' : 'w-full',
                className
            )}
        />
    );
}
