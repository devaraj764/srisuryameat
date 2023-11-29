"use client";
import React, { useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { useMutation } from '@tanstack/react-query';
import { createOrUpdateProduct } from '@/api/product.functions';
import { useToast } from '@/components/ui/use-toast';

type Props = {
    inStock: boolean
    productId: string
}

function SwitchStock({ inStock: stock, productId }: Props) {
    const { toast } = useToast();
    const [inStock, setInstock] = useState(stock)
    const { mutate, isPending } = useMutation({
        mutationFn: createOrUpdateProduct,
        onSuccess: (data) => {
            if (!data) {
                toast({
                    variant: 'destructive',
                    description: "Error updating stock",
                });
            } else {
                setInstock(!inStock)
            }
        },
        onError: (err) => {
            toast({
                variant: 'destructive',
                description: err?.message,
            })
        }
    });

    const handleOnchange = () => {
        mutate({ data: { inStock: !inStock }, id: productId })
    }

    return (
        <div className="flex items-center gap-3 w-full">
            <Switch
                checked={inStock}
                onCheckedChange={handleOnchange}
                className='bg-green-500'
            />
            <label className={inStock ? 'text-green-600' : 'text-red-500'}>{inStock ? 'In Stock' : "Out of stock"}</label>
        </div>
    )
}

export default SwitchStock