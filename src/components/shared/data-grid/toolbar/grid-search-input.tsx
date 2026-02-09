'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface GridSearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
    placeholder?: string;
    /** Debouncing göstergesi */
    isSearching?: boolean;
    hasSearch?: boolean;
    disabled?: boolean;
    className?: string;
    compact?: boolean;
}

/**
 * Grid arama input'u. URL state (nuqs) useDataGrid içinde senkron; value/onChange/onClear grid'den gelir.
 */
export const GridSearchInput = React.memo(function GridSearchInput({
    value,
    onChange,
    onClear,
    placeholder = 'Ara...',
    isSearching = false,
    hasSearch = false,
    disabled = false,
    className,
    compact = false,
}: GridSearchInputProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleClear = React.useCallback(() => {
        onClear();
        inputRef.current?.focus();
    }, [onClear]);

    return (
        <div className={cn('relative w-full max-w-sm', className)}>
            <Search
                className={cn(
                    'absolute pointer-events-none select-none z-10 text-muted-foreground',
                    compact ? 'left-2 top-2.5 size-4' : 'left-3 top-3 size-4'
                )}
            />
            <Input
                ref={inputRef}
                type="search"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={cn(
                    'pr-20',
                    compact ? 'h-9 pl-8' : 'h-10 pl-9'
                )}
                aria-label="Ara"
            />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 z-10">
                {isSearching && (
                    <div className="flex h-5 w-5 items-center justify-center">
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                    </div>
                )}
                {hasSearch && !isSearching && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        className={cn('h-6 w-6 p-0 hover:bg-transparent', compact && 'h-5 w-5')}
                        aria-label="Aramayı temizle"
                    >
                        <X className={cn(compact ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
                    </Button>
                )}
            </div>
        </div>
    );
});
