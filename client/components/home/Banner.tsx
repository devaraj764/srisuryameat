import React from 'react'
import Image from 'next/image'
import StakeImage from '@/app/assets/stake-image.png'
import Link from 'next/link'
import { HiPhone, HiShoppingBag } from 'react-icons/hi2'
import { FaFacebook, FaInstagram,  FaWhatsapp } from 'react-icons/fa6'


type Props = {}

const Banner = (props: Props) => {
    return (
        <>
            <div className='w-full bg-black pt-0 md:pt-12 relative text-white z-10'>
                <div className="max-w-[1400px] mx-auto px-5 flex items-center justify-between gap-10 py-16">
                    <div className='flex-1 py-10'>
                        <h1 className="font-semibold text-4xl text-white">Fresh Meat</h1>
                        <h1 className="font-bold text-7xl text-white">Leading <span className='text-primary'>Firm</span></h1>
                        <h4 className='text-sm md:text-md text-gray-500 max-w-xl mb-10 mt-5'>From farm to fork, we bring you the finest meats, handpicked for perfection. Satisfy your cravings with our succulent cuts, where quality meets taste in every bite.</h4>
                        <div className='flex items-center gap-7 my-5'>
                            <Link href={`tel:+91${7013240218}`} className='bg-blue-500 w-fit px-5 py-2 flex items-center gap-2'>
                                <HiPhone size='24' /> Call
                            </Link>
                            <Link href='/products' className='bg-primary w-fit px-5 py-2 flex items-center gap-2'>
                                <HiShoppingBag size='24' /> Shop now
                            </Link>
                        </div>
                        <div className="flex items-center gap-5">
                            <h5 className='text-gray-300'>Follow us on:</h5>
                            <Link href='/' target='_blank'>
                                <FaFacebook size='24' />
                            </Link>
                            <Link href='/' target='_blank'>
                                <FaInstagram size='24' />
                            </Link>
                            <Link href='/' target='_blank'>
                                <FaWhatsapp size='24' />
                            </Link>
                        </div>
                        <div className="flex my-5 mb-[-30px] items-center border w-fit p-3 border-gray-600">
                            <div className='mr-10'>
                                <h1 className="text-4xl font-bold">500+</h1>
                                <p className="text-sm text-gray-500">Orders</p>
                            </div>
                            <div className="border w-0 h-10 border-gray-400 mr-7"></div>
                            <div className='mr-14'>
                                <h1 className="text-4xl font-bold">80+</h1>
                                <p className="text-sm text-gray-500">Products</p>
                            </div>
                        </div>
                    </div>
                    <div className='opacity-100 bg-gray-900 rounded-full flex-1 max-h-[500px] max-w-[500px]'>
                        <Image src={StakeImage} alt='Banner Image' className='bg-blend-lighten h-full' />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Banner