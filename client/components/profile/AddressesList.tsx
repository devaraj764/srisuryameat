import { getAllAddresses } from '@/api/user.functions'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import AddressCard from './AddressCard';
import { usePathname } from 'next/navigation';
import addressStore from '@/store/address.store';


function AddressesList() {
    const { setEditAddress: edit } = addressStore();
    const { data, isLoading } = useQuery(({
        queryKey: ["get-all-addresses"],
        queryFn: getAllAddresses,
        refetchOnWindowFocus: false
    }));
    const pathname = usePathname();
    return (
        <>
            {isLoading ?
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <Skeleton className='w-full h-24' />
                </div>
                :
                data.addresses?.length <= 0 ?
                    <Alert>
                        <AlertTitle>Address Not Found!</AlertTitle>
                        <AlertDescription className='text-gray-500'>
                            Try to add new address above!!!
                        </AlertDescription>
                    </Alert>

                    :
                    <div className={pathname === '/profile' ? "grid grid-cols-1 md:grid-cols-3 gap-3" : "flex flex-col gap-3"}>
                        {data.addresses?.map((address: AddressT, index: number) => (
                            <AddressCard edit={edit} key={index.toString()} address={address} />
                        ))}
                    </div>
            }
        </>

    )
}

export default AddressesList