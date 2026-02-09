/**
 * Ürün grid için kolon tanımları.
 * useDataGrid sözleşmesi için gerekli; grid kart görünümünde kullanılmaz.
 */

import type { ColumnDef } from '@/components/shared/data-table/types';
import type { IProductDTO } from '@/features/products/types';

export const productColumns: ColumnDef<IProductDTO, unknown>[] = [
    {
        id: 'urunAdi',
        accessorKey: 'urunAdi',
        header: 'Ürün Adı',
    },
];
