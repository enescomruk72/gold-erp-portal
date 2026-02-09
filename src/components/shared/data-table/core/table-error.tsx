/**
 * TableError Component
 * 
 * Error state for DataTable.
 * Shows when data fetching fails.
 */

'use client';

import * as React from 'react';
import { AlertCircle, RefreshCw, WifiOff, ServerCrash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

/**
 * ============================================
 * PROPS
 * ============================================
 */

export interface TableErrorProps {
    /** Error object or message */
    error?: Error | string | null;

    /** Retry action */
    onRetry?: () => void;

    /** Custom title */
    title?: string;

    /** Custom description */
    description?: string;

    /** Show error details (for development) */
    showDetails?: boolean;

    /** Custom className */
    className?: string;

    /** Variant */
    variant?: 'default' | 'inline' | 'card';
}

/**
 * ============================================
 * HELPER FUNCTIONS
 * ============================================
 */

/**
 * Determine error type from error message
 */
function getErrorType(error?: Error | string | null): {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
} {
    const errorMessage =
        typeof error === 'string' ? error : error?.message || '';

    // Network error
    if (
        errorMessage.includes('network') ||
        errorMessage.includes('fetch') ||
        errorMessage.includes('connection')
    ) {
        return {
            icon: WifiOff,
            title: 'Bağlantı Hatası',
            description:
                'Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.',
        };
    }

    // Server error (5xx)
    if (
        errorMessage.includes('500') ||
        errorMessage.includes('502') ||
        errorMessage.includes('503') ||
        errorMessage.includes('server')
    ) {
        return {
            icon: ServerCrash,
            title: 'Sunucu Hatası',
            description:
                'Sunucu tarafında bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
        };
    }

    // Unauthorized (401)
    if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
        return {
            icon: AlertCircle,
            title: 'Oturum Süresi Doldu',
            description: 'Lütfen tekrar giriş yapın.',
        };
    }

    // Not found (404)
    if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        return {
            icon: AlertCircle,
            title: 'Sayfa Bulunamadı',
            description: 'İstenen kaynak bulunamadı.',
        };
    }

    // Generic error
    return {
        icon: AlertCircle,
        title: 'Bir Hata Oluştu',
        description:
            'Veriler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.',
    };
}

/**
 * ============================================
 * COMPONENT
 * ============================================
 */

/**
 * TableError
 * 
 * Error state with icon, message, and retry action
 * 
 * @example
 * ```tsx
 * if (table.query.isError) {
 *   return (
 *     <TableError
 *       error={table.query.error}
 *       onRetry={() => table.actions.refetch()}
 *     />
 *   );
 * }
 * ```
 */
export function TableError({
    error,
    onRetry,
    title: customTitle,
    description: customDescription,
    showDetails = process.env.NODE_ENV === 'development',
    className,
    variant = 'card',
}: TableErrorProps) {
    const errorType = getErrorType(error);
    const Icon = errorType.icon;

    const title = customTitle || errorType.title;
    const description = customDescription || errorType.description;

    // Inline variant (Alert component)
    if (variant === 'inline') {
        return (
            <Alert variant="destructive" className={className}>
                <Icon className="h-4 w-4" />
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>
                    {description}
                    {onRetry && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRetry}
                            className="mt-2"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Tekrar Dene
                        </Button>
                    )}
                </AlertDescription>
            </Alert>
        );
    }

    // Card variant (default)
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 py-16',
                className
            )}
        >
            {/* Icon */}
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <Icon className="h-8 w-8 text-destructive" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>

            {/* Description */}
            <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
                {description}
            </p>

            {/* Error details (development only) */}
            {showDetails && error && (
                <div className="mt-4 max-w-lg">
                    <details className="rounded-md border bg-muted p-3">
                        <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
                            Hata Detayları
                        </summary>
                        <pre className="mt-2 overflow-auto text-xs text-muted-foreground">
                            {typeof error === 'string'
                                ? error
                                : JSON.stringify(error, null, 2)}
                        </pre>
                    </details>
                </div>
            )}

            {/* Retry button */}
            {onRetry && (
                <Button onClick={onRetry} className="mt-6">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Tekrar Dene
                </Button>
            )}
        </div>
    );
}

/**
 * Inline variant (Alert)
 */
export function TableErrorInline(props: Omit<TableErrorProps, 'variant'>) {
    return <TableError {...props} variant="inline" />;
}
