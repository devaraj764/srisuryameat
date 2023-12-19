"use client";
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { AiOutlineLogout } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc'
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import userStore from '@/store/user.store';
import axios from 'axios';
import Spinner from './Spinner';
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query';
import { googleCientId } from '@/lib/config';

type Props = {
    className?: string
}

function SigninCard({ className }: Props) {
    const { user, signOut, signIn, setUserData } = userStore();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function callUserData() {
            setLoading(true)
            var value = localStorage.getItem("isLoggedin");
            if (value)
                await setUserData();
            setLoading(false)
        }
        if (typeof window !== "undefined") {
            callUserData();
        }
    }, []);


    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true)
            const res: any = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });
            const userInfo = await res.data;
            await signIn({
                name: userInfo.name,
                email: userInfo.email,
                profileImage: userInfo.picture
            });
            setLoading(false);
            router.refresh();
        },
    });

    const { isPending, mutate: logout } = useMutation({
        mutationFn: signOut,
        onSuccess: () => {
            router.push('/')
        }
    })

    if (loading || isPending) return <Button className={'duration-200 hover:scale-105' + className} variant={'outline'}>Wait...</Button>
    else if (user) {
        return (
            <Button disabled={loading} variant='destructive' className={'duration-200 hover:scale-105' + className} onClick={() => logout()}>
                <AiOutlineLogout size='22' /> &nbsp; Logout
            </Button>
        )
    }
    return (
        <Button className={className} disabled={loading} variant={'outline'} onClick={() => login()}><FcGoogle size={24} />&nbsp; SignIn</Button>
    )
}

export default function SigninButton({ className }: Props) {
    return (
        <GoogleOAuthProvider clientId={googleCientId}
        >
            <SigninCard className={className} />
        </GoogleOAuthProvider>
    )
}