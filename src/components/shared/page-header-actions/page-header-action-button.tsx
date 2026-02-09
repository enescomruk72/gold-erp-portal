/**
 * PageHeaderActionButton
 * 
 * Individual action button component
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PageHeaderAction } from '@/stores/page-header.store';

export interface PageHeaderActionButtonProps {
    action: PageHeaderAction;
}

export const PageHeaderActionButton = React.memo<PageHeaderActionButtonProps>(
    ({ action }) => {
        if (action.href) {
            return (
                // @ts-expect-error - Dynamic route type
                <Link key={action.id} href={action.href}>
                    <Button
                        variant={action.variant || 'default'}
                        disabled={action.disabled || action.loading}
                    >
                        {action.loading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {action.icon && !action.loading && (
                            <span className="mr-2">{action.icon}</span>
                        )}
                        {action.label}
                    </Button>
                </Link>
            );
        }

        return (
            <Button
                key={action.id}
                variant={action.variant || 'default'}
                onClick={action.onClick}
                disabled={action.disabled || action.loading}
            >
                {action.loading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {action.icon && !action.loading && (
                    <span className="mr-2">{action.icon}</span>
                )}
                {action.label}
            </Button>
        );
    }
);

PageHeaderActionButton.displayName = 'PageHeaderActionButton';
