"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ProductGrid, ProductDetailModal } from "@/features/products";
import type { IProductDTO } from "@/features/products/types";

const MODAL_CLOSE_DURATION_MS = 200;

export default function ProductsPage() {
    const [detailProduct, setDetailProduct] = useState<IProductDTO | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        };
    }, []);

    const handleDetailOpen = useCallback((product: IProductDTO | null) => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setDetailProduct(product);
        setModalOpen(!!product);
    }, []);

    const handleDetailOpenChange = useCallback((open: boolean) => {
        setModalOpen(open);
        if (!open) {
            closeTimeoutRef.current = setTimeout(() => {
                setDetailProduct(null);
                closeTimeoutRef.current = null;
            }, MODAL_CLOSE_DURATION_MS);
        }
    }, []);

    return (
        <div className="flex-1 space-y-6 p-gutter">
            <ProductGrid onProductDetailClick={handleDetailOpen} />
            <ProductDetailModal
                key={detailProduct?.id ?? "closed"}
                product={detailProduct}
                open={modalOpen}
                onOpenChange={handleDetailOpenChange}
            />
        </div>
    );
}
