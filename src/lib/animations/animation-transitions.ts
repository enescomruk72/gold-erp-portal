/**
 * @fileoverview Animation Transitions - Transition Presets
 * @description Pre-configured transition objects for common animation types
 * @version 1.0.0
 * 
 * This file implements the Factory pattern, providing ready-to-use
 * transition configurations that combine durations and easing functions.
 * 
 * Each transition preset is optimized for specific animation types:
 * - Fade: Smooth opacity changes
 * - Slide: Position-based movements
 * - Scale: Size transformations
 * - Spring: Physics-based animations
 */

import type { Transition } from "motion/react";
import { ANIMATION_DURATION, EASING } from "./animation-constants";

// ============================================================================
// TRANSITION PRESETS
// ============================================================================

/**
 * Fade Transitions
 * Optimized for opacity changes and visibility toggles
 */
export const FADE_TRANSITIONS = {
    fast: { duration: ANIMATION_DURATION.fast, ease: EASING.easeOut },
    normal: { duration: ANIMATION_DURATION.normal, ease: EASING.easeOut },
    slow: { duration: ANIMATION_DURATION.slow, ease: EASING.easeOut },
} as const satisfies Record<string, Transition>;

/**
 * Slide Transitions
 * Optimized for position-based movements and spatial animations
 */
export const SLIDE_TRANSITIONS = {
    fast: { duration: ANIMATION_DURATION.fast, ease: EASING.smooth },
    normal: { duration: ANIMATION_DURATION.normal, ease: EASING.smooth },
    slow: { duration: ANIMATION_DURATION.slow, ease: EASING.smooth },
} as const satisfies Record<string, Transition>;

/**
 * Scale Transitions
 * Optimized for size transformations and zoom effects
 */
export const SCALE_TRANSITIONS = {
    fast: { duration: ANIMATION_DURATION.fast, ease: EASING.snappy },
    normal: { duration: ANIMATION_DURATION.normal, ease: EASING.snappy },
    slow: { duration: ANIMATION_DURATION.slow, ease: EASING.snappy },
} as const satisfies Record<string, Transition>;

/**
 * Spring Transitions
 * Physics-based animations with natural motion feel
 */
export const SPRING_TRANSITIONS = {
    gentle: { type: "spring" as const, stiffness: 100, damping: 15 },
    bouncy: { type: "spring" as const, stiffness: 300, damping: 20 },
    stiff: { type: "spring" as const, stiffness: 500, damping: 30 },
} as const satisfies Record<string, Transition>;

// ============================================================================
// UNIFIED TRANSITIONS OBJECT (for backwards compatibility)
// ============================================================================

/**
 * Unified transitions object combining all preset categories
 * Maintains backwards compatibility with existing code
 */
export const TRANSITIONS = {
    fade: FADE_TRANSITIONS,
    slide: SLIDE_TRANSITIONS,
    scale: SCALE_TRANSITIONS,
    spring: SPRING_TRANSITIONS,
} as const;

// ============================================================================
// TRANSITION FACTORY FUNCTIONS
// ============================================================================

/**
 * Create a custom transition with specific duration and easing
 * Factory function following the Builder pattern
 * 
 * @param duration - Animation duration in seconds
 * @param ease - Easing function or cubic-bezier array
 * @param delay - Optional delay before animation starts
 * @returns Configured Transition object
 * 
 * @example
 * ```ts
 * const customTransition = createTransition(0.4, EASING.smooth, 0.1);
 * ```
 */
export function createTransition(
    duration: number = ANIMATION_DURATION.normal,
    ease: Transition["ease"] = EASING.easeOut,
    delay: number = 0
): Transition {
    return { duration, ease, delay };
}

/**
 * Create a spring transition with custom physics parameters
 * 
 * @param stiffness - Spring stiffness (higher = faster)
 * @param damping - Spring damping (higher = less bounce)
 * @param mass - Spring mass (optional, default = 1)
 * @returns Configured spring Transition object
 * 
 * @example
 * ```ts
 * const bouncySpring = createSpringTransition(400, 25);
 * ```
 */
export function createSpringTransition(
    stiffness: number = 300,
    damping: number = 20,
    mass: number = 1
): Transition {
    return {
        type: "spring",
        stiffness,
        damping,
        mass,
    };
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type TransitionPreset = keyof typeof TRANSITIONS;
export type FadeTransitionSpeed = keyof typeof FADE_TRANSITIONS;
export type SlideTransitionSpeed = keyof typeof SLIDE_TRANSITIONS;
export type ScaleTransitionSpeed = keyof typeof SCALE_TRANSITIONS;
export type SpringTransitionType = keyof typeof SPRING_TRANSITIONS;