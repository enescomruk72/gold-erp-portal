export const catalogNavigationQueryKeys = {
    all: ['b2b', 'category-navigation'] as const,
    tree: () => [...catalogNavigationQueryKeys.all, 'tree'] as const,
};
