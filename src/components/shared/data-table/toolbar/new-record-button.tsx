/**
 * NewRecordButton Component
 *
 * Toolbar button/link for creating a new record.
 * Supports either href (navigation) or onClick (e.g. open drawer).
 * Slightly more prominent style than other toolbar buttons.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Plus, SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Route } from 'next';

export interface NewRecordButtonProps {
    /** Navigation href - when provided, renders as Link */
    href?: string;

    /** Click handler - when href is not provided, renders as Button with onClick */
    onClick?: () => void;

    /** Tooltip label */
    label?: string;

    /** Custom className */
    className?: string;

    /** Compact mode (icon only) */
    compact?: boolean;

    /** Show label text on button */
    showLabel?: boolean;

    /** Trigger variant */
    triggerVariant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';

    /** Trigger className */
    triggerClassName?: string;

    /** Disabled (only when using onClick) */
    disabled?: boolean;
}

/**
 * NewRecordButton
 *
 * Renders Link when href is provided, otherwise Button with onClick.
 *
 * @example
 * ```tsx
 * <NewRecordButton href="/crm/cariler/new" label="Yeni cari" />
 * <NewRecordButton onClick={() => setDrawerOpen(true)} label="Yeni cari" />
 * ```
 */
export function NewRecordButton({
    href,
    onClick,
    label = 'Yeni kayıt',
    className,
    compact = true,
    showLabel = false,
    triggerVariant = 'outline',
    triggerClassName,
    disabled = false,
}: NewRecordButtonProps) {
    const baseButtonClass = cn(
        'gap-2 rounded-full h-8 transition-all duration-300',
        compact ? 'w-8' : 'px-3',
        'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground',
        // 'bg-[#0b57d0] text-white hover:bg-[#0b57d0]/90 hover:text-white',
        triggerClassName
    );

    const content = (
        <>
            <Plus className="size-4" />
            {showLabel && !compact && <span>{label}</span>}
        </>
    );

    if (href) {
        return (
            <span className={cn(className)}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant={triggerVariant}
                            size={compact ? 'icon' : 'default'}
                            className={baseButtonClass}
                            asChild
                        >
                            <Link href={href as Route}>{content}</Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="flex items-center gap-2">
                            <SendHorizontal className="size-3" />
                            <p>{label}</p>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </span>
        );
    }

    return (
        <span className={cn(className)}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={triggerVariant}
                        size={compact ? 'icon' : 'default'}
                        className={baseButtonClass}
                        onClick={onClick}
                        disabled={disabled}
                    >
                        {content}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="flex items-center gap-2">
                        <Plus className="size-3" />
                        <p>{label}</p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </span>
    );
}
