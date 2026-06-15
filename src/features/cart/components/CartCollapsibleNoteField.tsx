'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type CartCollapsibleNoteFieldProps = {
    id: string;
    label: string;
    addButtonLabel: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    className?: string;
};

export function CartCollapsibleNoteField({
    id,
    label,
    addButtonLabel,
    value,
    onChange,
    placeholder,
    rows = 3,
    className,
}: CartCollapsibleNoteFieldProps) {
    const [open, setOpen] = useState(() => value.trim().length > 0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (value.trim().length > 0) {
                setOpen(true);
            }
        }, 100);
        return () => clearTimeout(timeout);
    }, [value]);

    if (!open) {
        return (
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn('h-9 w-full justify-center gap-1.5 text-sm text-[#0b57d0]', className)}
                onClick={() => setOpen(true)}
            >
                <Plus className="size-4" />
                {addButtonLabel}
            </Button>
        );
    }

    return (
        <div className={cn('space-y-1.5', className)}>
            <Label htmlFor={id} className="text-xs text-muted-foreground">
                {label}
            </Label>
            <Textarea
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="min-h-0 resize-none text-sm"
            />
        </div>
    );
}
