"use client";

import React from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarSeparator,
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";
import { AppSidebarPrimary } from "./app-sidebar-primary";
import { AppSidebarUser } from "./app-sidebar-user";
import { AppSidebarSecondary } from "./app-sidebar-secondary";
import type { Session, User } from "next-auth";

function VersionSwitcher({
    versions,
    defaultVersion,
}: {
    versions: string[];
    defaultVersion: string;
}) {
    const [selectedVersion, setSelectedVersion] =
        React.useState(defaultVersion);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <GalleryVerticalEnd className="size-4" />
                            </div>
                            <div className="flex flex-col gap-0.5 leading-none">
                                <span className="font-medium">B2B Versiyon</span>
                                <span className="">v{selectedVersion}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width)"
                        align="start"
                    >
                        {versions.map((version) => (
                            <DropdownMenuItem
                                key={version}
                                onSelect={() => setSelectedVersion(version)}
                            >
                                v{version}{" "}
                                {version === selectedVersion && <Check className="ml-auto" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

export const AppSidebar = ({
    session,
    ...props
}: React.ComponentProps<typeof Sidebar> & { session: Session | null }) => {
    return (
        <Sidebar
            collapsible="icon"
            variant="sidebar"
            className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
            {...props}
        >
            <SidebarHeader>
                <VersionSwitcher versions={["0.1.0"]} defaultVersion="0.1.0" />
            </SidebarHeader>
            <SidebarContent>
                <AppSidebarPrimary />
                <SidebarSeparator />
                <AppSidebarSecondary />
            </SidebarContent>
            <SidebarFooter className="flex items-center justify-center border-t border-border">
                <AppSidebarUser user={session?.user as User} />
            </SidebarFooter>
        </Sidebar>
    );
};
