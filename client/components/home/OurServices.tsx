import Image from 'next/image'
import React from 'react'
import HighQuality from '@/app/assets/high-quality.png'
import Hygiene from "@/app/assets/safe.png";
import Beef from "@/app/assets/beef.png"

type Props = {}

function OurServices({ }: Props) {
    return (
        <div className='max-w-[1200px] mx-auto my-16 px-3'>
            <h2 className="text-center text-[28px] md:text-[30px] text-gray-700 font-bold">Our Services Includes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-5 mt-5">
                <div className="flex items-center flex-col p-5 text-center">
                    <Image src={HighQuality} alt="Meat on Heat" className='max-w-[360px] mb-3' />
                    <h4 className='text-primary text-xl font-bold'>Quality</h4>
                    <p className='text-sm max-w-[360px] text-gray-500 mt-1'>We&apos;re devoted to excellence, offering exceptional meat—fresh, tender, and flavorful cuts ensure the finest culinary satisfaction.</p>
                </div>
                <div className="flex items-center flex-col p-5 text-center">
                    <Image src={Hygiene} alt="Meat on Heat" className='max-w-[360px] mb-3' />
                    <h4 className='text-primary text-xl font-bold'>Hygiene</h4>
                    <p className='text-sm max-w-[360px] text-gray-500 mt-1'>Hygiene is our uncompromising standard—meticulous protocols from sourcing to delivery assure customers of safe, quality meat products.</p>
                </div>
                <div className="flex items-center flex-col p-5 text-center">
                    <Image src={Beef} alt="Meat on Heat" className='max-w-[360px] mb-3' />
                    <h4 className='text-primary text-xl font-bold'>Fresh Meat</h4>
                    <p className='text-sm max-w-[360px] text-gray-500 mt-1'>We prioritize delivering impeccably fresh meat—each cut embodies our commitment to quality, ensuring a delectable culinary experience every time.</p>
                </div>
            </div>
        </div>
    )
}

export default OurServices