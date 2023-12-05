import { backendUrl } from "@/lib/config";

import axios from "axios";

export const headers = {
    'Content-Type': 'application/json',
}

export const url = backendUrl;

const instance = axios.create({
    baseURL: url,
    headers: headers,
    withCredentials: true
});

export default instance;