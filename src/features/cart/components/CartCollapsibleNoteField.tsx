'use client';

import { useEffect, useRef, useState } from 'react';
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
    /** API'ye yazmadan önce bekleme süresi (ms). 0 = anında. */
    commitDelayMs?: number;
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
    commitDelayMs = 500,
}: CartCollapsibleNoteFieldProps) {
    const [open, setOpen] = useState(() => value.trim().length > 0);
    const [draft, setDraft] = useState(value);
    const commitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setDraft(value);
    }, [value]);

    useEffect(() => {
        if (value.trim().length > 0) {
            setOpen(true);
        }
    }, [value]);

    useEffect(
        () => () => {
            if (commitTimerRef.current) clearTimeout(commitTimerRef.current);
        },
        [],
    );

    const scheduleCommit = (next: string) => {
        if (commitTimerRef.current) clearTimeout(commitTimerRef.current);
        if (commitDelayMs <= 0) {
            onChange(next);
            return;
        }
        commitTimerRef.current = setTimeout(() => onChange(next), commitDelayMs);
    };

    const handleDraftChange = (next: string) => {
        setDraft(next);
        scheduleCommit(next);
    };

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
                value={draft}
                onChange={(e) => handleDraftChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="min-h-0 resize-none text-sm"
            />
        </div>
    );
}
