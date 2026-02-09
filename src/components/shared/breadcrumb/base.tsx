"use client";

import React, { useRef, useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight, Home, MoreHorizontal } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useBreadcrumbOptimization } from "./hooks";
import { breadcrumbVariants, TRANSITIONS } from "@/lib/animations";
import type { BreadcrumbItem as BreadcrumbItemType } from "./types";

/********************************************************************************/
/********************************** CONSTANTS ***********************************/
/********************************************************************************/

export const SEPARATOR_WIDTH = 20;

/********************************************************************************/
/*********************************** TYPES **************************************/
/********************************************************************************/

export interface BreadcrumbBaseProps {
  breadcrumbs: BreadcrumbItemType[];
  showSkeleton?: boolean;
}

/********************************************************************************/
/******************************* SUB-COMPONENTS *********************************/
/********************************************************************************/

/**
 * Home icon breadcrumb item
 */
const HomeIcon = React.forwardRef<HTMLAnchorElement>((_, ref) => (
  <BreadcrumbItem>
    <BreadcrumbLink asChild>
      <Button variant="ghost" size="icon" asChild>
        <Link href="/" ref={ref}>
          <Home className="size-[18px]" />
        </Link>
      </Button>
    </BreadcrumbLink>
  </BreadcrumbItem>
));
HomeIcon.displayName = "HomeIcon";

/**
 * Separator component
 */
const Separator: React.FC<{ className?: string }> = ({ className }) => (
  <BreadcrumbSeparator className={className}>
    <ChevronRight className="size-4!" />
  </BreadcrumbSeparator>
);

/**
 * Hidden measurement spans for width calculation
 */
const MeasurementSpans: React.FC<{
  items: BreadcrumbItemType[];
  itemRefs: React.RefObject<(HTMLSpanElement | null)[]>;
}> = ({ items, itemRefs }) => (
  <>
    {items.map((item, index) => (
      <span
        key={`measure-${index}`}
        ref={(el) => {
          itemRefs.current![index] = el;
        }}
        className="absolute opacity-0 pointer-events-none whitespace-nowrap"
        style={{ visibility: "hidden", position: "absolute", left: "-9999px" }}
        aria-hidden="true"
      >
        {item.name}
      </span>
    ))}
  </>
);

/**
 * Overflow dropdown menu
 */
const OverflowMenu: React.FC<{ items: BreadcrumbItemType[] }> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <>
      <BreadcrumbItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              aria-label="Show more breadcrumbs"
              className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 focus-visible:outline-none"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {items.map((item, index) => (
              <DropdownMenuItem key={`overflow-${index}`} asChild>
                <Link href={item.url || "#"}>{item.name}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </BreadcrumbItem>
      <Separator className="shrink-0" />
    </>
  );
};

/**
 * Individual breadcrumb item renderer
 */
const BreadcrumbItemRenderer: React.FC<{
  item: BreadcrumbItemType;
  isLast: boolean;
  maxWidth: number;
  showSkeleton?: boolean;
}> = ({ item, isLast, maxWidth, showSkeleton = false }) => (
  <>
    <BreadcrumbItem className="min-w-0">
      {showSkeleton && item.isLoading ? (
        <Skeleton className="h-4 w-20" />
      ) : (
        <div className="truncate" style={{ maxWidth: `${maxWidth}px` }}>
          {isLast ? (
            <BreadcrumbPage className="truncate block">{item.name}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href={item.url || "#"} className="truncate block">
                {item.name}
              </Link>
            </BreadcrumbLink>
          )}
        </div>
      )}
    </BreadcrumbItem>
    {!isLast && <Separator className="shrink-0" />}
  </>
);

/**
 * Visible breadcrumb items
 */
const VisibleItems: React.FC<{
  items: BreadcrumbItemType[];
  maxWidth: number;
  showSkeleton?: boolean;
}> = ({ items, maxWidth, showSkeleton = false }) => (
  <>
    {items.map((item, index) => {
      const isLast = index === items.length - 1;
      return (
        <React.Fragment key={`visible-${index}-${item.name}`}>
          <BreadcrumbItemRenderer
            item={item}
            isLast={isLast}
            maxWidth={maxWidth}
            showSkeleton={showSkeleton}
          />
        </React.Fragment>
      );
    })}
  </>
);

/********************************************************************************/
/******************************** BASE COMPONENT ********************************/
/********************************************************************************/

/**
 * Base breadcrumb component with shared logic
 * This component implements the Template Method pattern, providing
 * the skeleton of the breadcrumb rendering algorithm.
 */
export const BreadcrumbBase: React.FC<BreadcrumbBaseProps> = ({
  breadcrumbs,
  showSkeleton = false,
}) => {
  const homeIconRef = useRef<HTMLAnchorElement>(null);

  const { containerRef, itemRefs, overflowCount, maxWidth, isReady } =
    useBreadcrumbOptimization(breadcrumbs.length, {
      homeIconRef,
      separatorWidth: SEPARATOR_WIDTH,
    });

  // Memoize overflow and visible items calculation
  const { overflowItems, visibleItems } = useMemo(() => {
    if (overflowCount > 0) {
      return {
        overflowItems: breadcrumbs.slice(0, overflowCount),
        visibleItems: breadcrumbs.slice(overflowCount),
      };
    }
    return {
      overflowItems: [],
      visibleItems: breadcrumbs,
    };
  }, [breadcrumbs, overflowCount]);

  return (
    <div className="flex-1 min-w-0 overflow-hidden">
      <Breadcrumb>
        <motion.ol
          ref={containerRef}
          data-slot="breadcrumb-list"
          className="text-muted-foreground flex items-center gap-1.5 text-sm wrap-break-words sm:gap-2.5 flex-nowrap overflow-hidden"
          variants={breadcrumbVariants}
          initial="loading"
          animate={isReady ? "ready" : "loading"}
          transition={TRANSITIONS.fade.fast}
        >
          <HomeIcon ref={homeIconRef} />

          {breadcrumbs.length > 0 && <Separator />}

          <MeasurementSpans items={breadcrumbs} itemRefs={itemRefs} />

          <OverflowMenu items={overflowItems} />

          <VisibleItems items={visibleItems} maxWidth={maxWidth} showSkeleton={showSkeleton} />
        </motion.ol>
      </Breadcrumb>
    </div>
  );
};