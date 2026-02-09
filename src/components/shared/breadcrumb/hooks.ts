"use client";

import { useEffect, useRef, useState, useCallback, useMemo, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import type { BaseNavItem, NavGroup, NavSubItem } from "@/constants/navigation/types";
import type { BreadcrumbItem } from "./types";
import { Route } from "next";

/********************************************************************************/
/********************************** CONSTANTS ***********************************/
/********************************************************************************/

const PATTERNS = {
    UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    NUMERIC_ID: /^\d+$/,
    NEXTJS_DYNAMIC: /^\[.*\]$/,
    // 🆕 Alphanumeric IDs (cust-123, abc123, item_456, vb)
    ALPHANUMERIC_ID: /^[a-z0-9_-]+$/i,
} as const;

const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
} as const;

const BREAKPOINT_WIDTH_CONFIG = {
    mobile: { min: 80, max: 100 },
    sm: { min: 100, max: 200 },
    md: { min: 120, max: 250 },
    lg: { min: 150, max: 300 },
    xl: { min: 180, max: 350 },
    "2xl": { min: 200, max: 400 },
} as const;

const DEFAULT_SEPARATOR_WIDTH = 20;
const DEFAULT_HOME_ICON_WIDTH = 32;
const DEFAULT_DROPDOWN_WIDTH = 36;
const MIN_VISIBLE_ITEMS = 1;

/********************************************************************************/
/*********************************** TYPES **************************************/
/********************************************************************************/

type BreakpointKey = keyof typeof BREAKPOINT_WIDTH_CONFIG;

interface FlatNavItem {
    url: string;
    verbose_name?: string;
    verbose_name_plural?: string;
    title: string;
    depth: number;
    groupVerboseName?: string;
}

interface MatchResult {
    matchedItems: FlatNavItem[];
    remainingSegments: string[];
    lastStaticUrl: string;
}

interface BreadcrumbHookOptions {
    dynamicData?: Record<string, unknown>;
    dataExtractor?: (segment: string, data: unknown) => string | null;
}

interface HybridBreadcrumbOptions extends BreadcrumbHookOptions {
    loadingBehavior?: "showUUID" | "showLoading" | "hideSegment";
    finalBehavior?: "replaceUUID" | "replaceLoading" | "addAfterUUID" | "showOnly";
}

interface OptimizationOptions {
    homeIconRef?: React.RefObject<HTMLElement | null>;
    separatorWidth?: number;
}

interface OptimizationResult {
    containerRef: React.RefObject<HTMLOListElement | null>;
    itemRefs: React.RefObject<(HTMLSpanElement | null)[]>;
    containerWidth: number;
    itemWidths: number[];
    breakpoint: BreakpointKey;
    visibleCount: number;
    overflowCount: number;
    minWidth: number;
    maxWidth: number;
    isReady: boolean;
    measureItems: () => void;
}

/********************************************************************************/
/********************************* UTILITIES ************************************/
/********************************************************************************/

/**
 * Normalizes URL by removing trailing slash, except for root "/"
 */
const normalizeUrl = (url: string): string => {
    if (!url) return "/";
    return url === "/" ? "/" : url.replace(/\/$/, "");
};

/**
 * Checks if a segment is dynamic (UUID, numeric ID, or Next.js dynamic route)
 */
const isDynamicSegment = (segment: string): boolean => {
    // Static route keywords (bunlar dynamic değil)
    const STATIC_KEYWORDS = ['new', 'edit', 'create', 'list', 'settings'];
    if (STATIC_KEYWORDS.includes(segment.toLowerCase())) {
        return false;
    }

    return (
        PATTERNS.UUID.test(segment) ||
        PATTERNS.NUMERIC_ID.test(segment) ||
        PATTERNS.NEXTJS_DYNAMIC.test(segment) ||
        PATTERNS.ALPHANUMERIC_ID.test(segment)
    );
};

/**
 * Capitalizes first letter of a string
 */
const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Determines current breakpoint based on window width
 */
const getBreakpoint = (width: number): BreakpointKey => {
    if (width >= BREAKPOINTS["2xl"]) return "2xl";
    if (width >= BREAKPOINTS.xl) return "xl";
    if (width >= BREAKPOINTS.lg) return "lg";
    if (width >= BREAKPOINTS.md) return "md";
    if (width >= BREAKPOINTS.sm) return "sm";
    return "mobile";
};

/**
 * Safely extracts display name using data extractor
 */
const extractDisplayName = (
    segment: string,
    dynamicData: Record<string, unknown> | undefined,
    dataExtractor: ((segment: string, data: unknown) => string | null) | undefined
): string | null => {
    if (!dynamicData || !dataExtractor) return null;

    try {
        return dataExtractor(segment, dynamicData);
    } catch (error) {
        console.warn(`Failed to extract display name for segment: ${segment}`, error);
        return null;
    }
};

/********************************************************************************/
/****************************** NAVIGATION LOOKUP *******************************/
/********************************************************************************/

/**
 * Creates optimized lookup table for O(1) URL access
 */
const createNavLookupTable = (navGroups: NavGroup[]): Map<string, FlatNavItem> => {
    const lookupTable = new Map<string, FlatNavItem>();

    const processItems = (
        items: BaseNavItem[] | NavSubItem[],
        depth: number = 0,
        groupVerboseName?: string
    ): void => {
        items.forEach((item) => {
            // Add item to lookup if it has a URL
            if (item.url) {
                const normalizedUrl = normalizeUrl(item.url);
                lookupTable.set(normalizedUrl, {
                    url: normalizedUrl,
                    verbose_name: item.verbose_name_plural,
                    verbose_name_plural: item.verbose_name_plural,
                    title: item.title,
                    depth,
                    groupVerboseName,
                });
            }

            // Recursively process child items
            if (typeof item === "object" && "items" in item && item.items && Array.isArray(item.items) && item.items.length) {
                processItems(item.items as BaseNavItem[] | NavSubItem[], depth + 1, groupVerboseName);
            }
        });
    };

    navGroups.forEach((group) => {
        // Add group itself if it has URL
        if (group.url) {
            const normalizedUrl = normalizeUrl(group.url);
            lookupTable.set(normalizedUrl, {
                url: normalizedUrl,
                verbose_name: undefined,
                verbose_name_plural: group.verbose_name_plural,
                title: group.group,
                depth: 0,
                groupVerboseName: group.verbose_name_plural || group.group,
            });
        }

        // Process group items
        if (group.items?.length) {
            processItems(group.items, 1, group.verbose_name_plural || group.group);
        }
    });

    return lookupTable;
};

/**
 * Finds longest matching static path prefix
 */
const findLongestStaticMatch = (
    pathname: string,
    lookupTable: Map<string, FlatNavItem>
): MatchResult => {
    const segments = pathname.split("/").filter(Boolean);
    const matchedItems: FlatNavItem[] = [];
    let lastMatchIndex = -1;
    let lastStaticUrl = "";

    // Try to match progressively longer paths
    for (let i = 0; i <= segments.length; i++) {
        const testPath = "/" + segments.slice(0, i).join("/");
        const normalizedPath = normalizeUrl(testPath);

        const item = lookupTable.get(normalizedPath);
        if (item) {
            // Only add items with meaningful names
            if (item.verbose_name || item.verbose_name_plural || item.groupVerboseName) {
                matchedItems.push(item);
            }
            lastMatchIndex = i;
            lastStaticUrl = normalizedPath;
        }
    }

    const remainingSegments = segments.slice(lastMatchIndex);


    return { matchedItems, remainingSegments, lastStaticUrl };
};

/********************************************************************************/
/************************** BREADCRUMB ITEM BUILDERS ****************************/
/********************************************************************************/

/**
 * Builds breadcrumb items from matched static navigation items
 */
const buildStaticBreadcrumbs = (matchedItems: FlatNavItem[]): BreadcrumbItem[] => {
    return matchedItems
        .filter((item) => item.url && typeof item.url === "string") // Only include items with URLs
        .map((item) => ({
            name: item.verbose_name_plural || item.verbose_name || item.title,
            url: item.url as unknown as Route,
        }));
};

/**
 * Builds breadcrumb item for immediate strategy (show UUID/ID as-is)
 */
const buildImmediateBreadcrumb = (
    segment: string,
    currentUrl: string,
    isLast: boolean
): BreadcrumbItem => {
    if (isDynamicSegment(segment)) {
        return {
            name: segment,
            url: isLast ? undefined : currentUrl as unknown as Route,
            isLoading: false,
        };
    }

    return {
        name: capitalizeFirst(segment),
        url: isLast ? undefined : currentUrl as unknown as Route,
    };
};

/**
 * Builds breadcrumb item for progressive strategy (loading → data)
 */
const buildProgressiveBreadcrumb = (
    segment: string,
    currentUrl: string,
    isLast: boolean,
    dynamicData?: Record<string, unknown>,
    dataExtractor?: (segment: string, data: unknown) => string | null
): BreadcrumbItem => {
    if (isDynamicSegment(segment)) {
        const displayName = extractDisplayName(segment, dynamicData, dataExtractor);

        return {
            name: displayName || segment,
            url: isLast ? undefined : currentUrl as unknown as Route,
            isLoading: !displayName,
        };
    }

    return {
        name: capitalizeFirst(segment),
        url: isLast ? undefined : currentUrl as unknown as Route,
    };
};

/**
 * Builds breadcrumb items for hybrid strategy (configurable loading/final behavior)
 */
const buildHybridBreadcrumb = (
    segment: string,
    currentUrl: string,
    isLast: boolean,
    options: Required<Pick<HybridBreadcrumbOptions, "loadingBehavior" | "finalBehavior">>,
    dynamicData?: Record<string, unknown>,
    dataExtractor?: (segment: string, data: unknown) => string | null
): BreadcrumbItem[] => {
    if (!isDynamicSegment(segment)) {
        return [{
            name: capitalizeFirst(segment),
            url: isLast ? undefined : currentUrl as unknown as Route,
        }];
    }

    const displayName = extractDisplayName(segment, dynamicData, dataExtractor);
    const isDataAvailable = !!displayName;
    const { loadingBehavior, finalBehavior } = options;

    // Data is available - final state
    if (isDataAvailable) {
        if (finalBehavior === "addAfterUUID") {
            return [
                { name: segment, url: undefined, isLoading: false },
                { name: displayName, url: isLast ? undefined : currentUrl as unknown as Route, isLoading: false },
            ];
        }

        // All other final behaviors show only the display name
        return [{
            name: displayName,
            url: isLast ? undefined : currentUrl as unknown as Route,
            isLoading: false,
        }];
    }

    // Data not available - loading state
    if (loadingBehavior === "hideSegment") {
        return [];
    }

    if (loadingBehavior === "showUUID") {
        return [{
            name: segment,
            url: isLast ? undefined : currentUrl as unknown as Route,
            isLoading: false,
        }];
    }

    // loadingBehavior === "showLoading"
    return [{
        name: "Yükleniyor...",
        url: isLast ? undefined : currentUrl as unknown as Route,
        isLoading: true,
    }];
};

/********************************************************************************/
/******************************* BREADCRUMB HOOKS *******************************/
/********************************************************************************/

/**
 * Strategy 1: Immediate - Shows UUID/ID immediately, no loading state
 * Best for: Simple apps, UUIDs are acceptable to show
 */
export function useBreadcrumbImmediate(navGroups: NavGroup[]) {
    const pathname = usePathname();
    const lookupTable = useMemo(() => createNavLookupTable(navGroups), [navGroups]);

    const breadcrumbs = useMemo((): BreadcrumbItem[] => {
        /** Alwasy show home icon */
        // if (!pathname || pathname === "/") return [];

        const { matchedItems, remainingSegments, lastStaticUrl } = findLongestStaticMatch(
            pathname,
            lookupTable
        );

        const result = buildStaticBreadcrumbs(matchedItems);
        let currentUrl = lastStaticUrl;

        remainingSegments.forEach((segment, index) => {
            currentUrl += `/${segment}`;
            const isLast = index === remainingSegments.length - 1;
            result.push(buildImmediateBreadcrumb(segment, currentUrl, isLast));
        });

        return result;
    }, [pathname, lookupTable]);

    return { breadcrumbs };
}

/**
 * Strategy 2: Progressive - Shows loading first, then replaces with actual data
 * Best for: Apps with async data fetching, better UX than showing UUIDs
 */
export function useBreadcrumbProgressive(
    navGroups: NavGroup[],
    options?: BreadcrumbHookOptions
) {
    const pathname = usePathname();
    const lookupTable = useMemo(() => createNavLookupTable(navGroups), [navGroups]);

    const breadcrumbs = useMemo((): BreadcrumbItem[] => {
        if (!pathname || pathname === "/") return [];

        const { matchedItems, remainingSegments, lastStaticUrl } = findLongestStaticMatch(
            pathname,
            lookupTable
        );

        const result = buildStaticBreadcrumbs(matchedItems);
        let currentUrl = lastStaticUrl;

        remainingSegments.forEach((segment, index) => {
            currentUrl += `/${segment}`;
            const isLast = index === remainingSegments.length - 1;
            result.push(
                buildProgressiveBreadcrumb(
                    segment,
                    currentUrl,
                    isLast,
                    options?.dynamicData,
                    options?.dataExtractor
                )
            );
        });

        return result;
    }, [pathname, lookupTable, options?.dynamicData, options?.dataExtractor]);

    return { breadcrumbs };
}

/**
 * Strategy 3: Hybrid - Configurable loading and final behavior
 * Best for: Complex apps requiring fine-grained control over breadcrumb display
 */
export function useBreadcrumbHybrid(
    navGroups: NavGroup[],
    options?: HybridBreadcrumbOptions
) {
    const pathname = usePathname();
    const lookupTable = useMemo(() => createNavLookupTable(navGroups), [navGroups]);

    const breadcrumbs = useMemo((): BreadcrumbItem[] => {
        if (!pathname || pathname === "/") return [];

        const { matchedItems, remainingSegments, lastStaticUrl } = findLongestStaticMatch(
            pathname,
            lookupTable
        );

        const result = buildStaticBreadcrumbs(matchedItems);
        let currentUrl = lastStaticUrl;

        const behaviorOptions = {
            loadingBehavior: options?.loadingBehavior ?? "showLoading",
            finalBehavior: options?.finalBehavior ?? "replaceLoading",
        };

        remainingSegments.forEach((segment, index) => {
            currentUrl += `/${segment}`;
            const isLast = index === remainingSegments.length - 1;

            const items = buildHybridBreadcrumb(
                segment,
                currentUrl,
                isLast,
                behaviorOptions,
                options?.dynamicData,
                options?.dataExtractor
            );

            result.push(...items);
        });

        return result;
    }, [pathname, lookupTable, options]);

    return { breadcrumbs };
}

/********************************************************************************/
/****************************** OPTIMIZATION HOOKS ******************************/
/********************************************************************************/

/**
 * Measures container width with proper fallback chain
 */
const useMeasureContainer = (
    containerRef: React.RefObject<HTMLOListElement | null>
): number => {
    const [width, setWidth] = useState(0);

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        // Traverse up to find the wrapper element
        const navElement = containerRef.current.parentElement;
        const wrapperElement = navElement?.parentElement;
        const measureElement = wrapperElement || navElement || containerRef.current;

        // Immediate measurement
        const initialWidth = measureElement.offsetWidth;
        if (initialWidth > 0) {
            setTimeout(() => {
                setWidth(initialWidth);
            }, 0);
        }

        // Observe size changes
        let hasSetInitialWidth = initialWidth > 0;
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const newWidth = entry.contentRect.width;

                if (!hasSetInitialWidth && newWidth === 0) continue;

                if (newWidth > 0) {
                    setWidth(newWidth);
                    hasSetInitialWidth = true;
                }
            }
        });

        resizeObserver.observe(measureElement);

        return () => resizeObserver.disconnect();
    }, [containerRef]);

    return width;
};

/**
 * Measures individual breadcrumb item widths
 */
const useMeasureItems = (
    itemRefs: React.RefObject<(HTMLSpanElement | null)[]>,
    itemCount: number
): [number[], () => void] => {
    const [widths, setWidths] = useState<number[]>([]);
    const itemRefsRef = useRef(itemRefs);

    useEffect(() => {
        itemRefsRef.current = itemRefs;
    }, [itemRefs]);

    const measure = useCallback(() => {
        const newWidths: number[] = [];
        itemRefsRef.current.current.forEach((ref: HTMLSpanElement | null) => {
            if (ref) {
                newWidths.push(ref.offsetWidth);
            }
        });
        setWidths(newWidths);
    }, []);

    // Reset on item count change
    useEffect(() => {
        setTimeout(() => {
            setWidths([]);
        }, 0);
    }, [itemCount]);

    // Measure after DOM updates
    useEffect(() => {
        if (itemRefs.current.length === 0 || !measure) return;

        const timeoutId = setTimeout(measure, 0);
        return () => clearTimeout(timeoutId);
    }, [itemCount, measure, itemRefs]);

    return [widths, measure];
};

/**
 * Calculates visible items using Google Drive-style algorithm
 */
const useCalculateVisibleItems = (
    containerWidth: number,
    itemWidths: number[],
    itemCount: number,
    breakpoint: BreakpointKey,
    options?: OptimizationOptions
): { visibleCount: number; overflowCount: number } => {
    return useMemo(() => {
        if (itemWidths.length === 0 || containerWidth === 0) {
            return { visibleCount: itemCount, overflowCount: 0 };
        }

        const config = BREAKPOINT_WIDTH_CONFIG[breakpoint];
        const separatorWidth = options?.separatorWidth ?? DEFAULT_SEPARATOR_WIDTH;
        const homeIconWidth = options?.homeIconRef?.current?.offsetWidth ?? DEFAULT_HOME_ICON_WIDTH;
        const dropdownWidth = DEFAULT_DROPDOWN_WIDTH;

        const homeWidth = homeIconWidth + separatorWidth;
        let availableWidth = containerWidth - homeWidth;

        // Calculate from end (Google Drive style - last items always visible)
        const calculateFromEnd = (available: number): number => {
            let usedWidth = 0;
            let count = 0;

            for (let i = itemWidths.length - 1; i >= 0; i--) {
                const itemWidth = Math.min(itemWidths[i], config.max);
                const separatorNeeded = count > 0 ? separatorWidth : 0;
                const needed = itemWidth + separatorNeeded;

                if (usedWidth + needed <= available) {
                    usedWidth += needed;
                    count++;
                } else {
                    break;
                }
            }

            return count;
        };

        let visibleCount = calculateFromEnd(availableWidth);

        // If overflow needed, recalculate with dropdown space
        if (visibleCount < itemCount) {
            availableWidth = containerWidth - homeWidth - dropdownWidth - separatorWidth;
            visibleCount = calculateFromEnd(availableWidth);
        }

        visibleCount = Math.max(MIN_VISIBLE_ITEMS, visibleCount);
        const overflowCount = itemCount - visibleCount;

        return { visibleCount, overflowCount };
    }, [containerWidth, itemWidths, itemCount, breakpoint, options]);
};

/**
 * Hook to measure container and items for breadcrumb optimization
 * Implements Google Drive-style responsive breadcrumb behavior
 */
export function useBreadcrumbOptimization(
    itemCount: number,
    options?: OptimizationOptions
): OptimizationResult {
    const containerRef = useRef<HTMLOListElement>(null);
    const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);

    const containerWidth = useMeasureContainer(containerRef);
    const [itemWidths, measureItems] = useMeasureItems(itemRefs, itemCount);
    const [breakpoint, setBreakpoint] = useState<BreakpointKey>("mobile");

    // Update breakpoint when container width changes
    useEffect(() => {
        if (containerWidth > 0) {
            setTimeout(() => {
                setBreakpoint(getBreakpoint(containerWidth));
            }, 0);
        }
    }, [containerWidth]);

    // Re-measure items when container resizes
    useEffect(() => {
        if (containerWidth > 0) {
            setTimeout(() => {
                measureItems();
            }, 0);
        }
    }, [containerWidth, measureItems]);

    const { visibleCount, overflowCount } = useCalculateVisibleItems(
        containerWidth,
        itemWidths,
        itemCount,
        breakpoint,
        options
    );

    const isReady =
        containerWidth > 0 &&
        itemWidths.length === itemCount &&
        itemWidths.every((w) => w > 0);

    const config = BREAKPOINT_WIDTH_CONFIG[breakpoint];

    return {
        containerRef,
        itemRefs,
        containerWidth,
        itemWidths,
        breakpoint,
        visibleCount,
        overflowCount,
        minWidth: config.min,
        maxWidth: config.max,
        isReady,
        measureItems,
    };
}