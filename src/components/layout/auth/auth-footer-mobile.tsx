'use client';

import Link from 'next/link';
import { AppStoreBadges } from '@/components/layout/storefront/app-store-badges';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { STOREFRONT_CONTENT_CONTAINER_CLASS } from '@/constants/storefront/layout';

type FooterLink = { label: string; href: string };

const footerColumns: { title: string; links: FooterLink[] }[] = [
    {
        title: 'Akben',
        links: [
            { label: 'Biz Kimiz', href: '/biz-kimiz' },
            { label: 'İletişim', href: '/iletisim' },
        ],
    },
    {
        title: 'Satıcı',
        links: [{ label: "Akben'de B2B Başvurusu", href: '/b2b-basvuru' }],
    },
    {
        title: 'Yardım',
        links: [{ label: 'Sıkça Sorulan Sorular', href: '/sss' }],
    },
];

const legalLinks: FooterLink[] = [
    { label: 'Kişisel Verilerin Korunması', href: '/yasal/kvkk' },
    { label: 'Kullanım Koşulları', href: '/yasal/kullanim-kosullari' },
    { label: 'Çerez Politikası', href: '/yasal/cerez' },
    { label: 'Tüm Yasal Metinler', href: '/yasal' },
];

const paymentBadges = ['Visa', 'Mastercard', 'Troy', 'Amex'];
const securityBadges = ['ETBİS', 'PCI DSS', 'ISO 27001', 'SSL'];

function BadgeRow({ items }: { items: string[] }) {
    return (
        <div className="flex flex-wrap gap-2">
            {items.map((item) => (
                <span
                    key={item}
                    className="inline-flex h-8 min-w-[52px] items-center justify-center rounded-md border border-neutral-200 bg-white px-2 text-[10px] font-semibold uppercase tracking-wide text-neutral-500"
                >
                    {item}
                </span>
            ))}
        </div>
    );
}

type AuthFooterMobileProps = {
    containerClassName?: string;
};

export function AuthFooterMobile({
    containerClassName = STOREFRONT_CONTENT_CONTAINER_CLASS,
}: AuthFooterMobileProps) {
    return (
        <footer className="mt-auto lg:hidden">
            <div className="border-t border-neutral-200 bg-neutral-100">
                <div className={cn(containerClassName)}>
                    <Accordion type="multiple" className="w-full">
                        {footerColumns.map((column) => (
                            <AccordionItem
                                key={column.title}
                                value={column.title}
                                className="border-neutral-200"
                            >
                                <AccordionTrigger className="py-4 text-sm font-semibold text-neutral-900 hover:no-underline">
                                    {column.title}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul className="space-y-3 pb-2">
                                        {column.links.map((link) => (
                                            <li key={link.href}>
                                                <Link
                                                    href={link.href}
                                                    className="text-sm text-neutral-600"
                                                >
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <div className="space-y-6 border-t border-neutral-200 py-6">
                        <div>
                            <h3 className="mb-3 text-sm font-semibold text-neutral-900">
                                Güvenli Alışveriş
                            </h3>
                            <BadgeRow items={paymentBadges} />
                        </div>
                        <div>
                            <h3 className="mb-3 text-sm font-semibold text-neutral-900">
                                Güvenlik Sertifikaları
                            </h3>
                            <BadgeRow items={securityBadges} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-neutral-950 text-white">
                <div className={cn('flex flex-col gap-6 py-6', containerClassName)}>
                    <div className="flex items-center justify-center gap-3">
                        {[Instagram, Youtube, Facebook].map((Icon, index) => (
                            <a
                                key={index}
                                href="#"
                                aria-label="Sosyal medya"
                                className="flex size-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                            >
                                <Icon className="size-4" />
                            </a>
                        ))}
                    </div>

                    <AppStoreBadges className="justify-center" size="sm" />

                    <div className="flex flex-col gap-3 border-t border-white/10 pt-4 text-center text-[11px] text-white/70">
                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                            {legalLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="transition-colors hover:text-white"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        <p>© {new Date().getFullYear()} AKBEN Kuyumculuk. Her Hakkı Saklıdır.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
