import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { AppSidebar } from "./app-sidebar";
import { AppSidebarProvider } from "@/providers/app-sidebar.provider";
import { SidebarInset } from "@/components/ui/sidebar";
import AppHeader from "./app-header";
import AppContentLayout from "./content.layout";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";

export default async function AppRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/auth/login");
    }

    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

    return (
        <AppSidebarProvider defaultOpen={defaultOpen} className="flex flex-col">
            <AppHeader session={session as Session} />
            <div className="flex flex-1">
                <AppSidebar session={session as Session} />
                <SidebarInset>
                    <AppContentLayout>{children}</AppContentLayout>
                </SidebarInset>
            </div>
        </AppSidebarProvider>
    );
}
