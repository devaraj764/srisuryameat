import React from 'react'
import ProductsCard from './ProductsCard'
import { getProducts } from '@/api/product.functions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Props = {
    params: {};
    searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ProductsGrid(props: Props) {

    // const category = searchParams.category;
    const data = await getProducts(`category=${''}`);
    if (data && data.products)
        return (
            <div className='grid grid-cols-1 sm:grid-col-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {data.products?.length > 0 && data.products?.map((product: ProductT, index: number) => (
                    <ProductsCard key={index.toString()} product={product} />
                ))}
            </div>
        )
    else return <Alert>
        <AlertTitle>Not Found!</AlertTitle>
        <AlertDescription className='text-gray-500'>
            Sorry no products found!!!
        </AlertDescription>
    </Alert>
}