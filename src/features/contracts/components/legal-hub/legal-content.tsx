import type { SozlesmeDTO } from '@/features/contracts/types';

type LegalContentProps = {
    sozlesme: SozlesmeDTO;
};

export function LegalContent({ sozlesme }: LegalContentProps) {
    return (
        <div className="min-w-0 flex-1 min-h-screen">
            <div className="rounded-md border border-neutral-200 bg-neutral-50 px-5 py-3">
                <h1 className="text-base font-semibold text-neutral-900">
                    {sozlesme.baslik}
                </h1>
            </div>
            <div className="mt-4 rounded-md border border-neutral-200 bg-white p-6 sm:p-8">
                <div
                    className="prose prose-sm max-w-none text-neutral-800 prose-headings:text-[#0b57d0] prose-headings:font-bold prose-headings:scroll-mt-[var(--storefront-scroll-margin)] prose-h1:text-lg prose-h2:text-base"
                    dangerouslySetInnerHTML={{ __html: sozlesme.icerik }}
                />
            </div>
        </div>
    );
}
