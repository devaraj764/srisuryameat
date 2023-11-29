import React from 'react'
import { categories } from '@/lib/constants'
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/button';

type Props = {}

function WeProvide({ }: Props) {
  const images = [];
  for (let category of categories) {
    images.push(category.image || '');
  }
  return (
    <section className='px-3 md:container py-14'>
      <h2 className="text-center text-[28px] md:text-[30px] text-gray-700 font-bold">We Provide Meat of <br /> Best <span className='text-primary'>Category</span></h2>
      <div className="flex gap-1 md:gap-3 flex-wrap items-center justify-center mt-5 w-full">
        {
          categories.map((category, index) => (
            <div key={index.toString()} className="group relative overflow-hidden text-white p-5 flex items-center justify-center h-auto md:h-[200px] w-[180px] md:w-[200px] border rounded-md duration-200 text-center border-gray-300">
              <div className="flex gap-1 z-20">
                <i className=''>{category.icon}</i>
                &nbsp;
                <h1>{category.tag}</h1>
              </div>
              <div className="absolute z-20 h-[200px] flex items-end mb-5">
                <Link key={index.toString()} href={`/products?category=${category.variable}`}>
                  <Button className="rounded-full invisible duration-700 group-hover:visible">Visit</Button>
                </Link>
              </div>
              <div className="absolute t-0 b-0 r-0 bg-black opacity-60 z-10 w-full h-full"></div>
              <Image src={category.image} alt={category.tag} width={200} height={200} className='absolute z-0 t-0 b-0 r-0 duration-1000 w-full md:w-auto scale-150 group-hover:scale-[2.0]' />
            </div>
          ))
        }
      </div>
    </section>
  )
}

export default WeProvide