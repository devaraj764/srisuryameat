import React from 'react'
import OrderCard from './OrderCard';

type Props = {
    orders: OrderT[]
}

export default function OrdersGrid({ orders }: Props) {
    if (orders)
        return (
            <div className='grid grid-cols-1 sm:grid-col-2 md:grid-cols-3 gap-5 mb-5'>
                {orders?.length > 0 && orders?.map((order: OrderT, index: number) => (
                    <OrderCard key={index.toString()} order={order} />
                ))}
            </div>
        )
    else return <h5>No products found</h5>
}