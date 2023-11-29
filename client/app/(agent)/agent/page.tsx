"use client";
import { deliveryOrder, getAssigns, sendOtp } from '@/api/agent.functions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { formatDate } from '@/lib/helpers';
import userStore from '@/store/user.store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import React, { useRef } from 'react'
import { FaBoxesPacking, FaCheck, FaCheckDouble } from 'react-icons/fa6';
import { FcProcess } from 'react-icons/fc';
import { MdDeliveryDining } from 'react-icons/md';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

type Props = {}

function AgentPage({ }: Props) {
  const { user } = userStore();
  const { data: activeAssigns, isFetching: activeFetching } = useQuery({
    queryKey: ['agent-get-active-assigns'],
    enabled: user ? true : false,
    queryFn: () => getAssigns(15, 'active'),
  });

  const { data: completedAssigns, isFetching: completedFetching } = useQuery({
    queryKey: ['agent-get-completed-assigns'],
    enabled: user ? true : false,
    queryFn: () => getAssigns(15, 'completed'),
  });

  return (
    <div className='max-w-[1400px] mx-auto px-3'>
      {
        user &&
        <div className="flex items-center gap-2 mt-1">
          <Image src={user?.profileImage || ''} alt={user?.name || ''} width={32} height={32} className='rounded' />
          <div>
            <h5 className='m-0 p-0 text-gray-800'>{user?.name}</h5>
            <p className='text-gray-500 text-[10px] m-0 p-0'>{user?.email}</p>
          </div>
        </div>
      }
      <Separator className='my-4' />
      <h3 className='text-lg text-gray-700 mb-3'>Your Assigns</h3>
      <h5 className='text-sm text-gray-500 mb-2'>Pending</h5>
      {activeFetching ? <p className='text-sm text-gray-500'>Fectching...</p> :
        activeAssigns?.assigns?.length > 0 ?
          <AssignGrid assigns={activeAssigns.assigns} />
          : <Alert >
            <AlertTitle className='text-red-500'>Not Found!</AlertTitle>
            <AlertDescription className='text-gray-500'>
              Sorry No Active Assigns Found!!!
            </AlertDescription>
          </Alert >
      }
      <br />
      <h5 className='text-sm text-gray-500 mb-2'>Completed</h5>
      {
        completedFetching ? <p className='text-sm text-gray-500'>Fectching...</p> :
          completedAssigns?.assigns?.length > 0 ?
            <AssignGrid assigns={completedAssigns.assigns} />
            : <Alert >
              <AlertTitle className='text-red-500'>Not Found!</AlertTitle>
              <AlertDescription className='text-gray-500'>
                Sorry No Completed Assigns Found!!!
              </AlertDescription>
            </Alert >
      }

    </div >
  )
}

function AssignGrid({ assigns }: { assigns: Assign[] }) {
  return (
    <div className="flex flex-wrap justify-start gap-4">
      {
        assigns.map((assign: Assign, index: number) => (
          <AssignsCard key={index} assign={assign} />
        ))}
    </div>
  )
}

function AssignsCard({ assign }: { assign: Assign }) {
  const order = assign.order;
  const orderId = order?.id || '';
  const { toast } = useToast();
  const codeInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient();

  const { mutate: sendCodeMutate, isPending: isOtpPending } = useMutation({
    mutationFn: () => sendOtp(orderId),
    onSuccess: async (data) => {
      if (data) {
        toast({
          title: "Success",
          description: "Code Sent",
          className: 'bg-green-500 text-white'
        });
        await queryClient.invalidateQueries({ queryKey: ['agent-get-active-assigns'] })
      } else {
        toast({
          variant: 'destructive',
          description: data?.message || "Error assigning agent",
        })
      }
    },
    onError: (err) => {
      toast({
        variant: 'destructive',
        description: err?.message || "Error assigning agent",
      })
    }
  })

  const { mutate: deliveredMutation, isPending: isDeliveredPending } = useMutation({
    mutationFn: () => deliveryOrder({ orderId, assignId: assign.id || '', code: Number(codeInputRef.current?.value) }),
    onSuccess: async (data) => {
      if (data) {
        toast({
          title: "Success",
          description: data.message || "Order Delivery Confirmed",
          className: 'bg-green-500 text-white'
        });
        await queryClient.invalidateQueries({ queryKey: ['agent-get-active-assigns'] })
      } else {
        toast({
          variant: 'destructive',
          description: data?.message || "Error assigning agent",
        })
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
    <div className="w-full sm:w-1/3 lg:w-1/4 bg-white p-2 rounded-md shadow">
      <p className='text-xs text-gray-500'>OrderId: {order.id}</p>
      <Separator className='my-2' />
      <table>
        <tbody>
          <tr className='py-5 text-sm'>
            <td className='pr-5'>Status:</td>
            <td>
              {
                order.status === 'created' ? <Badge variant={'outline'} className='text-xs flex items-center gap-1 text-gray-500'><FaCheck /> Created</Badge> :
                  order.status === 'packed' ? <Badge variant={'outline'} className='text-xs flex items-center gap-1 text-blue-500'><FaBoxesPacking /> Order Packed</Badge> :
                    order.status === 'processing' ? <Badge variant={'outline'} className='text-xs flex items-center gap-1 text-purple-500'><FcProcess /> Processing..</Badge> :
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
            <td className='pr-5'>Items total:</td>
            <td className='text-sm text-gray-500'>{order.items.length} Items</td>
          </tr>
        </tbody>
      </table>
      <Collapsible className='px-3 py-1 border rounded'>
        <CollapsibleTrigger className='text-sm text-gray-600 w-full text-left'>Address</CollapsibleTrigger>
        <CollapsibleContent className='py-2'>
          <p className='text-xs'>Name: {order.user.name}</p>
          <a href={`callto:+91${order.user.mobile}`} className='text-xs'>Mobile: {order.user.mobile}</a>
          <p className='text-xs mt-1'>
            {order.address.address1}&nbsp; {order.address.address2}, {order.address.city}, {order.address.landmark}, {order.address.pincode},
            {order.address.state}
          </p>
        </CollapsibleContent>
      </Collapsible>
      {order.status !== 'delivered' &&
        <>
        <Separator className='my-2' />
          <div className="flex items-center justify-between gap-2">
            {
              order.code ?
                <div className="flex items-center gap-3">
                  <Input ref={codeInputRef} type="number" placeholder='6-DIGIT CODE' />
                  <Button disabled={isDeliveredPending} onClick={() => deliveredMutation()}>Send</Button>
                </div>
                :
                <Button onClick={() => sendCodeMutate()} disabled={isOtpPending} size='sm' variant={'outline'} className='text-blue-500 border border-blue-600 text-sm w-full'>Send Code</Button>
            }
          </div>
        </>
      }
    </div>
  )
}

export default AgentPage