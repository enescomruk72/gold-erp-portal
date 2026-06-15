'use client';

import { useEffect, useRef, useState } from 'react';
import { useGetProducts } from '@/features/products/api/use-get-products';
import { ProductRailSection } from './product-rail-section';
import {
    HOME_RAIL_COUNTS,
    splitProductsForHomeRails,
    type HomeProductRails,
} from '../lib/shuffle-home-products';

const FETCH_LIMIT = 400;
const MAX_RANDOM_PAGE = 8;

export function HomeProductRails() {
    const [fetchPage] = useState(() => Math.floor(Math.random() * MAX_RANDOM_PAGE) + 1);

    const { data, isLoading, isError } = useGetProducts({
        page: fetchPage,
        limit: FETCH_LIMIT,
        sortBy: 'katalog',
        sortOrder: 'asc',
    });

    const shuffledRef = useRef(false);
    const [sections, setSections] = useState<HomeProductRails | null>(null);

    useEffect(() => {
        if (data.length === 0 || shuffledRef.current) return;
        shuffledRef.current = true;
        setTimeout(() => {
            setSections(splitProductsForHomeRails(data));
        }, 100);
    }, [data]);

    const showLoading = isLoading || (data.length > 0 && sections == null);

    if (isError) {
        return null;
    }

    return (
        <>
            <ProductRailSection
                title="Popüler Ürünler"
                products={sections?.popular ?? []}
                isLoading={showLoading}
                skeletonCount={HOME_RAIL_COUNTS.popular}
            />
            <ProductRailSection
                title="Sana Özel Ürünler"
                products={sections?.personal ?? []}
                isLoading={showLoading}
                skeletonCount={HOME_RAIL_COUNTS.personal}
            />
            <ProductRailSection
                title="Önceden Gezdiklerim"
                products={sections?.recent ?? []}
                seeAllHref="/products?filter=recent"
                isLoading={showLoading}
                skeletonCount={HOME_RAIL_COUNTS.recent}
            />
        </>
    );
}
