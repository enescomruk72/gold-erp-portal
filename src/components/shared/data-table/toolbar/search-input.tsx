/**
 * SearchInput Component
 * 
 * Debounced global search input for DataTable.
 * Automatically syncs with URL state.
 */

'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { UseSearchReturn } from '../hooks/state/url';

/**
 * ============================================
 * PROPS
 * ============================================
 */

export interface SearchInputProps {
    /** Search state from useSearch hook */
    search: UseSearchReturn;

    /** Placeholder text */
    placeholder?: string;

    /** Custom className */
    className?: string;

    /** Loading state */
    isLoading?: boolean;

    /** Compact mode */
    compact?: boolean;

    /** Disabled */
    disabled?: boolean;
}

/**
 * ============================================
 * COMPONENT
 * ============================================
 */

/**
 * SearchInput
 * 
 * Debounced search input with clear button
 * 
 * @example
 * ```tsx
 * const table = useDataTable({ ... });
 * 
 * <SearchInput
 *   search={table.state.search}
 *   placeholder="Müşteri ara..."
 * />
 * ```
 */
export function SearchInput({
    search,
    placeholder = 'Ara...',
    className,
    isLoading = false,
    compact = false,
    disabled = false,
}: SearchInputProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Handle clear
    const handleClear = React.useCallback(() => {
        search.clear();
        inputRef.current?.focus();
    }, [search]);

    return (
        <div className={cn('relative w-full max-w-sm', className)}>
            {/* Search icon */}
            <Search
                className={cn(
                    'absolute text-muted-foreground pointer-events-none select-none z-1',
                    compact ? 'left-2 top-2.5 size-4' : 'left-3 top-3 size-4'
                )}
            />

            {/* Input */}
            <Input
                ref={inputRef}
                isLoading={isLoading}
                type="search"
                placeholder={placeholder}
                value={search.value}
                onChange={(e) => search.set(e.target.value)}
                disabled={disabled}
                className={cn(
                    'pr-20',
                    compact ? 'h-9 pl-8' : 'h-10 pl-9'
                )}
            />

            {/* Right side: Loading indicator / Clear button / Keyboard hint */}
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 z-1 select-none pointer-events-none">
                {/* Loading indicator (while debouncing) */}
                {search.isSearching && (
                    <div className="flex h-5 w-5 items-center justify-center">
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                    </div>
                )}

                {/* Clear button */}
                {search.hasSearch && !search.isSearching && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        className={cn(
                            'h-6 w-6 p-0 hover:bg-transparent',
                            compact && 'h-5 w-5'
                        )}
                        aria-label="Aramayı temizle"
                    >
                        <X className={cn(compact ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
                    </Button>
                )}
            </div>
        </div>
    );
}

/**
 * Memoized version
 */
export const MemoizedSearchInput = React.memo(SearchInput);
