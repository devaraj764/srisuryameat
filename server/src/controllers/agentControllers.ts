import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import generateOTP from "../helpers/generateOtp";
import { SendStatusEmails } from "../helpers/sendStatusEmails";

export const getAssigns = async (req: Request, res: Response, next: NextFunction) => {
    const agentId = req.id || '';
    const limit = req.query.limit;
    const query = req.params.query;
    try {
        const assigns = await prisma.assign.findMany({
            where: {
                agentId,
                isCompleted: query === 'active' ? false : true
            },
            orderBy: { updatedAt: "desc" },
            take: limit ? Number(limit) : 10,
            select: {
                id: true,
                order: {
                    select: {
                        user: {
                            select: {
                                name: true,
                                mobile: true
                            }
                        },
                        id: true,
                        status: true,
                        address: true,
                        items: true,
                        createdAt: true,
                        updatedAt: true,
                        code: true
                    }
                },
            },
        });
        res.send({ assigns, message: 'Assigns Found' })
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId;
    const otp = generateOTP();
    if (!orderId) return next({ message: 'Invalid Params', status: 400 })
    try {
        const assigns = await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                code: otp
            }
        });
        SendStatusEmails({ orderIds: [orderId], status: 'Out for Delivery' });
        res.send({ assigns, message: 'Assigns Found' })
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const orderDelivered = async (req: Request, res: Response, next: NextFunction) => {
    const { orderId, assignId, code } = req.body;
    console.log(req.body)
    if (!orderId || !assignId || !code) return next({ message: 'Invalid Params', status: 400 })
    try {
        const order = await prisma.order.findUnique({
            where: {
                id: orderId
            },
            select: {
                code: true
            }
        });
        if (!order) return next({ message: 'Order Not found', status: 404 })
        if (code !== order.code) return next({ message: 'Code doesnot match', status: 400 });
        await prisma.order.update({ where: { id: orderId }, data: { status: 'delivered' } });
        await prisma.assign.update({ where: { id: assignId }, data: { isCompleted: true } });
        
        // send mail
        SendStatusEmails({ orderIds: [orderId], status: 'delivered' });

        res.send({ message: 'Order delivered' })
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}