import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addAddress, updateAddress } from '@/api/user.functions';
import { useToast } from '../ui/use-toast';
import userStore from '@/store/user.store';
import addressStore from '@/store/address.store';

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

function AddAddress({ callback }: { callback?: () => void }) {
    const { setUserData } = userStore();
    const { editAddress: address, setEditAddress } = addressStore();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    useEffect(() => {

        if (address) {
            reset(address);
        } else {
            resetForm()
        }
    }, [address])

    const resetForm = () => {
        reset({
            address1: "",
            address2: "",
            city: "",
            landmark: "",
            // @ts-ignore
            pincode: ""
        });
    }

    const onSubmit = (data: FormData) => {
        mutate({ ...data, pincode: parseInt(`${data.pincode}`) });

    };

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: AddressT) => {
            if (address) {
                return await updateAddress(address.id || '', data)
            } else {
                return await addAddress(data)
            }
        },
        onSuccess: (data) => {
            toast({
                title: "Success",
                description: data?.message || "Address added Successfully",
                className: 'bg-green-500 text-white'
            })
            if (setEditAddress) setEditAddress(null)
            setUserData();
            queryClient.invalidateQueries({ queryKey: ["get-all-addresses"] });
            if (callback) callback();
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">

                <div>
                    <label className="block text-sm text-gray-700 mb-1">Pincode</label>
                    <Input type="number" {...register('pincode', { required: true })} className="w-full rounded-md border border-gray-300 p-2" />
                    {errors.pincode && (
                        <span className='text-red-600 text-xs'>
                            Pincode is required and should only contain numbers
                        </span>
                    )}
                </div>
                <div>
                    <label className="block text-sm text-gray-700 mb-1">State</label>
                    <Input readOnly value="Andhra Pradesh" {...register('state', { required: true })} className="w-full rounded-md border border-gray-300 p-2" />
                    {errors.state && <span className='text-red-600 text-xs'>State is required</span>}
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-1">Country</label>
                    <Input readOnly value="India" {...register('country', { required: true })} className="w-full rounded-md border border-gray-300 p-2" />
                    {errors.country && <span className='text-red-600 text-xs'>Country is required</span>}
                </div>
            </div>
            <Button disabled={isPending} variant={'link'} type="submit" className="text-blue-500 float-right">
                {address ? "Update" : "Add"}
            </Button>
            <Button onClick={resetForm} variant={'link'} type="button" className="text-gray-500 float-right">
                Reset
            </Button>
        </form>
    )
}

export default AddAddress