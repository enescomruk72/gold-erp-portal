import { cn } from '@/lib/utils';

export const PDP_ICON_ACTION_CLASS =
    'flex size-12 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-colors hover:bg-neutral-50 hover:border-neutral-300';

export function pdpFavoriteActionClass(favorited: boolean) {
    return cn(PDP_ICON_ACTION_CLASS, favorited && 'border-rose-200 text-rose-500');
}
