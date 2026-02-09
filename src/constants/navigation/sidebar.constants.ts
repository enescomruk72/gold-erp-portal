import type { NavGroup } from "@/constants/navigation/types";
import { LayoutDashboard, Package, ShoppingBag, FileText } from "lucide-react";

/**
 * B2B Portal Sidebar Navigation
 */
export const SIDEBAR_NAVIGATION: NavGroup[] = [
    {
        id: 1,
        group: "PANEL",
        state: { value: "default" },
        items: [
            {
                title: "Dashboard",
                url: "/",
                icon: LayoutDashboard,
                state: { value: "default" },
                verbose_name_plural: "Dashboard",
            },
        ],
    },
    {
        id: 2,
        group: "SATIŞ",
        state: { value: "default" },
        items: [
            {
                title: "Ürünler",
                url: "/products",
                icon: Package,
                state: { value: "default" },
                verbose_name_plural: "Ürünler",
            },
            {
                title: "Sepet",
                url: "/cart",
                icon: ShoppingBag,
                state: { value: "default" },
                verbose_name_plural: "Sepet",
            },
            {
                title: "Siparişlerim",
                url: "/orders",
                icon: FileText,
                state: { value: "default" },
                verbose_name_plural: "Siparişler",
            },
        ],
    },
];
