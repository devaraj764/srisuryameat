"use client";
import React from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { Button } from '../ui/button';
import { useMutation } from '@tanstack/react-query';
import { toogleWishlist } from '@/api/product.functions';
import userStore from '@/store/user.store';
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from '../ui/skeleton';

type Props = {
    productId: string
}

function AddToWishlistButton({ productId }: Props) {
    const { toast } = useToast()
    const { isWishlisted, setUserData, user } = userStore()
    const isInWishlist = isWishlisted(productId);
    const { mutate, isPending } = useMutation({
        mutationFn: toogleWishlist,
        onSuccess: (data) => {
            toast({
                title: "Success",
                description: data.message,
                className: 'bg-green-500 text-white'
            })
            setUserData();
        },
        onError: (err) => {
            toast({
                variant: 'destructive',
                description: err.message,
            })
        }
    });
    const handleToogle = (action: "add" | "remove") => {
        mutate({ productId, action });
    }

    return (
        !user ? null :
            isInWishlist ?
                <Button onClick={() => handleToogle('remove')} disabled={isPending} variant={'outline'} className='text-primary h-10 w-10 p-2'>
                    <AiFillHeart size='32' />
                </Button>
                :
                <Button onClick={() => handleToogle('add')} disabled={isPending} variant={'outline'} className='text-gray-500 h-10 w-10 p-2'>
                    <AiOutlineHeart size='32' />
                </Button>
    )
}

export default AddToWishlistButton