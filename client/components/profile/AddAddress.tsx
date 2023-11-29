import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addAddress } from '@/api/user.functions';
import { useToast } from '../ui/use-toast';
import userStore from '@/store/user.store';

const schema = z.object({
    address1: z.string(),
    address2: z.string().optional(),
    city: z.string(),
    landmark: z.string().optional(),
    pincode: z.preprocess((a) => parseInt(z.string().parse(a), 10),
        z.number().positive().min(5)),
    state: z.string(),
    country: z.string(),
});

type FormData = z.infer<typeof schema>;

function AddAddress() {
    const { setUserData } = userStore();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const onSubmit = (data: FormData) => {
        mutate({ ...data, pincode: parseInt(`${data.pincode}`) })
        reset();
    };

    const { mutate, isPending } = useMutation({
        mutationFn: addAddress,
        onSuccess: (data) => {
            toast({
                title: "Success",
                description: data?.message || "Address added Successfully",
                className: 'bg-green-500 text-white'
            })
            setUserData();
            queryClient.invalidateQueries({ queryKey: ["get-all-addresses"] })
        },
        onError: (err) => {
            toast({
                variant: 'destructive',
                description: err?.message || "Error adding Address",
            })
        }
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center justify-between">
                <h5 className='text-lg text-gray-900 py-2'>Add Address</h5>
                <Button disabled={isPending} variant={'link'} type="submit" className="text-blue-500">Submit</Button>
            </div>
            <Separator className='mb-5' />

            <div className="mb-3">
                <label className="block text-sm text-gray-700 mb-1">Address 1</label>
                <Input {...register('address1', { required: true })} className="w-full rounded-md border border-gray-300 p-2" />
                {errors.address1 && <span className='text-red-600 text-xs'>Address 1 is required</span>}
            </div>

            <div className="mb-3">
                <label className="block text-sm text-gray-700 mb-1">Address 2</label>
                <Input {...register('address2')} className="w-full rounded-md border border-gray-300 p-2" />
                {errors.address2 && <span className='text-red-600 text-xs'>{errors.address2.message}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="mb-3">
                    <label className="block text-sm text-gray-700 mb-1">City</label>
                    <Input {...register('city', { required: true })} className="w-full rounded-md border border-gray-300 p-2" />
                    {errors.city && <span className='text-red-600 text-xs'>City is required</span>}
                </div>

                <div className="mb-3">
                    <label className="block text-sm text-gray-700 mb-1">Landmark</label>
                    <Input {...register('landmark')} className="w-full rounded-md border border-gray-300 p-2" />
                    {errors.landmark && <span className='text-red-600 text-xs'>{errors.landmark.message}</span>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">

                <div className="mb-3">
                    <label className="block text-sm text-gray-700 mb-1">Pincode</label>
                    <Input type="number" {...register('pincode', { required: true })} className="w-full rounded-md border border-gray-300 p-2" />
                    {errors.pincode && (
                        <span className='text-red-600 text-xs'>
                            Pincode is required and should only contain numbers
                        </span>
                    )}
                </div>
                <div className="mb-3">
                    <label className="block text-sm text-gray-700 mb-1">State</label>
                    <Input readOnly value="Andhra Pradesh" {...register('state', { required: true })} className="w-full rounded-md border border-gray-300 p-2" />
                    {errors.state && <span className='text-red-600 text-xs'>State is required</span>}
                </div>

                <div className="mb-5">
                    <label className="block text-sm text-gray-700 mb-1">Country</label>
                    <Input readOnly value="India" {...register('country', { required: true })} className="w-full rounded-md border border-gray-300 p-2" />
                    {errors.country && <span className='text-red-600 text-xs'>Country is required</span>}
                </div>
            </div>
        </form>
    )
}

export default AddAddress