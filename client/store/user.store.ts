'use client';
import { create } from 'zustand'
import { authenticateUser, getUserDetails, logoutUser } from '@/api/user.functions'
import { googleLogout } from '@react-oauth/google';

type UserStore = {
    user: UserT | null
    signIn: (data: AuthUserT) => Promise<UserT> | null
    signOut: () => Promise<void>
    setUserData: () => Promise<UserT | null>,
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
    signIn: async (data: AuthUserT) => {
        const res = await authenticateUser(data);
        if (!res) return null;
        const { user } = res;
        if (user)
            set(() => ({ user }))
        return user
    },
    signOut: async () => {
        await logoutUser();
        googleLogout();
        set(() => ({ user: null }));
    },
    setUserData: async () => {
        const data = await getUserDetails();
        if(!data) return null;
        const { user }: { user: UserT } = await getUserDetails();
        if(user) set(() => ({ user }));
        return user;
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