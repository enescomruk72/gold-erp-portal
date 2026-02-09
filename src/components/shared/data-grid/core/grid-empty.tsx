'use client';

import { FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface GridEmptyProps {
    message?: string;
    action?: { label: string; onClick: () => void };
    className?: string;
}

export function GridEmpty({ message = 'Veri bulunamadı.', action, className }: GridEmptyProps) {
    return (
        <div
            className={cn(
                'flex min-h-[280px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/30 p-8 text-center',
                className
            )}
        >
            <FileSearch className="h-10 w-10 shrink-0 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{message}</p>
            {action && (
                <Button variant="outline" size="sm" onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    );
}
