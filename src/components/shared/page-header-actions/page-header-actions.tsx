/**
 * PageHeaderActions
 * 
 * Actions container component
 */

'use client';

import * as React from 'react';
import { usePageHeaderStore } from '@/stores/page-header.store';
import { PageHeaderActionButton } from './page-header-action-button';

export const PageHeaderActions = React.memo(() => {
    const actions = usePageHeaderStore((state) => state.actions);

    if (actions.length === 0) return null;

    return (
        <div className="flex items-center gap-2">
            {actions.map((action) => (
                <PageHeaderActionButton key={action.id} action={action} />
            ))}
        </div>
    );
});

PageHeaderActions.displayName = 'PageHeaderActions';
