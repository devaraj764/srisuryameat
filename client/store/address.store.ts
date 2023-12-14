'use client';
import { create } from 'zustand'

type AddressStore = {
    editAddress: AddressT | null
    setEditAddress: (data: AddressStore['editAddress']) => void
}

const addressStore = create<AddressStore>((set, get) => ({
    editAddress: null,
    setEditAddress: (data: AddressStore['editAddress']) => {
        set({ editAddress: data });
    }
}));

export default addressStore;