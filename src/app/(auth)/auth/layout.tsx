import { AuthShell } from '@/components/layout/auth';
import { PortalMaintenanceBanner } from '@/features/settings';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <PortalMaintenanceBanner />
            <AuthShell>{children}</AuthShell>
        </>
    );
}
