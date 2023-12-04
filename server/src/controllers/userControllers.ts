import { config } from 'dotenv'
config();
import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { createToken } from "../helpers/jwt";
import { SendStatusEmails } from "../helpers/sendStatusEmails";

export const autheticateUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.email || !req.body.name) res.status(400).send({ message: 'Invalid params' })
    try {
        const user = await prisma.user.upsert({
            where: {
                email: req.body.email,
            },
            update: {},
            create: { ...req.body },
            include: {
                cart: {
                    select: { quantity: true, price: true, units: true, productId: true }
                },
                wishlist: {
                    select: { productId: true }
                }
            }
        });
        if (user) {
            const token = createToken({ id: user.id }, '30d');
            if (process.env.NODE_ENV === "development") {
                res.cookie("token", token, {
                    httpOnly: true,
                    path: "/",
                    domain: "localhost",
                    secure: false,
                    sameSite: "lax", // "strict" | "lax" | "none" (secure must be true)
                    maxAge: 3600000 * 24 * 30, // 1 hour
                });
            }

            if (process.env.NODE_ENV === "production") {
                res.cookie("token", token, {
                    httpOnly: true,
                    path: "/",
                    secure: true,
                    sameSite: "none", // "strict" | "lax" | "none" (secure must be true)
                    maxAge: 3600000 * 24 * 30, // 30 days
                });
            }
            res.send({ user, message: 'Successfully authenticated user', token });
            // res.send({ user, message: 'Successfully authenticated user', token });
        } else {
            res.status(400).send({ message: 'Error authenticating user' })
        }
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.cookie('token', '', { httpOnly: true }).send({ message: 'Logged out' });
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const getUserData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.id;
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                cart: {
                    select: { quantity: true, price: true, units: true, productId: true }
                },
                wishlist: {
                    select: { productId: true }
                }
            }
        });
        if (user) {
            res.send({ user, message: 'User Found' })
        } else {
            res.status(400).send({ message: 'User Not found' })
        }
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const updateUserDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.id;
        const user = await prisma.user.update({
            where: { id },
            data: req.body
        });
        if (user) {
            res.send({ user, message: 'Successfully updated profile' })
        } else {
            res.status(400).send({ message: 'Error creating new user' })
        }
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const addAddress = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.id || '';
    const { address1, city, pincode, state, country } = req.body;
    if (!address1 || !city || !pincode || !state || !country) next({ status: 400, message: "Invalid data payload" })
    try {
        const address = await prisma.address.create({
            data: { ...req.body, userId: id }
        });
        if (!address) next({ status: 400, message: 'Error adding address' });
        await prisma.user.update({
            where: { id },
            data: { currentAddressId: address.id }
        });
        res.send({ address, message: 'Address added successfully' })
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const getAllAddresses = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.id || '';
    try {
        const addresses = await prisma.address.findMany({
            where: { userId: id }
        });
        if (!addresses) next({ status: 400, message: 'Error adding address' })
        res.send({ addresses, message: 'Address Found' })
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}

export const createComplaint = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.id || '';
    const { message, orderId } = req.body;
    if (!message || !orderId) return next({ status: 400, message: "Invalid Params" })
    try {
        const complaint = await prisma.complaint.create({
            data: {
                userId: id,
                orderId,
                message
            }
        });
        res.send({ complaint, message: 'Complaint Raised' })
    } catch (error: any) {
        console.log(error);
        next({ message: error.message })
    }
}

export const sendFeedback = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.id || '';
    const { message } = req.body;
    if (!message) return next({ status: 400, message: "Invalid Params" })
    try {
        const feedback = await prisma.feedback.create({
            data: {
                userId: id,
                message
            }
        });
        res.send({ feedback, message: 'Feedback Sent' })
    } catch (error: any) {
        console.log(error);
        next({ message: error.message })
    }
}

export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.id || '';
    const { orderId } = req.params;
    if (!orderId) return next({ status: 400, message: 'Invalid params' });
    try {
        const assigns = await prisma.order.update({
            where: {
                id: orderId,
                userId: userId
            },
            data: {
                status: 'cancelled'
            }
        });
        SendStatusEmails({ orderIds: [orderId], status: 'cancelled' });
        res.send({ assigns, message: 'Cancelled Order' })
    } catch (err: any) {
        console.log(err)
        next({ message: err.message })
    }
}