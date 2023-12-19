"use client";

import { deleteProduct } from "@/api/product.functions";
import { revalidateTag } from "next/cache";
import SwitchStock from "./SwitchStock";
import AddOrUpdateProduct from "@/components/products/AddOrUpdateProduct";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/navigation";

export function ProductActions({ product }: { product: ProductT }) {
    const router = useRouter();
    const handleDelete = async () => {
        await deleteProduct(product.id)
        router.refresh();
    }
    return (
        <div className="flex items-center gap-2">
            <SwitchStock inStock={product?.inStock} productId={product.id} />
            <AddOrUpdateProduct product={product}>
                <span className='bg-blue-500 hover:bg-blue-700 text-white py-2 w-fit px-7 text-center rounded-md cursor-pointer'>Edit</span>
            </AddOrUpdateProduct>
            <ConfirmDialog
                callback={handleDelete}
                title={
                    <div className='p-[10px] bg-red-500 text-white rounded-sm'>
                        <MdDelete size='20' />
                    </div>

                }
                actionTitle='Delete'
                message={`This action will delete ${product.name}`}
                successMesssage={`Succesfully deleted ${product.name}`}
            />
        </div>
    )
}