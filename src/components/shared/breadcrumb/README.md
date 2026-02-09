# Breadcrumb Component System

Modern, flexible breadcrumb system implementing SOLID principles and proven design patterns.

## 📁 File Structure

```
breadcrumbs/
├── index.ts                      # Barrel export (Facade pattern)
├── breadcrumb-base.tsx          # Base component (Template Method pattern)
├── immediate-breadcrumb.tsx     # Immediate strategy
├── progressive-breadcrumb.tsx   # Progressive strategy
└── hybrid-breadcrumb.tsx        # Hybrid strategy
```

## 🎯 Design Patterns

### 1. **Strategy Pattern**

Each breadcrumb component implements a different rendering strategy:

- **Immediate**: Shows raw URL segments immediately
- **Progressive**: Shows loading states, then fetches and displays data
- **Hybrid**: Configurable mix of both approaches

### 2. **Template Method Pattern**

`BreadcrumbBase` provides the skeleton algorithm for rendering breadcrumbs, while strategies customize specific behaviors.

### 3. **Facade Pattern**

The `index.ts` barrel export provides a simplified interface to the breadcrumb system.

## ✅ SOLID Principles

### Single Responsibility Principle (SRP)

- `breadcrumb-base.tsx`: Handles rendering and layout logic
- `immediate-breadcrumb.tsx`: Manages immediate display strategy
- `progressive-breadcrumb.tsx`: Manages progressive loading strategy
- `hybrid-breadcrumb.tsx`: Manages configurable hybrid strategy

### Open/Closed Principle (OCP)

- Base component is closed for modification but open for extension
- New strategies can be added without changing existing code

### Liskov Substitution Principle (LSP)

- All strategy components can be used interchangeably
- They all accept similar props and produce compatible output

### Interface Segregation Principle (ISP)

- Each component exposes only the props relevant to its strategy
- No component is forced to implement unused properties

### Dependency Inversion Principle (DIP)

- Components depend on abstractions (hooks, types) not concrete implementations
- Easy to swap implementations without breaking consumers

## 🚀 Usage

### Immediate Breadcrumb

Perfect for showing URL segments as-is without data fetching.

```tsx
import { ImmediateBreadcrumb } from "@/components/breadcrumbs";

function MyPage() {
  return <ImmediateBreadcrumb />;
}
```

**Use when:**

- No dynamic data needed
- Performance is critical
- Raw IDs/UUIDs are acceptable to display

---

### Progressive Breadcrumb

Shows loading states while fetching and displaying dynamic data.

```tsx
import { ProgressiveBreadcrumb } from "@/components/breadcrumbs";

function UserPage({ userId }) {
  const userData = useFetchUser(userId);

  return (
    <ProgressiveBreadcrumb
      dynamicData={{
        userId: userData,
      }}
      dataExtractor={(segment, data) => {
        if (segment === "userId") return data.userId?.name;
        return null;
      }}
    />
  );
}
```

**Use when:**

- Need to display meaningful names instead of IDs
- Loading indicators improve UX
- Data fetching is async

---

### Hybrid Breadcrumb

Maximum flexibility with configurable loading and final behaviors.

```tsx
import { HybridBreadcrumb } from "@/components/breadcrumbs";

function ProductPage({ productId }) {
  const productData = useFetchProduct(productId);

  return (
    <HybridBreadcrumb
      dynamicData={{
        productId: productData,
      }}
      options={{
        loadingBehavior: "showUUID", // Show UUID while loading
        finalBehavior: "replaceUUID", // Replace with name when loaded
      }}
    />
  );
}
```

**Configuration Options:**

**Loading Behaviors:**

- `showUUID`: Display the raw UUID/ID while loading
- `showLoading`: Display a skeleton loading indicator
- `hideSegment`: Hide the segment completely until loaded

**Final Behaviors:**

- `replaceUUID`: Replace the UUID with actual data
- `replaceLoading`: Replace loading state with actual data
- `addAfterUUID`: Keep UUID and append data (e.g., "123 | John Doe")
- `showOnly`: Show only the fetched data

**Use when:**

- Need custom UX flows
- A/B testing different behaviors
- Different segments need different strategies

---

## 🎨 Advanced Usage

### Custom Navigation Structure

```tsx
import { ImmediateBreadcrumb } from "@/components/breadcrumbs";

const customNav = {
  // Your custom navigation structure
};

<ImmediateBreadcrumb navigationStructure={customNav} />;
```

### Complex Data Extraction

```tsx
<ProgressiveBreadcrumb
  dynamicData={{
    userId: { firstName: "John", lastName: "Doe" },
    projectId: { title: "Project Alpha", code: "PA-001" },
  }}
  dataExtractor={(segment, data) => {
    switch (segment) {
      case "userId":
        return `${data.userId?.firstName} ${data.userId?.lastName}`;
      case "projectId":
        return `${data.projectId?.code}: ${data.projectId?.title}`;
      default:
        return null;
    }
  }}
/>
```

### Combining Strategies

```tsx
// Different pages can use different strategies
function App() {
  return (
    <Routes>
      <Route path="/users/:id" element={<ProgressiveBreadcrumb />} />
      <Route path="/admin/*" element={<ImmediateBreadcrumb />} />
      <Route path="/products/:id" element={<HybridBreadcrumb />} />
    </Routes>
  );
}
```

## 🔧 Customization

### Extending with New Strategies

```tsx
// Create a new strategy component
import { BreadcrumbBase } from "@/components/breadcrumbs";
import { useCustomBreadcrumb } from "@/hooks/use-breadcrumb";

export function CustomBreadcrumb(props) {
  const { breadcrumbs } = useCustomBreadcrumb(NAVIGATION_STRUCTURE, props);
  return <BreadcrumbBase breadcrumbs={breadcrumbs} />;
}
```

### Custom Base Component

```tsx
// Extend the base for specific needs
import { BreadcrumbBase } from "@/components/breadcrumbs";

export function CustomBase(props) {
  // Add custom logic
  const enhancedBreadcrumbs = enhanceBreadcrumbs(props.breadcrumbs);

  return <BreadcrumbBase breadcrumbs={enhancedBreadcrumbs} {...props} />;
}
```

## 📊 Performance Considerations

- **Memoization**: All strategies use `useMemo` for expensive calculations
- **Lazy Loading**: Components only render what's visible
- **Tree Shaking**: Named exports enable optimal bundle sizes
- **Overflow Handling**: Automatic dropdown for long breadcrumb chains

## 🧪 Testing

```tsx
import { render } from "@testing-library/react";
import { ImmediateBreadcrumb, ProgressiveBreadcrumb } from "@/components/breadcrumbs";

describe("Breadcrumb Strategies", () => {
  it("renders immediate breadcrumb", () => {
    const { getByText } = render(<ImmediateBreadcrumb />);
    expect(getByText("Home")).toBeInTheDocument();
  });

  it("shows loading state in progressive mode", () => {
    const { container } = render(<ProgressiveBreadcrumb />);
    expect(container.querySelector(".skeleton")).toBeInTheDocument();
  });
});
```

## 📝 Migration Guide

### From Old Component

```tsx
// Before
import { BreadcrumbImmediate, BreadcrumbProgressive } from './breadcrumbs';

<BreadcrumbImmediate />
<BreadcrumbProgressive dynamicData={data} />

// After
import { ImmediateBreadcrumb, ProgressiveBreadcrumb } from '@/components/breadcrumbs';

<ImmediateBreadcrumb />
<ProgressiveBreadcrumb dynamicData={data} />
```

## 🤝 Contributing

When adding new strategies:

1. Create a new file: `{strategy-name}-breadcrumb.tsx`
2. Implement using `BreadcrumbBase`
3. Export from `index.ts`
4. Add documentation and examples
5. Ensure SOLID principles are maintained

## 📚 Related Documentation

- [Hook Documentation](../hooks/use-breadcrumb.md)
- [Navigation Structure](../constants/navigations.constant.ts)
- [Animation Configuration](../lib/animations.ts)

## 🐛 Troubleshooting

**Breadcrumbs not showing data:**

- Verify `dynamicData` prop is passed correctly
- Check `dataExtractor` function returns valid values
- Ensure navigation structure matches URL segments

**Loading state stuck:**

- Confirm async data is resolving
- Check browser console for errors
- Verify hook implementation

**Performance issues:**

- Use `React.memo` for parent components
- Verify data isn't changing unnecessarily
- Check if re-renders are caused by parent state

---

Built with ❤️ following SOLID principles and design patterns
