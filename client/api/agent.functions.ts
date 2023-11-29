import axiosInstance from "./axiosInstance";

export const getAssigns = async (limit?: number, query?: string) => {
    try {
        const res = await axiosInstance.get(`/agent/get-assigns/${query}?limit=${limit}`);
        return await res.data;
    } catch (error) {
        console.error(error)
    }
}

export const sendOtp = async (orderId: string) => {
    try {
        const res = await axiosInstance.get(`/agent/send-otp/${orderId}`);
        return await res.data;
    } catch (error) {
        console.error(error)
    }
}


export const deliveryOrder = async (data: { orderId: string, assignId: string, code: number }) => {
    try {
        const res = await axiosInstance.patch(`/agent/order-delivered`, data);
        return await res.data;
    } catch (error) {
        console.error(error)
    }
}
