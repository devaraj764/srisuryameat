import { backendUrl as bu } from "@/lib/config";
import axiosInstance, { headers } from "./axiosInstance";

export const createOrUpdateProduct = async ({ data, id }: { data: ProductCreateT | { inStock: boolean }, id?: string }) => {
    try {
        var res;
        if (id) {
            res = await axiosInstance.patch(`/products/${id}`, { ...data });
        } else {
            res = await axiosInstance.post('/products/create', { product: data });
        }
        return await res.data;
    } catch (error) {
        console.log(error)
    }
}

export const getProducts = async (query?: any) => {
    try {
        const res = await fetch(`${bu}/products/all?${query ? query : ''}`, {
            method: "GET",
            headers: headers,
            cache: 'no-store',
            next: { tags: ['get-all-products'] }
        });
        return await res.json();
    } catch (error) {
        console.log(error)
    }
}

export const getCartProducts = async () => {
    try {
        const res = await fetch(`${bu}/products/cart`, {
            method: "GET",
            headers: headers,
            cache: 'no-store',
            credentials: 'include',
            next: { tags: ['get-cart-products'] }
        });
        return await res.json();
    } catch (error) {
        console.log(error)
    }
}


export const getWishlistProducts = async () => {
    try {
        const res = await fetch(`${bu}/products/wishlist`, {
            method: "GET",
            headers: headers,
            credentials: 'include',
            cache: "no-store",
            next: { tags: ['get-wishlist-products'] }
        });
        return await res.json();
    } catch (error) {
        console.log(error)
    }
}

export const addToCart = async (data: any) => {
    try {
        const res = await axiosInstance.post('/products/add-to-cart', data);
        return await res.data;
    } catch (error) {
        console.log(error)
    }
}

export const removeFromCart = async (id: string) => {
    try {
        const res = await axiosInstance.delete(`/products/remove-cart-item/${id}`);
        return await res.data;
    } catch (error) {
        console.log(error)
    }
}

export const toogleWishlist = async (data: { productId: string, action: "add" | "remove" }) => {
    try {
        const res = await axiosInstance.patch(`/products/toogle-wishlist/${data.productId}?action=${data.action}`);
        return await res.data;
    } catch (error) {
        console.log(error)
    }
}