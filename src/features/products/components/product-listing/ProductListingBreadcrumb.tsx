'use client';

import Link from 'next/link';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { categoryListHref } from '@/features/catalog-navigation';

type Crumb = { id: number; kategoriAdi: string };

type ProductListingBreadcrumbProps = {
    crumbs: Crumb[];
};

export function ProductListingBreadcrumb({ crumbs }: ProductListingBreadcrumbProps) {
    if (crumbs.length === 0) {
        return (
            <Breadcrumb className="text-xs">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">Ana Sayfa</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Ürünler</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        );
    }

    return (
        <Breadcrumb className="text-xs text-muted-foreground">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">Ana Sayfa</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {crumbs.map((crumb, index) => {
                    const isLast = index === crumbs.length - 1;
                    return (
                        <span key={crumb.id} className="contents">
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage className="font-medium text-foreground">
                                        {crumb.kategoriAdi}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={categoryListHref(crumb.id)}>
                                            {crumb.kategoriAdi}
                                        </Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </span>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
