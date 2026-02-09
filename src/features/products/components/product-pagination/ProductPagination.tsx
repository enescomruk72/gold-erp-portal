"use client";

import * as React from "react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeft,
    ChevronsRight,
    Ellipsis,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { PRODUCTS_PAGINATION_LIMITS } from "../../lib/search-params";

interface ProductPaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}

function generatePageNumbers(
    currentPage: number,
    totalPages: number,
    maxVisible: number
): (number | "ellipsis")[] {
    if (totalPages <= maxVisible) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "ellipsis")[] = [];
    const halfVisible = Math.floor(maxVisible / 2);
    pages.push(1);
    let start = Math.max(2, currentPage - halfVisible);
    let end = Math.min(totalPages - 1, currentPage + halfVisible);
    if (currentPage <= halfVisible + 1) end = maxVisible - 1;
    if (currentPage >= totalPages - halfVisible)
        start = totalPages - maxVisible + 2;
    if (start > 2) pages.push("ellipsis");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("ellipsis");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
}

export function ProductPagination({
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
}: ProductPaginationProps) {
    const maxVisiblePages = 3;
    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;

    const pages = React.useMemo(
        () => generatePageNumbers(currentPage, totalPages, maxVisiblePages),
        [currentPage, totalPages]
    );

    const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);

    const handleClick = (
        e: React.MouseEvent,
        page: number,
        canClick: boolean
    ) => {
        e.preventDefault();
        if (canClick) onPageChange(page);
    };

    if (totalItems === 0) return null;

    return (
        <div className="flex items-center justify-between gap-8 px-4 py-4">
            <div className="flex flex-1 items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap text-sm text-muted-foreground">
                        Sayfa başına:
                    </span>
                    <Select
                        value={pageSize.toString()}
                        onValueChange={(v) => onPageSizeChange(Number(v))}
                    >
                        <SelectTrigger className="h-9 w-[70px] text-sm">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {PRODUCTS_PAGINATION_LIMITS.map((size) => (
                                <SelectItem
                                    key={size}
                                    value={size.toString()}
                                >
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <p>
                        <span className="font-medium text-foreground">
                            {start}-{end}
                        </span>{" "}
                        / {totalItems} ürün
                    </p>
                </div>
            </div>

            {totalPages > 1 && (
                <Pagination className="w-fit max-sm:mx-0">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationLink
                                href="#"
                                aria-label="İlk sayfa"
                                size="icon"
                                className={cn(
                                    "rounded-full",
                                    !hasPreviousPage &&
                                        "pointer-events-none opacity-50"
                                )}
                                onClick={(e) =>
                                    handleClick(e, 1, hasPreviousPage)
                                }
                                aria-disabled={!hasPreviousPage}
                                tabIndex={!hasPreviousPage ? -1 : undefined}
                            >
                                <ChevronsLeft className="size-4" />
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink
                                href="#"
                                aria-label="Önceki sayfa"
                                size="icon"
                                className={cn(
                                    "rounded-full",
                                    !hasPreviousPage &&
                                        "pointer-events-none opacity-50"
                                )}
                                onClick={(e) =>
                                    handleClick(
                                        e,
                                        currentPage - 1,
                                        hasPreviousPage
                                    )
                                }
                                aria-disabled={!hasPreviousPage}
                                tabIndex={!hasPreviousPage ? -1 : undefined}
                            >
                                <ChevronLeftIcon className="size-4" />
                            </PaginationLink>
                        </PaginationItem>

                        {pages.map((page, index) => {
                            if (page === "ellipsis") {
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
                                        className="rounded-full"
                                        size="icon"
                                        onClick={(e) =>
                                            handleClick(e, page, true)
                                        }
                                        aria-label={`Sayfa ${page}`}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}

                        <PaginationItem>
                            <PaginationLink
                                href="#"
                                aria-label="Sonraki sayfa"
                                size="icon"
                                className={cn(
                                    "rounded-full",
                                    !hasNextPage &&
                                        "pointer-events-none opacity-50"
                                )}
                                onClick={(e) =>
                                    handleClick(
                                        e,
                                        currentPage + 1,
                                        hasNextPage
                                    )
                                }
                                aria-disabled={!hasNextPage}
                                tabIndex={!hasNextPage ? -1 : undefined}
                            >
                                <ChevronRightIcon className="size-4" />
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink
                                href="#"
                                aria-label="Son sayfa"
                                size="icon"
                                className={cn(
                                    "rounded-full",
                                    !hasNextPage &&
                                        "pointer-events-none opacity-50"
                                )}
                                onClick={(e) =>
                                    handleClick(e, totalPages, hasNextPage)
                                }
                                aria-disabled={!hasNextPage}
                                tabIndex={!hasNextPage ? -1 : undefined}
                            >
                                <ChevronsRight className="size-4" />
                            </PaginationLink>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
