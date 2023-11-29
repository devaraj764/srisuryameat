import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { sendOrderHtml } from "../helpers/html_templets";

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.id || '';
    const { items, totalPrice, addressId } = req.body;
    if (!items || items.length <= 0 || !totalPrice || !addressId) next({ status: 400, message: 'Invalid payload' })
    try {
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } })
        if (!user) return next({ status: 404, message: "User Not Found" })
        const result = await prisma.order.create({
            data: { totalPrice, items, addressId, userId }
        });
        if (result) {
            await prisma.cart.deleteMany({ where: { userId } });
            await sendOrderHtml({
                order: result,
                subject: `Order Placed! ID:${result.id}`,
                emails: [user.email]
            }
            );
            res.send({ message: 'Order Created', order: result })
        } else {
            next({ status: 400, message: 'Error creating order' })
        }
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.id || '';
    const limit = req.query.limit || '15';
    try {
        const active = await prisma.order.findMany({
            where: {
                userId,
                status: {
                    in: ['created', 'packed', 'processing', 'out_for_delivery']
                }
            },
            orderBy: { updatedAt: "desc" },
            include: { address: true, assign: { select: { agent: { select: { name: true } } } } }
        });
        const completed = await prisma.order.findMany({
            where: {
                userId,
                status: {
                    in: ['delivered', 'cancelled', 'rejected']
                }
            },
            orderBy: { updatedAt: "desc" },
            take: Number(limit),
            include: {
                address: true,
                complaint: {
                    select: { message: true }
                },
                assign: {
                    select: {
                        agent: {
                            select: { name: true }
                        }
                    }
                }
            }
        });
        if (active && completed) {
            res.send({ message: 'Yours Orders', active, completed })
        } else {
            next({ status: 400, message: 'Error fetchig orders' })
        }
    } catch (err: any) {
        next({ message: err.message })
    }
}

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    const limit = req.query.limit || '10';
    const search = JSON.parse(req.query.search ? req.query.search.toString() : '');
    try {
        var result;
        result = await prisma.order.findMany({
            where: search.searchBy === 'id' ? {
                id: {
                    equals: search.value
                }
            } : {
                user: {
                    [search.searchBy]: {
                        contains: search.value
                    }
                }
            },
            orderBy: { updatedAt: "desc" },
            take: Number(limit),
            include: { user: { select: { name: true, email: true } }, address: true, assign: { select: { agent: true } } }
        });
        if (result) {
            res.send({ message: 'Yours Orders', orders: result })
        } else {
            next({ status: 400, message: 'Error fetchig orders' })
        }
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const getActiveOrders = async (req: Request, res: Response, next: NextFunction) => {
    const limit = req.query.limit || '10';
    const search = JSON.parse(req.query.search ? req.query.search.toString() : '');
    try {
        var result = await prisma.order.findMany({
            where: {
                status: {
                    in: search.status !== '' ? [search.status] : ['created', 'packed', 'processing', 'out_for_delivery']
                }
            },
            orderBy: { createdAt: "desc" },
            take: Number(limit),
            select: {
                id: true,
                address: true,
                status: true,
                createdAt: true,
                items: true,
                totalPrice: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        mobile: true,
                    }
                },
                assign: {
                    select: {
                        agent: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                mobile: true,
                            }
                        }
                    }
                }
            }
        });
        if (result) {
            res.send({ message: 'Yours Orders', orders: result })
        } else {
            next({ status: 400, message: 'Error fetchig orders' })
        }
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}