'use client';

import * as React from 'react';
import { Filter, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { FilterState } from '@/components/shared/data-table/types';

export interface GridFilterOption {
    value: string;
    label: string;
}

export interface GridFilterFieldBase {
    id: string;
    label: string;
}

export interface GridFilterFieldText extends GridFilterFieldBase {
    type: 'text';
    placeholder?: string;
}

export interface GridFilterFieldSelect extends GridFilterFieldBase {
    type: 'select';
    options?: GridFilterOption[];
    placeholder?: string;
    /** Bu değer seçildiğinde filtre temizlenir (örn. "Tümü" için '_all_') */
    clearValue?: string;
}

export interface GridFilterFieldCustom extends GridFilterFieldBase {
    type: 'custom';
    /** Özel filtre bileşeni (örn. ProductFilterDrawer) */
    component: React.ReactNode;
}

export type GridFilterField =
    | GridFilterFieldText
    | GridFilterFieldSelect
    | GridFilterFieldCustom;

export interface GridFilterPopoverProps {
    /** Sadece text ve select alanları; custom alanlar GridToolbar'da ayrı render edilir */
    fields: (GridFilterFieldText | GridFilterFieldSelect)[];
    filters: FilterState[];
    onSetFilter: (columnId: string, value: unknown, operator?: FilterState['operator']) => void;
    onClearFilter: (columnId: string) => void;
    onClearAll: () => void;
    disabled?: boolean;
    className?: string;
}

/**
 * Grid filtre popover. URL state (nuqs) useDataGrid/useFilters ile senkron.
 */
export function GridFilterPopover({
    fields,
    filters,
    onSetFilter,
    onClearFilter,
    onClearAll,
    disabled = false,
    className,
}: GridFilterPopoverProps) {
    const [open, setOpen] = React.useState(false);
    const activeCount = filters.length;
    const hasFilters = activeCount > 0;

    const getFilterValue = (columnId: string): string | undefined => {
        const f = filters.find((x) => x.id === columnId);
        if (!f) return undefined;
        return typeof f.value === 'string' ? f.value : String(f.value ?? '');
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled || filters.length === 0}
                    className={cn('gap-2', className)}
                >
                    <Filter className="h-4 w-4" />
                    Filtreler
                    {hasFilters && (
                        <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1">
                            {activeCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium">Filtreler</h4>
                        {hasFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => {
                                    onClearAll();
                                    setOpen(false);
                                }}
                            >
                                Tümünü temizle
                            </Button>
                        )}
                    </div>
                    {fields.map((field) => {
                        const value = getFilterValue(field.id);
                        const isActive = Boolean(value);
                        return (
                            <div key={field.id} className="space-y-2">
                                <Label className="text-xs">{field.label}</Label>
                                <div className="flex gap-2">
                                    {field.type === 'select' && field.options ? (
                                        <Select
                                            value={value ?? (field.clearValue ?? '')}
                                            onValueChange={(v) => {
                                                if (v && v !== field.clearValue) onSetFilter(field.id, v, 'eq');
                                                else onClearFilter(field.id);
                                            }}
                                        >
                                            <SelectTrigger className="flex-1 h-9">
                                                <SelectValue placeholder={field.placeholder ?? 'Seçin'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {field.options.map((opt) => (
                                                    <SelectItem key={opt.value} value={String(opt.value)}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input
                                            className="h-9"
                                            placeholder={field.placeholder ?? 'Değer'}
                                            value={value ?? ''}
                                            onChange={(e) => {
                                                const v = e.target.value;
                                                if (v.trim()) onSetFilter(field.id, v.trim(), 'contains');
                                                else onClearFilter(field.id);
                                            }}
                                        />
                                    )}
                                    {isActive && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 shrink-0"
                                            onClick={() => onClearFilter(field.id)}
                                            aria-label={`${field.label} filtresini kaldır`}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}
