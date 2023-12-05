'use server'
 
import { revalidateTag } from 'next/cache'
 
export default async function revalidateWishlist() {
  revalidateTag('get-wishlist-products')
}