"use client";

import {
    BadgeCheck,
    ChevronsUpDown,
    CreditCard,
    LogOut,
} from "lucide-react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import type { User } from "next-auth";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export function AppSidebarUser({
    user,
    contentSide = "right",
    contentAlign = "end",
}: {
    user?: User | null
    contentSide?: "left" | "right" | "bottom" | "top"
    contentAlign?: "center" | "end" | "start"
}) {
    const { isMobile } = useSidebar();
    const displayName =
        user && (user as User & { firstName?: string; lastName?: string })
            ? `${(user as User & { firstName?: string }).firstName || ""} ${(user as User & { lastName?: string }).lastName || ""}`.trim() ||
            user.userName ||
            "-"
            : "-";

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className={cn(
                                "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
                                isMobile ? "rounded-full" : "rounded-lg"
                            )}
                        >
                            <Avatar
                                className={
                                    isMobile
                                        ? "h-8 w-8 rounded-full ring ring-border"
                                        : "h-8 w-8 rounded-lg ring ring-border"
                                }
                            >
                                <AvatarImage
                                    src={user?.image || undefined}
                                    alt={user?.name || undefined}
                                />
                                <AvatarFallback
                                    className={
                                        isMobile ? "rounded-full" : "rounded-lg"
                                    }
                                >
                                    {displayName?.charAt(0) || "CN"}
                                </AvatarFallback>
                            </Avatar>
                            {!isMobile && (
                                <>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">
                                            {displayName}
                                        </span>
                                        <span className="truncate text-xs">
                                            {user?.email || "-"}
                                        </span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </>
                            )}
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : contentSide}
                        align={contentAlign}
                        sideOffset={8}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg ring ring-border">
                                    <AvatarImage
                                        src={user?.image || undefined}
                                        alt={user?.name || undefined}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        {displayName?.charAt(0) || "CN"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {user?.userName || "-"}
                                    </span>
                                    <span className="truncate text-xs">
                                        {user?.email || "-"}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <BadgeCheck className="mr-2 h-4 w-4" />
                                Profil
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Fatura
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() =>
                                signOut({ callbackUrl: "/auth/login" })
                            }
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Çıkış Yap
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
