import { getProducts } from '@/api/product.functions';
import ProductsCard from '@/components/products/ProductsCard';
import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import SelectCategory from '@/components/products/SelectCategory';

type Props = {
    params: {};
    searchParams: { [key: string]: string | undefined};
};

async function ProductsPage({ searchParams }: Props) {
    const data = await getProducts(`category=${searchParams.category || 'all'}`);
    
    return (
        <main className='mt-20 md:mt-24 max-w-[1400px] mx-auto  p-3'>
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-xl font-bold text-primary">Meat Products</h1>
                <SelectCategory defaultCategory={searchParams?.category} />
            </div>
            {
                data?.products?.length ?
                    <div className='grid grid-cols-1 sm:grid-col-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                        {data.products?.length > 0 && data.products?.map((product: ProductT, index: number) => (
                            <ProductsCard key={index.toString()} product={product} />
                        ))}
                    </div> :
                    <Alert>
                        <AlertTitle>Not Found!</AlertTitle>
                        <AlertDescription className='text-gray-500'>
                            Sorry no products found!!!
                        </AlertDescription>
                    </Alert>
            }
        </main >
    )
}

export const dynamic = 'force-dynamic';

export default ProductsPage;