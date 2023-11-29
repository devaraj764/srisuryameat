import React from 'react'
import Image from 'next/image'
import SpinnerImage from '@/app/assets/spinner.svg'

type Props = {}

function Spinner({ }: Props) {
    return (
        <Image priority src={SpinnerImage} alt='spinner' height={28} width={28} />
    )
}

export default Spinner