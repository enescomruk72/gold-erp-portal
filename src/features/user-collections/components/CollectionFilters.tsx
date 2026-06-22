'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { portalPrimaryButtonClass, portalPrimaryTextClass } from '@/constants/storefront/brand';
import { cn } from '@/lib/utils';

export function CollectionSearchInput({
    value,
    onChange,
    placeholder = 'Koleksiyonda Ara',
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return (
        <div className="relative w-full min-w-[220px] max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="h-10 rounded-full border-neutral-200 bg-white pl-9 pr-4"
            />
        </div>
    );
}

type CheckboxFilterPopoverProps = {
    label: string;
    searchPlaceholder: string;
    value: number | null;
    options: Array<{ id: number; label: string }>;
    onChange: (value: number | null) => void;
};

function CheckboxFilterPopover({
    label,
    searchPlaceholder,
    value,
    options,
    onChange,
}: CheckboxFilterPopoverProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [draft, setDraft] = useState<number | null>(value);

    const filteredOptions = useMemo(() => {
        const query = search.trim().toLocaleLowerCase('tr');
        if (!query) return options;
        return options.filter((option) =>
            option.label.toLocaleLowerCase('tr').includes(query),
        );
    }, [options, search]);

    const isActive = value != null;

    const handleOpenChange = (next: boolean) => {
        if (next) {
            setDraft(value);
            setSearch('');
        }
        setOpen(next);
    };

    const handleApply = () => {
        onChange(draft);
        setOpen(false);
    };

    if (options.length === 0) return null;

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        'inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-xs font-semibold transition-colors',
                        open || isActive
                            ? cn('border-[#0769e9] bg-white', portalPrimaryTextClass)
                            : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300',
                    )}
                >
                    <span>{label}</span>
                    {isActive ? (
                        <span className="flex size-4 items-center justify-center rounded-full bg-[#0769e9] text-[10px] font-bold text-white">
                            1
                        </span>
                    ) : null}
                    <ChevronDown
                        className={cn(
                            'size-3.5 shrink-0 transition-transform',
                            open && 'rotate-180',
                        )}
                    />
                </button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                sideOffset={8}
                className="w-[min(calc(100vw-2rem),26rem)] overflow-hidden rounded-xl border-neutral-200 p-0 shadow-lg"
            >
                <div className="p-3">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="h-10 rounded-lg border-0 bg-neutral-100 pl-9 text-sm shadow-none focus-visible:ring-1"
                        />
                    </div>
                </div>

                <div className="max-h-64 overflow-y-auto px-3 pb-3">
                    {filteredOptions.length > 0 ? (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            {filteredOptions.map((option) => {
                                const checked = draft === option.id;

                                return (
                                    <label
                                        key={option.id}
                                        className="flex cursor-pointer items-start gap-2.5 text-sm leading-snug text-neutral-800"
                                    >
                                        <Checkbox
                                            checked={checked}
                                            onCheckedChange={(next) => {
                                                setDraft(next === true ? option.id : null);
                                            }}
                                            className="mt-0.5"
                                        />
                                        <span className="min-w-0 flex-1">{option.label}</span>
                                    </label>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="py-6 text-center text-sm text-muted-foreground">
                            Sonuç bulunamadı
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-neutral-100 p-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-10 rounded-lg border-neutral-200 font-semibold text-neutral-500"
                        disabled={draft == null}
                        onClick={() => setDraft(null)}
                    >
                        Temizle
                    </Button>
                    <Button
                        type="button"
                        className={cn('h-10 rounded-lg font-semibold', portalPrimaryButtonClass)}
                        onClick={handleApply}
                    >
                        Uygula
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export function CollectionCategoryFilter({
    value,
    options,
    onChange,
}: {
    value: number | null;
    options: Array<{ id: number; label: string }>;
    onChange: (value: number | null) => void;
}) {
    return (
        <CheckboxFilterPopover
            label="Kategori"
            searchPlaceholder="Kategoriler"
            value={value}
            options={options}
            onChange={onChange}
        />
    );
}

export function CollectionMarkaFilter({
    value,
    options,
    onChange,
}: {
    value: number | null;
    options: Array<{ id: number; markaAdi: string }>;
    onChange: (value: number | null) => void;
}) {
    const normalizedOptions = useMemo(
        () => options.map((option) => ({ id: option.id, label: option.markaAdi })),
        [options],
    );

    return (
        <CheckboxFilterPopover
            label="Marka"
            searchPlaceholder="Marka Ara"
            value={value}
            options={normalizedOptions}
            onChange={onChange}
        />
    );
}
