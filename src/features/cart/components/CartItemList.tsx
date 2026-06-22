'use client';

import type { ICartItem } from '@/features/cart/store/cart.types';
import { groupCartItemsBySlicer, isSimpleCartLine } from '@/features/cart/lib/cart-group-items';
import { CartLineItem } from './CartLineItem';
import { CartProductGroupCard } from './CartProductGroupCard';

type CartItemListProps = {
    items: ICartItem[];
    compact?: boolean;
    readOnly?: boolean;
    showNoteEditor?: boolean;
    onUpdateQuantity?: (lineKey: string, miktar: number) => void;
    onRemove?: (lineKey: string) => void;
    onUpdateNote?: (lineKey: string, note: string) => void;
};

export function CartItemList({
    items,
    compact,
    readOnly,
    showNoteEditor,
    onUpdateQuantity,
    onRemove,
    onUpdateNote,
}: CartItemListProps) {
    const groups = groupCartItemsBySlicer(items);

    return (
        <div className="space-y-5">
            {groups.map((group) => {
                if (isSimpleCartLine(group.lines)) {
                    const item = group.lines[0];
                    return (
                        <CartLineItem
                            key={item.lineKey}
                            item={item}
                            compact={compact}
                            readOnly={readOnly}
                            showNoteEditor={showNoteEditor}
                            onUpdateQuantity={onUpdateQuantity}
                            onRemove={onRemove}
                            onUpdateNote={onUpdateNote}
                        />
                    );
                }

                return (
                    <CartProductGroupCard
                        key={group.groupKey}
                        lines={group.lines}
                        compact={compact}
                        readOnly={readOnly}
                        showNoteEditor={showNoteEditor}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemove={onRemove}
                        onUpdateNote={onUpdateNote}
                    />
                );
            })}
        </div>
    );
}
