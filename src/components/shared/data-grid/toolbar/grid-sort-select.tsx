'use client';

import * as React from 'react';
import { ArrowUpDown, ArrowDown, ArrowUp, ArrowUpNarrowWide } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export interface GridSortOption {
    value: string;
    label: string;
}

export interface GridSortSelectProps {
    options: GridSortOption[];
    /** Mevcut sıralama: column id */
    sortBy: string | undefined;
    /** Mevcut yön */
    sortOrder: 'asc' | 'desc';
    onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
    onClear?: () => void;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
}

/**
 * Grid sıralama seçici. URL state (nuqs) useDataGrid/useSorting ile senkron.
 */
export function GridSortSelect({
    options,
    sortBy,
    sortOrder,
    onSortChange,
    onClear,
    disabled = false,
    className,
    placeholder = 'Sırala',
}: GridSortSelectProps) {
    const isMobile = useIsMobile(768);
    const currentOption = options.find((o) => o.value === sortBy);
    const label = currentOption ? currentOption.label : placeholder;
    const hasSort = Boolean(sortBy);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size={isMobile ? "icon" : "default"}
                    disabled={disabled || options.length === 0}
                    className={cn(className)}
                >
                    <ArrowUpNarrowWide className="size-4 shrink-0" />
                    <span className="truncate hidden md:inline-block">{label}</span>
                    {hasSort ? (
                        sortOrder === 'asc' ? (
                            <ArrowUp className="ml-2 h-4 w-4 shrink-0 hidden md:block" />
                        ) : (
                            <ArrowDown className="ml-2 h-4 w-4 shrink-0 hidden md:block" />
                        )
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground hidden md:block" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[180px]">
                {options.map((opt) => (
                    <React.Fragment key={opt.value}>
                        <DropdownMenuItem
                            onClick={() =>
                                onSortChange(
                                    opt.value,
                                    sortBy === opt.value && sortOrder === 'asc' ? 'desc' : 'asc'
                                )
                            }
                        >
                            <span className="flex-1">{opt.label}</span>
                            {sortBy === opt.value && (
                                <span className="text-muted-foreground text-xs">
                                    {sortOrder === 'asc' ? 'A→Z' : 'Z→A'}
                                </span>
                            )}
                        </DropdownMenuItem>
                    </React.Fragment>
                ))}
                {hasSort && onClear && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onClear}>
                            Sıralamayı kaldır
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
