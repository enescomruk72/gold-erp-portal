'use client';

import { Scale } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

const warningSurfaceClass =
    'border-amber-200/80 bg-amber-50/90 text-amber-950 dark:border-amber-800/60 dark:bg-amber-950/35 dark:text-amber-100';

export function CartWeightDisclaimer() {
    return (
        <Accordion type="single" collapsible>
            <AccordionItem value="weight-disclaimer" className="border-0">
                <AccordionTrigger
                    className={cn(
                        'group/trigger flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2.5',
                        warningSurfaceClass,
                        'transition-colors hover:border-amber-300 hover:bg-amber-100/90 hover:no-underline',
                        'active:bg-amber-100 dark:hover:border-amber-700 dark:hover:bg-amber-950/50',
                        '[&>svg]:size-5 [&>svg]:shrink-0 [&>svg]:rounded-full',
                        '[&>svg]:border [&>svg]:border-amber-300/80 [&>svg]:bg-amber-100/80',
                        '[&>svg]:p-0.5 [&>svg]:text-amber-700',
                        'dark:[&>svg]:border-amber-700 dark:[&>svg]:bg-amber-900/50 dark:[&>svg]:text-amber-400'
                    )}
                >
                    <span className="flex min-w-0 flex-1 items-center gap-2.5 text-left">
                        <Scale className="size-5 shrink-0 text-amber-700 dark:text-amber-400" />
                        <span className="min-w-0">
                            <span className="block text-sm font-semibold leading-snug">
                                Ortalama ağırlık uyarısı
                            </span>
                            <span className="block text-[11px] text-amber-900/80 dark:text-amber-100/80">
                                <span className="group-data-[state=open]/trigger:hidden">
                                    Tahmini referans değerler — detay için genişletin
                                </span>
                                <span className="hidden group-data-[state=open]/trigger:inline">
                                    Daraltmak için tıklayın
                                </span>
                            </span>
                        </span>
                    </span>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                    <div
                        role="note"
                        className={cn(
                            'mt-2 rounded-lg border px-3 py-2.5 text-xs leading-relaxed text-amber-900/90',
                            'border-amber-200/60 bg-amber-50/60 dark:border-amber-800/40',
                            'dark:bg-amber-950/25 dark:text-amber-100/90'
                        )}
                    >
                        Sepette gördüğünüz ortalama ağırlıklar{' '}
                        <span className="font-medium">tahmini referans değerlerdir</span>; nihai
                        teslim ağırlığı üretim ve ölçüm sonrası belirlenir. Gerçek ağırlıkta{' '}
                        <span className="font-medium">artı veya eksi sapmalar</span> olabilir —
                        has ve fiyatlandırma süreçleri teslimat sonrası net ağırlık üzerinden
                        yürütülür.
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
