"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductSearchProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
}

export function ProductSearch({
    value = "",
    onChange,
    placeholder = "Ürün ara... (kod, ad)",
}: ProductSearchProps) {
    const handleClear = () => onChange?.("");

    return (
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="search"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className="pl-9 pr-9"
            />
            {value && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Temizle</span>
                </Button>
            )}
        </div>
    );
}
