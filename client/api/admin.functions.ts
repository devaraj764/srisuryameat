import axiosInstance from "./axiosInstance";

export const getAllUsers = async (limit?: number, search?: string) => {
    try {
        const res = await axiosInstance.get(`/admin/get-all-users?limit=${limit}&search=${search}`);
        return await res.data;
    } catch (error) {
        console.error(error)
    }
}

export const getAgents = async (limit?: number, search?: string) => {
    try {
        const res = await axiosInstance.get(`/admin/get-agents?limit=${limit}`);
        return await res.data;
    } catch (error) {
        console.error(error)
    }
}

export const assignAgent = async (data: { orderIds: string[], agentId: string }) => {
    try {
        const res = await axiosInstance.post(`/admin/assign-agent`, data);
        return await res.data;
    } catch (error) {
        console.error(error)
    }
}

export const updateUser = async ({data, id}: { data: any, id: string }) => {
    console.log(data, id)
    try {
        const res = await axiosInstance.patch(`/admin/update-user/${id}`, data);
        return await res.data;
    } catch (error) {
        console.log(error)
    }
}

export const changeOrderStatus = async (data: { orderIds: string[], status: string }) => {
    try {
        const res = await axiosInstance.patch(`/admin/order/change-status`, data);
        return await res.data;
    } catch (error) {
        console.error(error)
    }
}

export const getComplaints = async () => {
    try {
        const res = await axiosInstance.get(`/admin/get-complaints`);
        return await res.data;
    } catch (error) {
        console.error(error)
    }
}

export const getFeedbacks = async () => {
    try {
        const res = await axiosInstance.get(`/admin/get-feedbacks`);
        return await res.data;
    } catch (error) {
        console.error(error)
    }
}
