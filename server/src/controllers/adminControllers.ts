import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { SendStatusEmails } from "../helpers/sendStatusEmails";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    const limit = req.query.limit || '10';
    const search = JSON.parse(req.query.search ? req.query.search.toString() : '');
    try {
        const users = await prisma.user.findMany({
            where: {
                [search.searchBy]: {
                    contains: search.value
                }
            },
            orderBy: { updatedAt: "desc" },
            take: Number(limit),
            include: { addresses: true }
        });
        res.send({ users, message: 'Users Found' })
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const getAgents = async (req: Request, res: Response, next: NextFunction) => {
    const limit = req.query.limit || '10';
    // const search = JSON.parse(req.query.search ? req.query.search.toString() : '');
    try {
        const agents = await prisma.user.findMany({
            where: {
                role: 'agent'
            },
            orderBy: { updatedAt: "desc" },
            take: Number(limit),
            select: {
                id: true,
                name: true,
                profileImage: true,
                email: true,
                mobile: true,
                assigns: {
                    select: {
                        id: true
                    }
                }
            }
        });
        res.send({ agents, message: 'Agents Found' })
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const assignOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { agentId, orderIds } = req.body;
    if (!agentId || !orderIds) return next({ status: 400, message: "Inavlid payload" });
    const data = orderIds.map((id: string) => ({ orderId: id, agentId }))
    try {
        const assign = await prisma.assign.createMany({
            data: data
        });
        await prisma.order.updateMany({
            where: {
                id: {
                    in: orderIds
                }
            },
            data: { status: "out_for_delivery" }
        })
        SendStatusEmails({ orderIds, status:'Out for Delivery' });

        res.send({ assign, message: 'Agent assigned successfully' })
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.userId;
    if (!id) return next({ status: 400, message: "User Id must be provided" })
    console.log(req.body)
    try {
        var isUser = await prisma.user.findUnique({ where: { id }, select: { id: true } })
        if (!isUser) return next({ status: 404, message: "User not found" });
        const user = await prisma.user.update({
            where: { id },
            data: req.body,
        });
        res.send({ user, message: 'User Updated Successfully' })
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const changeStatus = async (req: Request, res: Response, next: NextFunction) => {
    const { orderIds, status } = req.body;
    if (!orderIds || !status) return next({ status: 400, message: 'Invalid params and query' });
    try {
        const assigns = await prisma.order.updateMany({
            where: {
                id: {
                    in: orderIds
                }
            },
            data: {
                status
            }
        });
        SendStatusEmails({ orderIds, status });
        res.send({ assigns, message: 'Changed Order Status' })
    } catch (err: any) {
        console.log(err)

        next({ message: err.message })
    }
}

export const getComplaints = async (req: Request, res: Response, next: NextFunction) => {
    const last_timestamp = req.query.last_timestamp || new Date(Date.now());
    const limit = req.query.limit || '15';
    try {
        const complaints = await prisma.complaint.findMany({
            where: {
                createdAt: {
                    // @ts-ignore
                    lt: last_timestamp
                },
            },
            select: {
                id: true,
                message: true,
                user: {
                    select: {
                        name: true,
                        mobile: true,
                        email: true
                    }
                },
                order: {
                    select: {
                        id: true,
                        items: true,
                        status: true,
                        createdAt: true,
                        updatedAt: true,
                        address: true,
                        assign: {
                            select: {
                                updatedAt: true
                            }
                        }
                    }
                }
            },
            take: Number(limit),
            orderBy: { createdAt: 'desc' }
        });
        res.send({ complaints, message: 'Complaints Found' })
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const getFeedbacks = async (req: Request, res: Response, next: NextFunction) => {
    const last_timestamp = req.query.last_timestamp || new Date(Date.now());
    const limit = req.query.limit || '15';
    try {
        const feedbacks = await prisma.feedback.findMany({
            where: {
                createdAt: {
                    // @ts-ignore
                    lt: last_timestamp
                },
            },
            select: {
                id: true,
                message: true,
                user: {
                    select: {
                        name: true,
                        mobile: true,
                        email: true
                    }
                },
                createdAt: true
            },
            take: Number(limit),
            orderBy: { createdAt: 'desc' }
        });
        res.send({ feedbacks, message: 'Feedbacks Found' })
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}