"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter, usePathname } from 'next/navigation';
import { AnimatePresence, motion, Transition } from 'framer-motion';
import { composeRefs } from "@/lib/compose-refs";
import Link from 'next/link';
import { Route } from 'next';
// Animation transition
const transition: Transition = {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.15
};

// Helper function for hover animation
const getHoverAnimationProps = (hoveredRect: DOMRect, navRect: DOMRect, navScrollLeft: number) => ({
    x: hoveredRect.left - navRect.left - 1 + navScrollLeft,
    y: hoveredRect.top - navRect.top - 1,
    width: hoveredRect.width + 2,
    height: hoveredRect.height + 2,
});

// Tab context
interface LinkTabsContextType {
    activeTab: string;
    isLoading?: boolean;
    skeleton?: React.ReactNode;
}

const LinkTabsContext = createContext<LinkTabsContextType | undefined>(undefined);

export const useLinkTabsContext = () => {
    const context = useContext(LinkTabsContext);
    if (!context) {
        throw new Error('LinkTabs bileşenleri LinkTabsContainer içinde kullanılmalıdır');
    }
    return context;
};

// Ana LinkTabs Container bileşeni
interface LinkTabsContainerProps {
    children: React.ReactNode;
    isLoading?: boolean;
    className?: string;
}

const LinkTabsContainer = ({
    children,
    isLoading = false,
    className
}: LinkTabsContainerProps) => {
    return (
        <LinkTabsContext.Provider value={{ activeTab: '', isLoading }}>
            <div className={cn("relative flex w-full items-center justify-between border-b overflow-x-auto scrollbar-none", className)}>
                {children}
            </div>
        </LinkTabsContext.Provider>
    );
};

// LinkTabs List bileşeni
interface LinkTabsListProps extends React.HTMLAttributes<HTMLUListElement> {
    children?: React.ReactNode;
    skeleton?: React.ReactNode;
}

const LinkTabsList = React.forwardRef<HTMLElement, LinkTabsListProps>(
    ({ className, children, skeleton, ...props }, ref) => {
        const { isLoading } = useLinkTabsContext();
        const [buttonRefs, setButtonRefs] = useState<Array<HTMLButtonElement | null>>([]);
        const [hoveredTabIndex, setHoveredTabIndex] = useState<number | null>(null);
        const navRef = useRef<HTMLElement>(null);
        const pathname = usePathname();

        // Button refs'i güncelle
        useEffect(() => {
            const buttons = navRef.current?.querySelectorAll('button');
            if (buttons) {
                setButtonRefs(Array.from(buttons));
            }
        }, [children]);

        const navRect = navRef.current?.getBoundingClientRect();
        const navScrollLeft = navRef.current?.scrollLeft ?? 0;

        const hoveredRect = buttonRefs[hoveredTabIndex ?? -1]?.getBoundingClientRect();

        // Active tab detection - daha basit yaklaşım
        const activeButtonIndex = buttonRefs.findIndex((button) => {
            if (!button) return false;
            const href = button.getAttribute('data-href');
            return href && pathname === href; // Exact match kullan
        });

        const selectedRect = buttonRefs[activeButtonIndex]?.getBoundingClientRect();

        if (isLoading) {
            return skeleton ? (
                <nav role="tablist" className={cn("flex gap-5", className)} {...props}>
                    {skeleton}
                </nav>
            ) : (
                <nav role="tablist" className={cn("flex gap-5", className)} {...props}>
                    {[1, 2].map((i) => (
                        <div key={i}>
                            <Skeleton className="h-8 w-20" />
                        </div>
                    ))}
                </nav>
            );
        }

        return (
            <nav
                ref={composeRefs(ref, navRef)}
                role="tablist"
                className={cn(
                    "flex items-center relative z-0 py-2 px-2 gap-0.5 w-full dark:bg-accent overflow-x-auto scrollbar-none",
                    "scroll-smooth snap-x snap-mandatory",
                    "max-w-full",
                    className
                )}
                onPointerLeave={() => setHoveredTabIndex(null)}
                {...props}
            >
                {React.Children.map(children, (child, index) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child as React.ReactElement<LinkTabsTriggerProps & { index: number }>, {
                            index,
                            onHover: setHoveredTabIndex
                        });
                    }
                    return child;
                })}

                {/* Hover Animation */}
                <AnimatePresence>
                    {hoveredRect && navRect && (
                        <motion.div
                            key="hover"
                            className={cn(
                                'absolute z-20 top-0 left-0 rounded-md bg-foreground/5',
                            )}
                            initial={{ ...getHoverAnimationProps(hoveredRect, navRect, navScrollLeft), opacity: 0 }}
                            animate={{ ...getHoverAnimationProps(hoveredRect, navRect, navScrollLeft), opacity: 1 }}
                            exit={{ ...getHoverAnimationProps(hoveredRect, navRect, navScrollLeft), opacity: 0 }}
                            transition={transition}
                        />
                    )}
                </AnimatePresence>

                {/* Active Tab Indicator */}
                <AnimatePresence>
                    {selectedRect && navRect && activeButtonIndex !== -1 && (
                        <motion.div
                            className={cn(
                                'absolute z-20 bottom-0 left-0 h-[4px] rounded-t-2xl bg-primary',
                            )}
                            initial={false}
                            animate={{
                                width: selectedRect.width + 2,
                                x: `calc(${selectedRect.left - navRect.left - 1 + navScrollLeft}px)`,
                                opacity: 1
                            }}
                            transition={transition}
                        />
                    )}
                </AnimatePresence>
            </nav>
        );
    }
);
LinkTabsList.displayName = "LinkTabsList";

// LinkTabs Trigger bileşeni
interface LinkTabsTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
    href: string;
    children: React.ReactNode;
    exact?: boolean;
    index?: number;
    onHover?: (index: number | null) => void;
}

const LinkTabsTrigger = React.forwardRef<HTMLButtonElement, LinkTabsTriggerProps>(
    ({ className, href, children, exact = false, index = 0, onHover, ...props }, ref) => {
        const router = useRouter();
        const pathname = usePathname();
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        const [, setButtonRef] = useState<HTMLButtonElement | null>(null);

        // Aktif elemanı görünür yap
        React.useEffect(() => {
            if (isActive) {
                const timer = setTimeout(() => {
                    const activeElement = document.querySelector(`[data-state="active"]`);
                    if (activeElement) {
                        activeElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                            inline: 'center'
                        });
                    }
                }, 100);

                return () => clearTimeout(timer);
            }
        }, [isActive]);

        const handleClick = () => {
            if (isActive) return; // Zaten aktifse tıklamayı engelle

            try {
                router.push(href as Route);
            } catch (error) {
                console.error('Navigation error:', error);
            }
        };

        return (
            <Link
                href={href as Route}

            >
                <button
                    ref={(el) => {
                        if (el) {
                            setButtonRef(el);
                        }
                        if (typeof ref === 'function') {
                            ref(el);
                        } else if (ref) {
                            ref.current = el;
                        }
                    }}
                    data-state={isActive ? "active" : "inactive"}
                    data-href={href}
                    className={cn(
                        "text-sm font-medium relative rounded-md flex items-center h-8 px-3 sm:px-4 z-30 bg-transparent cursor-pointer select-none transition-colors hover:text-primary shrink-0 whitespace-nowrap",
                        className
                    )}
                    onPointerEnter={() => onHover?.(index)}
                    onFocus={() => onHover?.(index)}
                    onPointerLeave={() => onHover?.(null)}
                    onClick={handleClick}
                    {...props}
                >
                    <div className="inline-flex items-center gap-2 py-1.5 w-full h-full">
                        <span
                            className={cn(
                                'block font-medium transition-colors',
                                isActive
                                    ? 'text-primary'
                                    : 'text-foreground/80',
                            )}
                        >
                            {children}
                        </span>
                    </div>
                </button>
            </Link>
        );
    }
);
LinkTabsTrigger.displayName = "LinkTabsTrigger";

// Ana LinkTabs bileşeni ve alt bileşenleri export et
const LinkTabs = Object.assign(LinkTabsContainer, {
    List: LinkTabsList,
    Trigger: LinkTabsTrigger,
});

export default LinkTabs; 