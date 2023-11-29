"use client";
import { getComplaints } from '@/api/admin.functions';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { DataTable } from '../common/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { DialogContent, DialogTrigger, Dialog } from '../ui/dialog';
import { Separator } from '../ui/separator';
import { MdInfo } from 'react-icons/md';
import { formatDate } from '@/lib/helpers';
import { DetailsDialog } from '../orders/OrderCard';
import Link from 'next/link';

type Props = {}

function ComplaintsList({ }: Props) {
    const { data, isFetching } = useQuery({
        queryKey: ['get-complaints'],
        queryFn: getComplaints,
        retry: 2,
    })
    return (
        isFetching ? <p className='text-sm text-gray-500'>Fecthing...</p> :
            data && data.complaints && data.complaints.length > 0 ?
                <ComplaintsTable complaints={data.complaints} />
                :
                <Alert >
                    <AlertTitle>Not Found!</AlertTitle>
                    <AlertDescription className='text-gray-500'>
                        Sorry No Complaints Found!!!
                    </AlertDescription>
                </Alert>
    )
}

function ComplaintsTable({ complaints }: { complaints: Complaint[] }) {
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
                return <Link href={`/admin/users-list?email=${complaints[index].user?.email}`} className="text-xs text-blue-700">{complaints[index].user?.name}</Link>
            },
        },
        {
            header: "Mobile",
            cell: ({ row }) => {
                const index = row.index;
                return <p className="text-xs text-gray-700">{complaints[index].user?.mobile}</p>
            },
        },
        {
            header: "OrderId",
            cell: ({ row }) => {
                const index = row.index;
                return <p className="text-xs text-gray-700">{complaints[index].order?.id}</p>
            },
        },
        {
            header: "Delivered on",
            cell: ({ row }) => {
                const index = row.index;
                const deliveredon = complaints[index].order?.assign?.updatedAt;
                return <p className="text-xs text-gray-700 truncate">{deliveredon ? formatDate(deliveredon) : '----'}</p>
            },
        },
        {
            header: "Message",
            cell: ({ row }) => {
                const index = row.index;
                return <p className="text-xs text-gray-700 truncate">{complaints[index].message}</p>
            },
        },
        {
            header: "Actions",
            cell: ({ row }) => {
                const index = row.index;
                const complaint = complaints[index];
                return <DetailsDialog address={complaint.order?.address} items={complaint.order?.items} complaint={complaint.message} />
            },
        },

    ]
    return (
        <DataTable data={complaints} columns={columns} />
    )
}

export default ComplaintsList