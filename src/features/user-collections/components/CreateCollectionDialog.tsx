'use client';

import { CollectionNameDialog } from './CollectionNameDialog';

type CreateCollectionDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (name: string) => Promise<void>;
    isSubmitting?: boolean;
};

export function CreateCollectionDialog(props: CreateCollectionDialogProps) {
    return (
        <CollectionNameDialog
            {...props}
            title="Koleksiyon Oluştur"
            initialName=""
            submitLabel="Kaydet"
        />
    );
}
