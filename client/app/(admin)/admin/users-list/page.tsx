import UsersList from '@/components/admin/UsersList'
import React from 'react'

type Props = {}

const UsersListPage = (props: Props) => {
  return (
    <div className='mx-auto max-w-[1400px] px-3'>
    <UsersList />
    </div>
  )
}

export default UsersListPage