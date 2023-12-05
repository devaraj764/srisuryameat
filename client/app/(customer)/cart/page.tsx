import { getCartProducts } from '@/api/product.functions';
import CartGrid from '@/components/cart/CartGird';
import CheckOutButton from '@/components/cart/CheckOutButton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import React from 'react'

type Props = {}


async function CartPage({ }: Props) {
    const { products: data } = await getCartProducts();
    if (!data) return <div className='min-h-10 flex items-center justify-center w-full border rounded-md'>
        <h1>Sorry no cart items found!</h1>
    </div>
    const products = [];
    for (let item of data) {
        products.push(item.product);
    }
    return (
        <main className='mt-24 max-w-[1400px] mx-auto px-3'>
                <div className="flex items-center justify-between mb-5">
                    <h1 className="text-2xl font-bold text-gray-700 ">Cart</h1>
                    <CheckOutButton data={data} />
                </div>
                {!data || data.length === 0
                    ? <Alert>
                        <AlertTitle>Not Found!</AlertTitle>
                        <AlertDescription className='text-gray-500'>
                            Sorry your wishlist is empty!!!
                        </AlertDescription>
                    </Alert>
                    :
                    <CartGrid products={products} />
                }
        </main>
    )
}

export const dynamic = 'force-dynamic';

export default CartPage