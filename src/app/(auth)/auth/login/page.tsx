import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { LoginForm } from '@/features/iam/components/login-form';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
    title: 'Giriş Yap | AKBEN B2B Portal',
    description: 'AKBEN B2B portal hesabınıza giriş yapın.',
};

export default function LoginPage() {
    return (
        <div className="flex min-h-[80vh] flex-1 flex-col items-center justify-center px-gutter py-10 sm:py-14">
            <div className="mb-base">
                <Link href="/" className="inline-block" aria-label="AKBEN ana sayfa">
                    <Image
                        src="/brand-logo.png"
                        alt="AKBEN"
                        width={180}
                        height={64}
                        className="h-28 w-auto object-contain md:h-32"
                        priority
                    />
                </Link>
            </div>

            <Card className="w-full max-w-md border shadow-google-sm py-gutter!">
                <CardContent className="p-base sm:p-gutter py-0!">
                    <div className="mb-base space-y-2 text-center">
                        <h1 className="text-xl font-semibold tracking-tight text-foreground">
                            Hesabınıza giriş yapın
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            B2B portal hesabınızla devam edin.
                        </p>
                    </div>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    );
}
