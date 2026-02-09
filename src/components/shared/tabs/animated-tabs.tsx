'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence, motion, Transition } from 'framer-motion';
import { useQueryState, parseAsString } from 'nuqs';
import { cn } from '@/lib/utils';

export interface Tab {
    label: string;
    value: string;
    subRoutes?: string[];
}

interface AnimatedTabsProps {
    tabs: Tab[];
    defaultTab?: string;
    children?: React.ReactNode | ((selectedTab: Tab) => React.ReactNode);
    onTabChange?: (tab: Tab) => void;
    className?: string;
    tabHeaderClassName?: string;
    tabButtonClassName?: string;
    tabHeaderInnerContainerClassName?: string;
    contentClassName?: string;
    /**
     * Search params key for tab value (e.g., "tab", "section")
     * If provided, tab value will be synced with URL search params
     */
    searchParamKey?: string;
    isSearchParamEnabled?: boolean;
}

const transition: Transition = {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.15
};

const getHoverAnimationProps = (hoveredRect: DOMRect, navRect: DOMRect, navScrollLeft: number) => ({
    x: hoveredRect.left - navRect.left + navScrollLeft - 1,
    y: hoveredRect.top - navRect.top - 1,
    width: hoveredRect.width + 2,
    height: hoveredRect.height + 2
});

function useTabs({
    tabs,
    initialTabId,
    onChange,
    externalTabValue,
    onTabSelect
}: {
    tabs: Tab[];
    initialTabId: string;
    onChange?: (id: string) => void;
    externalTabValue?: string | null;
    onTabSelect?: (tabValue: string) => void;
}) {
    const [[selectedTabIndex, direction], setSelectedTab] = useState(() => {
        const indexOfInitialTab = tabs.findIndex((tab) => tab.value === initialTabId);
        return [indexOfInitialTab === -1 ? 0 : indexOfInitialTab, 0];
    });

    // External value (search params) değiştiğinde tab'ı güncelle
    useEffect(() => {
        if (externalTabValue) {
            const indexOfExternalTab = tabs.findIndex((tab) => tab.value === externalTabValue);
            if (indexOfExternalTab !== -1 && indexOfExternalTab !== selectedTabIndex) {
                setSelectedTab([indexOfExternalTab, 0]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [externalTabValue, tabs]);

    // Tab seçildiğinde callback çağır
    const handleSetSelectedTab = useCallback((input: [number, number]) => {
        setSelectedTab(input);
        const newTab = tabs[input[0]];
        if (newTab && onTabSelect) {
            onTabSelect(newTab.value);
        }
    }, [tabs, onTabSelect]);

    return {
        tabProps: {
            tabs,
            selectedTabIndex,
            onChange,
            setSelectedTab: handleSetSelectedTab
        },
        selectedTab: tabs[selectedTabIndex] || tabs[0],
        contentProps: {
            direction,
            selectedTabIndex
        }
    };
}

function TabContent({ tab }: { tab: Tab }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={transition}
            className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg mt-4 h-[55vh]"
        >
            {/* Güzel bir tasarımla tab içeriklerinin olmadığını gösteren bir bileşen, ayrıca hangi tablarında olduğunu ifade eder */}
            <div className="flex items-center justify-center h-full">
                <p>{tab.label}</p>
                <p>{tab.value}</p>
            </div>
        </motion.div>
    );
}

type TabsProps = {
    tabs: Tab[];
    selectedTabIndex: number;
    setSelectedTab: (input: [number, number]) => void;
    className?: string;
    tabButtonClassName?: string;
};

const TabButton = React.memo(({
    tab,
    index,
    isActive,
    selectedTabIndex,
    setSelectedTab,
    setHoveredTabIndex,
    tabButtonClassName,
    buttonRef
}: {
    tab: Tab;
    index: number;
    isActive: boolean;
    selectedTabIndex: number;
    setSelectedTab: (input: [number, number]) => void;
    setHoveredTabIndex: (index: number | null) => void;
    tabButtonClassName?: string;
    buttonRef: (el: HTMLButtonElement | null) => void;
}) => {
    return (
        <button
            type="button"
            key={tab.value}
            className={cn("text-sm relative rounded-md flex items-center h-10 px-3 z-30 bg-transparent cursor-pointer select-none transition-colors hover:text-primary/80 shrink-0 whitespace-nowrap",
                isActive ? "text-primary!" : "text-foreground/50",
                tabButtonClassName)}
            onPointerEnter={() => setHoveredTabIndex(index)}
            onFocus={() => setHoveredTabIndex(index)}
            onClick={(e) => {
                e.preventDefault();
                setSelectedTab([index, index > selectedTabIndex ? 1 : -1]);
            }}
            ref={buttonRef}
        >
            <span className="block font-medium">
                {tab.label}
            </span>
        </button>
    );
});

TabButton.displayName = 'TabButton';

const Tabs = React.memo(({
    tabs,
    selectedTabIndex,
    setSelectedTab,
    className,
    tabButtonClassName
}: TabsProps) => {
    const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const navRef = useRef<HTMLDivElement>(null);
    const [hoveredTabIndex, setHoveredTabIndex] = useState<number | null>(null);
    const [scrollLeft, setScrollLeft] = useState(0);
    const rafRef = useRef<number | null>(null);

    const [rects, setRects] = useState<{
        nav: DOMRect | null;
        selected: DOMRect | null;
        hovered: DOMRect | null;
    }>({ nav: null, selected: null, hovered: null });

    // Optimized rect calculation with RAF
    const updateRects = useCallback(() => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }

        rafRef.current = requestAnimationFrame(() => {
            setRects({
                nav: navRef.current?.getBoundingClientRect() ?? null,
                selected: buttonRefs.current[selectedTabIndex]?.getBoundingClientRect() ?? null,
                hovered: hoveredTabIndex !== null ?
                    buttonRefs.current[hoveredTabIndex]?.getBoundingClientRect() ?? null : null
            });
        });
    }, [selectedTabIndex, hoveredTabIndex]);

    // Update rects when selection or hover changes
    useEffect(() => {
        updateRects();
    }, [updateRects]);

    // Optimized scroll event handler
    useEffect(() => {
        const nav = navRef.current;
        if (!nav) return;

        const handleScroll = () => {
            setScrollLeft(nav.scrollLeft);
        };

        nav.addEventListener('scroll', handleScroll, { passive: true });
        return () => nav.removeEventListener('scroll', handleScroll);
    }, []);

    // ResizeObserver for responsive updates
    useEffect(() => {
        if (!navRef.current) return;

        const resizeObserver = new ResizeObserver(() => {
            updateRects();
        });

        // Observe nav container
        resizeObserver.observe(navRef.current);

        // Observe all buttons
        buttonRefs.current.forEach(btn => {
            if (btn) resizeObserver.observe(btn);
        });

        return () => resizeObserver.disconnect();
    }, [updateRects, tabs.length]);

    // Cleanup buttonRefs array when tabs change
    useEffect(() => {
        buttonRefs.current = buttonRefs.current.slice(0, tabs.length);
    }, [tabs.length]);

    // Cleanup RAF on unmount
    useEffect(() => {
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    return (
        <nav
            ref={navRef}
            role="tablist"
            className={cn(
                "flex items-center relative z-0 px-2 gap-0.5 w-full dark:bg-accent overflow-x-auto scrollbar-none",
                "scroll-smooth snap-x snap-mandatory",
                "max-w-full",
                className
            )}
            onPointerLeave={() => setHoveredTabIndex(null)}
        >
            {tabs.map((tab, i) => {
                const isActive = selectedTabIndex === i;

                return (
                    <TabButton
                        key={tab.value}
                        tab={tab}
                        index={i}
                        isActive={isActive}
                        selectedTabIndex={selectedTabIndex}
                        setSelectedTab={setSelectedTab}
                        setHoveredTabIndex={setHoveredTabIndex}
                        tabButtonClassName={tabButtonClassName}
                        buttonRef={(el) => {
                            buttonRefs.current[i] = el;
                        }}
                    />
                );
            })}

            <AnimatePresence>
                {rects.hovered && rects.nav && (
                    <motion.div
                        key={`hover-${hoveredTabIndex}`}
                        className={cn(
                            'absolute z-20 top-0 left-0 rounded-md bg-foreground/5',
                        )}
                        initial={{ ...getHoverAnimationProps(rects.hovered, rects.nav, scrollLeft), opacity: 0 }}
                        animate={{ ...getHoverAnimationProps(rects.hovered, rects.nav, scrollLeft), opacity: 1 }}
                        exit={{ ...getHoverAnimationProps(rects.hovered, rects.nav, scrollLeft), opacity: 0 }}
                        transition={transition}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {rects.selected && rects.nav && (
                    <motion.svg
                        key="selected-indicator"
                        className="absolute z-20 bottom-0 left-0"
                        initial={false}
                        animate={{
                            width: rects.selected.width + 2,
                            x: `calc(${rects.selected.left - rects.nav.left + scrollLeft - 1}px)`,
                            opacity: 1
                        }}
                        transition={transition}
                        height="4" // ← Yükseklik
                        style={{ overflow: 'visible' }}
                    >
                        <path
                            d={(() => {
                                const h = 4;          // Yükseklik
                                const inset = 6;     // Üst kenar içerideki mesafe (yamuk açısı)
                                const radius = 6;     // Köşe yuvarlaklığı
                                const w = rects.selected.width;

                                return `
                        M ${inset} 0
                        L ${w - inset} 0
                        Q ${w - inset + radius} 0 ${w} ${radius}
                        L ${w} ${h}
                        L 0 ${h}
                        L 0 ${radius}
                        Q 0 0 ${inset} 0
                        Z
                    `;
                            })()}
                            fill="currentColor"
                            className="text-primary"
                        />
                    </motion.svg>
                )}
            </AnimatePresence>
        </nav>
    );
});

Tabs.displayName = 'Tabs';

export function AnimatedTabs({
    tabs,
    defaultTab,
    children,
    onTabChange,
    className,
    tabHeaderInnerContainerClassName,
    tabHeaderClassName,
    tabButtonClassName,
    contentClassName,
    searchParamKey = 'tab',
    isSearchParamEnabled = false
}: AnimatedTabsProps) {
    // Search params'tan tab value'sini oku
    const [tabFromSearchParams, setTabFromSearchParams] = useQueryState(
        searchParamKey,
        parseAsString
    );

    // Initial tab ID'yi sadece ilk render'da hesapla
    const initialTabId = useMemo(() => {
        if (tabFromSearchParams) {
            const tabExists = tabs.some(tab => tab.value === tabFromSearchParams);
            if (tabExists) {
                return tabFromSearchParams;
            }
        }
        return defaultTab || tabs[0]?.value || '';
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Tab seçildiğinde search params'ı güncelle
    const handleTabSelect = useCallback((tabValue: string) => {
        if (isSearchParamEnabled) {
            setTabFromSearchParams(tabValue);
        }
    }, [setTabFromSearchParams, isSearchParamEnabled]);

    const framer = useTabs({
        tabs,
        initialTabId,
        externalTabValue: tabFromSearchParams,
        onTabSelect: handleTabSelect
    });

    // Tab değiştiğinde onTabChange callback'ini çağır
    useEffect(() => {
        if (onTabChange) {
            onTabChange(framer.selectedTab);
        }
    }, [framer.selectedTab, onTabChange]);

    // Memoize children function call
    const renderedChildren = useMemo(() => {
        if (!children) return null;
        return typeof children === 'function' ? children(framer.selectedTab) : children;
    }, [children, framer.selectedTab]);

    return (
        <div className={cn("w-full", className)}>
            <div className={cn("relative flex w-full items-center justify-between overflow-visible scrollbar-none", tabHeaderInnerContainerClassName)}>
                {/* absolute bottom border */}
                <div className="absolute bottom-0 -left-gutter w-[calc(100%+var(--gutter)*2)] lg:w-[calc(100%+var(--gutter)+calc(var(--base)*2))] h-px bg-border"></div>
                <Tabs {...framer.tabProps} className={tabHeaderClassName} tabButtonClassName={tabButtonClassName} />
            </div>
            {children ? (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={framer.selectedTab.value}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={transition}
                        className={cn("mt-6", contentClassName)}
                    >
                        {renderedChildren}
                    </motion.div>
                </AnimatePresence>
            ) : (
                <AnimatePresence mode="wait">
                    <TabContent tab={framer.selectedTab} />
                </AnimatePresence>
            )}
        </div>
    );
}