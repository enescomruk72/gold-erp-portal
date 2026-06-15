import { PortalMaintenanceBanner } from '@/features/settings';

import StorefrontLayout from '@/components/layout/storefront/storefront-layout';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <PortalMaintenanceBanner />
            <StorefrontLayout>{children}</StorefrontLayout>
        </>
    );
}
