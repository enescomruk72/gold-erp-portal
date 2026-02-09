"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import type { NavGroup, NavMainItem } from "@/constants/navigation/types";
import { SIDEBAR_NAVIGATION } from "@/constants/navigation/sidebar.constants";

const isUrlActive = (url: string | undefined, pathname: string): boolean => {
    if (!url) return false;
    if (pathname === url) return true;
    return pathname.startsWith(url + "/");
};

const NavItem = ({
    item,
    pathname,
}: {
    item: NavMainItem;
    pathname: string;
}) => {
    const isActive = isUrlActive(item.url, pathname);
    const hasSubItems = Boolean(item.items && item.items.length > 0);

    if (item.url && !hasSubItems) {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.url}>
                        {item.icon &&
                            (React.isValidElement(item.icon) ? (
                                item.icon
                            ) : (
                                <item.icon className="h-4 w-4" />
                            ))}
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    }

    return null;
};

const NavGroupComp = ({
    group,
    pathname,
}: {
    group: NavGroup;
    pathname: string;
}) => {
    if (group.items.length === 0) return null;
    return (
        <SidebarGroup key={group.id}>
            {group.group && (
                <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
            )}
            <SidebarMenu>
                {group.items.map((item) => (
                    <NavItem key={item.title} item={item} pathname={pathname} />
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
};

export const AppSidebarPrimary = React.memo(() => {
    const pathname = usePathname();
    const navigationGroups = useMemo(() => SIDEBAR_NAVIGATION, []);

    return (
        <>
            {navigationGroups.map((group) => (
                <NavGroupComp
                    key={group.id}
                    group={group}
                    pathname={pathname}
                />
            ))}
        </>
    );
});

AppSidebarPrimary.displayName = "AppSidebarPrimary";
