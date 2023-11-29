import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { product } = req.body;
    try {
        const result = await prisma.product.create({
            data: product
        });
        if (result) {
            res.send({ message: 'Successfully created product', result })
        } else {
            next({ status: 400, message: 'Error creating product' })
        }
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const createManyProducts = async (req: Request, res: Response, next: NextFunction) => {
    const { products } = req.body;
    try {
        const result = await prisma.product.createMany({
            data: products
        })
        if (result) {
            res.send({ message: 'Successfully uploaded products', result })
        } else {
            next({ status: 400, message: 'Error uploading products' })
        }
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    const category = req.query.category?.toString() || 'all';
    const name = req.query.productName?.toString() || '';
    console.log(name)
    try {
        const products = await prisma.product.findMany({
            where: {
                ...(category !== 'all' ? { category } : {}),
                ...(name !== '' ? {
                    name: {
                        contains: name
                    }
                }: {})
            },
            select: {
                id: true,
                name: true,
                description: true,
                thumbnail: true,
                prices: true,
                category: true,
                createdAt: true,
                updatedAt: true,
                ordersCount: true,
                inStock: true
            }
        });
        res.send({ products, message: 'Products list' })
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) next({ status: 400, message: 'Id is not sent' })
    try {
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) next({ status: 404, message: 'Product not found' })
        res.send({ product, message: 'Product found' })
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) next({ status: 400, message: 'Id is not sent' })
    try {
        const product = await prisma.product.delete({ where: { id } });
        if (!product) next({ status: 404, message: 'Product not found' })
        res.send({ product, message: 'Product Deleted' })
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const data = req.body;
    if (!id) next({ status: 400, message: 'Id is not sent' })
    try {
        const product = await prisma.product.update({ where: { id }, data });
        if (!product) next({ status: 404, message: 'Product not found' })
        res.send({ product, message: 'Product Updated' })
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const getCartProducts = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.id;
    try {
        const products = await prisma.cart.findMany({
            where: {
                userId: id
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        thumbnail: true,
                        prices: true,
                        category: true,
                        createdAt: true,
                        updatedAt: true,
                        ordersCount: true
                    }
                }
            },
        });
        res.send({ products, message: 'Cart Products list' })
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const getWishlistProducts = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.id;
    try {
        const products = await prisma.wishlist.findMany({
            where: {
                userId: id
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        thumbnail: true,
                        prices: true,
                        category: true,
                        createdAt: true,
                        updatedAt: true,
                        ordersCount: true
                    }
                }
            },
        });
        res.send({ products, message: 'Wishlist Products list' })
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.id || '';
    const { productId, quantity, units, price } = req.body;
    if (!productId || !quantity || !units || !price) next({ status: 400, message: "Invalid data input" })
    try {
        const isProduct = await prisma.product.findUnique({ where: { id: productId } });
        if (!isProduct) next({ status: 404, message: "Product Not Found" })
        const cartItem = await prisma.cart.upsert({
            where: { cartId: { userId: id, productId } },
            update: { quantity, units, price },
            create: { ...req.body, userId: id }
        });
        if (!cartItem) next({ status: 404, message: 'Error adding product to cart' })
        res.send({ cartItem, message: `${isProduct?.name} is added to Cart` })
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.id || '';
    const productId = req.params.productId;
    if (!productId) next({ status: 400, message: "Invalid data input" })
    try {
        await prisma.cart.delete({ where: { cartId: { userId, productId } } });
        res.send({ message: `Item removed from cart` })
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const toogleWishlist = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.id || '';
    const { productId } = req.params;
    const { action } = req.query;
    console.log(action)
    if (!productId || id === '') next({ status: 400, message: "Invalid data input" });
    if (!action) next({ status: 400, message: "Action should be sent.. add or remove" })
    try {
        const isProduct = await prisma.product.findUnique({ where: { id: productId } });
        if (!isProduct) next({ status: 404, message: "Product Not Found" });
        if (action === "add") {
            const wishItem = await prisma.wishlist.create({ data: { productId, userId: id } });
            if (!wishItem) next({ status: 404, message: 'Error adding product to wishlist' })
            res.send({ wishItem, message: `${isProduct?.name} Added to Wishlist` })
        } else if (action === "remove") {
            const unWishItem = await prisma.wishlist.delete({ where: { wishlistId: { productId, userId: id } } });
            if (!unWishItem) next({ status: 404, message: 'Error removing from wishlist' })
            res.send({ message: `${isProduct?.name} Removed from Wishlist` })
        }
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}