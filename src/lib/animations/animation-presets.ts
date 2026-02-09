/**
 * @fileoverview Animation Presets - Ready-to-Use Configurations
 * @description Complete animation configurations combining variants and transitions
 * @version 1.0.0
 * 
 * This file implements the Composite pattern, combining variants and
 * transitions into ready-to-use animation presets.
 * 
 * Each preset includes:
 * - variants: Visual state definitions
 * - transition: Timing and easing configuration
 * - initial/animate/exit: State management hints
 * 
 * These presets can be spread directly onto motion components for
 * instant, consistent animations.
 */

import {
    fadeVariants,
    scaleVariants,
    slideVariants,
    type SlideDirection,
} from "./animation-variants";

import {
    modalVariants,
    dropdownVariants,
} from "./component-variants";

import { TRANSITIONS } from "./animation-transitions";

// ============================================================================
// BASIC ANIMATION PRESETS
// ============================================================================

/**
 * Fade In Preset (Normal Speed)
 * Standard fade-in animation for general use
 * 
 * @example
 * ```tsx
 * <motion.div {...fadeIn} />
 * // Equivalent to:
 * // <motion.div
 * //   variants={fadeVariants}
 * //   initial="hidden"
 * //   animate="visible"
 * //   transition={TRANSITIONS.fade.normal}
 * // />
 * ```
 */
export const fadeIn = {
    variants: fadeVariants,
    transition: TRANSITIONS.fade.normal,
    initial: "hidden" as const,
    animate: "visible" as const,
};

/**
 * Fade In Preset (Fast Speed)
 * Quick fade-in for responsive interactions
 */
export const fadeInFast = {
    variants: fadeVariants,
    transition: TRANSITIONS.fade.fast,
    initial: "hidden" as const,
    animate: "visible" as const,
};

/**
 * Fade In Preset (Slow Speed)
 * Gentle fade-in for dramatic effect
 */
export const fadeInSlow = {
    variants: fadeVariants,
    transition: TRANSITIONS.fade.slow,
    initial: "hidden" as const,
    animate: "visible" as const,
};

// ============================================================================
// SLIDE ANIMATION PRESETS
// ============================================================================

/**
 * Slide Up + Fade In Preset
 * Content rises from below while fading in
 */
export const slideUpFadeIn = {
    variants: slideVariants.up,
    transition: TRANSITIONS.slide.normal,
    initial: "hidden" as const,
    animate: "visible" as const,
};

/**
 * Slide Down + Fade In Preset
 * Content descends from above while fading in
 */
export const slideDownFadeIn = {
    variants: slideVariants.down,
    transition: TRANSITIONS.slide.normal,
    initial: "hidden" as const,
    animate: "visible" as const,
};

/**
 * Slide Left + Fade In Preset
 * Content slides from right while fading in
 */
export const slideLeftFadeIn = {
    variants: slideVariants.left,
    transition: TRANSITIONS.slide.normal,
    initial: "hidden" as const,
    animate: "visible" as const,
};

/**
 * Slide Right + Fade In Preset
 * Content slides from left while fading in
 */
export const slideRightFadeIn = {
    variants: slideVariants.right,
    transition: TRANSITIONS.slide.normal,
    initial: "hidden" as const,
    animate: "visible" as const,
};

// ============================================================================
// SCALE ANIMATION PRESETS
// ============================================================================

/**
 * Scale In Preset (Normal Speed)
 * Zoom-in effect for appearing content
 */
export const scaleIn = {
    variants: scaleVariants,
    transition: TRANSITIONS.scale.normal,
    initial: "hidden" as const,
    animate: "visible" as const,
};

/**
 * Scale In Preset (Fast Speed)
 * Quick zoom-in for snappy interactions
 */
export const scaleInFast = {
    variants: scaleVariants,
    transition: TRANSITIONS.scale.fast,
    initial: "hidden" as const,
    animate: "visible" as const,
};

/**
 * Scale In Preset (Slow Speed)
 * Gentle zoom-in for emphasis
 */
export const scaleInSlow = {
    variants: scaleVariants,
    transition: TRANSITIONS.scale.slow,
    initial: "hidden" as const,
    animate: "visible" as const,
};

// ============================================================================
// COMPONENT-SPECIFIC PRESETS
// ============================================================================

/**
 * Modal Preset
 * Complete animation for modal/dialog overlays
 * Includes enter, active, and exit states
 * 
 * @example
 * ```tsx
 * <AnimatePresence>
 *   {isOpen && <motion.div {...modal} />}
 * </AnimatePresence>
 * ```
 */
export const modal = {
    variants: modalVariants,
    transition: TRANSITIONS.fade.normal,
    initial: "hidden" as const,
    animate: "visible" as const,
    exit: "exit" as const,
};

/**
 * Dropdown Preset
 * Complete animation for dropdown menus and popovers
 */
export const dropdown = {
    variants: dropdownVariants,
    transition: TRANSITIONS.fade.fast,
    initial: "hidden" as const,
    animate: "visible" as const,
    exit: "exit" as const,
};

// ============================================================================
// PRESET COLLECTIONS
// ============================================================================

/**
 * All animation presets organized by type
 * Useful for documentation and preset discovery
 */
export const ANIMATION_PRESETS = {
    // Basic fade presets
    fade: {
        fadeIn,
        fadeInFast,
        fadeInSlow,
    },

    // Slide presets
    slide: {
        slideUpFadeIn,
        slideDownFadeIn,
        slideLeftFadeIn,
        slideRightFadeIn,
    },

    // Scale presets
    scale: {
        scaleIn,
        scaleInFast,
        scaleInSlow,
    },

    // Component presets
    component: {
        modal,
        dropdown,
    },
} as const;

// ============================================================================
// PRESET FACTORY FUNCTIONS
// ============================================================================

/**
 * Create a custom slide preset with specific direction
 * 
 * @param direction - Direction of slide animation
 * @param speed - Speed of animation (fast/normal/slow)
 * @returns Complete animation preset
 * 
 * @example
 * ```tsx
 * const customSlide = createSlidePreset("up", "fast");
 * <motion.div {...customSlide} />
 * ```
 */
export function createSlidePreset(
    direction: SlideDirection,
    speed: "fast" | "normal" | "slow" = "normal"
) {
    return {
        variants: slideVariants[direction],
        transition: TRANSITIONS.slide[speed],
        initial: "hidden" as const,
        animate: "visible" as const,
    };
}

/**
 * Create a custom fade preset with specific speed
 * 
 * @param speed - Speed of animation
 * @returns Complete animation preset
 */
export function createFadePreset(speed: "fast" | "normal" | "slow" = "normal") {
    return {
        variants: fadeVariants,
        transition: TRANSITIONS.fade[speed],
        initial: "hidden" as const,
        animate: "visible" as const,
    };
}

/**
 * Create a custom scale preset with specific speed
 * 
 * @param speed - Speed of animation
 * @returns Complete animation preset
 */
export function createScalePreset(speed: "fast" | "normal" | "slow" = "normal") {
    return {
        variants: scaleVariants,
        transition: TRANSITIONS.scale[speed],
        initial: "hidden" as const,
        animate: "visible" as const,
    };
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type AnimationPreset = keyof typeof ANIMATION_PRESETS;
export type FadePreset = keyof typeof ANIMATION_PRESETS.fade;
export type SlidePreset = keyof typeof ANIMATION_PRESETS.slide;
export type ScalePreset = keyof typeof ANIMATION_PRESETS.scale;
export type ComponentPreset = keyof typeof ANIMATION_PRESETS.component;
export type AnimationSpeed = "fast" | "normal" | "slow";