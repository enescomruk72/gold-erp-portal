import { LucideIcon } from "lucide-react";

export type NavState =
    | { value: "default"; tooltip?: undefined }
    | { value: "disabled"; tooltip: string }
    | { value: "comingSoon"; tooltip: string }
    | { value: "inDevelopment"; tooltip: string }
    | { value: "planned"; tooltip: string };

export interface BaseNavItem
    extends Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "target"> {
    title: string;
    url?: string;
    icon?: LucideIcon | React.ReactElement;
    isActive?: boolean;
    state?: NavState;
    verbose_name_plural?: string;
}

export interface NavSubItem extends BaseNavItem {
    actionLabel?: string;
    items?: BaseNavItem[];
}

export interface NavMainItem extends BaseNavItem {
    items?: NavSubItem[];
}

export interface NavGroup extends Omit<BaseNavItem, "title" | "icon"> {
    id: number;
    group: string;
    items: NavMainItem[];
}
