import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type CartPaymentSectionCardProps = {
    title: string;
    children: React.ReactNode;
    className?: string;
};

export function CartPaymentSectionCard({
    title,
    children,
    className,
}: CartPaymentSectionCardProps) {
    return (
        <Card className={cn('overflow-hidden border shadow-sm py-0', className)}>
            <CardHeader className="border-b bg-neutral-100/80 px-4 py-3.5 dark:bg-neutral-900/50">
                <h2 className="text-base font-bold text-neutral-900 sm:text-lg">{title}</h2>
            </CardHeader>
            <CardContent className="p-4">{children}</CardContent>
        </Card>
    );
}
