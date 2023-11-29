"use client";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import React, { FormEventHandler, useState } from 'react'

type Props = {}

function SearchProduct({ }: Props) {
    const router = useRouter();
    const [value, setValue] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push(`/admin/products-list?product_name=${value}`);
    }

    return (
        <form onSubmit={handleSubmit} className='flex items-center gap-2'>
            <Input placeholder="Product name.." type="index" value={value} onChange={(e) => setValue(e.target.value)} />
            <Button size='sm' className='bg-blue-500 hover:bg-blue-700 text-sm'>Search</Button>
        </form>
    )
}

export default SearchProduct