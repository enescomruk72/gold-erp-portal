import AppRootLayout from "@/components/layout/root.layout";
import PageHeader from "@/components/shared/page-header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AppRootLayout>
            <PageHeader />
            {children}
        </AppRootLayout>
    );
}