'use server'
 
import { revalidateTag } from 'next/cache'
 
export default async function revalidateCartItems() {
  revalidateTag('get-wishlist-products')
}