/**
 * @fileoverview Component Animation Variants
 * @description Specialized animation variants for specific UI components
 * @version 1.0.0
 * 
 * This file follows the Open/Closed Principle, providing variants
 * that are specific to common UI component patterns.
 * 
 * Each component type has optimized variants for its specific use case:
 * - Breadcrumbs: Progressive loading reveal
 * - Modals: Centered scale entrance
 * - Dropdowns: Directional reveals
 * - Sidebars: Sliding panels
 * - Toasts: Positioned notifications
 * - Lists: Staggered item reveals
 */

import type { Variants } from "motion/react";

// ============================================================================
// NAVIGATION COMPONENTS
// ============================================================================

/**
 * Breadcrumb Loading Variants
 * Smooth fade-in after layout measurements are ready
 * Prevents layout shift by revealing after calculation
 * 
 * @example
 * ```tsx
 * <motion.ol
 *   variants={breadcrumbVariants}
 *   animate={isReady ? "ready" : "loading"}
 * />
 * ```
 */
export const breadcrumbVariants: Variants = {
    loading: { opacity: 0 },
    ready: { opacity: 1 },
};

// ============================================================================
// OVERLAY COMPONENTS
// ============================================================================

/**
 * Modal/Dialog Variants
 * Centered overlay with subtle scale and vertical offset
 * Creates a "floating up" effect for modals
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={modalVariants}
 *   initial="hidden"
 *   animate="visible"
 *   exit="exit"
 * />
 * ```
 */
export const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 10 },
};

/**
 * Dropdown/Popover Variants
 * Attached overlay with upward reveal
 * Optimized for menus and popovers that appear below triggers
 * 
 * @example
 * ```tsx
 * <motion.div variants={dropdownVariants} />
 * ```
 */
export const dropdownVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: -5 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -5 },
};

// ============================================================================
// PANEL COMPONENTS
// ============================================================================

/**
 * Sidebar/Drawer Slide Variants
 * Full-height panels that slide in from screen edges
 * Supports both left and right positioning
 * 
 * @example
 * ```tsx
 * <motion.aside variants={sidebarVariants.left} />
 * <motion.aside variants={sidebarVariants.right} />
 * ```
 */
export const sidebarVariants = {
    left: {
        hidden: { x: "-100%" },
        visible: { x: 0 },
        exit: { x: "-100%" },
    },
    right: {
        hidden: { x: "100%" },
        visible: { x: 0 },
        exit: { x: "100%" },
    },
} as const satisfies Record<string, Variants>;

// ============================================================================
// NOTIFICATION COMPONENTS
// ============================================================================

/**
 * Toast/Notification Variants
 * Positioned notifications with directional entrance
 * Supports both top and bottom screen positions
 * 
 * @example
 * ```tsx
 * // Top notification
 * <motion.div variants={toastVariants.top} />
 * 
 * // Bottom notification
 * <motion.div variants={toastVariants.bottom} />
 * ```
 */
export const toastVariants = {
    top: {
        hidden: { opacity: 0, y: -20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -20, scale: 0.95 },
    },
    bottom: {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 20, scale: 0.95 },
    },
} as const satisfies Record<string, Variants>;

// ============================================================================
// LIST COMPONENTS
// ============================================================================

/**
 * List Container Variants
 * Parent container for staggered list animations
 * Controls the timing of child animations
 * 
 * @example
 * ```tsx
 * <motion.ul variants={listContainerVariants}>
 *   {items.map(item => (
 *     <motion.li key={item.id} variants={listItemVariants}>
 *       {item.content}
 *     </motion.li>
 *   ))}
 * </motion.ul>
 * ```
 */
export const listContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.02,
        },
    },
};

/**
 * List Item Variants
 * Individual item animation for staggered lists
 * Works in conjunction with listContainerVariants
 */
export const listItemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
};

// ============================================================================
// VARIANT COLLECTIONS
// ============================================================================

/**
 * All component variants grouped by category
 * Useful for documentation and discovering available variants
 */
export const COMPONENT_VARIANTS = {
    navigation: {
        breadcrumb: breadcrumbVariants,
    },
    overlay: {
        modal: modalVariants,
        dropdown: dropdownVariants,
    },
    panel: {
        sidebar: sidebarVariants,
    },
    notification: {
        toast: toastVariants,
    },
    list: {
        container: listContainerVariants,
        item: listItemVariants,
    },
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type SidebarPosition = keyof typeof sidebarVariants;
export type ToastPosition = keyof typeof toastVariants;
export type ComponentVariantCategory = keyof typeof COMPONENT_VARIANTS;