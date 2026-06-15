'use client';

import { create } from 'zustand';

type DeliveryAddressSelectionState = {
    selectedAddressId: string | null;
    selectAddress: (id: string | null) => void;
};

export const useDeliveryAddressStore = create<DeliveryAddressSelectionState>()((set) => ({
    selectedAddressId: null,
    selectAddress: (id) => set({ selectedAddressId: id }),
}));
