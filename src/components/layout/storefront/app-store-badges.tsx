import Image from 'next/image';
import { cn } from '@/lib/utils';

type AppStoreBadgesProps = {
    className?: string;
    /** Badge yüksekliği — varsayılan 40px */
    size?: 'sm' | 'md';
};

const sizeClasses = {
    sm: 'h-9',
    md: 'h-10',
} as const;

export function AppStoreBadges({ className, size = 'md' }: AppStoreBadgesProps) {
    const heightClass = sizeClasses[size];

    return (
        <div className={cn('flex shrink-0 flex-row items-center gap-2', className)}>
            <a
                href="#"
                aria-label="App Store'dan indir"
                className="shrink-0 transition-opacity hover:opacity-80"
            >
                <Image
                    src="/download_on_the_app_store_badge_en.svg.webp"
                    alt="Download on the App Store"
                    width={120}
                    height={40}
                    className={cn('w-auto', heightClass)}
                />
            </a>
            <a
                href="#"
                aria-label="Google Play'den indir"
                className="shrink-0 transition-opacity hover:opacity-80"
            >
                <Image
                    src="/google_play_store_badge_en.svg.webp"
                    alt="Get it on Google Play"
                    width={135}
                    height={40}
                    className={cn('w-auto', heightClass)}
                />
            </a>
        </div>
    );
}
