import { getProducts } from '@/api/product.functions'
import ProductsListGrid from '@/components/admin/products-list/ProductsListGrid'
import SearchProduct from '@/components/admin/products-list/SearchProduct'
import AddOrUpdateProduct from '@/components/products/AddOrUpdateProduct'
import React from 'react'
import { AiOutlinePlus } from 'react-icons/ai'

type Props = {
  params: {};
  searchParams: { [key: string]: string | undefined};
};

async function ProductsListPage({ searchParams }: Props) {
  const data = await getProducts(`productName=${searchParams.product_name || ''}`);
  return (
    <div className="max-w-[1400px] mx-auto p-3">
      <div className="flex items-center justify-between gap-3 mb-5">
        <SearchProduct />
        <AddOrUpdateProduct>
          <span className='text-blue-500 px-5 py-2 bg-white border rounded-md flex items-center gap-2 text-sm cursor-pointer'><AiOutlinePlus /> Add New Product</span>
        </AddOrUpdateProduct>
      </div>
      <ProductsListGrid data={data} />
    </div>
  )
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default ProductsListPage