/**
 * TableEmpty Component
 * 
 * Empty state for DataTable.
 * Shows when no data is available.
 */

'use client';

import * as React from 'react';
import { FileQuestion, Search, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * ============================================
 * PROPS
 * ============================================
 */

export interface TableEmptyProps {
    /** Title message */
    title?: string;

    /** Description message */
    description?: string;

    /** Icon to show */
    icon?: 'search' | 'database' | 'file' | React.ReactNode;

    /** Action button */
    action?: {
        label: string;
        onClick: () => void;
        icon?: React.ReactNode;
    };

    /** Custom className */
    className?: string;

    /** Compact mode */
    compact?: boolean;
}

/**
 * ============================================
 * ICON MAPPER
 * ============================================
 */

const IconMap: Record<string, React.ElementType> = {
    search: Search,
    database: Database,
    file: FileQuestion,
};

/**
 * ============================================
 * COMPONENT
 * ============================================
 */

/**
 * TableEmpty
 * 
 * Empty state with icon, message, and optional action
 * 
 * @example
 * ```tsx
 * if (table.isEmpty) {
 *   return (
 *     <TableEmpty
 *       title="Müşteri bulunamadı"
 *       description="Yeni müşteri eklemek için butona tıklayın"
 *       icon="database"
 *       action={{
 *         label: "Müşteri Ekle",
 *         onClick: () => router.push('/crm/cariler/new')
 *       }}
 *     />
 *   );
 * }
 * ```
 */
export function TableEmpty({
    title = 'Veri bulunamadı',
    description = 'Henüz hiç veri eklenmemiş veya arama kriterlerinize uygun sonuç bulunamadı.',
    icon = 'database',
    action,
    className,
    compact = false,
}: TableEmptyProps) {
    // Icon component
    const IconComponent =
        typeof icon === 'string' ? IconMap[icon as keyof typeof IconMap] : null;

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center rounded-lg border border-dashed',
                compact ? 'py-12' : 'py-24',
                className
            )}
        >
            {/* Icon */}
            <div
                className={cn(
                    'flex items-center justify-center rounded-full bg-muted',
                    compact ? 'mb-4 h-12 w-12' : 'mb-6 h-16 w-16'
                )}
            >
                {IconComponent ? (
                    <IconComponent
                        className={cn(
                            'text-muted-foreground',
                            compact ? 'h-6 w-6' : 'h-8 w-8'
                        )}
                    />
                ) : (
                    icon
                )}
            </div>

            {/* Title */}
            <h3
                className={cn(
                    'font-semibold text-foreground',
                    compact ? 'text-base' : 'text-lg'
                )}
            >
                {title}
            </h3>

            {/* Description */}
            {description && (
                <p
                    className={cn(
                        'mt-2 max-w-lg text-center text-muted-foreground',
                        compact ? 'text-xs' : 'text-sm'
                    )}
                >
                    {description}
                </p>
            )}

            {/* Action button */}
            {action && (
                <Button
                    onClick={action.onClick}
                    className="mt-6"
                    size={compact ? 'sm' : 'default'}
                >
                    {action.icon && (
                        <>{action.icon}</>
                    )}
                    {action.label}
                </Button>
            )}
        </div>
    );
}

/**
 * Search-specific empty state
 */
export function TableEmptySearch({
    searchTerm,
    onClearSearch,
    ...props
}: Omit<TableEmptyProps, 'title' | 'description' | 'icon' | 'action'> & {
    searchTerm: string;
    onClearSearch?: () => void;
}) {
    return (
        <TableEmpty
            title="Sonuç bulunamadı"
            description={`"${searchTerm}" araması için sonuç bulunamadı. Farklı bir terim deneyin.`}
            icon="search"
            action={
                onClearSearch
                    ? {
                        label: 'Aramayı Temizle',
                        onClick: onClearSearch,
                    }
                    : undefined
            }
            {...props}
        />
    );
}

/**
 * Filter-specific empty state
 */
export function TableEmptyFilter({
    onClearFilters,
    ...props
}: Omit<TableEmptyProps, 'title' | 'description' | 'icon' | 'action'> & {
    onClearFilters?: () => void;
}) {
    return (
        <TableEmpty
            title="Filtre sonucu boş"
            description="Seçili filtrelere uygun sonuç bulunamadı. Filtreleri temizleyip tekrar deneyin."
            icon="search"
            action={
                onClearFilters
                    ? {
                        label: 'Filtreleri Temizle',
                        onClick: onClearFilters,
                    }
                    : undefined
            }
            {...props}
        />
    );
}

/**
 * Compact variant
 */
export function TableEmptyCompact(props: Omit<TableEmptyProps, 'compact'>) {
    return <TableEmpty {...props} compact />;
}
