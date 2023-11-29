"use client";
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useMutation, useQuery } from '@tanstack/react-query';
import { getAllUsers, updateUser } from '@/api/admin.functions';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { AiOutlineSearch, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../common/DataTable';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { useToast } from '../ui/use-toast';
import Link from 'next/link';
import { IoMdOpen } from 'react-icons/io';
import { useSearchParams } from 'next/navigation';


type Props = {}

function UsersList({ }: Props) {
    const search = useSearchParams();
    const email = search.get('email')
    const [searchBy, setSearchBy] = useState('email')
    const [value, setValue] = useState(email || '');
    const [isDirty, setIsDirty] = useState(false)
    const { data, isFetching, refetch } = useQuery({
        queryKey: ['get-all-users'],
        queryFn: () => getAllUsers(10, JSON.stringify({ searchBy, value })),
        refetchOnWindowFocus: false
    });

    const onSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await refetch();
        setIsDirty(true)
    }

    const reset = async () => {
        setSearchBy('email');
        setValue('');
    }

    useEffect(() => {
        if (searchBy === 'email' && value === "" && isDirty) {
            refetch();
            setIsDirty(false)
        }
        // eslint-disable-next-line
    }, [searchBy, value])

    return (
        <div className='my-10'>
            <div className="flex items-center gap-2">
                <AiOutlineUsergroupAdd size='24' />
                <h2 className="text-xl font-bold text-gray-600">Users List</h2>
            </div>
            <br />
            <div className="flex items-center w-fit mb-2 gap-2">
                <Select value={searchBy} onValueChange={(e) => setSearchBy(e)}>
                    <SelectTrigger className="w-[180px]" defaultValue={'all'}>
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="mobile">Mobile</SelectItem>
                    </SelectContent>
                </Select>
                <form onSubmit={onSearch} className='flex items-center gap-1'>
                    <Input type="text" value={value} onChange={(e) => setValue(e.target.value)} required placeholder={`Search by ${searchBy}`} />
                    <Button size='sm' variant={'outline'} className='bg-blue-500 hover:bg-blue-700 hover:text-white text-white'><AiOutlineSearch size="18" />&nbsp; Search</Button>
                </form>
                {
                    isDirty && <Button variant="outline" onClick={reset}>Reset</Button>
                }
            </div>
            {
                isFetching ? <p className='text-gray-500'>Fecthing data....</p> : (data && data.users?.length > 0) ?
                    <ScrollArea className='my-5'>
                        <UsersTable userslist={data.users} isFetching={isFetching} />
                        <ScrollBar orientation='horizontal' />
                    </ScrollArea>
                    :
                    <Alert >
                        <AlertTitle>Not Found!</AlertTitle>
                        <AlertDescription className='text-gray-500'>
                            Sorry No Orders Found!!!
                        </AlertDescription>
                    </Alert >
            }
        </div>
    )
}

export function UsersTable({ userslist, isFetching }: { userslist: UserT[], isFetching: boolean }) {
    const { toast } = useToast();
    const [users, setUsers] = useState<UserT[]>(userslist);

    useEffect(() => {
        setUsers(userslist)
    }, [userslist])

    const updateRole = async (id: string, role: "customer" | "admin" | "agent") => {
        const index = users.map(e => e.id).indexOf(id);
        const tempUsers = [...users];
        tempUsers[index].role = role;
        setUsers(tempUsers)
    }

    const { mutate, isPending } = useMutation({
        mutationFn: updateUser,
        onSuccess: (data) => {
            if (data) {
                toast({
                    title: "success",
                    description: data.message || "Successfully updated role",
                });
                updateRole(data.user.id, data.user.role)
            } else {
                toast({
                    title: "Error",
                    description: "Error updating role",
                });
            }
        },
        onError: (err) => {
            toast({
                title: "Error",
                description: err.message || "Error updating role",
            });
        }
    })
    const columns: ColumnDef<UserT>[] = [
        {
            header: "SI",
            cell: ({ row }) => {
                return <p className="text-xs text-gray-700">{row.index + 1}</p>
            },
        },
        {
            accessorKey: 'name',
            header: "Name",
            cell: ({ row }) => {
                return <p className="text-md text-gray-500">{row.getValue('name')}</p>
            },
        },
        {
            accessorKey: 'email',
            header: "Email Address",
            cell: ({ row }) => {
                return <p className="text-sm">{row.getValue('email')}</p>
            },
        },
        {
            accessorKey: 'role',
            header: "Role",
            cell: ({ row }) => {
                const role = users[row.index].role;
                const id: string = users[row.index].id;
                return <Select disabled={isPending} value={role} onValueChange={(e) => mutate({ data: { role: e }, id })}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="agent">Agent</SelectItem>
                    </SelectContent>
                </Select>
            },
        },
        {
            accessorKey: 'mobile',
            header: "Mobile",
            cell: ({ row }) => {
                return <p className="text-md">{row.getValue('mobile') || 'XXXXXXXXXX'}</p>
            },
        },
        {
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2 text-gray-500">
                        <ViewUsersAddress addresses={users[row.index].addresses || []} />
                        |
                        <Link href={`/admin/orders-list?email=${users[row.index].email}`} className='text-blue-500 hover:text-blue-700 flex items-center gap-1'>
                            Orders <IoMdOpen size='14' />
                        </Link>
                    </div>
                )
            },
        },
    ];


    return (
        <DataTable columns={columns} data={users} />
    )
}

export function ViewUsersAddress({ addresses }: { addresses: AddressT[] }) {
    return (
        <Dialog>
            <DialogTrigger className=' text-sm text-red-500'>Addresses</DialogTrigger>
            <DialogContent className={"max-w-screen-md max-h-screen"}>
                <h3 className="text-xl text-gray-600">Addresses</h3>
                {
                    addresses?.length > 0 ? addresses.map((address, index) => (
                        <div key={index.toString()} className='border p-2 rounded-md'>
                            <p className='mb-2 text-blue-600'>Address {index + 1}</p>
                            <p className='text-sm text-gray-500'>{address.address1} &nbsp; {address?.address2}</p>
                            <p className='text-sm text-gray-500'>{address.landmark}, {address.city}</p>
                            <p className='text-sm text-gray-500'>{address.state}, {address.country}</p>
                            <p className='text-sm text-gray-500'>{address.pincode}</p>
                        </div>
                    )) : <Alert >
                        <AlertTitle>Not Found!</AlertTitle>
                        <AlertDescription className='text-gray-500'>
                            Sorry No Adresses Found!!!
                        </AlertDescription>
                    </Alert >
                }
            </DialogContent>
        </Dialog>
    )
}

export default UsersList