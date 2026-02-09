/**
 * PageNavigator Component
 * 
 * Page navigation buttons (First, Previous, Page Numbers, Next, Last).
 */

'use client';

import * as React from 'react';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeft,
    ChevronsRight,
    Ellipsis,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationEllipsis,
} from '@/components/ui/pagination';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import type { PaginationMeta } from '../types';

/**
 * ============================================
 * PROPS
 * ============================================
 */

export interface PageNavigatorProps {
    /** Pagination metadata */
    pagination: PaginationMeta;

    /** Page change handler */
    onPageChange: (page: number) => void;

    /** Show first/last buttons */
    showFirstLast?: boolean;

    /** Max visible page buttons */
    maxVisiblePages?: number;

    /** Custom className */
    className?: string;

    /** Compact mode (reserved for future use) */
    compact?: boolean;

    /** Disabled */
    disabled?: boolean;
}

/**
 * ============================================
 * HELPER
 * ============================================
 */

/**
 * Generate page numbers to display
 * Shows first, last, current, and surrounding pages with ellipsis
 */
function generatePageNumbers(
    currentPage: number,
    totalPages: number,
    maxVisible: number
): (number | 'ellipsis')[] {
    if (totalPages <= maxVisible) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [];
    const halfVisible = Math.floor(maxVisible / 2);

    // Always show first page
    pages.push(1);

    // Calculate range
    let start = Math.max(2, currentPage - halfVisible);
    let end = Math.min(totalPages - 1, currentPage + halfVisible);

    // Adjust if at start
    if (currentPage <= halfVisible + 1) {
        end = maxVisible - 1;
    }

    // Adjust if at end
    if (currentPage >= totalPages - halfVisible) {
        start = totalPages - maxVisible + 2;
    }

    // Add ellipsis before
    if (start > 2) {
        pages.push('ellipsis');
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    // Add ellipsis after
    if (end < totalPages - 1) {
        pages.push('ellipsis');
    }

    // Always show last page
    if (totalPages > 1) {
        pages.push(totalPages);
    }

    return pages;
}

/**
 * ============================================
 * COMPONENT
 * ============================================
 */

/**
 * PageNavigator
 * 
 * Page navigation with buttons
 * 
 * @example
 * ```tsx
 * <PageNavigator
 *   pagination={table.pagination}
 *   onPageChange={(page) => table.actions.setPage(page - 1)}
 * />
 * ```
 */
export function PageNavigator({
    pagination,
    onPageChange,
    showFirstLast = true,
    maxVisiblePages = 3,
    className,
    disabled = false,
}: PageNavigatorProps) {
    const { currentPage, totalPages, hasPreviousPage, hasNextPage } = pagination;

    const pages = React.useMemo(
        () => generatePageNumbers(currentPage, totalPages, maxVisiblePages),
        [currentPage, totalPages, maxVisiblePages]
    );

    const handleClick = (e: React.MouseEvent, page: number, canClick: boolean) => {
        e.preventDefault();
        if (canClick) onPageChange(page);
    };

    return (
        <Pagination className={cn('w-fit max-sm:mx-0', className)}>
            <PaginationContent>
                {/* First page */}
                {showFirstLast && (
                    <PaginationItem>
                        <PaginationLink
                            href="#"
                            aria-label="İlk sayfa"
                            size="icon"
                            className={cn(
                                'rounded-full',
                                (!hasPreviousPage || disabled) &&
                                'pointer-events-none opacity-50'
                            )}
                            onClick={(e) => handleClick(e, 1, hasPreviousPage && !disabled)}
                            aria-disabled={!hasPreviousPage || disabled}
                            tabIndex={!hasPreviousPage || disabled ? -1 : undefined}
                        >
                            <ChevronsLeft className="size-4" />
                        </PaginationLink>
                    </PaginationItem>
                )}

                {/* Previous page */}
                <PaginationItem>
                    <PaginationLink
                        href="#"
                        aria-label="Önceki sayfa"
                        size="icon"
                        className={cn(
                            'rounded-full',
                            (!hasPreviousPage || disabled) &&
                            'pointer-events-none opacity-50'
                        )}
                        onClick={(e) =>
                            handleClick(e, currentPage - 1, hasPreviousPage && !disabled)
                        }
                        aria-disabled={!hasPreviousPage || disabled}
                        tabIndex={!hasPreviousPage || disabled ? -1 : undefined}
                    >
                        <ChevronLeftIcon className="size-4" />
                    </PaginationLink>
                </PaginationItem>

                {/* Page numbers */}
                {pages.map((page, index) => {
                    if (page === 'ellipsis') {
                        return (
                            <PaginationItem key={`ellipsis-${index}`}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="flex cursor-default items-center">
                                            <PaginationEllipsis />
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="flex items-center gap-2">
                                            <Ellipsis className="size-3" />
                                            <p>Diğer sayfalar</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </PaginationItem>
                        );
                    }

                    const isActive = page === currentPage;

                    return (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href={`#${page}`}
                                isActive={isActive}
                                className={cn(
                                    'rounded-full',
                                    disabled && 'pointer-events-none opacity-50'
                                )}
                                size="icon"
                                onClick={(e) => handleClick(e, page, !disabled)}
                                aria-label={`Sayfa ${page}`}
                                aria-disabled={disabled}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                {/* Next page */}
                <PaginationItem>
                    <PaginationLink
                        href="#"
                        aria-label="Sonraki sayfa"
                        size="icon"
                        className={cn(
                            'rounded-full',
                            (!hasNextPage || disabled) &&
                            'pointer-events-none opacity-50'
                        )}
                        onClick={(e) =>
                            handleClick(e, currentPage + 1, hasNextPage && !disabled)
                        }
                        aria-disabled={!hasNextPage || disabled}
                        tabIndex={!hasNextPage || disabled ? -1 : undefined}
                    >
                        <ChevronRightIcon className="size-4" />
                    </PaginationLink>
                </PaginationItem>

                {/* Last page */}
                {showFirstLast && (
                    <PaginationItem>
                        <PaginationLink
                            href="#"
                            aria-label="Son sayfa"
                            size="icon"
                            className={cn(
                                'rounded-full',
                                (!hasNextPage || disabled) &&
                                'pointer-events-none opacity-50'
                            )}
                            onClick={(e) =>
                                handleClick(e, totalPages, hasNextPage && !disabled)
                            }
                            aria-disabled={!hasNextPage || disabled}
                            tabIndex={!hasNextPage || disabled ? -1 : undefined}
                        >
                            <ChevronsRight className="size-4" />
                        </PaginationLink>
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}

/**
 * Memoized version
 */
export const MemoizedPageNavigator = React.memo(PageNavigator);