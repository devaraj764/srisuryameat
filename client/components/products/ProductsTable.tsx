import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

type Props = {}

const columns: ColumnDef<ProductT>[] = [
    {
        accessorKey: "ID",
        header: "Status",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "amount",
        header: "Amount",
      },
]

function ProductsTable({}: Props) {
  return (
    <div>ProductsTable</div>
  )
}

export default ProductsTable