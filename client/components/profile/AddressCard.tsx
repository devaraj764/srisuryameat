"use client";
import React from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import userStore from '@/store/user.store';
import { useMutation } from '@tanstack/react-query';
import { updateUserDetails } from '@/api/user.functions';
import { useToast } from '../ui/use-toast';

type Props = {
    address: AddressT
}

function AddressCard({ address }: Props) {
    const { isSelectedAddress, setUserData } = userStore()
    const isSelected = isSelectedAddress(address.id || '');
    const { toast } = useToast()

    const { mutate, isPending } = useMutation({
        mutationFn: updateUserDetails,
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Address Changed",
                className: 'bg-green-500 text-white'
            })
            setUserData()
        },
        onError: (err) => {
            toast({
                variant: 'destructive',
                description: err.message,
            })
        }
    });

    const handleChangeAddress = () => {
        if (!isSelected) {
            const data = { currentAddressId: address.id || '' };
            mutate(data);
        }
    }
    return (
        <div className='bg-white rounded p-3 px-5 border'>
            <div className="flex items-center gap-2 mb-3">
                <Checkbox checked={isSelected} id={address.id} className='checked:bg-green-600' onClick={handleChangeAddress} />
                <label htmlFor={address.id}>{isSelected ? 'Selected' : "Select"}</label>
            </div>
            <p className='text-sm text-gray-700 mb-2'>{address.address1 + " " + address.address2}</p>
            <table className='table-auto'>
                <tbody>
                    <tr>
                        <td className="pr-2"><h5 className='text-semibold text-sm text-gray-700'>City:</h5></td>
                        <td><p className='text-sm text-gray-500'>{address.city}</p></td>
                    </tr>
                    {
                        address.landmark &&
                        <tr>
                            <td className="pr-2"><h5 className='text-semibold text-sm text-gray-700'>Landmark:</h5></td>
                            <td><p className='text-sm text-gray-500'>{address.landmark}</p></td>
                        </tr>
                    }
                    <tr>
                        <td className="pr-2"><h5 className='text-semibold text-sm text-gray-700'>State:</h5></td>
                        <td><p className='text-sm text-gray-500'>{address.state}</p></td>
                    </tr>
                    <tr>
                        <td className="pr-2"><h5 className='text-semibold text-sm text-gray-700'>Country:</h5></td>
                        <td><p className='text-sm text-gray-500'>{address.country}</p></td>
                    </tr>
                    <tr>
                        <td className="pr-2"><h5 className='text-semibold text-sm text-gray-700'>Pincode:</h5></td>
                        <td><p className='text-sm text-gray-500'>{address.pincode}</p></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default AddressCard