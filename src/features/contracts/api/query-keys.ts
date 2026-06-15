import type { SozlesmeLocation } from '../types';

export const sozlesmelerQueryKeys = {
    all: ['sozlesmeler'] as const,
    list: (location?: SozlesmeLocation) =>
        location
            ? ([...sozlesmelerQueryKeys.all, 'list', location] as const)
            : sozlesmelerQueryKeys.all,
};
