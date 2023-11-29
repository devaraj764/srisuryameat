import { backendUrl } from "@/lib/config";
import axios from "axios";

export const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': '*'
}

export const url = backendUrl;

export const bindUrl = (suburl: string) => `${backendUrl}${suburl}`;

const instance = axios.create({
    baseURL: url,
    timeout: 1000,
    headers: headers,
    withCredentials: true
});

export default instance;