import { SidebarProvider } from "@/components/ui/sidebar";

export function AppSidebarProvider({
    children,
    defaultOpen = true,
    ...props
}: React.ComponentProps<typeof SidebarProvider>) {
    return (
        <SidebarProvider defaultOpen={defaultOpen} {...props}>
            {children}
        </SidebarProvider>
    );
}
