'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { portalPrimaryButtonClass } from '@/constants/storefront/brand';
import {
    CollectionSuggestedNames,
    isSuggestedCollectionName,
} from './collection-suggested-names';
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
    showSuggestions?: boolean;
};

function CollectionNameForm({
    name,
    setName,
    initialName,
    placeholder,
    isSubmitting,
    showSuggestions,
    onSubmit,
    onCancel,
    submitLabel,
    stackedSubmit = false,
}: {
    name: string;
    setName: (value: string) => void;
    initialName: string;
    placeholder: string;
    isSubmitting: boolean;
    showSuggestions: boolean;
    onSubmit: () => void;
    onCancel: () => void;
    submitLabel: string;
    stackedSubmit?: boolean;
}) {
    const trimmed = name.trim();
    const unchanged = trimmed === initialName.trim();
    const canSubmit = trimmed.length > 0 && (!initialName || !unchanged) && !isSubmitting;
    const isSuggested = isSuggestedCollectionName(trimmed);

    return (
        <>
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
                    className={cn(
                        'h-11',
                        isSuggested && 'border-[#0769e9] ring-1 ring-[#0769e9]'
                    )}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && canSubmit) void onSubmit();
                    }}
                />
                <p className="text-right text-xs text-neutral-500">{name.length}/50</p>

                {showSuggestions && (
                    <CollectionSuggestedNames
                        value={name}
                        onSelect={setName}
                        disabled={isSubmitting}
                        className="pt-2"
                    />
                )}
            </div>

            {stackedSubmit ? (
                <div className="px-5 pb-5">
                    <Button
                        type="button"
                        className={cn('h-12 w-full rounded-lg font-semibold', portalPrimaryButtonClass)}
                        disabled={!canSubmit}
                        onClick={onSubmit}
                    >
                        {isSubmitting ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : null}
                        {isSubmitting ? 'Kaydediliyor…' : submitLabel}
                    </Button>
                </div>
            ) : (
                <div className="flex gap-2 border-t border-neutral-200 px-5 py-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        disabled={isSubmitting}
                        onClick={onCancel}
                    >
                        Vazgeç
                    </Button>
                    <Button
                        type="button"
                        className={cn('flex-1', portalPrimaryButtonClass)}
                        disabled={!canSubmit}
                        onClick={onSubmit}
                    >
                        {isSubmitting ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : null}
                        {isSubmitting ? 'Kaydediliyor…' : submitLabel}
                    </Button>
                </div>
            )}
        </>
    );
}

export function CollectionNameDialog({
    open,
    onOpenChange,
    title,
    submitLabel = 'Kaydet',
    initialName = '',
    placeholder = 'Koleksiyon ismi yazabilirsin',
    onSubmit,
    isSubmitting = false,
    showSuggestions = !initialName,
}: CollectionNameDialogProps) {
    const isMobile = useIsMobile(1024);
    const [name, setName] = useState(initialName);

    useEffect(() => {
        if (open) setName(initialName);
    }, [open, initialName]);

    const handleSubmit = async () => {
        const trimmed = name.trim();
        if (!trimmed || isSubmitting) return;
        if (initialName && trimmed === initialName.trim()) return;
        await onSubmit(trimmed);
    };

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange} dismissible modal>
                <DrawerContent className="max-h-[90vh] pb-6">
                    <DrawerHeader className="items-start border-b border-neutral-200 px-5 py-4 text-left">
                        <DrawerTitle className="text-base font-semibold">{title}</DrawerTitle>
                    </DrawerHeader>
                    <CollectionNameForm
                        name={name}
                        setName={setName}
                        initialName={initialName}
                        placeholder={placeholder}
                        isSubmitting={isSubmitting}
                        showSuggestions={showSuggestions}
                        onSubmit={handleSubmit}
                        onCancel={() => onOpenChange(false)}
                        submitLabel={submitLabel}
                        stackedSubmit
                    />
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="z-101 gap-0 overflow-hidden p-0 sm:max-w-lg">
                <DialogHeader className="border-b border-neutral-200 px-5 py-4">
                    <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
                </DialogHeader>
                <CollectionNameForm
                    name={name}
                    setName={setName}
                    initialName={initialName}
                    placeholder={placeholder}
                    isSubmitting={isSubmitting}
                    showSuggestions={showSuggestions}
                    onSubmit={handleSubmit}
                    onCancel={() => onOpenChange(false)}
                    submitLabel={submitLabel}
                />
            </DialogContent>
        </Dialog>
    );
}
