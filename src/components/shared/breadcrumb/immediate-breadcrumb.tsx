"use client";

import React from "react";
import { useBreadcrumbImmediate } from "./hooks";
import { BreadcrumbBase } from "./base";
import { SIDEBAR_NAVIGATION } from "@/constants/navigation/sidebar.constants";

/********************************************************************************/
/*********************************** TYPES **************************************/
/********************************************************************************/

export interface ImmediateBreadcrumbProps {
  /**
   * Optional navigation structure override
   * If not provided, uses the default SIDEBAR_NAVIGATION
   */
  navigationStructure?: typeof SIDEBAR_NAVIGATION;
}

/********************************************************************************/
/****************************** STRATEGY COMPONENT ******************************/
/********************************************************************************/

/**
 * Immediate Breadcrumb Strategy Component
 * 
 * This component implements the Strategy pattern for breadcrumb rendering.
 * It uses the "immediate" strategy where UUID/ID segments are displayed as-is
 * without any data fetching or transformation.
 * 
 * Use this when:
 * - You want to show the raw URL segments immediately
 * - No dynamic data fetching is needed
 * - Performance is critical and you want minimal overhead
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <ImmediateBreadcrumb />
 * 
 * // With custom navigation structure
 * <ImmediateBreadcrumb navigationStructure={customNavStructure} />
 * ```
 */
export function ImmediateBreadcrumb({
  navigationStructure = SIDEBAR_NAVIGATION,
}: ImmediateBreadcrumbProps = {}) {
  const { breadcrumbs } = useBreadcrumbImmediate(navigationStructure);

  return <BreadcrumbBase breadcrumbs={breadcrumbs} />;
}

/**
 * Default export for convenience
 */
export default ImmediateBreadcrumb;