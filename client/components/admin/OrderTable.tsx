import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../common/DataTable';
import { formatDate } from '@/lib/helpers';
import { AgentsDialog } from './ActiveOrders';
import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { OrderStatusDisplay } from '../orders/OrderCard';
import Image from 'next/image';

export function OrdersTable({ orders, isFetching }: { orders: OrderT[], isFetching: boolean }) {

    const columns: ColumnDef<OrderT>[] = [
        {
            header: "SI",
            cell: ({ row }) => {
                return <p className="text-xs text-gray-700">{row.index + 1}</p>
            },
        },
        {
            header: "User Name",
            cell: ({ row }) => {
                return <p className="text-sm text-gray-700">{orders[row.index]?.user?.name}</p>
            },
        },
        {
            accessorKey: 'createdAt',
            header: "Created on",
            cell: ({ row }) => {
                return <p className="text-md text-gray-500">{formatDate(row.getValue('createdAt'))}</p>
            },
        },
        {
            accessorKey: 'totalPrice',
            header: "Total Price",
            cell: ({ row }) => {
                return <p className="text-lg font-bold">Rs.{row.getValue('totalPrice')}</p>
            },
        },
        {
            accessorKey: 'items',
            header: "No of Items",
            cell: ({ row }) => {
                const items: any = row.getValue('items');
                return <p className="text-md">{items.length}</p>
            },
        },
        {
            accessorKey: 'status',
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue('status');
                return <OrderStatusDisplay status={status} />
            },
        },
        {
            header: "Assigned to",
            cell: ({ row }) => {
                const index = row.index;
                const agent = orders[index].assign?.agent;
                return <div className="flex items-center">
                    {agent ?
                        <a href={`/agents?agentId=${orders[index].assign?.agent?.id}`} className="text-xs text-blue-500 truncate">{orders[index].assign?.agent?.name}</a>
                        : <p className="text-xs text-gray-600">----</p>
                    }
                </div>
            },
        },
        {
            header: "Actions",
            cell: ({ row }) => {
                const index = row.index;
                const status = row.getValue('status');
                return (
                    <div className="flex items-center gap-2">
                        <ViewOrderDetailsDialog order={orders[index]} />
                        |
                        {
                            status === 'delivered' || status === 'rejected' || status === 'cancelled' ? <p className='text-green-500'>Done</p> :
                                <>
                                    {orders[index].assign ? <p className='text-gray-500'>Assigned</p> :
                                        <AgentsDialog orderIds={[orders[index].id || '']} />
                                    }
                                </>
                        }
                    </div>
                )
            },
        },
    ];


    return (
        isFetching ? <p className='text-gray-500'>Fecthing data....</p> : orders?.length === 0 ?
            <Alert >
                <AlertTitle>Not Found!</AlertTitle>
                <AlertDescription className='text-gray-500'>
                    Sorry No Orders Found!!!
                </AlertDescription>
            </Alert > :
            <DataTable columns={columns} data={orders} />
    )
}


export function ViewOrderDetailsDialog({ order }: { order: OrderT }) {
    return (
        <Dialog>
            <DialogTrigger className='py-2 text-blue-600'>Details</DialogTrigger>
            <DialogContent className={"max-w-screen-md max-h-screen"}>
                <p className='text-xs text-gray-400'>ID: {order.id}</p>
                <table className='w-fit'>
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
                            <td className='pr-5'>Total Amount:</td>
                            <td className='text-lg font-semibold text-green-600'>Rs.{order.totalPrice} /-</td>
                        </tr>
                        <tr className='py-5 text-sm'>
                            <td className='pr-5'>Items total:</td>
                            <td className='text-sm text-gray-500'>{order.items.length} Items</td>
                        </tr>

                    </tbody>
                </table>
                <h5 className='text-md text-gray-400'>Items</h5>
                {order.items?.map((item, index: number) => (
                    <div key={index.toString()} className="bg-white border rounded-md p-2 flex items-start gap-2">
                        <Image src={item?.thumbnail || ''} alt={item.name} width={50} height={50} className='rounded-lg border shadow' />
                        <div>
                            <h4 className='text-gray-500'>{item.name}</h4>
                            <h4 className='text-xs text-gray-400'>
                                <span className='text-lg font-bold text-gray-700'>₹{item.price}</span> / {item.quantity}{item.units}
                            </h4>
                        </div>
                    </div>
                ))}
                <h5 className='text-md text-gray-400'>User Info</h5>
                <div className='border p-2 rounded-md'>
                    <p className='text-sm text-gray-600'>Name: {order.user?.name}</p>
                    <p className='text-sm text-gray-600'>Mobile: {order.user?.mobile}</p>
                    <p className='mt-2 text-sm text-gray-800'>Delivery Address:</p>
                    <p className='text-sm text-gray-500'>{order.address.address1} &nbsp; {order.address?.address2}</p>
                    <p className='text-sm text-gray-500'>{order.address.landmark}, {order.address.city}</p>
                    <p className='text-sm text-gray-500'>{order.address.state}, {order.address.country}</p>
                    <p className='text-sm text-gray-500'>{order.address.pincode}</p>
                </div>
            </DialogContent>
        </Dialog>
    )
}