import { useApiQuery } from '@/lib/api/hooks';
import type { B2bPublicAyarlar } from '../types';

export const publicAyarlarQueryKey = ['b2b', 'ayarlar', 'public'] as const;

export function useGetPublicAyarlar() {
    const query = useApiQuery<B2bPublicAyarlar>('/v1/b2b/ayarlar/public', {
        queryKey: [...publicAyarlarQueryKey],
        apiOptions: {
            requiresAuth: false,
        },
        queryOptions: {
            staleTime: 5 * 60 * 1000,
        },
    });

    const data = (query.data?.data ?? {}) as B2bPublicAyarlar;

    const maintenance = data.B2B_PORTAL_MAINTENANCE_MODE;
    const minOrder = data.B2B_PORTAL_MIN_ORDER_AMOUNT;
    const allowOrders = data.B2B_PORTAL_ALLOW_ORDERS;

    return {
        ...query,
        data,
        isMaintenanceMode: maintenance?.enabled === true,
        maintenanceMessage:
            maintenance?.message ??
            'Portal geçici olarak bakımdadır. Lütfen daha sonra tekrar deneyin.',
        minOrderAmount: minOrder?.amount ?? 0,
        minOrderCurrency: minOrder?.currency ?? 'TRY',
        allowOrders: allowOrders?.enabled !== false,
        supportPhone: data.B2B_PORTAL_SUPPORT_PHONE?.value,
        supportEmail: data.B2B_PORTAL_SUPPORT_EMAIL?.value,
        companyDisplayName: data.B2B_PORTAL_COMPANY_DISPLAY_NAME?.value,
    };
}
