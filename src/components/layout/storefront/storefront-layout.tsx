import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import type { User } from 'next-auth';
import { AuthFooter } from '@/components/layout/auth/auth-footer';
import { StorefrontHeader } from './storefront-header';

export default async function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect('/auth/login');
    }

    return (
        <div className="min-h-screen w-full bg-white">
            <StorefrontHeader user={session.user as User} />
            <main className="relative w-full bg-white min-h-screen">{children}</main>
            <AuthFooter />
        </div>
    );
}
