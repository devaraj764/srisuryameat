import Link from 'next/link'
import React from 'react'
import { AiOutlineUsergroupAdd } from 'react-icons/ai'
import { GiMeat } from 'react-icons/gi'
import { MdMessage, MdReportProblem } from 'react-icons/md'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'

type Props = {}
const acesses = [
    {
        href: '/admin/products-list',
        tag: 'Products List',
        icon: <GiMeat size='28' />,
        color: 'text-primary'
    },
    {
        href: '/admin/users-list',
        tag: 'Users List',
        icon: <AiOutlineUsergroupAdd size='24' />,
        color: 'text-blue-500'
    },
    {
        href: '/admin/feedbacks',
        tag: 'Feedbacks',
        icon: <MdMessage size='22' />,
        color: 'text-green-500'
    },
    {
        href: '/admin/complaints',
        tag: 'Complaints',
        icon: <MdReportProblem size='24' />,
        color: 'text-orange-500'
    },
]

function Accessibilities({ }: Props) {
    return (
        <div>
            <h5 className="text-sm text-gray-500">Accessibilities</h5>
            <ScrollArea>
                <div className="grid grid-cols-2 md:grid-cols-4 my-3 gap-5">
                    {
                        acesses.map((item, index) => (
                            <Link key={index.toString()} href={item.href}>
                                <div className={"p-3 px-3 text-xs md:text-sm shadow-md bg-white rounded-lg duration-150 hover:scale-105 flex items-center gap-2" + ' ' + item.color}>
                                    {item.icon} {item.tag}
                                </div>
                            </Link>
                        ))}
                </div>
                <ScrollBar orientation='horizontal' />
            </ScrollArea>
        </div>
    )
}

export default Accessibilities