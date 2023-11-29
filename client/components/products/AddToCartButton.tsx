"use client";
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { useMutation } from '@tanstack/react-query';
import { addToCart, removeFromCart } from '@/api/product.functions';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import userStore from '@/store/user.store';
import { FaCheck } from 'react-icons/fa6';
import { useToast } from '../ui/use-toast';
import { Skeleton } from '../ui/skeleton';
import { usePathname } from 'next/navigation';
import revalidateCartItems from '@/app/(customer)/cart/action';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import AddToWishlistButton from './AddToWishlistButton';

type Props = {
    data: ProductT
}

type SelectedQuantity = {
    quantity: number,
    units: 'g' | 'kg',
    price: number
}

function AddToCartButton({ data: product }: Props) {
    const { toast } = useToast();
    const pathname = usePathname();
    const { setUserData, isCarted, user } = userStore();
    const isInCart = isCarted(product.id);
    const [selected, setSelected] = useState<SelectedQuantity>(isInCart ?
        { quantity: isInCart.quantity, units: isInCart.units, price: isInCart.price }
        : product.prices[0]);

    const { mutate, isPending } = useMutation({
        mutationFn: addToCart,
        onSuccess: (data) => {
            toast({
                title: "Success",
                description: data.message,
                className: 'bg-green-500 text-white'
            })
            setUserData();
            if (pathname === '/cart') revalidateCartItems();
        },
        onError: (err) => {
            toast({
                variant: 'destructive',
                description: err.message,
            })
        }
    });

    const { mutate: removeMutate, isPending: removePending } = useMutation({
        mutationFn: removeFromCart,
        onSuccess: (data) => {
            toast({
                title: "Success",
                description: data.message,
                className: 'bg-green-500 text-white'
            });
            setUserData();
        },
        onError: (err) => {
            toast({
                variant: 'destructive',
                description: err.message,
            })
        }
    });

    const handleAddToCart = async (metadata?: SelectedQuantity) => {
        const payload = metadata ? {
            productId: product.id,
            ...metadata
        } : {
            productId: product.id,
            ...selected
        }
        mutate(payload)
    }

    const isSelected = (item: any) => {
        return selected.price === item.price
    }

    const handleSelectChange = (item: any) => {
        setSelected(item);
        if (user && isInCart) handleAddToCart(item)
    }

    useEffect(() => {
        if (isInCart) {
            setSelected({ quantity: isInCart.quantity, units: isInCart.units, price: isInCart.price })
        }
    }, [isInCart])

    return (
        <div className="mt-3">
            <ScrollArea className='w-full'>
                <div className="flex items-center gap-3  w-max overflow-auto">
                    {
                        product.prices.map((item, index) => (
                            <div onClick={() => handleSelectChange(item)} key={index} className={`border text-sm rounded-md p-2 cursor-pointer ${selected.price === item.price ? 'bg-primary text-white' : ''}`}>
                                {item.quantity}{item.units} - ₹ {item.price}
                            </div>
                        ))
                    }
                </div>
                <ScrollBar orientation='horizontal' hidden={true} />
            </ScrollArea>
            {
                !user ? null :
                    <div className='mt-4 flex gap-3'>
                        <AddToWishlistButton productId={product.id} />
                        {isInCart ?
                            pathname === '/cart' ?
                                <Button variant={'destructive'} className='w-full' onClick={() => removeMutate(product.id)} disabled={removePending}>Remove</Button>
                                :
                                <Button className='bg-green-600 w-full cursor-not-allowed' disabled={true}><FaCheck /> &nbsp; Added to cart</Button>
                            :
                            <Button variant={'outline'} className='border border-primary text-primary hover:text-primary w-full' onClick={() => handleAddToCart()} disabled={isPending || isInCart}>Add to cart</Button>
                        }
                    </div>
            }
        </div>
    )
}

export default AddToCartButton