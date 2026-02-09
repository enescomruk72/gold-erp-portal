/**
 * B2B Portal - Products Query Keys
 */

export const productsQueryKeys = {
    all: ["products"] as const,
    lists: () => [...productsQueryKeys.all, "list"] as const,
    list: (params?: object) =>
        [...productsQueryKeys.lists(), params ?? {}] as const,
    details: () => [...productsQueryKeys.all, "detail"] as const,
    detail: (id: string) => [...productsQueryKeys.details(), id] as const,
};
