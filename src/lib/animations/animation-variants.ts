/**
 * @fileoverview Animation Variants - Common Patterns
 * @description Reusable animation variants for standard interactions
 * @version 1.0.0
 * 
 * This file implements the Strategy pattern, providing different
 * animation strategies that can be applied to components.
 * 
 * Each variant defines the visual states of an animation:
 * - hidden: Initial/exit state
 * - visible: Final/active state
 * 
 * Variants are composable and can be combined with transitions.
 */

import type { Transition, Variants } from "motion/react";

// ============================================================================
// BASIC ANIMATION VARIANTS
// ============================================================================

/**
 * Fade Variants
 * Simple opacity-based visibility toggle
 * 
 * @example
 * ```tsx
 * <motion.div variants={fadeVariants} initial="hidden" animate="visible" />
 * ```
 */
export const fadeVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

/**
 * Fade with Blur Variants
 * Combines opacity change with blur effect for depth perception
 * Useful for modal overlays and background transitions
 * 
 * @example
 * ```tsx
 * <motion.div variants={fadeBlurVariants} />
 * ```
 */
export const fadeBlurVariants: Variants = {
    hidden: { opacity: 0, filter: "blur(6px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
};

/**
 * Scale Variants
 * Size-based entrance/exit with subtle zoom effect
 * Creates a "pop-in" effect common in modern UIs
 * 
 * @example
 * ```tsx
 * <motion.div variants={scaleVariants} />
 * ```
 */
export const scaleVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
};

/**
 * Collapse/Expand Variants
 * Height-based animations for accordion and expandable content
 * Uses "auto" height for flexible content sizing
 * 
 * @example
 * ```tsx
 * <motion.div variants={collapseVariants} animate={isOpen ? "expanded" : "collapsed"} />
 * ```
 */
export const collapseVariants: Variants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { height: "auto", opacity: 1 },
};

// ============================================================================
// DIRECTIONAL SLIDE VARIANTS
// ============================================================================

/**
 * Slide Variants (all directions)
 * Position-based entrance animations from different directions
 * Each direction uses consistent offset values for predictable motion
 */
export const slideVariants = {
    /**
     * Slide from bottom to top
     */
    up: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    },

    /**
     * Slide from top to bottom
     */
    down: {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
    },

    /**
     * Slide from right to left
     */
    left: {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
    },

    /**
     * Slide from left to right
     */
    right: {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    },
} as const satisfies Record<string, Variants>;

// ============================================================================
// VARIANT FACTORY FUNCTIONS
// ============================================================================

/**
 * Create a custom slide variant with specific direction and offset
 * Factory function for dynamic variant generation
 * 
 * @param direction - Direction of the slide animation
 * @param offset - Distance to slide in pixels
 * @returns Configured Variants object
 * 
 * @example
 * ```ts
 * const customSlide = createSlideVariant("up", 50);
 * <motion.div variants={customSlide} />
 * ```
 */
export function createSlideVariant(
    direction: "up" | "down" | "left" | "right",
    offset: number = 20
): Variants {
    const axis = direction === "up" || direction === "down" ? "y" : "x";
    const multiplier = direction === "up" || direction === "left" ? 1 : -1;

    return {
        hidden: { opacity: 0, [axis]: offset * multiplier },
        visible: { opacity: 1, [axis]: 0 },
    };
}

/**
 * Create delayed variants for sequential animations
 * Adds delay to existing variant transitions
 * 
 * @param variants - Base variants to apply delay to
 * @param delay - Delay in seconds
 * @returns Modified Variants with delay applied
 * 
 * @example
 * ```ts
 * const delayedFade = withDelay(fadeVariants, 0.2);
 * ```
 */
export function withDelay(variants: Variants, delay: number): Variants {
    return Object.entries(variants).reduce((acc, [key, value]) => {
        acc[key] = {
            ...value,
            transition: { ...(value as unknown as { transition: Transition }).transition, delay },
        };
        return acc;
    }, {} as Variants);
}

/**
 * Create a custom scale variant with specific scale factor
 * 
 * @param scaleFactor - Scale factor for hidden state (e.g., 0.9 for 90%)
 * @returns Configured Variants object
 * 
 * @example
 * ```ts
 * const subtleScale = createScaleVariant(0.98);
 * ```
 */
export function createScaleVariant(scaleFactor: number = 0.95): Variants {
    return {
        hidden: { opacity: 0, scale: scaleFactor },
        visible: { opacity: 1, scale: 1 },
    };
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type SlideDirection = "up" | "down" | "left" | "right";