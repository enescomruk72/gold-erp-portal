"use client";

import { ArrowUpDown } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ProductSearch } from "./ProductSearch";
import { PRODUCTS_SORT_OPTIONS } from "../../lib/search-params";

interface ProductToolbarProps {
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    sortValue?: string;
    onSortChange?: (value: string) => void;
}

export function ProductToolbar({
    searchValue,
    onSearchChange,
    sortValue = "urunAdi:asc",
    onSortChange,
}: ProductToolbarProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <ProductSearch value={searchValue} onChange={onSearchChange} />
            <div className="flex items-center gap-2">
                <Select value={sortValue} onValueChange={onSortChange}>
                    <SelectTrigger className="w-[200px]">
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Sırala" />
                    </SelectTrigger>
                    <SelectContent>
                        {PRODUCTS_SORT_OPTIONS.map((option) => (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
