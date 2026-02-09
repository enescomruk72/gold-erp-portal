'use client';

import { SiparisListTable } from '@/features/orders';

export default function OrdersPage() {
    return (
        <div className="flex-1 px-gutter pb-gutter">
            <SiparisListTable />
        </div>
    );
}
