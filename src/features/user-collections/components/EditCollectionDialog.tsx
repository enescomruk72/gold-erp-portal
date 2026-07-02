'use client';

import { CollectionNameDialog } from './CollectionNameDialog';

type EditCollectionDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialName: string;
    onSubmit: (name: string) => Promise<void>;
    isSubmitting?: boolean;
    showSuggestions?: boolean;
};

export function EditCollectionDialog({
    open,
    onOpenChange,
    initialName,
    onSubmit,
    isSubmitting,
    showSuggestions = false,
}: EditCollectionDialogProps) {
    return (
        <CollectionNameDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Koleksiyon Adı Düzenle"
            initialName={initialName}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            showSuggestions={showSuggestions}
        />
    );
}
