"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { ImageZoom } from "@/components/ui/image-zoom";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
    imageUrls: string[];
    alt: string;
    className?: string;
}

export function ProductImageGallery({
    imageUrls,
    alt,
    className,
}: ProductImageGalleryProps) {
    const [api, setApi] = useState<CarouselApi | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const urls = imageUrls.length > 0 ? imageUrls : ["/test-product-images/001.png"];

    const scrollTo = useCallback(
        (index: number) => {
            api?.scrollTo(index);
        },
        [api]
    );

    useEffect(() => {
        if (!api) return;
        const sync = () => setActiveIndex(api.selectedScrollSnap());
        api.on("select", sync);
        queueMicrotask(sync);
        return () => {
            api.off("select", sync);
        };
    }, [api]);

    return (
        <div
            className={cn(
                "flex h-full min-h-0 flex-col overflow-hidden",
                "min-h-[200px] max-h-[45vh] lg:min-h-[280px] lg:max-h-none",
                className
            )}
        >
            <Carousel
                setApi={setApi}
                opts={{ loop: true }}
                className="flex min-h-0 flex-1 flex-col overflow-hidden"
            >
                <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-hidden sm:gap-3">
                    <div className="relative flex min-h-[180px] min-w-0 flex-1 overflow-hidden rounded-lg sm:min-h-[220px] lg:min-h-[240px] lg:rounded-r-2xl">
                        <CarouselContent className="ml-0 h-full w-full min-h-0 rounded-lg">
                            {urls.map((url, i) => (
                                <CarouselItem
                                    key={i}
                                    className="basis-full shrink-0 grow-0 pl-0"
                                >
                                    <div className="relative w-full min-h-[180px] aspect-square sm:min-h-[220px] lg:min-h-[240px]">
                                        <ImageZoom
                                            width="100%"
                                            height="100%"
                                            zoomScale={2.5}
                                            zoomOnHover
                                            zoomOnClick
                                            className="rounded-lg lg:rounded-r-2xl"
                                        >
                                            <div className="relative h-full w-full">
                                                <Image
                                                    src={url}
                                                    alt={`${alt} ${i + 1}`}
                                                    fill
                                                    className="object-contain rounded-lg lg:rounded-r-2xl"
                                                    sizes="(max-width: 1024px) 100vw, 40vw"
                                                    priority={i === 0}
                                                />
                                            </div>
                                        </ImageZoom>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <div className="absolute bottom-base right-base flex items-center gap-base">
                            <Button
                                size="icon"
                                className="h-8 w-8 rounded-full bg-primary shadow-sm"
                                onClick={() => api?.scrollPrev()}
                                aria-label="Önceki görsel"
                                disabled={urls.length <= 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                size="icon"
                                className="h-8 w-8 rounded-full bg-primary shadow-sm"
                                onClick={() => api?.scrollNext()}
                                aria-label="Sonraki görsel"
                                disabled={urls.length <= 1}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-row gap-1.5 overflow-x-auto overflow-y-hidden p-1 sm:gap-2">
                        {urls.map((url, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => scrollTo(i)}
                                className={cn(
                                    "relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:h-14 sm:w-14",
                                    activeIndex === i
                                        ? "border-primary ring-2 ring-primary/20"
                                        : "border-transparent hover:border-muted-foreground/30"
                                )}
                            >
                                <Image
                                    src={url}
                                    alt={`${alt} ${i + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 48px, (max-width: 1024px) 56px, 80px"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </Carousel>
        </div>
    );
}
