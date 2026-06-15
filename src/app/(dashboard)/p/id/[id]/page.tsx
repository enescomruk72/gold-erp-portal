'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetProduct } from '@/features/products/api/use-get-product';
import { productPublicHref } from '@/features/products/lib/product-href';

/** UUID fallback — public slug varsa kalıcı detay URL'sine yönlendirir */
export default function ProductByIdRedirectPage() {
    const params = useParams();
    const router = useRouter();
    const id = typeof params.id === 'string' ? params.id : '';

    const { data: response, isLoading, isError } = useGetProduct(id || null, Boolean(id));
    const product = response?.data ?? null;

    useEffect(() => {
        if (!product?.publicSlug) return;
        router.replace(productPublicHref(product.publicSlug));
    }, [product, router]);

    if (isLoading || (product?.publicSlug && !isError)) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center bg-white">
                <Loader2 className="size-8 animate-spin text-neutral-400" />
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 bg-white">
                <p className="text-sm text-neutral-500">Ürün bulunamadı.</p>
                <Button variant="outline" asChild>
                    <Link href="/products">Ürünlere dön</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 bg-white">
            <p className="text-sm text-neutral-500">Bu ürün için henüz katalog URL&apos;si tanımlı değil.</p>
            <Button variant="outline" asChild>
                <Link href="/products">Ürünlere dön</Link>
            </Button>
        </div>
    );
}
