import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-gutter text-center">
            <p className="text-6xl font-bold tracking-tight text-neutral-300">404</p>
            <h1 className="mt-4 text-xl font-semibold text-neutral-900">
                Sayfa bulunamadı
            </h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Aradığınız yasal metin veya sayfa mevcut değil.
            </p>
            <Button asChild className="mt-6">
                <Link href="/">Ana sayfaya dön</Link>
            </Button>
        </div>
    );
}
