"use client"
import React, { useState } from 'react'
import { Separator } from '../ui/separator'
import { FaBoxesPacking, FaCheck, FaCheckDouble } from 'react-icons/fa6'
import { FcProcess } from 'react-icons/fc'
import { MdDeliveryDining, MdInfo, MdSend } from 'react-icons/md'
import { formatDate } from '@/lib/helpers'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { AiFillCloseCircle } from 'react-icons/ai'
import { LuAlertCircle } from "react-icons/lu";
import { Textarea } from '../ui/textarea'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelOrder, createComplaint } from '@/api/user.functions'
import { useToast } from '../ui/use-toast'
import Image from 'next/image'

type Props = {
  order: OrderT
}

function OrderCard({ order }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: () => cancelOrder(order.id || ''),
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
        queryClient.invalidateQueries({ queryKey: ['get-orders'] });
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
    <div className='min-h-24 bg-white rounded-md p-3'>
      <p className='text-xs text-gray-400'>ID: {order.id}</p>
      <Separator className='my-2' />
      <table>
        <tbody>
          <tr className='py-5 text-sm'>
            <td className='pr-5'>Status:</td>
            <td>
              <OrderStatusDisplay status={order?.status} />
            </td>
          </tr>
          <tr className='py-5 text-sm'>
            <td className='pr-5'>Created:</td>
            <td className='text-sm text-gray-500'>{formatDate(order.createdAt)}</td>
          </tr>
          <tr className='py-5 text-sm'>
            <td className='pr-5'>Items total:</td>
            <td className='text-sm text-gray-500'>{order.items.length} Items</td>
          </tr>
          <tr className='py-5 text-sm'>
            <td className='pr-5'>Assigned:</td>
            <td className='text-sm text-gray-500'>{order.assign?.agent?.name || '---'}</td>
          </tr>
        </tbody>
      </table>
      <Separator className='my-2' />
      <div className="flex items-center justify-between gap-2">
        <DetailsDialog items={order.items} address={order.address} complaint={order?.complaint?.message} />
        {
          (order.status === 'created' || order.status === 'processing') &&
          <Button disabled={isPending} onClick={() => mutate()} variant={'destructive'} className='w-full'>Calcel</Button>
        }
        {
          order.code && order.status !== 'delivered' && <p className='text-lg font-bold w-full border rounded p-1 text-center text-gray-600'>CODE: {order.code}</p>
        }
        {
          order.status === 'delivered' ?
            !order?.complaint ?
              <ComplaintDialog order={order} /> :
              <Button variant={'outline'} className='text-orange-500 w-full' disabled> Complaint Raised</Button>
            : null
        }
      </div>
    </div>
  )
}

export function OrderStatusDisplay({ status }: { status: any }) {
  return (
    status === 'created' ? <Badge variant={'outline'} className='text-xs w-fit flex items-center gap-1 text-gray-500'><FaCheck /> Created</Badge> :
      status === 'packed' ? <Badge variant={'outline'} className='text-xs w-fit flex items-center gap-1 text-purple-500'><FaBoxesPacking /> Order Packed</Badge> :
        status === 'processing' ? <Badge variant={'outline'} className='text-xs w-fit flex items-center gap-1 text-blue-500'><FcProcess /> Processing Order</Badge> :
          status === 'out_for_delivery' ? <Badge variant={'outline'} className='text-xs w-fit flex items-center gap-1 text-orange-500'><MdDeliveryDining /> Out For Delivery</Badge> :
            status === 'delivered' ? <Badge variant={'outline'} className='text-xs w-fit flex items-center gap-1 text-green-500'><FaCheckDouble />  Delivered</Badge> :
              status === 'cancelled' ? <Badge variant={'outline'} className='text-xs w-fit flex items-center gap-1 bg-red-500 text-white'><AiFillCloseCircle /> Cancelled</Badge> :
                status === 'rejected' && <Badge variant={'outline'} className='text-xs w-fit flex items-center gap-1 bg-gray-600 text-white'> Rejected</Badge>

  )
}

export const DetailsDialog: React.FC<{ items?: OrderItem[], address?: AddressT, complaint?: string }> = ({ items: orderItems, address, complaint }) => {
  return (
    <Dialog>
      <DialogTrigger className='px-3 py-2 w-full border flex items-center justify-center gap-2 text-sm rounded-md text-gray-700'>
        <MdInfo size='18' /> More Info
      </DialogTrigger>
      <DialogContent className='overflow-y-scroll max-h-[90vh]'>
        <h1 className="text-xl">
          Order Details
        </h1>
        <Separator />
        <h5 className='text-md text-gray-400'>Items</h5>
        {orderItems?.map((item, index: number) => (
          <div key={index.toString()} className="bg-white border rounded-md p-2 flex items-start gap-2">
            <Image src={item.thumbnail} alt={item.name} width={30} height={30} className='h-14 w-14 rounded-lg border shadow' />
            <div>
              <h4 className='text-gray-500'>{item.name}</h4>
              <h4 className='text-xs text-gray-400'>
                <span className='text-lg font-bold text-gray-700'>₹{item.price}</span> / {item.quantity}{item.units}
              </h4>
            </div>
          </div>
        ))}
        <h5 className='text-md text-gray-400'>Delivery Address</h5>
        <table className='table-auto border px-2'>
          <tbody>
            <tr>
              <td colSpan={2} className='text-sm text-gray-500 mt-2'>{address?.address1} {address?.address2}</td>
            </tr>
            <tr>
              <td className="pr-2"><h5 className='text-semibold text-sm text-gray-700'>City:</h5></td>
              <td><p className='text-sm text-gray-500'>{address?.city}</p></td>
            </tr>
            {
              address?.landmark &&
              <tr>
                <td className="pr-2"><h5 className='text-semibold text-sm text-gray-700'>Landmark:</h5></td>
                <td><p className='text-sm text-gray-500'>{address?.landmark}</p></td>
              </tr>
            }
            <tr>
              <td className="pr-2"><h5 className='text-semibold text-sm text-gray-700'>State:</h5></td>
              <td><p className='text-sm text-gray-500'>{address?.state}</p></td>
            </tr>
            <tr>
              <td className="pr-2"><h5 className='text-semibold text-sm text-gray-700'>Country:</h5></td>
              <td><p className='text-sm text-gray-500'>{address?.country}</p></td>
            </tr>
            <tr>
              <td className="pr-2"><h5 className='text-semibold text-sm text-gray-700'>Pincode:</h5></td>
              <td><p className='text-sm text-gray-500'>{address?.pincode}</p></td>
            </tr>
          </tbody>
        </table>
        {
          complaint &&
          <div className='border p-2'>
            <h5 className='text-md m-0 text-orange-500'>Complaint:</h5>
            <p className='text-sm m-0 text-gray-600 mt-1'>{complaint}</p>
          </div>
        }
      </DialogContent>
    </Dialog>
  )
}

export function ComplaintDialog({ order }: { order: OrderT }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('')

  const { mutate, isPending } = useMutation({
    mutationFn: createComplaint,
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
        queryClient.invalidateQueries({ queryKey: ['get-orders'] });
      }
    },
    onError: (err) => {
      toast({
        variant: 'destructive',
        description: err?.message || "Error assigning agent",
      })
    }
  });

  const handleComplaint = async () => {
    const data = {
      orderId: order?.id || '',
      message
    }
    console.log('Hello')
    mutate(data)
  }

  return (
    <Dialog>
      <DialogTrigger className='px-3 py-2 w-full border flex items-center justify-center gap-2 text-sm rounded-md text-orange-700'>
        <LuAlertCircle /> &nbsp; Complaint
      </DialogTrigger>
      <DialogContent className='overflow-y-scroll max-h-[90vh]'>
        <h4>File a Complaint</h4>
        <p className='text-sm text-gray-500 m-0 p-0' >OrderId: {order.id}</p>
        <p className='text-sm text-gray-500 m-0 p-0'>Price:  Rs {order.totalPrice}/-</p>
        <p className='text-sm text-gray-500 m-0 p-0'>Items:  {order.items.length} Items</p>
        <Textarea value={message} rows={3} placeholder="What's your complaint.." className='w-full' onChange={(e) => setMessage(e.target.value)}></Textarea>
        <DialogFooter>
          <Button disabled={isPending} onClick={handleComplaint}><MdSend /> &nbsp; Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default OrderCard