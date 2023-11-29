"use client";
import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { categories } from '@/lib/constants';
import { useRouter } from 'next/navigation';

type Props = {
    defaultCategory?: string
}

function SelectCategory({ defaultCategory }: Props) {
    const router = useRouter();

    const handleCategory = (category: string) => {
        router.push(`/products?category=${category}`)
    }
    return (
        <Select defaultValue={defaultCategory || 'all'} onValueChange={(val) => handleCategory(val)}>
            <SelectTrigger className="w-[180px]" >
                <SelectValue placeholder="select" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem onClick={() => handleCategory('')} value={'all'}>
                    All
                </SelectItem>
                {
                    categories.map((category, index) => (
                        <SelectItem key={index.toString()} value={category.variable}>
                            {category.tag}
                        </SelectItem>
                    ))
                }
            </SelectContent>
        </Select>
    )
}

export default SelectCategory