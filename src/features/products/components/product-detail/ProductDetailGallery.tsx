'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from '@/components/ui/carousel';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import type { IProductImageDTO } from '@/features/products/types';

function sortImages(images: IProductImageDTO[]): IProductImageDTO[] {
    return [...images]
        .filter((img) => img.url)
        .sort((a, b) => {
            if (a.varsayilanMi && !b.varsayilanMi) return -1;
            if (!a.varsayilanMi && b.varsayilanMi) return 1;
            return a.siraNo - b.siraNo;
        });
}

type ProductDetailGalleryProps = {
    images: IProductImageDTO[];
    productName: string;
};

function GalleryCarousel({
    sorted,
    productName,
    activeIndex,
    onIndexChange,
    onImageClick,
    variant,
    setApi,
}: {
    sorted: IProductImageDTO[];
    productName: string;
    activeIndex: number;
    onIndexChange: (index: number) => void;
    onImageClick?: (index: number) => void;
    variant: 'main' | 'lightbox';
    setApi?: (api: CarouselApi) => void;
}) {
    const [api, setLocalApi] = useState<CarouselApi | null>(null);

    useEffect(() => {
        if (!api) return;
        setApi?.(api);
        const sync = () => onIndexChange(api.selectedScrollSnap());
        api.on('select', sync);
        queueMicrotask(sync);
        return () => {
            api.off('select', sync);
        };
    }, [api, onIndexChange, setApi]);

    useEffect(() => {
        if (!api) return;
        if (api.selectedScrollSnap() !== activeIndex) {
            api.scrollTo(activeIndex, true);
        }
    }, [api, activeIndex]);

    const isMain = variant === 'main';

    return (
        <div className="relative">
            <Carousel
                setApi={setLocalApi}
                opts={{ loop: sorted.length > 1, startIndex: activeIndex }}
                className="w-full"
            >
                <CarouselContent className="ml-0">
                    {sorted.map((img, i) => (
                        <CarouselItem key={img.id} className="basis-full pl-0">
                            <button
                                type="button"
                                className={cn(
                                    'relative block w-full overflow-hidden bg-neutral-50',
                                    isMain && 'aspect-square cursor-zoom-in rounded-lg',
                                    !isMain && 'aspect-square max-h-[80vh] cursor-default'
                                )}
                                onClick={isMain ? () => onImageClick?.(i) : undefined}
                                aria-label={`${productName} görsel ${i + 1}`}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={img.url as string}
                                    alt={`${productName} ${i + 1}`}
                                    className="h-full w-full object-contain"
                                />
                            </button>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            {sorted.length > 1 ? (
                <>
                    <button
                        type="button"
                        onClick={() => api?.scrollPrev()}
                        className={cn(
                            'absolute top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-neutral-50',
                            isMain ? 'left-3 size-10' : 'left-4 size-11'
                        )}
                        aria-label="Önceki görsel"
                    >
                        <ChevronLeft className={isMain ? 'size-5' : 'size-6'} />
                    </button>
                    <button
                        type="button"
                        onClick={() => api?.scrollNext()}
                        className={cn(
                            'absolute top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-neutral-50',
                            isMain ? 'right-3 size-10' : 'right-4 size-11'
                        )}
                        aria-label="Sonraki görsel"
                    >
                        <ChevronRight className={isMain ? 'size-5' : 'size-6'} />
                    </button>
                </>
            ) : null}
        </div>
    );
}

export function ProductDetailGallery({ images, productName }: ProductDetailGalleryProps) {
    const sorted = sortImages(images);
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [mainApi, setMainApi] = useState<CarouselApi | null>(null);
    const [modalApi, setModalApi] = useState<CarouselApi | null>(null);

    const scrollTo = useCallback(
        (index: number) => {
            setActiveIndex(index);
            mainApi?.scrollTo(index);
            modalApi?.scrollTo(index);
        },
        [mainApi, modalApi]
    );

    const openLightbox = useCallback((index: number) => {
        setActiveIndex(index);
        setLightboxOpen(true);
    }, []);

    useEffect(() => {
        if (lightboxOpen && modalApi) {
            modalApi.scrollTo(activeIndex, true);
        }
    }, [lightboxOpen, modalApi, activeIndex]);

    if (sorted.length === 0) {
        return (
            <div className="flex aspect-square items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50">
                <Info className="size-16 text-neutral-300" />
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-base">
                <div className="overflow-hidden rounded-lg border border-neutral-200">
                    <GalleryCarousel
                        sorted={sorted}
                        productName={productName}
                        activeIndex={activeIndex}
                        onIndexChange={setActiveIndex}
                        onImageClick={openLightbox}
                        variant="main"
                        setApi={setMainApi}
                    />
                </div>

                {sorted.length > 1 ? (
                    <div className="flex gap-base overflow-x-auto p-1">
                        {sorted.map((img, i) => (
                            <button
                                key={img.id}
                                type="button"
                                onClick={() => scrollTo(i)}
                                className={cn(
                                    'relative size-20 shrink-0 overflow-hidden rounded-md ring-2 ring-offset-2 bg-neutral-50 transition',
                                    activeIndex === i
                                        ? 'ring-[#0b57d0]'
                                        : 'ring-neutral-200 hover:ring-neutral-400'
                                )}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={img.url as string}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                ) : null}
            </div>

            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
                <DialogContent
                    className="max-w-[min(960px,96vw)] gap-0 overflow-hidden border-0 bg-white p-0 sm:max-w-[960px]"
                    showCloseButton
                >
                    <DialogTitle className="sr-only">{productName} görselleri</DialogTitle>
                    <div className="p-base sm:p-gutter">
                        <GalleryCarousel
                            sorted={sorted}
                            productName={productName}
                            activeIndex={activeIndex}
                            onIndexChange={setActiveIndex}
                            variant="lightbox"
                            setApi={setModalApi}
                        />

                        {sorted.length > 1 ? (
                            <div className="pt-base flex justify-center gap-base overflow-x-auto pb-1">
                                {sorted.map((img, i) => (
                                    <button
                                        key={img.id}
                                        type="button"
                                        onClick={() => scrollTo(i)}
                                        className={cn(
                                            'relative size-14 shrink-0 overflow-hidden rounded-md ring-2 ring-offset-2 bg-neutral-50',
                                            activeIndex === i
                                                ? 'ring-[#0b57d0]'
                                                : 'ring-neutral-200'
                                        )}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={img.url as string}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
