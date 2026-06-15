'use client';

import Image from 'next/image';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

type CartPaymentAccordionSectionProps = {
    id: string;
    title: string;
    count?: number;
    previewImageUrls?: string[];
    defaultOpen?: boolean;
    children: React.ReactNode;
    className?: string;
};

export function CartPaymentAccordionSection({
    id,
    title,
    count,
    previewImageUrls = [],
    defaultOpen = false,
    children,
    className,
}: CartPaymentAccordionSectionProps) {
    const label =
        count !== undefined ? `${title} (${count})` : title;
    const previews = previewImageUrls.slice(0, 3);

    return (
        <Accordion
            type="single"
            collapsible
            defaultValue={defaultOpen ? id : undefined}
            className={cn('overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm', className)}
        >
            <AccordionItem value={id} className="border-0">
                <AccordionTrigger
                    className={cn(
                        'group/section flex items-center gap-3 px-4 py-4 hover:no-underline',
                        'bg-neutral-50/80 transition-colors hover:bg-neutral-100/80',
                        '[&>svg]:size-5 [&>svg]:shrink-0 [&>svg]:text-neutral-500'
                    )}
                >
                    <span className="min-w-0 flex-1 text-left text-base font-bold text-neutral-900 sm:text-lg">
                        {label}
                    </span>

                    {previews.length > 0 ? (
                        <span className="flex shrink-0 items-center -space-x-2">
                            {previews.map((src, i) => (
                                <span
                                    key={`${src}-${i}`}
                                    className="relative size-8 overflow-hidden rounded-full border-2 border-white bg-neutral-100 shadow-sm"
                                >
                                    <Image
                                        src={src}
                                        alt=""
                                        width={32}
                                        height={32}
                                        className="h-full w-full object-cover"
                                    />
                                </span>
                            ))}
                        </span>
                    ) : null}
                </AccordionTrigger>

                <AccordionContent className="border-t border-neutral-100 px-4 pb-4 pt-3">
                    {children}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
