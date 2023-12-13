"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveOrders = exports.getOrders = exports.getMyOrders = exports.createOrder = void 0;
const prisma_1 = require("../config/prisma");
const html_templets_1 = require("../helpers/html_templets");
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.id || '';
    const { items, totalPrice, addressId, contactInfo } = req.body;
    if (!items || items.length <= 0 || !totalPrice || !addressId || !contactInfo)
        next({ status: 400, message: 'Invalid payload' });
    try {
        const user = yield prisma_1.prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
        if (!user)
            return next({ status: 404, message: "User Not Found" });
        const result = yield prisma_1.prisma.order.create({
            data: { totalPrice, items, addressId, userId, contactInfo }
        });
        if (result) {
            yield prisma_1.prisma.cart.deleteMany({ where: { userId } });
            yield (0, html_templets_1.sendOrderHtml)({
                order: result,
                subject: `Order Placed! ID:${result.id}`,
                emails: [user.email]
            });
            res.send({ message: 'Order Created', order: result });
        }
        else {
            next({ status: 400, message: 'Error creating order' });
        }
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.createOrder = createOrder;
const getMyOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.id || '';
    const limit = req.query.limit || '15';
    try {
        const active = yield prisma_1.prisma.order.findMany({
            where: {
                userId,
                status: {
                    in: ['created', 'packed', 'processing', 'out_for_delivery']
                }
            },
            orderBy: { updatedAt: "desc" },
            include: { address: true, assign: { select: { agent: { select: { name: true } } } } }
        });
        const completed = yield prisma_1.prisma.order.findMany({
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
            res.send({ message: 'Yours Orders', active, completed });
        }
        else {
            next({ status: 400, message: 'Error fetchig orders' });
        }
    }
    catch (err) {
        next({ message: err.message });
    }
});
exports.getMyOrders = getMyOrders;
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = req.query.limit || '10';
    const search = JSON.parse(req.query.search ? req.query.search.toString() : '');
    try {
        var result;
        result = yield prisma_1.prisma.order.findMany({
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
            res.send({ message: 'Yours Orders', orders: result });
        }
        else {
            next({ status: 400, message: 'Error fetchig orders' });
        }
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.getOrders = getOrders;
const getActiveOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = req.query.limit || '10';
    const search = JSON.parse(req.query.search ? req.query.search.toString() : '');
    try {
        var result = yield prisma_1.prisma.order.findMany({
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
                contactInfo: true,
                user: {
                    select: {
                        id: true,
                        email: true,
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
            const resultCount = yield prisma_1.prisma.$transaction([
                prisma_1.prisma.order.count({ where: { status: 'created' } }),
                prisma_1.prisma.order.count({ where: { status: 'packed' } }),
                prisma_1.prisma.order.count({ where: { status: 'processing' } }),
                prisma_1.prisma.order.count({ where: { status: 'out_for_delivery' } }),
            ]);
            const count = {
                all: resultCount.reduce((acc, number) => acc + number, 0),
                created: resultCount[0],
                packed: resultCount[1],
                processing: resultCount[2],
                out_for_delivery: resultCount[3]
            };
            res.send({ message: 'Yours Orders', orders: result, count });
        }
        else {
            next({ status: 400, message: 'Error fetchig orders' });
        }
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.getActiveOrders = getActiveOrders;
