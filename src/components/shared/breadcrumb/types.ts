import type { Route } from "next";

export interface BreadcrumbItem {
    name: string;
    url?: Route;
    isLoading?: boolean;
}

export type BreadcrumbStrategy = "immediate" | "progressive" | "hybrid";

export interface FlatNavItem {
    /** Full URL path */
    url: string;

    /** Singular verbose name */
    verbose_name?: string;

    /** Plural verbose name */
    verbose_name_plural?: string;

    /** Item title */
    title: string;

    /** Depth in navigation hierarchy (0 = root) */
    depth: number;

    /** Parent group's verbose name */
    groupVerboseName?: string;
}

/**
 * Result from URL matching operation
 */
export interface MatchResult {
    /** Successfully matched navigation items */
    matchedItems: FlatNavItem[];

    /** URL segments that didn't match static routes */
    remainingSegments: string[];

    /** Last matched static URL */
    lastStaticUrl: string;
}

// ============================================================================
// HOOK OPTIONS & CONFIGURATION
// ============================================================================

/**
 * Base options for breadcrumb hooks
 */
export interface BreadcrumbHookOptions {
    /**
     * Dynamic data for populating breadcrumb names
     * Keys should match dynamic segment identifiers
     */
    dynamicData?: Record<string, unknown>;

    /**
     * Function to extract display name from dynamic data
     * @param segment - The URL segment (e.g., "123", "abc-uuid")
     * @param data - The full dynamic data object
     * @returns Extracted display name or null
     */
    dataExtractor?: (segment: string, data: unknown) => string | null;
}

/**
 * Extended options for hybrid breadcrumb strategy
 */
export interface HybridBreadcrumbOptions extends BreadcrumbHookOptions {
    /**
     * Behavior while data is loading
     * - "showUUID": Display the raw UUID/ID
     * - "showLoading": Display loading indicator
     * - "hideSegment": Hide segment until data loads
     */
    loadingBehavior?: "showUUID" | "showLoading" | "hideSegment";

    /**
     * Behavior after data is loaded
     * - "replaceUUID": Replace UUID with data
     * - "replaceLoading": Replace loading indicator with data
     * - "addAfterUUID": Show both UUID and data
     * - "showOnly": Show only the data
     */
    finalBehavior?: "replaceUUID" | "replaceLoading" | "addAfterUUID" | "showOnly";
}

/**
 * Options for breadcrumb optimization/rendering
 */
export interface OptimizationOptions {
    /** Reference to the home icon element for width calculation */
    homeIconRef?: React.RefObject<HTMLElement | null>;

    /** Width of separator elements in pixels */
    separatorWidth?: number;
}

// ============================================================================
// HOOK RETURN TYPES
// ============================================================================

/**
 * Return value from breadcrumb strategy hooks
 */
export interface BreadcrumbHookResult {
    /** Generated breadcrumb items */
    breadcrumbs: BreadcrumbItem[];
}

/**
 * Breakpoint identifiers for responsive behavior
 */
export type BreakpointKey = "mobile" | "sm" | "md" | "lg" | "xl" | "2xl";

/**
 * Return value from breadcrumb optimization hook
 */
export interface OptimizationResult {
    /** Reference to the container element */
    containerRef: React.RefObject<HTMLOListElement | null>;

    /** References to individual item elements for measurement */
    itemRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>;

    /** Current container width in pixels */
    containerWidth: number;

    /** Measured widths of individual items */
    itemWidths: number[];

    /** Current responsive breakpoint */
    breakpoint: BreakpointKey;

    /** Number of items currently visible */
    visibleCount: number;

    /** Number of items in overflow menu */
    overflowCount: number;

    /** Minimum width for items at current breakpoint */
    minWidth: number;

    /** Maximum width for items at current breakpoint */
    maxWidth: number;

    /** Whether measurements are complete and ready */
    isReady: boolean;

    /** Function to manually trigger re-measurement */
    measureItems: () => void;
}

// ============================================================================
// PATTERN TYPES
// ============================================================================

/**
 * URL segment patterns for detection
 */
export interface SegmentPatterns {
    /** UUID pattern (e.g., "123e4567-e89b-12d3-a456-426614174000") */
    UUID: RegExp;

    /** Numeric ID pattern (e.g., "123", "456") */
    NUMERIC_ID: RegExp;

    /** Next.js dynamic route pattern (e.g., "[id]", "[slug]") */
    NEXTJS_DYNAMIC: RegExp;
}

/**
 * Responsive breakpoint values in pixels
 */
export interface Breakpoints {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    "2xl": number;
}

/**
 * Width configuration for each breakpoint
 */
export interface BreakpointWidthConfig {
    /** Minimum item width */
    min: number;

    /** Maximum item width */
    max: number;
}