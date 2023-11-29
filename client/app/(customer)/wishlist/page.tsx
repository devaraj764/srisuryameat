import { getWishlistProducts } from '@/api/product.functions';
import WishlistGrid from '@/components/wishlist/WishlistGrid'
import React from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


type Props = {}

async function WishlistPage({ }: Props) {
  const { products: data } = await getWishlistProducts();
  const products = [];
  var totalAmont = 0
  for (let item of data) {
    products.push(item.product);
    totalAmont += item.price
  }
  return (
    <main className='mt-24'>
      <div className="container">
        <h1 className="text-lg font-medium text-gray-500 mb-5">Your Wishlist</h1>
        {!data || data.length === 0
          ? <Alert>
            <AlertTitle>Not Found!</AlertTitle>
            <AlertDescription className='text-gray-500'>
              Sorry your wishlist is empty!!!
            </AlertDescription>
          </Alert>
          :
          <WishlistGrid products={products} />
        }
        <br />
      </div>
    </main>
  )
}

export const dynamic = 'force-dynamic';

export default WishlistPage