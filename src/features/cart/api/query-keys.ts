export const adreslerQueryKeys = {
    all: ['b2b', 'adresler'] as const,
    list: (adresTipi?: string) =>
        adresTipi
            ? (['b2b', 'adresler', adresTipi] as const)
            : (['b2b', 'adresler'] as const),
};

export const cartQueryKeys = {
    all: ['b2b', 'cart'] as const,
};

export const favoritesQueryKeys = {
    all: ['b2b', 'favorites'] as const,
    listing: (params?: Record<string, unknown>) =>
        ['b2b', 'favorites', 'listing', params ?? {}] as const,
};

export const userCollectionsQueryKeys = {
    all: ['b2b', 'user-collections'] as const,
    list: (search?: string) => ['b2b', 'user-collections', search ?? ''] as const,
    detail: (id: string, params?: Record<string, unknown>) =>
        ['b2b', 'user-collections', id, params ?? {}] as const,
};
