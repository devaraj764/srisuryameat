"use client";
import { getOrdersList } from '@/api/order.functions';
import { OrdersTable } from '@/components/admin/OrderTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai';

type Props = {}

function OrdersPage({ }: Props) {
  const searchParams = useSearchParams();
  const email = searchParams.get('email')
  const [searchBy, setSearchBy] = useState('email')
  const [value, setValue] = useState(email || '');
  const [isDirty, setIsDirty] = useState(false)
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['get-all-orders'],
    queryFn: () => getOrdersList(10, JSON.stringify({ searchBy, value })),
  });

  const onSearch = async () => {
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
    <div className='max-w-[1400px] mx-auto px-3'>
      <h2 className="text-xl font-bold text-gray-700">Orders List</h2>
      <br />
      <div className="flex items-center w-fit mb-2 gap-2">
        <Select value={searchBy} onValueChange={(e) => setSearchBy(e)}>
          <SelectTrigger className="w-[180px]" defaultValue={'all'}>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="mobile">Mobile</SelectItem>
            <SelectItem value="id">Order Id</SelectItem>
          </SelectContent>
        </Select>
        <Input value={value} onChange={(e) => setValue(e.target.value)} type="email" required placeholder={`Search by ${searchBy}`} />
        <Button onClick={onSearch} variant={'outline'} className='bg-blue-500 hover:bg-blue-700 hover:text-white text-white'><AiOutlineSearch size="18" />&nbsp; Search</Button>
        {
          isDirty && <Button variant="outline" onClick={reset}>Reset</Button>
        }
      </div>
      <ScrollArea className='my-5'>
        <OrdersTable orders={data?.orders || []} isFetching={isFetching} />
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </div>
  )
}

export default OrdersPage