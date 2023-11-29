"use client";
import React from 'react';
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { usePathname, useRouter } from 'next/navigation';
import userStore from '@/store/user.store';

const queryClient = new QueryClient()

const Provider: React.FC<{ children: React.ReactNode }> = (props) => {
    const { user } = userStore();
    const pathname = usePathname();
    const router = useRouter();
    if (user?.role === 'admin' && !pathname.includes('/admin')) {
        router.push('/admin')
    } else if (user?.role === 'agent' && !pathname.includes('/agent')) {
        router.push('/agent');
    } else if (user?.role === 'customer' && (pathname.includes('/admin') || pathname.includes('/agent'))) {
        router.push('/');
    }
    
    return (
        <GoogleOAuthProvider clientId={'100798026341-mo13lehidlcba8o9rronsqcd6r43h5np.apps.googleusercontent.com'}>
            <QueryClientProvider client={queryClient}>
                {props.children}
            </QueryClientProvider>
        </GoogleOAuthProvider>
    )
}

export default Provider;