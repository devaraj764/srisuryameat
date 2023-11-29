"use client";
import SigninButton from '@/components/common/SigninButton';
import AddAddress from '@/components/profile/AddAddress';
import AddressesList from '@/components/profile/AddressesList';
import UpdateProfile from '@/components/profile/UpdateProfile';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import userStore from '@/store/user.store';
import Image from 'next/image';
import React from 'react'

type Props = {}

function ProfilePage({ }: Props) {
    const { user } = userStore();
    return (
        user ?
            <main className='mt-24 mb-16 mx-auto max-w-[1400px] px-3'>
                <section className='border bg-white px-5 py-4  flex items-center justify-between rounded-md shadow'>
                    <div className='flex items-center gap-2'>
                        <Image src={user?.profileImage || ''} alt={user?.name || ''} height={50} width={50} className='rounded-full' />
                        <div>
                            <h1 className="text-md text-gray-800">Hello! {user?.name}</h1>
                            <p className='text-xs text-gray-400'>{user?.email}</p>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <SigninButton />
                    </div>
                </section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-5">
                    <section className='border bg-white p-3 rounded shadow' >
                        <UpdateProfile />
                    </section>
                    <section className='border bg-white p-3 rounded shadow'>
                        <AddAddress />
                    </section>
                </div>
                <h4 className='my-3'>Addresses List</h4>
                <AddressesList />
            </main>
            :
            <Loading />
    )
}

function Loading() {
    return (
        <main className='mt-24 container'>
            <Skeleton className='w-full h-16' />
        </main>
    )
}

export default ProfilePage