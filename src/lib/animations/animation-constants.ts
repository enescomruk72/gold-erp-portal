/**
 * @fileoverview Animation Constants - Base Configuration
 * @description Core animation values following Single Responsibility Principle
 * @version 1.0.0
 * 
 * This file contains only the fundamental animation constants:
 * - Duration values
 * - Easing functions
 * 
 * These constants serve as the foundation for all animation configurations
 * and should rarely need modification.
 */

// ============================================================================
// ANIMATION DURATIONS (in seconds)
// ============================================================================

/**
 * Standard animation duration scale
 * Used consistently across all animations for coherent motion design
 */
export const ANIMATION_DURATION = {
    instant: 0,
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
    slower: 0.8,
} as const;

// ============================================================================
// EASING FUNCTIONS
// ============================================================================

/**
 * Easing function library
 * Includes both standard CSS easing and custom cubic-bezier curves
 */
export const EASING = {
    // Standard CSS easing
    linear: "linear",
    easeIn: "easeIn",
    easeOut: "easeOut",
    easeInOut: "easeInOut",

    // Custom cubic-bezier curves optimized for specific use cases
    smooth: [0.4, 0, 0.2, 1], // Material Design standard - balanced motion
    snappy: [0.22, 1, 0.36, 1], // Quick start, smooth end - attention-grabbing
    bounce: [0.68, -0.55, 0.265, 1.55], // Playful bounce - casual interactions
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type AnimationSpeed = keyof typeof ANIMATION_DURATION;
export type AnimationEasing = keyof typeof EASING;