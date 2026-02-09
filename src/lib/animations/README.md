# Enterprise Animation System

Modern, modular animation configuration system built with SOLID principles and design patterns for consistent motion design across your application.

## 📁 File Structure

```
animations/
├── index.ts                      # Barrel export (Facade pattern)
├── animation-constants.ts        # Base durations & easing
├── animation-transitions.ts      # Transition presets & factories
├── animation-variants.ts         # Common animation variants
├── component-variants.ts         # Component-specific variants
└── animation-presets.ts          # Ready-to-use presets
```

## 🎯 Design Patterns

### 1. **Strategy Pattern**

Different animation strategies (variants) that can be swapped:

- Fade strategies
- Slide strategies
- Scale strategies
- Component-specific strategies

### 2. **Factory Pattern**

Functions to create custom animations on-demand:

- `createTransition()` - Custom transition configs
- `createSlideVariant()` - Custom slide animations
- `createScaleVariant()` - Custom scale animations
- `createSpringTransition()` - Custom spring physics

### 3. **Composite Pattern**

Presets combine multiple elements:

- Variants + Transitions = Complete animation
- Reusable, consistent configurations

### 4. **Facade Pattern**

Simple API via barrel export:

- Import only what you need
- Tree-shakeable exports
- Clean, intuitive interface

## ✅ SOLID Principles

### Single Responsibility Principle (SRP)

- `animation-constants.ts`: Only durations and easing
- `animation-transitions.ts`: Only transition configurations
- `animation-variants.ts`: Only visual state definitions
- `component-variants.ts`: Only component-specific patterns
- `animation-presets.ts`: Only preset combinations

### Open/Closed Principle (OCP)

- Add new animations without modifying existing code
- Extend through factory functions and new files
- Core system remains stable

### Liskov Substitution Principle (LSP)

- All variants are interchangeable
- All transitions are interchangeable
- Consistent API across all animation types

### Interface Segregation Principle (ISP)

- Import only what you need
- No forced dependencies on unused animations
- Granular exports for optimal tree-shaking

### Dependency Inversion Principle (DIP)

- High-level presets depend on low-level abstractions
- Easy to swap implementation details
- Flexible, testable architecture

## 🚀 Usage Guide

### Level 1: Use Presets (Easiest)

Perfect for most use cases - just spread the preset:

```tsx
import { fadeIn, slideUpFadeIn, modal } from '@/lib/animations';

// Basic fade
<motion.div {...fadeIn}>Content</motion.div>

// Slide animation
<motion.div {...slideUpFadeIn}>Content</motion.div>

// Modal with exit animation
<AnimatePresence>
  {isOpen && <motion.div {...modal}>Modal content</motion.div>}
</AnimatePresence>
```

### Level 2: Mix Variants & Transitions

More control over timing and behavior:

```tsx
import { fadeVariants, TRANSITIONS } from "@/lib/animations";

<motion.div
  variants={fadeVariants}
  transition={TRANSITIONS.fade.slow} // Slower fade
  initial="hidden"
  animate="visible"
>
  Content
</motion.div>;
```

### Level 3: Create Custom Animations

Maximum flexibility with factory functions:

```tsx
import { createSlideVariant, createTransition, EASING } from "@/lib/animations";

// Custom slide with 50px offset
const customSlide = createSlideVariant("up", 50);

// Custom transition with Material Design easing
const customTransition = createTransition(0.4, EASING.smooth, 0.1);

<motion.div variants={customSlide} transition={customTransition} initial="hidden" animate="visible">
  Content
</motion.div>;
```

## 📚 Available Presets

### Basic Animations

```tsx
// Fade
import { fadeIn, fadeInFast, fadeInSlow } from "@/lib/animations";

// Slide
import {
  slideUpFadeIn,
  slideDownFadeIn,
  slideLeftFadeIn,
  slideRightFadeIn,
} from "@/lib/animations";

// Scale
import { scaleIn, scaleInFast, scaleInSlow } from "@/lib/animations";
```

### Component Animations

```tsx
// Modal/Dialog
import { modal } from "@/lib/animations";
<AnimatePresence>{isOpen && <motion.div {...modal}>Modal</motion.div>}</AnimatePresence>;

// Dropdown/Menu
import { dropdown } from "@/lib/animations";
<motion.div {...dropdown}>Menu</motion.div>;

// Sidebar
import { sidebarVariants } from "@/lib/animations";
<motion.aside variants={sidebarVariants.left} initial="hidden" animate="visible">
  Sidebar
</motion.aside>;

// Toast Notification
import { toastVariants } from "@/lib/animations";
<motion.div variants={toastVariants.top} initial="hidden" animate="visible">
  Notification
</motion.div>;
```

### Staggered Lists

```tsx
import { listContainerVariants, listItemVariants } from "@/lib/animations";

<motion.ul variants={listContainerVariants} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.li key={item.id} variants={listItemVariants}>
      {item.content}
    </motion.li>
  ))}
</motion.ul>;
```

## 🎨 Customization

### Custom Duration

```tsx
import { fadeVariants, createTransition, EASING } from "@/lib/animations";

const slowFade = createTransition(0.8, EASING.smooth);

<motion.div variants={fadeVariants} transition={slowFade} initial="hidden" animate="visible" />;
```

### Custom Slide Distance

```tsx
import { createSlideVariant, TRANSITIONS } from "@/lib/animations";

const longSlide = createSlideVariant("up", 100); // 100px offset

<motion.div
  variants={longSlide}
  transition={TRANSITIONS.slide.normal}
  initial="hidden"
  animate="visible"
/>;
```

### Custom Spring Physics

```tsx
import { createSpringTransition, scaleVariants } from "@/lib/animations";

const bouncySpring = createSpringTransition(400, 15, 1.2);

<motion.div
  variants={scaleVariants}
  transition={bouncySpring}
  initial="hidden"
  animate="visible"
/>;
```

### Adding Delay

```tsx
import { fadeVariants, withDelay } from "@/lib/animations";

const delayedFade = withDelay(fadeVariants, 0.3);

<motion.div variants={delayedFade} initial="hidden" animate="visible" />;
```

## 📖 Quick Reference

### Duration Scale

| Speed   | Value | Use Case            |
| ------- | ----- | ------------------- |
| instant | 0s    | No animation        |
| fast    | 0.15s | Quick interactions  |
| normal  | 0.3s  | Standard animations |
| slow    | 0.5s  | Emphasis            |
| slower  | 0.8s  | Dramatic effect     |

### Easing Functions

| Easing    | Curve                        | Best For              |
| --------- | ---------------------------- | --------------------- |
| linear    | Linear                       | Progress indicators   |
| easeIn    | Accelerate                   | Exits                 |
| easeOut   | Decelerate                   | Entrances             |
| easeInOut | Smooth                       | Two-way transitions   |
| smooth    | `[0.4, 0, 0.2, 1]`           | Material Design style |
| snappy    | `[0.22, 1, 0.36, 1]`         | Attention-grabbing    |
| bounce    | `[0.68, -0.55, 0.265, 1.55]` | Playful interactions  |

### Transition Types

| Type   | Purpose              |
| ------ | -------------------- |
| fade   | Opacity changes      |
| slide  | Position movements   |
| scale  | Size transformations |
| spring | Physics-based motion |

## 🔧 Extending the System

### Adding New Variants

```tsx
// Create new file: custom-variants.ts
import type { Variants } from "motion/react";

export const rotateVariants: Variants = {
  hidden: { opacity: 0, rotate: -180 },
  visible: { opacity: 1, rotate: 0 },
};

// Export from index.ts
export { rotateVariants } from "./custom-variants";
```

### Adding New Presets

```tsx
// In animation-presets.ts
import { rotateVariants } from "./custom-variants";
import { TRANSITIONS } from "./animation-transitions";

export const rotateIn = {
  variants: rotateVariants,
  transition: TRANSITIONS.scale.normal,
  initial: "hidden" as const,
  animate: "visible" as const,
};
```

### Creating Domain-Specific Variants

```tsx
// feature-variants.ts
export const productCardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  hover: { scale: 1.02, y: -4 },
};

// Usage
<motion.div variants={productCardVariants} initial="hidden" animate="visible" whileHover="hover" />;
```

## 🧪 Testing

```tsx
import { render } from "@testing-library/react";
import { fadeIn, TRANSITIONS } from "@/lib/animations";

describe("Animation System", () => {
  it("applies fade preset correctly", () => {
    const { container } = render(<motion.div {...fadeIn}>Content</motion.div>);

    expect(container.firstChild).toHaveAttribute("data-framer-appear-id");
  });

  it("uses correct transition timing", () => {
    expect(TRANSITIONS.fade.normal.duration).toBe(0.3);
    expect(TRANSITIONS.fade.fast.duration).toBe(0.15);
  });
});
```

## 📊 Performance Tips

1. **Use presets** - They're optimized and memoized
2. **Avoid inline objects** - Create variants outside components
3. **Leverage tree-shaking** - Import only what you need
4. **Use AnimatePresence** - For proper exit animations
5. **Memoize custom animations** - Prevent recreation on renders

```tsx
// ❌ Bad: Creates new object every render
<motion.div animate={{ opacity: 1 }} />

// ✅ Good: Uses memoized preset
<motion.div {...fadeIn} />

// ✅ Good: Defined outside component
const customVariant = createSlideVariant("up", 50);
function Component() {
  return <motion.div variants={customVariant} />;
}
```

## 🎓 Best Practices

1. **Consistency**: Use system animations throughout your app
2. **Purposeful motion**: Animate to guide attention, not distract
3. **Respect preferences**: Honor `prefers-reduced-motion`
4. **Performance**: Keep animations under 500ms for perceived speed
5. **Accessibility**: Ensure animations don't cause motion sickness

## 📝 Migration Guide

### From Old System

```tsx
// Before
import { fadeVariants, TRANSITIONS } from "./old-animations";

// After
import { fadeVariants, TRANSITIONS } from "@/lib/animations";
// Same API, better structure!
```

### From Inline Styles

```tsx
// Before
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
/>

// After
<motion.div {...slideUpFadeIn} />
```

## 🐛 Troubleshooting

**Animations not working:**

- Ensure `AnimatePresence` wraps exit animations
- Check that `initial` and `animate` states are defined
- Verify component is wrapped with `<motion.*>`

**Stutter or jank:**

- Reduce animation complexity
- Use `will-change` CSS property
- Consider `transform` over `position`

**TypeScript errors:**

- Update `framer-motion` to latest version
- Check import paths match your setup
- Ensure `motion/react` is available

---

Built with ❤️ following SOLID principles and design patterns.

For questions or contributions, please refer to the main project documentation.
