import axiosInstance, { headers, url } from "./axiosInstance";

export const createOrder = async (data: OrderCreateT) => {
    try {
        const res = await axiosInstance.post('/orders/create', data);
        return await res.data;
    } catch (error) {
        console.log(error)
    }
}

export const getMyOrders = async (limit?: number) => {
    try {
        const res = await axiosInstance.get(`/orders/get-my-orders`);
        return await res.data;
    } catch (error) {
        console.log(error)
    }
}

export const getOrdersList = async (limit?: number, search?: string ) => {
    try {
        const res = await axiosInstance.get(`/orders/all?limit=${limit}&search=${search}`);
        return await res.data;
    } catch (error) {
        console.log(error)
    }
}


export const getActiveOrders = async (search: string) => {
    try {
        const res = await axiosInstance.get(`/orders/active?search=${search}`);
        return await res.data;
    } catch (error) {
        console.log(error)
    }
}