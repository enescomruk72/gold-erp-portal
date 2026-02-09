'use client';

import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { GridCardProps } from '../types';

/**
 * GridCard
 *
 * Tek bir grid öğesi: seçim checkbox, tıklanabilir alan, children (içerik).
 */
export function GridCard<TData>({
    item,
    index,
    isSelected,
    onToggleSelect,
    selectionEnabled,
    onCardClick,
    className,
    children,
}: GridCardProps<TData>) {
    const handleClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('[data-grid-card-checkbox]')) return;
        onCardClick?.(item);
    };

    return (
        <div
            className={cn(
                'group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:shadow-md',
                isSelected && 'ring-2 ring-primary',
                className
            )}
            data-grid-index={index}
        >
            {selectionEnabled && onToggleSelect && (
                <div
                    className="absolute left-2 top-2 z-10"
                    data-grid-card-checkbox
                    onClick={(e) => e.stopPropagation()}
                >
                    <Checkbox
                        checked={!!isSelected}
                        onCheckedChange={() => onToggleSelect()}
                        aria-label="Seç"
                    />
                </div>
            )}
            <div
                className={cn('flex flex-1 flex-col', onCardClick && 'cursor-pointer')}
                onClick={onCardClick ? handleClick : undefined}
                onKeyDown={
                    onCardClick
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onCardClick(item);
                            }
                        }
                        : undefined
                }
                role={onCardClick ? 'button' : undefined}
                tabIndex={onCardClick ? 0 : undefined}
            >
                {children}
            </div>
        </div>
    );
}
