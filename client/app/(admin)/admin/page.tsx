import Accessibilities from '@/components/admin/Accessibilities'
import ActiveOrders from '@/components/admin/ActiveOrders'
import React from 'react'

type Props = {}

function AdminPage({ }: Props) {
  return (
    <div className='max-w-[1400px] mx-auto px-3'>
      <Accessibilities />
      <ActiveOrders />
    </div>
  )
}

export default AdminPage