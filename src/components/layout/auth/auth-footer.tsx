import Link from 'next/link';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { AppStoreBadges } from '@/components/layout/storefront/app-store-badges';
import { cn } from '@/lib/utils';
import { STOREFRONT_CONTENT_CONTAINER_CLASS } from '@/constants/storefront/layout';
import { AuthFooterMobile } from './auth-footer-mobile';

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
        links: [
            { label: "Akben'de B2B Başvurusu", href: '/b2b-basvuru' },
        ],
    },
    {
        title: 'Yardım',
        links: [
            { label: 'Sıkça Sorulan Sorular', href: '/sss' },
        ],
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

function FooterLinkList({ links }: { links: FooterLink[] }) {
    return (
        <ul className="space-y-2.5">
            {links.map((link) => (
                <li key={link.href}>
                    <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        {link.label}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

function BadgeRow({ items }: { items: string[] }) {
    return (
        <div className="flex flex-wrap gap-2">
            {items.map((item) => (
                <span
                    key={item}
                    className="inline-flex h-8 min-w-[52px] items-center justify-center rounded-md border border-border bg-card px-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
                >
                    {item}
                </span>
            ))}
        </div>
    );
}

type AuthFooterProps = {
    className?: string;
    containerClassName?: string;
};

export function AuthFooter({
    className,
    containerClassName = STOREFRONT_CONTENT_CONTAINER_CLASS,
}: AuthFooterProps) {
    return (
        <>
            <AuthFooterMobile containerClassName={containerClassName} />

            <footer className={cn('mt-auto hidden bg-card lg:block', className)}>
            <div className="border-t border-border">
                <div
                    className={cn(
                        'grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-5',
                        containerClassName
                    )}
                >
                    {footerColumns.map((column) => (
                        <div key={column.title}>
                            <h3 className="mb-4 text-sm font-semibold text-foreground">{column.title}</h3>
                            <FooterLinkList links={column.links} />
                        </div>
                    ))}

                    <div className="space-y-6 sm:col-span-2 lg:col-span-2">
                        <div>
                            <h3 className="mb-3 text-sm font-semibold text-foreground">Güvenli Alışveriş</h3>
                            <BadgeRow items={paymentBadges} />
                        </div>
                        <div>
                            <h3 className="mb-3 text-sm font-semibold text-foreground">
                                Güvenlik Sertifikaları
                            </h3>
                            <BadgeRow items={securityBadges} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-primary text-primary-foreground">
                <div className={cn('flex flex-col gap-6 py-6', containerClassName)}>
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3">
                            {[Instagram, Youtube, Facebook].map((Icon, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    aria-label="Sosyal medya"
                                    className="flex size-9 items-center justify-center rounded-full border border-primary-foreground/20 transition-colors hover:border-primary-foreground/50 hover:bg-primary-foreground/10"
                                >
                                    <Icon className="size-4" />
                                </a>
                            ))}
                        </div>
                        <AppStoreBadges size="sm" />
                    </div>

                    <div className="flex flex-col gap-3 border-t border-primary-foreground/10 pt-4 text-[11px] text-primary-foreground/70 sm:flex-row sm:items-center sm:justify-between">
                        <p>© {new Date().getFullYear()} AKBEN Kuyumculuk. Her Hakkı Saklıdır.</p>
                        <div className="flex flex-wrap gap-4">
                            {legalLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="transition-colors hover:text-primary-foreground"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
        </>
    );
}
