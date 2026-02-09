/**
 * Page Header Store
 * 
 * Global state management for page header using Zustand.
 * Manages title, description, breadcrumbs, actions, and tabs.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ReactNode } from 'react';

/**
 * ============================================
 * TYPES
 * ============================================
 */

export interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: ReactNode;
}

/**
 * Breadcrumb strategy types
 */
export type BreadcrumbStrategy = 'immediate' | 'progressive' | 'hybrid';

/**
 * Breadcrumb configuration
 */
export interface BreadcrumbConfig {
    /** Strategy to use (default: 'immediate') */
    strategy?: BreadcrumbStrategy;

    /** Dynamic data for breadcrumb segments */
    dynamicData?: Record<string, unknown>;

    /** Data extractor function */
    dataExtractor?: (segment: string, data: unknown) => string | null;
}

export interface PageHeaderAction {
    id: string;
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: ReactNode;
    variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
    disabled?: boolean;
    loading?: boolean;
}

export interface PageHeaderState {
    /** Page title */
    title: string;

    /** Page description */
    description?: string;

    /** Breadcrumb items (deprecated - use breadcrumbConfig) */
    breadcrumbs: BreadcrumbItem[];

    /** Breadcrumb configuration */
    breadcrumbConfig?: BreadcrumbConfig;

    /** Action buttons */
    actions: PageHeaderAction[];

    /** Show back button */
    showBackButton: boolean;

    /** Back button action (default: router.back()) */
    onBack?: () => void;

    /** Data extractor */
    dataExtractor?: (segment: string, data: unknown) => string | null;

    /** Loading state */
    isLoading: boolean;

    /** Custom content (slot) */
    customContent?: ReactNode;

    /** When true, page header does not render */
    disabled?: boolean;
}

export interface PageHeaderActions {
    /** Set title */
    setTitle: (title: string) => void;

    /** Set description */
    setDescription: (description: string | undefined) => void;

    /** Set breadcrumbs (deprecated - use setBreadcrumbConfig) */
    setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;

    /** Add breadcrumb (deprecated) */
    addBreadcrumb: (breadcrumb: BreadcrumbItem) => void;

    /** Set breadcrumb configuration */
    setBreadcrumbConfig: (config: BreadcrumbConfig | undefined) => void;

    /** Set actions */
    setActions: (actions: PageHeaderAction[]) => void;

    /** Add action */
    addAction: (action: PageHeaderAction) => void;

    /** Remove action */
    removeAction: (actionId: string) => void;

    /** Show/hide back button */
    setShowBackButton: (show: boolean) => void;

    /** Set back button handler */
    setOnBack: (onBack: (() => void) | undefined) => void;

    /** Set data extractor */
    setDataExtractor: (dataExtractor: ((segment: string, data: unknown) => string | null) | undefined) => void;

    /** Set loading state */
    setLoading: (loading: boolean) => void;

    /** Set custom content */
    setCustomContent: (content: ReactNode | undefined) => void;

    /** Set disabled (when true, header does not render) */
    setDisabled: (disabled: boolean) => void;

    /** Set all at once */
    setPageHeader: (state: Partial<PageHeaderState>) => void;

    /** Reset to defaults */
    reset: () => void;
}

export type PageHeaderStore = PageHeaderState & PageHeaderActions;

/**
 * ============================================
 * DEFAULT STATE
 * ============================================
 */

const DEFAULT_STATE: PageHeaderState = {
    title: '',
    description: undefined,
    breadcrumbs: [],
    breadcrumbConfig: undefined,
    actions: [],
    showBackButton: false,
    onBack: undefined,
    isLoading: false,
    customContent: undefined,
    disabled: false,
};

/**
 * ============================================
 * STORE
 * ============================================
 */

export const usePageHeaderStore = create<PageHeaderStore>()(
    devtools(
        (set) => ({
            // State
            ...DEFAULT_STATE,

            // Actions
            setTitle: (title) =>
                set({ title }, false, 'pageHeader/setTitle'),

            setDescription: (description) =>
                set({ description }, false, 'pageHeader/setDescription'),

            setBreadcrumbs: (breadcrumbs) =>
                set({ breadcrumbs }, false, 'pageHeader/setBreadcrumbs'),

            addBreadcrumb: (breadcrumb) =>
                set(
                    (state) => ({ breadcrumbs: [...state.breadcrumbs, breadcrumb] }),
                    false,
                    'pageHeader/addBreadcrumb'
                ),

            setBreadcrumbConfig: (breadcrumbConfig) =>
                set({ breadcrumbConfig }, false, 'pageHeader/setBreadcrumbConfig'),

            setActions: (actions) =>
                set({ actions }, false, 'pageHeader/setActions'),

            addAction: (action) =>
                set(
                    (state) => ({ actions: [...state.actions, action] }),
                    false,
                    'pageHeader/addAction'
                ),

            removeAction: (actionId) =>
                set(
                    (state) => ({
                        actions: state.actions.filter((a) => a.id !== actionId),
                    }),
                    false,
                    'pageHeader/removeAction'
                ),

            setShowBackButton: (showBackButton) =>
                set({ showBackButton }, false, 'pageHeader/setShowBackButton'),

            setOnBack: (onBack) =>
                set({ onBack }, false, 'pageHeader/setOnBack'),

            setDataExtractor: (dataExtractor) =>
                set({ dataExtractor }, false, 'pageHeader/setDataExtractor'),

            setLoading: (isLoading) =>
                set({ isLoading }, false, 'pageHeader/setLoading'),

            setCustomContent: (customContent) =>
                set({ customContent }, false, 'pageHeader/setCustomContent'),

            setDisabled: (disabled) =>
                set({ disabled }, false, 'pageHeader/setDisabled'),

            setPageHeader: (state) =>
                set(state, false, 'pageHeader/setPageHeader'),

            reset: () =>
                set(DEFAULT_STATE, false, 'pageHeader/reset'),
        }),
        {
            name: 'PageHeaderStore',
            enabled: process.env.NODE_ENV === 'development',
        }
    )
);
