"use client";
import { getMyOrders } from '@/api/order.functions';
import OrdersGrid from './OrdersGrid';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

function OrdersPageClient() {
    const { data, isFetching } = useQuery({
        queryKey: ['get-orders'],
        queryFn: () => getMyOrders(15),
        refetchOnWindowFocus: false,
        retry: 0
    })
    return (
        isFetching || !data ? <LoadingSkeleton /> :
            <main className='mt-20 md:mt-24'>
                <div className="max-w-[1400px] mx-auto px-4">
                    <h1 className="text-lg font-bold text-gray-700 ">Your Order Items</h1>
                    {!data || (data?.active?.length === 0 && data.completed?.length === 0)
                        ? <Alert>
                            <AlertTitle>Not Found!</AlertTitle>
                            <AlertDescription className='text-gray-500'>
                                Sorry your orders is empty!!!
                            </AlertDescription>
                        </Alert>
                        :
                        <>
                            {data?.active && data.active?.length > 0 &&
                                <>
                                    <h6 className='text-gray-500 text-sm mt-5 mb-2'>Active Orders</h6>
                                    <OrdersGrid orders={data?.active} />
                                </>
                            }
                            <h6 className='text-gray-500 text-sm mt-5 mb-2'>Completed Orders</h6>
                            <OrdersGrid orders={data?.completed} />
                        </>
                    }
                </div>
            </main>
    )
}

export function LoadingSkeleton() {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8]
    return (
        <div className="grid grid-cols-1 mf:grid-cols-4">
            {arr.map((number) => (
                <Skeleton key={number} className='min-h-24 w-full' />
            ))}
        </div>
    )
}

export default OrdersPageClient