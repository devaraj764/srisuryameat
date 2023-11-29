import React from 'react'
import MeatBox from '@/app/assets/meat-box.jpg'
import Image from 'next/image'
import { Button } from '../ui/button'
import Link from 'next/link'

type Props = {}

function Quotation({ }: Props) {
    return (
        <div className="bg-white py-16">
            <div className="max-w-[1200px] mx-auto px-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="relative w-fit">
                        <Image src={MeatBox} alt="Meat on Heat" style={{ maxWidth: '360px' }} />
                        <div style={{ borderWidth: '5px' }} className="text-white rounded-full bg-primary flex flex-col items-center justify-center text-center h-[150px] w-[150px] border-solid border-2 border-white absolute top-[-50px] right-[50%] left-[50%] md:left-auto md:top-3 md:right-[-70px]">
                            <h1 className="text-5xl font-bold">25+</h1>
                            <p className='text-[10px]'>We are serving since</p>
                        </div>
                    </div>
                    <div className="flex flex-col  justify-center gap-3 ">
                        <h4 className="text-sm text-primary">Best Meat Delivery in your city</h4>
                        <h1 className="text-4xl font-bold text-gray-700">Let us Make the World <br />Better <span className='text-primary'>Meat Time</span></h1>
                        <p className='border p-3 rounded-md text-md text-gray-400 font-light italic mt-5'>&quot;Enjoying responsibly sourced meat nourishes not just the body but also our appreciation for the intricate web of life. Mindful consumption creates a beautiful synergy between gratitude for sustenance and respect for the natural world, fostering a deeper connection to our place within it.&quot;</p>
                        <Link href="/products">
                            <Button className='w-fit bg-black rounded-none text-md'>Explore More</Button>
                        </Link>
                    </div>
                </div>
                {/* </AspectRatio> */}
            </div>
        </div>
    )
}

export default Quotation