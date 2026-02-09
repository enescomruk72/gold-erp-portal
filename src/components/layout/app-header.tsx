import { SidebarTrigger } from "@/components/ui/sidebar";
import { CartDrawer } from "@/features/cart";
import { AppSidebarUser } from "./app-sidebar-user";
import { Session, User } from "next-auth";

export default function AppHeader({ session }: { session: Session }) {
    return (
        <header className="bg-card dark:bg-black w-full h-(--header-height) min-h-(--header-height) transition-[width,height] duration-300 ease-linear border-b sticky top-0 z-50 backdrop-blur-sm">
            <div className="max-w-full w-full h-full px-gutter">
                <div className="flex items-center justify-between gap-4 flex-1 h-full">
                    <SidebarTrigger className="size-8" />
                    <div className="ml-auto flex items-center gap-2">
                        <CartDrawer />
                        <AppSidebarUser user={session.user as User} contentSide="bottom" contentAlign="end" />
                    </div>
                </div>
            </div>
        </header>
    );
}
