'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { portalPrimaryButtonClass } from '@/constants/storefront/brand';
import { cn } from '@/lib/utils';

type CollectionNameDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    submitLabel?: string;
    initialName?: string;
    placeholder?: string;
    onSubmit: (name: string) => Promise<void>;
    isSubmitting?: boolean;
};

export function CollectionNameDialog({
    open,
    onOpenChange,
    title,
    submitLabel = 'Kaydet',
    initialName = '',
    placeholder = 'Koleksiyon ismi yazabilirsin',
    onSubmit,
    isSubmitting = false,
}: CollectionNameDialogProps) {
    const [name, setName] = useState(initialName);

    useEffect(() => {
        if (open) setName(initialName);
    }, [open, initialName]);

    const trimmed = name.trim();
    const unchanged = trimmed === initialName.trim();
    const canSubmit = trimmed.length > 0 && !unchanged && !isSubmitting;

    const handleSubmit = async () => {
        if (!canSubmit && initialName) return;
        if (!trimmed) return;
        await onSubmit(trimmed);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="z-101 gap-0 overflow-hidden p-0 sm:max-w-lg">
                <DialogHeader className="border-b border-neutral-200 px-5 py-4">
                    <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-2 px-5 py-4">
                    <Label htmlFor="collection-name-input" className="text-sm font-medium">
                        Koleksiyon İsmi
                    </Label>
                    <Input
                        id="collection-name-input"
                        value={name}
                        maxLength={50}
                        placeholder={placeholder}
                        disabled={isSubmitting}
                        className="h-10"
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && (canSubmit || (!initialName && trimmed))) {
                                void handleSubmit();
                            }
                        }}
                    />
                    <p className="text-right text-xs text-neutral-500">{name.length}/50</p>
                </div>

                <DialogFooter className="flex-row gap-2 border-t border-neutral-200 px-5 py-4 sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1 sm:flex-none"
                        disabled={isSubmitting}
                        onClick={() => onOpenChange(false)}
                    >
                        Vazgeç
                    </Button>
                    <Button
                        type="button"
                        className={cn('flex-1 sm:flex-none', portalPrimaryButtonClass)}
                        disabled={initialName ? !canSubmit : !trimmed || isSubmitting}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : null}
                        {isSubmitting ? 'Kaydediliyor…' : submitLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
