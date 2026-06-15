export const adreslerQueryKeys = {
    all: ['b2b', 'adresler'] as const,
    list: (adresTipi?: string) =>
        adresTipi
            ? (['b2b', 'adresler', adresTipi] as const)
            : (['b2b', 'adresler'] as const),
};
