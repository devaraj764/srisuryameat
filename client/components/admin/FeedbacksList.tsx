"use client";
import { getComplaints, getFeedbacks } from '@/api/admin.functions';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { DataTable } from '../common/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { formatDate } from '@/lib/helpers';
import { DetailsDialog } from '../orders/OrderCard';
import Link from 'next/link';

type Props = {}

function FeedbacksList({ }: Props) {
    const { data, isFetching } = useQuery({
        queryKey: ['get-feedbacks'],
        queryFn: getFeedbacks,
        retry: 2,
    })
    return (
        isFetching ? <p className='text-sm text-gray-500'>Fecthing...</p> :
            data && data.feedbacks && data.feedbacks.length > 0 ?
                <FeedbacksTable feedbacks={data.feedbacks} />
                :
                <Alert >
                    <AlertTitle>Not Found!</AlertTitle>
                    <AlertDescription className='text-gray-500'>
                        Sorry No Feedbacks Found!!!
                    </AlertDescription>
                </Alert>
    )
}

function FeedbacksTable({ feedbacks }: { feedbacks: Feedback[] }) {
    const columns: ColumnDef<Complaint>[] = [
        {
            header: "SI",
            cell: ({ row }) => {
                return <p className="text-xs text-gray-700">{row.index + 1}</p>
            },
        },
        {
            header: "User Name",
            cell: ({ row }) => {
                const index = row.index;
                return <Link href={`/admin/users-list?email=${feedbacks[index].user?.email}`} className="text-xs text-blue-700">{feedbacks[index].user?.name}</Link>
            },
        },
        {
            header: "Mobile",
            cell: ({ row }) => {
                const index = row.index;
                return <p className="text-xs text-gray-700">{feedbacks[index].user?.mobile}</p>
            },
        },
        {
            header: "On",
            cell: ({ row }) => {
                const index = row.index;
                const date = feedbacks[index].createdAt;
                return <p className="text-xs text-gray-700">{formatDate(date)}</p>
            },
        },
        {
            header: "Message",
            cell: ({ row }) => {
                const index = row.index;
                return <p className="text-xs text-gray-700 truncate">{feedbacks[index].message}</p>
            },
        }

    ]
    return (
        <DataTable data={feedbacks} columns={columns} />
    )
}

export default FeedbacksList