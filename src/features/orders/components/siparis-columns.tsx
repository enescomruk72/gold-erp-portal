/**
 * Sipariş (Order) Kolonları – Portal
 * Cari kendi siparişlerini görür; Müşteri kolonu yok.
 */

'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, MoreVerticalIcon, Package2 } from 'lucide-react';
import Link from 'next/link';
import type { ISiparisListDTO } from '@/features/orders/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Route } from 'next';

const siparisTipiLabels: Record<string, string> = {
    PERAKENDE: 'Perakende',
    TOPTAN: 'Toptan',
    E_TICARET: 'E-Ticaret',
    OZEL_URETIM: 'Özel Üretim',
    KONSINYE: 'Konsinye',
};

const siparisDurumuLabels: Record<string, string> = {
    BEKLEMEDE: 'Beklemede',
    ONAYLANDI: 'Onaylandı',
    TESLIM_EDILDI: 'Teslim Edildi',
};

const odemeDurumuLabels: Record<string, string> = {
    ODENMEDI: 'Ödenmedi',
    KISME_ODENDI: 'Kısmen Ödendi',
    ODENDI: 'Ödendi',
};

export const siparisColumns: ColumnDef<ISiparisListDTO>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <div className="flex items-center justify-center px-2 w-full">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Tümünü seç"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center px-2">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Satırı seç"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
        meta: { sticky: true, headerClassName: 'min-w-10!' },
    },
    {
        id: 'siparisNo',
        accessorKey: 'siparisNo',
        header: 'Sipariş No',
        cell: ({ row }) => (
            <div className="flex gap-2">
                <span className="flex items-center justify-center">
                    <Package2 className="size-5 w-auto text-muted-foreground/60" />
                </span>
                <div className="flex flex-col">
                    <span className="font-medium text-primary">
                        {row.getValue('siparisNo')}
                    </span>
                    <span className="font-medium text-xs text-muted-foreground group-hover:text-primary">
                        {row.original.urunCount} Ürün
                    </span>
                </div>
            </div>
        ),
        enableSorting: true,
        enableHiding: true,
        meta: {
            label: 'Sipariş No',
            filterable: true,
            filterType: 'text',
            headerClassName: 'w-[140px]',
        },
    },
    {
        id: 'siparisTarihi',
        accessorKey: 'siparisTarihi',
        header: 'Sipariş Tarihi',
        cell: ({ row }) => {
            const val = row.getValue('siparisTarihi') as string;
            return val ? (
                <span className="text-sm text-muted-foreground">
                    {new Date(val).toLocaleDateString('tr-TR')}
                </span>
            ) : (
                <span className="text-muted-foreground">-</span>
            );
        },
        enableSorting: true,
        enableHiding: true,
        meta: { label: 'Sipariş Tarihi', headerClassName: 'w-[110px]' },
    },
    {
        id: 'siparisTipi',
        accessorKey: 'siparisTipi',
        header: 'Tip',
        cell: ({ row }) => {
            const tip = row.getValue('siparisTipi') as string;
            const label = siparisTipiLabels[tip] ?? tip;
            return <Badge variant="outline">{label}</Badge>;
        },
        enableSorting: false,
        enableHiding: true,
        meta: { label: 'Tip', headerClassName: 'w-[110px]' },
    },
    {
        id: 'durum',
        accessorKey: 'durum',
        header: 'Durum',
        cell: ({ row }) => {
            const durum = row.getValue('durum') as string;
            const label = siparisDurumuLabels[durum] ?? durum;
            const variant =
                durum === 'TESLIM_EDILDI' ? 'default' : durum === 'ONAYLANDI' ? 'secondary' : 'outline';
            return <Badge variant={variant}>{label}</Badge>;
        },
        enableSorting: false,
        enableHiding: true,
        meta: { label: 'Durum', headerClassName: 'w-[120px]' },
    },
    {
        id: 'odemeDurumu',
        accessorKey: 'odemeDurumu',
        header: 'Ödeme',
        cell: ({ row }) => {
            const odeme = row.getValue('odemeDurumu') as string;
            const label = odemeDurumuLabels[odeme] ?? odeme;
            const variant =
                odeme === 'ODENDI' ? 'default' : odeme === 'KISME_ODENDI' ? 'secondary' : 'outline';
            return <Badge variant={variant}>{label}</Badge>;
        },
        enableSorting: false,
        enableHiding: true,
        meta: { label: 'Ödeme', headerClassName: 'w-[120px]' },
    },
    {
        id: 'genelToplam',
        accessorKey: 'genelToplam',
        header: 'Tutar',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium tabular-nums">
                    {Number(row.getValue('genelToplam')).toLocaleString('tr-TR', {
                        minimumFractionDigits: 2,
                    })}{' '}
                    TL
                </span>
                {row.original.araToplam &&
                    row.original.araToplam !== row.original.genelToplam && (
                        <span className="font-medium text-xs tabular-nums text-muted-foreground">
                            Ara:{' '}
                            {Number(row.original.araToplam).toLocaleString('tr-TR', {
                                minimumFractionDigits: 2,
                            })}{' '}
                            TL
                        </span>
                    )}
            </div>
        ),
        enableSorting: false,
        enableHiding: true,
        meta: { label: 'Toplam', headerClassName: 'w-[120px]' },
    },
    {
        id: 'actions',
        header: 'İşlemler',
        cell: ({ row }) => {
            const siparis = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <span className="sr-only">Menüyü aç</span>
                            <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-40">
                        <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/orders/${siparis.id}` as Route}>
                                <Eye className="h-4 w-4" />
                                Görüntüle
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        enableSorting: false,
        enableHiding: false,
        meta: { sticky: true, headerClassName: 'w-[80px]' },
    },
];

export function useSiparisColumns() {
    return React.useMemo(() => siparisColumns, []);
}
