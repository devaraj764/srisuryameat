import axiosInstance from "./axiosInstance";


export const getUserDetails = async () => {
    try {
        const res = await axiosInstance.get('/users/get-my-data');
        return await res.data;
    } catch (error) {
        console.error(error)
    }
}

export const authenticateUser = async (data: AuthUserT) => {
    try {
        const res = await axiosInstance.post('/authenticate', data);
        return await res.data;
    } catch (error) {
        console.error(error)
    }
}

export const logoutUser = async () => {
    try {
        const res = await axiosInstance.get('/logout');
        return await res.data;
    } catch (error) {
        console.error(error)
    }
}

export const updateUserDetails = async (data: AuthUserT | { currentAddressId: string }) => {
    try {
        const res = await axiosInstance.patch('/users/update-profile', data);
        return await res.data;
    } catch (error) {
        console.error(error)
    }
}

export const addAddress = async (data: AddressT) => {
    try {
        const res = await axiosInstance.post('/users/add-address', data);
        return await res.data;
    } catch (error) {
        console.error(error)
    }
}

export const updateAddress = async (id: string, data: AddressT) => {
    try {
        const res = await axiosInstance.post(`/users/update-address/${id}`, data);
        return await res.data;
    } catch (error) {
        console.error(error)
    }
}

export const getAllAddresses = async () => {
    try {
        const res = await axiosInstance.get(`/users/get-addresses`);
        return await res.data;
    } catch (error) {
        console.error(error)
    }
}

export const createComplaint = async (data: { orderId: string, message: string }) => {
    try {
        const res = await axiosInstance.post(`/users/create-complaint`, data);
        return await res.data;
    } catch (error) {
        console.error(error)
    }
}

export const sendFeedback = async (data: { message: string }) => {
    try {
        const res = await axiosInstance.post(`/users/send-feedback`, data);
        return await res.data;
    } catch (error) {
        console.error(error)
    }
}

export const cancelOrder = async (orderId: string) => {
    try {
        const res = await axiosInstance.delete(`/users/cancel-order/${orderId}`,);
        return await res.data;
    } catch (error) {
        console.error(error)
    }
}
