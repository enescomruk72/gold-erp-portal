/**
 * Breadcrumb Components - Barrel Export
 * 
 * This file provides a centralized export point for all breadcrumb components,
 * following the Facade pattern to simplify imports.
 * 
 * Design Patterns Used:
 * - Strategy Pattern: Each breadcrumb component implements a different strategy
 * - Template Method: BreadcrumbBase provides the common algorithm skeleton
 * - Facade Pattern: This barrel export simplifies the component API
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Each component has one specific breadcrumb strategy
 * - Open/Closed: Easy to add new strategies without modifying existing code
 * - Liskov Substitution: All strategies can be used interchangeably
 * - Interface Segregation: Each strategy exposes only relevant props
 * - Dependency Inversion: Components depend on abstractions (hooks, types)
 */

// Base component and utilities
export { BreadcrumbBase, SEPARATOR_WIDTH } from "./base";
export type { BreadcrumbBaseProps } from "./base";

// Immediate Strategy
export { ImmediateBreadcrumb, default as Immediate } from "./immediate-breadcrumb";
export type { ImmediateBreadcrumbProps } from "./immediate-breadcrumb";

// Progressive Strategy
export { ProgressiveBreadcrumb, default as Progressive } from "./progressive-breadcrumb";
export type { ProgressiveBreadcrumbProps } from "./progressive-breadcrumb";

// Hybrid Strategy
export {
    HybridBreadcrumb,
    default as Hybrid,
} from "./hybrid-breadcrumb";
export type {
    HybridBreadcrumbProps,
    HybridBreadcrumbOptions,
    LoadingBehavior,
    FinalBehavior,
} from "./hybrid-breadcrumb";

/**
 * Usage Examples:
 * 
 * // Named imports (recommended for tree-shaking)
 * import { ImmediateBreadcrumb, ProgressiveBreadcrumb, HybridBreadcrumb } from './breadcrumbs';
 * 
 * // Default imports
 * import { Immediate, Progressive, Hybrid } from './breadcrumbs';
 * 
 * // Type imports
 * import type { ProgressiveBreadcrumbProps, HybridBreadcrumbOptions } from './breadcrumbs';
 * 
 * // Base component import (for custom implementations)
 * import { BreadcrumbBase } from './breadcrumbs';
 */