"use client";
import { backendUrl } from "@/lib/config";

import axios from "axios";

export const headers = {
    'Content-Type': 'application/json',
}

export const url = backendUrl;

const instance = axios.create({
    baseURL: url,
    timeout: 1000,
    headers: headers,
    withCredentials: true
});

export default instance;