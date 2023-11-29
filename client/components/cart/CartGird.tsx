import React from 'react'
import ProductsCard from '../products/ProductsCard';

type Props = {
    products: ProductT[]
}

export default async function CartGrid({ products }: Props) {
    if (products)
        return (
            <div className='grid grid-cols-1 sm:grid-col-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {products?.length > 0 && products?.map((product: ProductT, index: number) => (
                    <ProductsCard key={index.toString()} product={product} />
                ))}
            </div>
        )
    else return <h5>No products found</h5>
}