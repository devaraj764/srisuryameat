declare global {

    interface UserT {
        id: string
        name: string
        profileImage: string
        email: string
        role: 'customer' | 'admin' | 'agent'
        createdAt: Date
        updatedAt: Date
        profileStatus: 'pending' | 'completed'
        mobile?: number
        whatsapp?: number,
        currentAddressId?: string,
        addresses?: AddressT[],
        assigns?: Assign[]
        cart: {
            productId: string
            quantity: number;
            units: "g" | "kg";
            price: number;
        }[]
        wishlist: { productId: string }[]
    }

    interface AuthUserT {
        name: string
        profileImage?: string
        email: string
    }


    interface ProductT {
        id: string
        name: string
        thumbnail: string
        category: string
        prices: {
            quantity: number,
            units: "g" | "kg",
            price: number
        }[]
        inStock: boolean
        description?: string
        ordersCount?: number
        createdAt?: Date
        updatedAt?: Date
    }

    interface ProductCreateT {
        name: string
        description?: string
        thumbnail: string,
        category: string,
        prices: {
            quantity: number,
            units: "g" | "kg",
            price: number
        }[]
        inStock?: boolean
    }

    interface AddressT {
        id?: string,
        address1: string;
        city: string;
        pincode: number;
        state: string;
        country: string;
        address2?: string | undefined;
        landmark?: string | undefined;
    }

    interface CartItemT {
        id: string,
        quantity: number,
        units: 'g' | 'kg',
        price: number,
        product?: ProductT
    }

    interface OrderItem {
        name: string,
        productId: string,
        thumbnail: string,
        quantity: number,
        units: string,
        price: number
    }

    interface OrderT {
        id?: string,
        totalPrice: number,
        items: OrderItem[],
        status: 'created' | 'processing' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'rejected',
        code?: number,
        address: AddressT,
        contactInfo: {
            name: string,
            mobile: string
        },
        user: UserT,
        agent?: UserT,
        createdAt: Date,
        updatedAt: Date
        assign?: Assign
        complaint?: { message: strring }
    }

    interface Complaint {
        id: string,
        message: string
        user?: UserT
        order?: OrderT
    }

    interface OrderCreateT {
        totalPrice: number,
        items: OrderItem[],
        addressId: string,
        contactInfo: OrderT["contactInfo"]
    }

    interface Assign {
        id?: string
        order: OrderT
        orderId?: string
        agentId?: string
        agent?: UserT
        isCompleted: boolean
        createdAt?: Date,
        updatedAt: Date
    }

    interface Feedback {
        id: string
        message: string
        user: UserT
        createdAt: Date
    }
}

export default global;