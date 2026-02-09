"use client";

import React from "react";
import { useBreadcrumbProgressive } from "./hooks";
import { BreadcrumbBase } from "./base";
import { SIDEBAR_NAVIGATION } from "@/constants/navigation/sidebar.constants";

/********************************************************************************/
/*********************************** TYPES **************************************/
/********************************************************************************/

export interface ProgressiveBreadcrumbProps {
  /**
   * Dynamic data object containing the actual values for breadcrumb segments
   * Keys should match the dynamic segment identifiers
   */
  dynamicData?: Record<string, unknown>;

  /**
   * Custom function to extract display values from dynamic data
   * @param segment - The URL segment identifier (e.g., "id", "uuid")
   * @param data - The full dynamic data object
   * @returns The display value or null if not found
   */
  dataExtractor?: (segment: string, data: unknown) => string | null;

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
 * Progressive Breadcrumb Strategy Component
 * 
 * This component implements the Strategy pattern for breadcrumb rendering.
 * It uses the "progressive" strategy where breadcrumbs initially show a loading
 * state, then progressively replace with actual data as it becomes available.
 * 
 * Use this when:
 * - You need to fetch and display dynamic data (user names, product titles, etc.)
 * - You want to show loading indicators while data is being fetched
 * - User experience benefits from seeing the loading progress
 * 
 * Features:
 * - Shows skeleton loading states for dynamic segments
 * - Automatically replaces loading states with real data
 * - Smooth transitions between states
 * 
 * @example
 * ```tsx
 * // Basic usage with dynamic data
 * <ProgressiveBreadcrumb
 *   dynamicData={{
 *     userId: { name: "John Doe" },
 *     productId: { title: "Product Name" }
 *   }}
 * />
 * 
 * // With custom data extractor
 * <ProgressiveBreadcrumb
 *   dynamicData={myData}
 *   dataExtractor={(segment, data) => {
 *     if (segment === "userId") return data.user?.fullName;
 *     if (segment === "productId") return data.product?.displayName;
 *     return null;
 *   }}
 * />
 * ```
 */
export function ProgressiveBreadcrumb({
  dynamicData,
  dataExtractor,
  navigationStructure = SIDEBAR_NAVIGATION,
}: ProgressiveBreadcrumbProps = {}) {
  const { breadcrumbs } = useBreadcrumbProgressive(navigationStructure, {
    dynamicData,
    dataExtractor,
  });

  return <BreadcrumbBase breadcrumbs={breadcrumbs} showSkeleton />;
}

/**
 * Default export for convenience
 */
export default ProgressiveBreadcrumb;