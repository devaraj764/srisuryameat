"use client";
import React, { ReactNode, useEffect, useRef } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useForm, SubmitHandler, Controller, useFieldArray, DeepMap, FieldValues, FieldPath } from 'react-hook-form';
import { object, string, number, array, enum as enumeration, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { categories } from '@/lib/constants';
import { useMutation } from '@tanstack/react-query';
import { createOrUpdateProduct } from '@/api/product.functions';
import { useToast } from '../ui/use-toast';
import { MdDelete } from 'react-icons/md';
import { Separator } from '../ui/separator';
import { useRouter } from 'next/navigation';

const productSchema = object({
    name: string(),
    description: string().optional(),
    category: string(),
    thumbnail: string(),
    prices: array(
        object({
            quantity: number(),
            units: enumeration(['g', 'kg']),
            price: number(),
        })
    ),
})

type ProductFormData = z.infer<typeof productSchema>;

function AddOrUpdateProduct({ product, children }: { product?: ProductT, children: ReactNode }) {
    const { handleSubmit, control, register, formState: { errors }, } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product?.name || '',
            description: product?.description || '',
            category: product?.category || '',
            thumbnail: product?.thumbnail || '',
            prices: product?.prices || []
        }
    });
    const { toast } = useToast();
    const router = useRouter();
    const closeRef = useRef<HTMLButtonElement>(null)

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'prices',
    });


    useEffect(() => {
        if (product?.prices) {
            for (let item of product?.prices) {
                append(item)
            }
        } else
            append({ quantity: 0, price: 0, units: 'g' })
        return () => remove()
        // eslint-disable-next-line
    }, [append]);

    const { mutate: addOrUpdate } = useMutation({
        mutationFn: createOrUpdateProduct,
        onSuccess: (data) => {
            toast({
                title: "Success",
                description: data?.message,
                className: 'bg-green-500 text-white'
            })
            router.refresh();
            closeRef.current?.click();
        },
        onError: (err) => {
            toast({
                variant: 'destructive',
                description: err?.message || "Error creating Order",
            });
        }
    })

    const onSubmit: SubmitHandler<ProductFormData> = (data) => {
        console.log(data);
        if (product) {
            addOrUpdate({ data, id: product?.id })
        } else {
            addOrUpdate({ data })
        }
        // Perform submission logic here
    };

    const displayAllErrors = (errors: DeepMap<FieldValues, FieldPath<ProductFormData>>) => {
        const errorMessages: string[] = [];

        // Iterate through the errors object and collect messages
        Object.keys(errors).forEach((key) => {
            const fieldErrors = errors[key];

            if (fieldErrors && Array.isArray(fieldErrors)) {
                fieldErrors.forEach((error) => {
                    errorMessages.push(error.message);
                });
            } else if (fieldErrors) {
                errorMessages.push(fieldErrors.message);
            }
        });

        return errorMessages;
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className={"max-w-screen-md max-h-screen"}>
                <h2 className="text-lg text-gray-700">Create New Product</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-5'>
                        <label className='text-xs text-gray-500 mb-1'>Product Name:</label>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => <Input {...field} required className='mt-1' />}
                        />
                    </div>

                    <div className='mb-5'>
                        <label className='text-xs text-gray-500 mb-1'>Description:</label>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => <Textarea {...field} className='mt-1' />}
                        />
                    </div>

                    <div className='mb-5'>
                        <label className='text-xs text-gray-500'>Category:</label>
                        <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                                <select className='w-full border px-5 bg-white rounded-md py-2 mt-1' defaultValue={'select'} {...field}>
                                    <option value='select' disabled>--select--</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category.variable} >{category.tag}</option>
                                    ))}
                                </select>
                            )}
                        />
                    </div>

                    <div className='mb-5'>
                        <label>Thumbnail:</label>
                        <Controller
                            name="thumbnail"
                            control={control}
                            render={({ field }) =>
                                <Input {...field} required className='mt-1' />}
                        />
                    </div>

                    <div className='mb-5'>
                        <label className='text-xs text-gray-500'>Price Ranges:</label>

                        {fields.map((field, index) => (
                            <div key={field.id} className='flex items-center gap-5 mb-3'>
                                <Input type='number' {...register(`prices.${index}.quantity` as const, {
                                    valueAsNumber: true, // Parse the input value as a number
                                })} />
                                <select className='w-full py-2 border px-5 bg-white rounded-md' {...register(`prices.${index}.units` as const)}>
                                    <option value='units' disabled>Units</option>
                                    <option value="g">g</option>
                                    <option value="kg">kg</option>
                                </select>
                                <Input type='number' {...register(`prices.${index}.price` as const, {
                                    valueAsNumber: true, // Parse the input value as a number
                                })} />
                                <Button type="button" size='sm' variant={'outline'} onClick={() => remove(index)}><MdDelete size={20} className="text-red-600" /></Button>
                            </div>
                        ))}
                        <div className="flex items-center justify-end w-full mt-2">
                            <Button variant='link' className='text-sm' size={'sm'} type="button" onClick={() => append({ quantity: 0, price: 0, units: 'g' })}>
                                Add price
                            </Button>
                        </div>
                        {displayAllErrors(errors).map((error, index) => (
                            <div key={index}>{error}</div>
                        ))}
                    </div>
                    <Separator className='my-3' />
                    <DialogFooter>
                        <DialogClose asChild ref={closeRef}>
                            <Button variant={'secondary'} type='button'>Close</Button>
                        </DialogClose>
                        <Button className='float-right w-[180px] bg-green-600 text-white' variant={'ghost'} type="submit">Submit</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

    )
}

export default AddOrUpdateProduct