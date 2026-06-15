import { cn } from '@/lib/utils';
import {
    STOREFRONT_CONTENT_CONTAINER_CLASS,
    STOREFRONT_HEADER_CONTAINER_CLASS,
} from '@/constants/storefront/layout';

type StorefrontContainerProps = {
    variant: 'header' | 'content';
    className?: string;
    children: React.ReactNode;
};

export function StorefrontContainer({
    variant,
    className,
    children,
}: StorefrontContainerProps) {
    return (
        <div
            data-storefront-header-container={variant === 'header' ? true : undefined}
            className={cn(
                variant === 'header'
                    ? STOREFRONT_HEADER_CONTAINER_CLASS
                    : STOREFRONT_CONTENT_CONTAINER_CLASS,
                className
            )}
        >
            {children}
        </div>
    );
}
