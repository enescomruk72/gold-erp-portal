import { useMemo } from 'react';
import type { CategoryNavParent } from '@/features/catalog-navigation';

export type FlatCategoryOption = {
    id: number;
    label: string;
    depth: number;
};

export function flattenCategoryNavigation(parents: CategoryNavParent[]): FlatCategoryOption[] {
    const options: FlatCategoryOption[] = [];

    for (const parent of parents) {
        options.push({ id: parent.id, label: parent.kategoriAdi, depth: 0 });
        for (const child of parent.children) {
            options.push({
                id: child.id,
                label: child.kategoriAdi,
                depth: 1,
            });
        }
    }

    return options;
}

export function useFlatCategoryOptions(parents: CategoryNavParent[]) {
    return useMemo(() => flattenCategoryNavigation(parents), [parents]);
}
