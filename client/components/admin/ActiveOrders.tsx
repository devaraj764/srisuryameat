'use client';
import React, { useEffect, useRef, useState } from 'react'
import { IoMdOpen } from 'react-icons/io'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getActiveOrders } from '@/api/order.functions'
import { ScrollArea, ScrollBar, } from '../ui/scroll-area'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Badge } from '../ui/badge';
import { formatDate } from '@/lib/helpers';
import { Button } from '../ui/button';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from '../ui/dialog';
import { FaBoxesPacking, FaCheck, FaCheckDouble } from 'react-icons/fa6';
import { FcProcess } from 'react-icons/fc';
import { MdDeliveryDining } from 'react-icons/md';
import { assignAgent, changeOrderStatus, getAgents } from '@/api/admin.functions';
import Image from 'next/image';
import { useToast } from '../ui/use-toast';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';

type Props = {}

function ActiveOrders({ }: Props) {
    const [selected, setSelected] = useState<string>('all')
    const { data, isFetching, refetch } = useQuery({
        queryKey: ['get-active-orders'],
        queryFn: () => getActiveOrders(JSON.stringify({ status: selected === 'all' ? '' : selected })),
    });

    useEffect(() => {
        refetch()
    }, [selected, refetch])

    return (
        <div className='my-10'>
            <div className="flex items-center justify-between">
                <Select value={selected} onValueChange={(val) => setSelected(val)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="created">New Orders</SelectItem>
                        <SelectItem value="processing">Proceessing</SelectItem>
                        <SelectItem value="packed">Packed</SelectItem>
                        <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                    </SelectContent>
                </Select>
                <Link href='/admin/orders-list' className='text-sm text-blue-700 flex gap-2 items-center'>
                    View all <IoMdOpen size='18' />
                </Link>
            </div>
            <ScrollArea className='my-5'>
                <OrdersGrid orders={data?.orders} isFetching={isFetching} selected={selected} />
                {/* <OrdersTable orders={data?.orders} isFetching={isFetching} /> */}
                <ScrollBar orientation='horizontal' />
            </ScrollArea>
        </div>
    )
}

export function OrdersGrid({ orders, isFetching, selected }: { orders: OrderT[], isFetching: boolean, selected: string }) {
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const handleSelectOrder = (orderId: string) => {
        const isChecked = selectedOrders.includes(orderId);
        var result = [...selectedOrders];
        if (isChecked) result = result.filter(id => id !== orderId);
        else result.push(orderId);
        setSelectedOrders(result)
    }

    const { mutate, isPending } = useMutation({
        mutationFn: changeOrderStatus,
        onSuccess: (data) => {
            if (!data) {
                toast({
                    variant: 'destructive',
                    description: "Error updating status",
                })
            } else {
                toast({
                    title: "Success",
                    description: data?.message,
                    className: 'bg-green-500 text-white'
                });
                setSelectedOrders([])
                queryClient.invalidateQueries({ queryKey: ['get-active-orders'] });
            }
        },
        onError: (err) => {
            toast({
                variant: 'destructive',
                description: err?.message || "Error assigning agent",
            })
        }
    })

    return (
        isFetching ? <p className='text-gray-500'>Fecthing data....</p> : orders?.length === 0 ?
            <Alert >
                <AlertTitle>Not Found!</AlertTitle>
                <AlertDescription className='text-gray-500'>
                    Sorry No Orders Found!!!
                </AlertDescription>
            </Alert > :
            <div>
                {
                    selectedOrders.length > 0 &&
                    <div className="flex items-center justify-end gap-2 mb-3 text-gray-500 mx-5">
                        {
                            selected === 'created' &&
                            <>
                                <Button disabled={isPending} onClick={() => mutate({ orderIds: selectedOrders, status: 'rejected' })} variant={'link'} className='w-fit text-red-500'>Reject</Button>
                                |
                                <Button disabled={isPending} onClick={() => mutate({ orderIds: selectedOrders, status: 'processing' })} variant={'link'} className='w-fit text-blue-500'>Start</Button>
                            </>
                        }
                        {
                            selected === 'processing' &&
                            <Button disabled={isPending} onClick={() => mutate({ orderIds: selectedOrders, status: 'packed' })} variant={'link'} className='w-fit text-violet-700'>Pack</Button>

                        }
                        {
                            selected === 'packed' &&
                            <AgentsDialog orderIds={selectedOrders} />
                        }
                    </div>
                }
                {orders?.map((order, index) => (
                    <div key={index} className="p-3 bg-white mb-5">
                        <div className="flex items-center justify-between">
                            <p className='text-xs text-gray-500'>OrderId: {order.id}</p>
                            {
                                (selected !== 'all' && selected !== 'out_for_delivery') &&
                                <div className='flex items-center gap-1'>
                                    <Input onChange={() => handleSelectOrder(order?.id || '')} id={order.id} type='checkbox' className='h-4 w-4' />
                                    <label className='text-sm' htmlFor={order.id}>Select</label>
                                </div>
                            }
                        </div>
                        <Separator className='my-3' />
                        <div className="grid grid-cols-3 gap-5">
                            <div className="border px-3 rounded-md">
                                <table className='w-fit'>
                                    <tbody>
                                        <tr className='py-5 text-sm'>
                                            <td className='pr-5'>Status:</td>
                                            <td>
                                                {
                                                    order.status === 'created' ? <Badge variant={'outline'} className='text-xs flex items-center gap-1 text-gray-500'><FaCheck /> Created</Badge> :
                                                        order.status === 'packed' ? <Badge variant={'outline'} className='text-xs flex items-center gap-1 text-purple-500'><FaBoxesPacking /> Order Packed</Badge> :
                                                            order.status === 'processing' ? <Badge variant={'outline'} className='text-xs flex items-center gap-1 text-blue-500'><FcProcess /> Processing Order</Badge> :
                                                                order.status === 'out_for_delivery' ? <Badge variant={'outline'} className='text-xs flex items-center gap-1 text-orange-500'><MdDeliveryDining /> Out For Delivery</Badge> :
                                                                    order.status === 'delivered' && <Badge variant={'outline'} className='text-xs flex items-center gap-1 text-green-500'><FaCheckDouble />  Delivered</Badge>
                                                }
                                            </td>
                                        </tr>
                                        <tr className='py-5 text-sm'>
                                            <td className='pr-5'>Created:</td>
                                            <td className='text-sm text-gray-500'>{formatDate(order.createdAt)}</td>
                                        </tr>
                                        <tr className='py-5 text-sm'>
                                            <td className='pr-5'>Total Amount:</td>
                                            <td className='text-lg font-semibold text-green-600'>Rs.{order.totalPrice} /-</td>
                                        </tr>
                                        <tr className='py-5 text-sm'>
                                            <td className='pr-5'>Items total:</td>
                                            <td className='text-sm text-gray-500'>{order.items.length} Items</td>
                                        </tr>
                                        <tr className='py-5 text-sm'>
                                            <td className='pr-5'>Assigned to:</td>
                                            <td className='text-sm text-blue-500'>
                                                {
                                                    order.assign?.agent ?
                                                        <Link href={`/adimin/users-list?email=${order.assign?.agent?.email}`}>{order.assign?.agent?.name}</Link> :
                                                        '-----'
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="border p-3 rounded-md">
                                <h5 className='text-md text-gray-700 mb-2'>Delivery Details:</h5>
                                <div>
                                    <p className='text-sm text-blue-700'>{order.user?.name},</p>
                                    <p className='text-sm text-green-700 mb-2'>Ph: {order.user?.mobile},</p>
                                    <p className='text-sm text-gray-500'>{order.address.address1} &nbsp; {order.address?.address2}</p>
                                    <p className='text-sm text-gray-500'>{order.address.landmark}, {order.address.city}</p>
                                    <p className='text-sm text-gray-500'>{order.address.state}, {order.address.country}</p>
                                    <p className='text-sm text-gray-500'>{order.address.pincode}</p>
                                </div>
                            </div>
                            <div className="border px-2 rounded-md">
                                <h5 className='text-md text-gray-400'>Items</h5>
                                <ScrollArea>
                                    {order.items?.map((item, index: number) => (
                                        <div key={index.toString()} className="bg-white border rounded-md p-2 flex items-start gap-2 mb-2">
                                            <Image src={item.thumbnail} alt={item.name} width={30} height={30} className='h-14 w-14 rounded-lg border shadow' />
                                            <div>
                                                <h4 className='text-gray-500'>{item.name}</h4>
                                                <h4 className='text-xs text-gray-400'>
                                                    <span className='text-lg font-bold text-gray-700'>₹{item.price}</span> / {item.quantity}{item.units}
                                                </h4>
                                            </div>
                                        </div>
                                    ))}
                                    <ScrollBar orientation='vertical' />
                                </ScrollArea>
                            </div>
                        </div>
                        <Separator className='my-3' />
                        <div className="flex items-center justify-end">

                        </div>
                    </div>
                ))}
            </div>
    )
}


export function AgentsDialog({ orderIds }: { orderIds: string[] }) {
    const { toast } = useToast();
    const closeRef = useRef<HTMLButtonElement>(null)
    const { data, isFetching } = useQuery({
        queryKey: ['get-agents'],
        queryFn: () => getAgents(10)
    });

    const { mutate, isPending } = useMutation({
        mutationFn: assignAgent,
        onSuccess: (data) => {
            toast({
                title: "Success",
                description: data?.message || "Agent assigned successfully",
                className: 'bg-green-500 text-white'
            })
            closeRef.current?.click();
        },
        onError: (err) => {
            toast({
                variant: 'destructive',
                description: err?.message || "Error assigning agent",
            })
        }
    })

    const handleAssignAgent = (agentId: string) => {
        if (agentId)
            mutate({ agentId, orderIds })
    }
    return (
        <Dialog>
            <DialogTrigger className='text-primary'>Assign</DialogTrigger>
            <DialogContent>
                <h4 className="m-0 mb-3 text-xl font-semibold">Agents</h4>
                {
                    isFetching ? <p className='text-gray-500 text-sm'>Fetching...</p>
                        : data?.agents.length > 0 ? data?.agents.map((agent: UserT, index: number) => (
                            <div key={index.toString()} className="flex p-2 px-3 items-center justify-between border rounded-md mb-2">
                                <div className="flex items-center gap-3">
                                    <Image src={agent.profileImage} alt={agent.name} width={40} height={40} className='rounded-full' />
                                    <div>
                                        <h5 className='text-sm '>{agent.name}</h5>
                                        <p className='text-[10px] text-gray-500'>{agent.email}</p>
                                    </div>
                                </div>
                                <h1 className='text-xl text-seminbold text-gray-500'>{agent.assigns?.length}</h1>
                                <Button onClick={() => handleAssignAgent(agent.id)} disabled={isPending} size="sm" className='border-primary border-2 rounded-md text-primary hover:bg-primary hover:text-white' variant={'outline'}>Assign</Button>
                            </div>
                        )) :
                            <Alert >
                                <AlertTitle className='text-red-500'>Not Found!</AlertTitle>
                                <AlertDescription className='text-gray-500'>
                                    Sorry No Agents Found!!!
                                </AlertDescription>
                            </Alert >
                }
                <DialogFooter>
                    <DialogClose ref={closeRef} />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ActiveOrders