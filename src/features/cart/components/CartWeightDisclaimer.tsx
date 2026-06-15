import { Scale } from 'lucide-react';

export function CartWeightDisclaimer() {
    return (
        <div
            role="note"
            className="flex gap-3 rounded-lg border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-950 dark:border-amber-800/60 dark:bg-amber-950/35 dark:text-amber-100"
        >
            <Scale className="mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-400" />
            <div className="space-y-1">
                <p className="font-semibold leading-snug">Ortalama ağırlık uyarısı</p>
                <p className="text-xs leading-relaxed text-amber-900/90 dark:text-amber-100/90">
                    Sepette gördüğünüz ortalama ağırlıklar{' '}
                    <span className="font-medium">tahmini referans değerlerdir</span>; nihai
                    teslim ağırlığı üretim ve ölçüm sonrası belirlenir. Gerçek ağırlıkta{' '}
                    <span className="font-medium">artı veya eksi sapmalar</span> olabilir —
                    has ve fiyatlandırma süreçleri teslimat sonrası net ağırlık üzerinden
                    yürütülür.
                </p>
            </div>
        </div>
    );
}
