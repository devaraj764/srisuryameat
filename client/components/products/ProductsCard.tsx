import React from 'react'
import Image from 'next/image'
import {  AiFillInfoCircle } from 'react-icons/ai'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import AddToCartButton from './AddToCartButton';
import { AspectRatio } from "@/components/ui/aspect-ratio"


type Props = {
  product: ProductT
}

const item = {
  title: 'Rohu/seelavathi curry cut with head',
  category: 'chicken',
  quantities: [
    {
      per: '500g',
      price: 160
    },
    {
      per: '1g',
      price: 240
    },
  ],
}

function ProductsCard({ product }: Props) {
  return (
    <div className='p-3 bg-white shadow-md rounded-lg w-full h-full'>
      <div className="relative">
        <AspectRatio ratio={1/1} className={`flex items-center justify-center bg-blue-50 rounded overflow-hidden border`}>
          <Image src={product.thumbnail} alt='banner image' className='max-h-[300px] w-auto rounded duration-1000 hover:scale-150 cursor-pointer' width="0"
            height="0"
            sizes="100vw"
            loading="lazy"
          />
        </AspectRatio>
      </div>
      <p className=' text-gray-400 text-sm mt-2 '>{product.category}</p>
      <h4 className='text-lg font-medium text-gray-600 truncate'>{product.name}</h4>
      <HoverCard>
        <HoverCardTrigger className='flex items-center text-sm mt-1 text-blue-500 gap-1 cursor-pointer'><AiFillInfoCircle /> Details</HoverCardTrigger>
        <HoverCardContent>
          <p className='text-sm text-gray-700 mb-2'>{product.name}</p>
          <p className='text-xs text-gray-500'>{product.description}</p>
        </HoverCardContent>
      </HoverCard>
      <AddToCartButton data={product} />
    </div>
  )
}

export default ProductsCard