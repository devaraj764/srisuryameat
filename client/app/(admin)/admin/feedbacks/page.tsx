import FeedbacksList from '@/components/admin/FeedbacksList'
import React from 'react'
import { MdMessage } from 'react-icons/md'

type Props = {}

function FeedbacksPage({ }: Props) {
    return (
        <div className='max-w-[1400px] mx-auto px-3'>
            <div className="flex items-center gap-2 mb-5 text-green-500">
                <MdMessage size='22' />
                <h1 className='text-md'>Feedbacks</h1>
            </div>
            <FeedbacksList />
        </div>
    )
}

export default FeedbacksPage