import React from 'react'
import { MdAdminPanelSettings } from 'react-icons/md'
import SigninButton from '../common/SigninButton'
import Link from 'next/link'

type Props = {}

function AdminNavbar({ }: Props) {
  return (
    <div className='border-b py-3 mb-5 bg-white'>
      <div className="max-w-[1400px] mx-auto px-3 flex items-center justify-between gap-5">
        <div className="flex items-center gap-2">
          <MdAdminPanelSettings size='32' className='text-green-500' />
          <Link href='/admin'>
            <h1 className='text-gray-600 text-lg md:text-xl font-medium cursor-pointer'>Admin Dashboard</h1>
          </Link>
        </div>
        <SigninButton />
      </div>
    </div>
  )
}

export default AdminNavbar