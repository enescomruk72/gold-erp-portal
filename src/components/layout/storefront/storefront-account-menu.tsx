'use client';

import Link from 'next/link';
import {
    BadgeCheck,
    ChevronDown,
    ClipboardList,
    LogOut,
    User,
} from 'lucide-react';
import type { User as AuthUser } from 'next-auth';
import { signOut } from 'next-auth/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type StorefrontAccountMenuProps = {
    user?: AuthUser | null;
    className?: string;
    variant?: 'default' | 'icon';
};

export function StorefrontAccountMenu({
    user,
    className,
    variant = 'default',
}: StorefrontAccountMenuProps) {
    const displayName =
        user && (user as AuthUser & { firstName?: string; lastName?: string })
            ? `${(user as AuthUser & { firstName?: string }).firstName || ''} ${(user as AuthUser & { lastName?: string }).lastName || ''}`.trim() ||
            user.userName ||
            'Hesabım'
            : 'Hesabım';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size={variant === 'icon' ? 'icon' : 'lg'}
                    aria-label={variant === 'icon' ? 'Hesabım' : undefined}
                    className={cn(
                        'inline-flex shrink-0 text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        variant === 'icon'
                            ? 'size-10 rounded-md'
                            : 'flex-col items-center gap-0.5 rounded-md px-2 py-1.5',
                        className
                    )}
                >
                    <User className="size-5" aria-hidden />
                    {variant !== 'icon' && (
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-medium leading-none">
                            Hesabım
                            <ChevronDown className="size-3 opacity-60" aria-hidden />
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-56">
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-2 py-2">
                        <Avatar className="size-8 rounded-lg">
                            <AvatarImage src={user?.image || undefined} alt={displayName} />
                            <AvatarFallback className="rounded-lg">
                                {displayName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid text-left text-sm leading-tight">
                            <span className="truncate font-medium text-[#0769e9]">{displayName}</span>
                            <span className="truncate text-xs text-muted-foreground">
                                {user?.email || user?.userName || '-'}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/orders">
                            <ClipboardList className="mr-2 size-4" />
                            Tüm Siparişlerim
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/account">
                            <BadgeCheck className="mr-2 size-4" />
                            Kullanıcı Bilgilerim
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    variant="destructive"
                    onClick={() => signOut({ callbackUrl: '/auth/login' })}
                >
                    <LogOut className="mr-2 size-4" />
                    Çıkış Yap
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
