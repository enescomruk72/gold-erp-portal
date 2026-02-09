'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface GridErrorProps {
    error?: Error | string | null;
    onRetry?: () => void;
    className?: string;
}

export function GridError({
    error,
    onRetry,
    className,
}: GridErrorProps) {
    const message =
        typeof error === 'string' ? error : error?.message ?? 'Bir hata oluştu.';

    return (
        <div
            className={cn(
                'flex min-h-[280px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/30 p-8 text-center',
                className
            )}
        >
            <AlertCircle className="h-10 w-10 shrink-0 text-destructive/80" />
            <p className="text-sm text-muted-foreground">{message}</p>
            {onRetry && (
                <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
                    Tekrar dene
                </Button>
            )}
        </div>
    );
}
