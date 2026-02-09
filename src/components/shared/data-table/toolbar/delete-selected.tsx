/**
 * DeleteSelected Component
 *
 * Delete selected rows from the table.
 * Shows a confirmation dialog before deletion.
 * Parent provides onDelete logic (API call, clear selection, refetch).
 */

'use client';

import * as React from 'react';
import { type Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

export interface DeleteSelectedProps<TData> {
    /** TanStack Table instance */
    table: Table<TData>;

    /** Called when user confirms delete. Receives selected row data. Parent should: call API, clear selection, refetch. */
    onDelete: (rows: TData[]) => void | Promise<void>;

    /** Optional: called after successful delete (e.g. to clear selection). If onDelete is async, called after it resolves. */
    onDeleted?: () => void;

    /** Custom className */
    className?: string;

    /** Compact mode */
    compact?: boolean;

    /** Custom trigger label (tooltip) */
    label?: string;

    /** Show label text on button (default: only count) */
    showLabel?: boolean;

    /** Trigger button variant */
    triggerVariant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';

    /** Trigger button className */
    triggerClassName?: string;

    /** Confirm dialog title */
    confirmTitle?: string;

    /** Confirm dialog description */
    confirmDescription?: string;
}

/**
 * DeleteSelected
 *
 * Renders a button that opens a confirmation dialog and calls onDelete with selected rows.
 *
 * @example
 * ```tsx
 * <DeleteSelected
 *   table={table.table}
 *   onDelete={async (rows) => {
 *     await Promise.all(rows.map((r) => deleteDepo(r.id)));
 *     table.actions.clearSelection();
 *     table.actions.refetch();
 *   }}
 * />
 * ```
 */
export function DeleteSelected<TData>({
    table,
    onDelete,
    onDeleted,
    className,
    compact = false,
    label = 'Seçilenleri sil',
    showLabel = false,
    triggerVariant = 'outline',
    triggerClassName,
    confirmTitle = 'Seçilenleri sil',
    confirmDescription,
}: DeleteSelectedProps<TData>) {
    const [open, setOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const selectedRows = table.getSelectedRowModel().rows;
    const hasSelection = selectedRows.length > 0;
    const count = selectedRows.length;
    const rows = React.useMemo(
        () => selectedRows.map((r) => r.original),
        [selectedRows]
    );

    const defaultDescription =
        count === 1
            ? 'Bu öğe kalıcı olarak silinecektir.'
            : `${count} öğe kalıcı olarak silinecektir. Bu işlem geri alınamaz.`;

    const handleConfirm = React.useCallback(async () => {
        if (rows.length === 0) return;

        setIsDeleting(true);
        try {
            await Promise.resolve(onDelete(rows));
            setOpen(false);
            onDeleted?.();
        } finally {
            setIsDeleting(false);
        }
    }, [rows, onDelete, onDeleted]);

    const handleOpenChange = React.useCallback((value: boolean) => {
        if (!isDeleting) {
            setOpen(value);
        }
    }, [isDeleting]);

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <span className={cn(className)}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant={triggerVariant}
                                size={compact ? 'icon' : 'default'}
                                className={cn(
                                    'gap-2 rounded-full h-8 transition-all duration-300',
                                    compact ? 'w-8' : 'px-3',
                                    'bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive',
                                    triggerClassName
                                )}
                                disabled={!hasSelection}
                            >
                                <Trash2 className={cn('size-4', !compact && 'mr-2')} />
                                {(showLabel || hasSelection) && (
                                    <span>{hasSelection ? count : 0}</span>
                                )}
                            </Button>
                        </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="flex items-center gap-2">
                            <Trash2 className="size-3" />
                            <p>{label}</p>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </span>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {confirmDescription ?? defaultDescription}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        İptal
                    </AlertDialogCancel>
                    <Button
                        variant="destructive"
                        size="default"
                        disabled={isDeleting}
                        onClick={(e) => {
                            e.preventDefault();
                            handleConfirm();
                        }}
                        asChild
                    >
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleConfirm();
                            }}
                            disabled={isDeleting}
                        >
                            <Trash2 className="size-4" />
                            Sil
                        </AlertDialogAction>
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
