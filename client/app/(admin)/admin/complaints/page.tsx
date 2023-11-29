import ComplaintsList from '@/components/admin/ComplaintsList'
import React from 'react'

type Props = {}

async function ComplaintsPage({ }: Props) {
    return (
        <div className='max-w-[1400px] mx-auto px-3'>
            <h1 className='text-gray-600 text-md mb-5'>Complaints</h1>
            <ComplaintsList />
        </div>

    )
}

export default ComplaintsPage