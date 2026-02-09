"use client";

import React from "react";
import { useBreadcrumbHybrid } from "./hooks";
import { BreadcrumbBase } from "./base";
import { SIDEBAR_NAVIGATION } from "@/constants/navigation/sidebar.constants";

/********************************************************************************/
/*********************************** TYPES **************************************/
/********************************************************************************/

/**
 * Defines how breadcrumb segments appear during the loading phase
 */
export type LoadingBehavior = "showUUID" | "showLoading" | "hideSegment";

/**
 * Defines how breadcrumb segments appear after data is fetched
 */
export type FinalBehavior = "replaceUUID" | "replaceLoading" | "addAfterUUID" | "showOnly";

/**
 * Configuration options for hybrid breadcrumb behavior
 */
export interface HybridBreadcrumbOptions {
  /**
   * Behavior during the loading phase
   * - "showUUID": Display the raw UUID/ID while loading
   * - "showLoading": Display a loading skeleton
   * - "hideSegment": Hide the segment completely until loaded
   * 
   * @default "showLoading"
   */
  loadingBehavior?: LoadingBehavior;

  /**
   * Behavior after data is loaded
   * - "replaceUUID": Replace the UUID with the actual data
   * - "replaceLoading": Replace the loading state with the actual data
   * - "addAfterUUID": Keep UUID and add data after it (e.g., "uuid-123 | John Doe")
   * - "showOnly": Only show the fetched data, remove any previous state
   * 
   * @default "replaceLoading"
   */
  finalBehavior?: FinalBehavior;
}

export interface HybridBreadcrumbProps {
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
   * Configuration options for loading and final behavior
   */
  options?: HybridBreadcrumbOptions;

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
 * Hybrid Breadcrumb Strategy Component
 * 
 * This component implements the Strategy pattern with configurable behavior options.
 * It combines aspects of both immediate and progressive strategies, allowing you to
 * customize how breadcrumbs appear during loading and after data is fetched.
 * 
 * This is the most flexible breadcrumb strategy, ideal when you need fine-grained
 * control over the user experience.
 * 
 * Use this when:
 * - You need custom loading/loaded state behaviors
 * - Different segments require different display strategies
 * - You want to balance immediate feedback with data accuracy
 * - You need to A/B test different breadcrumb behaviors
 * 
 * Features:
 * - Configurable loading behavior (show UUID, loading state, or hide)
 * - Configurable final behavior (replace, append, or show only)
 * - Smooth transitions between all states
 * - Full control over UX progression
 * 
 * @example
 * ```tsx
 * // Show UUID immediately, then replace with data
 * <HybridBreadcrumb
 *   dynamicData={{ userId: { name: "John Doe" } }}
 *   options={{
 *     loadingBehavior: "showUUID",
 *     finalBehavior: "replaceUUID"
 *   }}
 * />
 * 
 * // Show loading state, then replace with data
 * <HybridBreadcrumb
 *   dynamicData={{ productId: { title: "Product Name" } }}
 *   options={{ 
 *     loadingBehavior: "showLoading",
 *     finalBehavior: "replaceLoading"
 *   }}
 * />
 * 
 * // Hide during loading, show only data when ready
 * <HybridBreadcrumb
 *   dynamicData={{ orderId: { number: "ORD-123" } }}
 *   options={{
 *     loadingBehavior: "hideSegment",
 *     finalBehavior: "showOnly"
 *   }}
 * />
 * 
 * // Show UUID and append data (dual display)
 * <HybridBreadcrumb
 *   dynamicData={{ customerId: { name: "Jane Smith" } }}
 *   options={{
 *     loadingBehavior: "showUUID",
 *     finalBehavior: "addAfterUUID"
 *   }}
 * />
 * ```
 */
export function HybridBreadcrumb({
  dynamicData,
  dataExtractor,
  options = {
    loadingBehavior: "showLoading",
    finalBehavior: "replaceLoading",
  },
  navigationStructure = SIDEBAR_NAVIGATION,
}: HybridBreadcrumbProps = {}) {
  const { breadcrumbs } = useBreadcrumbHybrid(navigationStructure, {
    dynamicData,
    dataExtractor,
    ...options,
  });

  return <BreadcrumbBase breadcrumbs={breadcrumbs} showSkeleton />;
}

/**
 * Default export for convenience
 */
export default HybridBreadcrumb;