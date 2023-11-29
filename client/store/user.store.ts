'use client';
import { create } from 'zustand'
import { authenticateUser, getUserDetails } from '@/api/user.functions'
import { googleLogout } from '@react-oauth/google';

type UserStore = {
    user: UserT | null
    token: string | null
    signIn: (data: AuthUserT) => Promise<UserT> | null
    signOut: () => void
    setUserData: () => void,
    isCarted: (productId: string) => {
        productId: string;
        quantity: number;
        units: "g" | "kg";
        price: number;
    } | undefined,
    isWishlisted: (productId: string) => boolean
    isSelectedAddress: (addressId: string) => boolean
    updateUserData: (data: any) => void
}

const userStore = create<UserStore>((set, get) => ({
    user: null,
    token: null,
    signIn: async (data: AuthUserT) => {
        const res = await authenticateUser(data);
        if (!res) return null;
        const { user } = res;
        if (user)
            set(() => ({ user }))
        return user
    },
    signOut: async () => {
        googleLogout();
        localStorage.removeItem('token');
        set(() => ({ token: null, user: null }));
    },
    setUserData: async () => {
        const { user }: { user: UserT } = await getUserDetails();
        set(() => ({ user }))
        return user
    },
    updateUserData: async (data: UserT) => {
        set(() => ({ user: data }));
    },
    isCarted: (productId: string) => {
        const returns = get().user?.cart.filter(item => item.productId === productId);
        return returns ? returns[0] : undefined;
    },
    isWishlisted: (productId: string) => {
        const returns = get().user?.wishlist.filter(item => item.productId === productId);
        return returns && returns.length > 0 ? true : false;
    },
    isSelectedAddress: (addressId: string) => {
        return addressId === get().user?.currentAddressId;
    }
}))

export default userStore;