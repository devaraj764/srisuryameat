import React from 'react'
import { getProducts } from '@/api/product.functions';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import AddOrUpdateProduct from '@/components/products/AddOrUpdateProduct';
import Image from 'next/image';
import SwitchStock from './SwitchStock';


type Props = {
    data: {
        products: ProductT[]
    }
}

export default async function ProductsListGrid({ data }: Props) {  
    if (data && data.products)
        return (
            <div className='grid grid-cols-1 sm:grid-col-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
                {data.products?.length > 0 && data.products?.map((product: ProductT, index: number) => (
                    <ProductsCard key={index.toString()} product={product} />
                ))}
            </div>
        )
    else return <h5>No products found</h5>
}

export function ProductsCard({ product }: { product: ProductT }) {
    return (
        <div className="bg-white shadow-md rounded-md p-3">
            <div className="flex items-center gap-2">
                <Image src={product.thumbnail} alt={product.name} width={30} height={30} className='h-14 w-14 rounded-lg border shadow' />
                <h4 className='text-gray-500'>{product.name}</h4>
            </div>
            <Separator className='my-3' />
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex items-center gap-2">
                    {
                        product.prices.map((item, index) => (
                            <h5 key={index.toString()} className="border p-2 w-fit text-xs rounded-md">
                                {item.quantity}{item.units} - ₹{item.price}
                            </h5>
                        ))
                    }
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <Separator className='my-3' />
            <ProductActions product={product} />
        </div>
    )
}

export function ProductActions({ product }: { product: ProductT }) {
    return (
        <div className="flex items-center gap-2">
            <SwitchStock inStock={product?.inStock} productId={product.id} />
            <AddOrUpdateProduct product={product}>
                <span className='bg-blue-500 hover:bg-blue-700 text-white py-2 w-fit px-7 text-center rounded-md cursor-pointer'>Edit</span>
            </AddOrUpdateProduct>
        </div>
    )
}