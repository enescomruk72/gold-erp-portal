/**
 * @fileoverview Animation System - Barrel Export
 * @description Centralized export point for the enterprise animation system
 * @version 1.0.0
 * 
 * This file implements the Facade pattern, providing a simplified interface
 * to the complete animation system while maintaining the internal modular structure.
 * 
 * ARCHITECTURE OVERVIEW:
 * 
 * 1. animation-constants.ts
 *    - Base durations and easing functions
 *    - Foundation for all animations
 * 
 * 2. animation-transitions.ts
 *    - Pre-configured transition presets
 *    - Factory functions for custom transitions
 * 
 * 3. animation-variants.ts
 *    - Common animation variants (fade, slide, scale)
 *    - Variant factory functions
 * 
 * 4. component-variants.ts
 *    - Component-specific variants (modal, sidebar, toast, etc.)
 *    - Specialized UI patterns
 * 
 * 5. animation-presets.ts
 *    - Ready-to-use animation configurations
 *    - Combines variants + transitions
 * 
 * DESIGN PATTERNS USED:
 * - Strategy Pattern: Different animation strategies (variants)
 * - Factory Pattern: Functions to create custom animations
 * - Composite Pattern: Combining variants and transitions into presets
 * - Facade Pattern: This barrel export simplifying the API
 * 
 * SOLID PRINCIPLES:
 * - Single Responsibility: Each file has one clear purpose
 * - Open/Closed: Easy to extend with new animations without modifying existing
 * - Liskov Substitution: All variants/transitions are interchangeable
 * - Interface Segregation: Exports only what consumers need
 * - Dependency Inversion: High-level presets depend on low-level abstractions
 */

// ============================================================================
// CONSTANTS & FOUNDATIONS
// ============================================================================

export {
    ANIMATION_DURATION,
    EASING,
    type AnimationSpeed,
    type AnimationEasing,
  } from "./animation-constants";
  
  // ============================================================================
  // TRANSITIONS
  // ============================================================================
  
  export {
    // Transition objects
    TRANSITIONS,
    FADE_TRANSITIONS,
    SLIDE_TRANSITIONS,
    SCALE_TRANSITIONS,
    SPRING_TRANSITIONS,
    
    // Factory functions
    createTransition,
    createSpringTransition,
    
    // Types
    type TransitionPreset,
    type FadeTransitionSpeed,
    type SlideTransitionSpeed,
    type ScaleTransitionSpeed,
    type SpringTransitionType,
  } from "./animation-transitions";
  
  // ============================================================================
  // COMMON VARIANTS
  // ============================================================================
  
  export {
    // Basic variants
    fadeVariants,
    fadeBlurVariants,
    scaleVariants,
    collapseVariants,
    
    // Directional variants
    slideVariants,
    
    // Factory functions
    createSlideVariant,
    withDelay,
    createScaleVariant,
    
    // Types
    type SlideDirection,
  } from "./animation-variants";
  
  // ============================================================================
  // COMPONENT VARIANTS
  // ============================================================================
  
  export {
    // Navigation components
    breadcrumbVariants,
    
    // Overlay components
    modalVariants,
    dropdownVariants,
    
    // Panel components
    sidebarVariants,
    
    // Notification components
    toastVariants,
    
    // List components
    listContainerVariants,
    listItemVariants,
    
    // Collections
    COMPONENT_VARIANTS,
    
    // Types
    type SidebarPosition,
    type ToastPosition,
    type ComponentVariantCategory,
  } from "./component-variants";
  
  // ============================================================================
  // ANIMATION PRESETS
  // ============================================================================
  
  export {
    // Individual presets
    fadeIn,
    fadeInFast,
    fadeInSlow,
    slideUpFadeIn,
    slideDownFadeIn,
    slideLeftFadeIn,
    slideRightFadeIn,
    scaleIn,
    scaleInFast,
    scaleInSlow,
    modal,
    dropdown,
    
    // Collections
    ANIMATION_PRESETS,
    
    // Preset factories
    createSlidePreset,
    createFadePreset,
    createScalePreset,
    
    // Types
    type AnimationPreset,
    type FadePreset,
    type SlidePreset,
    type ScalePreset,
    type ComponentPreset,
    type AnimationSpeed as PresetAnimationSpeed,
  } from "./animation-presets";
  
  // ============================================================================
  // USAGE EXAMPLES
  // ============================================================================
  
  /**
   * BASIC USAGE:
   * 
   * // Using presets (easiest)
   * import { fadeIn, slideUpFadeIn } from '@/lib/animations';
   * <motion.div {...fadeIn} />
   * 
   * // Using variants + transitions separately
   * import { fadeVariants, TRANSITIONS } from '@/lib/animations';
   * <motion.div
   *   variants={fadeVariants}
   *   transition={TRANSITIONS.fade.normal}
   *   initial="hidden"
   *   animate="visible"
   * />
   * 
   * // Creating custom animations
   * import { createSlideVariant, createTransition } from '@/lib/animations';
   * const customVariant = createSlideVariant("up", 50);
   * const customTransition = createTransition(0.4, [0.4, 0, 0.2, 1]);
   * <motion.div
   *   variants={customVariant}
   *   transition={customTransition}
   *   initial="hidden"
   *   animate="visible"
   * />
   * 
   * // Component-specific animations
   * import { modalVariants, dropdown } from '@/lib/animations';
   * <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" />
   * <motion.div {...dropdown} />
   * 
   * // Staggered list animations
   * import { listContainerVariants, listItemVariants } from '@/lib/animations';
   * <motion.ul variants={listContainerVariants} initial="hidden" animate="visible">
   *   {items.map(item => (
   *     <motion.li key={item.id} variants={listItemVariants}>
   *       {item.content}
   *     </motion.li>
   *   ))}
   * </motion.ul>
   */
  
  // ============================================================================
  // QUICK REFERENCE
  // ============================================================================
  
  /**
   * DURATION SCALE:
   * - instant: 0s
   * - fast: 0.15s
   * - normal: 0.3s
   * - slow: 0.5s
   * - slower: 0.8s
   * 
   * EASING FUNCTIONS:
   * - linear, easeIn, easeOut, easeInOut (standard)
   * - smooth: Material Design curve [0.4, 0, 0.2, 1]
   * - snappy: Quick start [0.22, 1, 0.36, 1]
   * - bounce: Playful effect [0.68, -0.55, 0.265, 1.55]
   * 
   * TRANSITION TYPES:
   * - fade: Opacity changes
   * - slide: Position movements
   * - scale: Size transformations
   * - spring: Physics-based
   * 
   * COMMON VARIANTS:
   * - fadeVariants: Simple opacity toggle
   * - fadeBlurVariants: Opacity + blur
   * - scaleVariants: Zoom effect
   * - slideVariants: Directional slides (up/down/left/right)
   * - collapseVariants: Height-based accordion
   * 
   * COMPONENT VARIANTS:
   * - breadcrumbVariants: Progressive loading
   * - modalVariants: Centered overlay
   * - dropdownVariants: Attached menu
   * - sidebarVariants: Sliding panels (left/right)
   * - toastVariants: Notifications (top/bottom)
   * - listContainerVariants + listItemVariants: Staggered lists
   */