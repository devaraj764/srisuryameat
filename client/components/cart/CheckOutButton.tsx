"use client";
import React from 'react'
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '../ui/separator';
import AddressesList from '../profile/AddressesList';
import { Button } from '../ui/button';
import { useMutation } from '@tanstack/react-query';
import { createOrder } from '@/api/order.functions';
import { useToast } from '../ui/use-toast';
import revalidateCartItems from '@/app/(customer)/cart/action';
import userStore from '@/store/user.store';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Props = {
    data: CartItemT[]
}

function CheckOutButton({ data }: Props) {
    const { toast } = useToast();
    const router = useRouter();
    const {user, setUserData} = userStore();
    var totalAmont = 0;
    const orderItems: OrderItem[] = [];
    for (let item of data) {
        totalAmont += item.price
        orderItems.push({
            name: item.product?.name || '',
            productId: item.product?.id || '',
            thumbnail: item.product?.thumbnail || '',
            quantity: item.quantity,
            units: item.units,
            price: item.price
        })
    }

    const { mutate, isPending } = useMutation({
        mutationFn: createOrder,
        onSuccess: async (data) => {
            toast({
                title: "Success",
                description: data?.message || "Address added Successfully",
                className: 'bg-green-500 text-white'
            })
            await revalidateCartItems();
            setUserData();
            router.push('/orders')
        },
        onError: (err) => {
            toast({
                variant: 'destructive',
                description: err?.message || "Error creating Order",
            })
        }
    });

    const handleCreateOrder = () => {
        const newOrder: OrderCreateT = {
            addressId: user?.currentAddressId || '',
            items: orderItems,
            totalPrice : totalAmont
        };
        mutate(newOrder);
    }
    return (
        totalAmont > 0 &&
        <Dialog>
            <DialogTrigger className='bg-primary px-3 py-2 text-white flex items-center gap-2 text-sm'>
                Checkout <span className='text-lg font-medium'>₹{totalAmont}</span>
            </DialogTrigger>
            <DialogContent className='overflow-y-scroll max-h-[90vh]'>
                <h1 className="text-xl">
                    Checkout
                </h1>
                <Separator />
                <h5 className='text-md text-gray-400'>Items</h5>
                {orderItems?.map((item, index: number) => (
                    <div key={index.toString()} className="bg-white border rounded-md p-2 flex items-start gap-2">
                        <Image src={item.thumbnail} alt={item.name} width={30} height={30} className='h-14 w-14 rounded-lg border shadow' />
                        <div>
                            <h4 className='text-gray-500'>{item.name}</h4>
                            <h4 className='text-xs text-gray-400'>
                                <span className='text-lg font-bold text-gray-700'>₹{item.price}</span> / {item.quantity}{item.units}
                            </h4>
                        </div>
                    </div>
                ))}
                <h5 className='text-md text-gray-400'>Select Address</h5>
                <AddressesList />
                <Separator />
                <DialogFooter className='flex items-center justify-between'>
                    <h5 className='text-lg'>Total : ₹{totalAmont}</h5>
                    <Button onClick={handleCreateOrder} disabled={isPending} className='rounded-none bg-green-600 hover:bg-green-700'>Proceed</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CheckOutButton