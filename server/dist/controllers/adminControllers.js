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
exports.getFeedbacks = exports.getComplaints = exports.changeStatus = exports.updateUser = exports.assignOrder = exports.getAgents = exports.getAllUsers = void 0;
const prisma_1 = require("../config/prisma");
const sendStatusEmails_1 = require("../helpers/sendStatusEmails");
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = req.query.limit || '10';
    const search = JSON.parse(req.query.search ? req.query.search.toString() : '');
    try {
        const users = yield prisma_1.prisma.user.findMany({
            where: {
                [search.searchBy]: {
                    contains: search.value
                }
            },
            orderBy: { updatedAt: "desc" },
            take: Number(limit),
            include: { addresses: true }
        });
        res.send({ users, message: 'Users Found' });
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.getAllUsers = getAllUsers;
const getAgents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = req.query.limit || '10';
    // const search = JSON.parse(req.query.search ? req.query.search.toString() : '');
    try {
        const agents = yield prisma_1.prisma.user.findMany({
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
        res.send({ agents, message: 'Agents Found' });
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.getAgents = getAgents;
const assignOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentId, orderIds } = req.body;
    if (!agentId || !orderIds)
        return next({ status: 400, message: "Inavlid payload" });
    const data = orderIds.map((id) => ({ orderId: id, agentId }));
    try {
        const assign = yield prisma_1.prisma.assign.createMany({
            data: data
        });
        yield prisma_1.prisma.order.updateMany({
            where: {
                id: {
                    in: orderIds
                }
            },
            data: { status: "out_for_delivery" }
        });
        (0, sendStatusEmails_1.SendStatusEmails)({ orderIds, status: 'Out for Delivery' });
        res.send({ assign, message: 'Agent assigned successfully' });
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.assignOrder = assignOrder;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.userId;
    if (!id)
        return next({ status: 400, message: "User Id must be provided" });
    console.log(req.body);
    try {
        var isUser = yield prisma_1.prisma.user.findUnique({ where: { id }, select: { id: true } });
        if (!isUser)
            return next({ status: 404, message: "User not found" });
        const user = yield prisma_1.prisma.user.update({
            where: { id },
            data: req.body,
        });
        res.send({ user, message: 'User Updated Successfully' });
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.updateUser = updateUser;
const changeStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderIds, status } = req.body;
    if (!orderIds || !status)
        return next({ status: 400, message: 'Invalid params and query' });
    try {
        const assigns = yield prisma_1.prisma.order.updateMany({
            where: {
                id: {
                    in: orderIds
                }
            },
            data: {
                status
            }
        });
        (0, sendStatusEmails_1.SendStatusEmails)({ orderIds, status });
        res.send({ assigns, message: 'Changed Order Status' });
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.changeStatus = changeStatus;
const getComplaints = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const last_timestamp = req.query.last_timestamp || new Date(Date.now());
    const limit = req.query.limit || '15';
    try {
        const complaints = yield prisma_1.prisma.complaint.findMany({
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
        res.send({ complaints, message: 'Complaints Found' });
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.getComplaints = getComplaints;
const getFeedbacks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const last_timestamp = req.query.last_timestamp || new Date(Date.now());
    const limit = req.query.limit || '15';
    try {
        const feedbacks = yield prisma_1.prisma.feedback.findMany({
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
        res.send({ feedbacks, message: 'Feedbacks Found' });
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.getFeedbacks = getFeedbacks;
