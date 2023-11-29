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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderDelivered = exports.sendOtp = exports.getAssigns = void 0;
const prisma_1 = require("../config/prisma");
const generateOtp_1 = __importDefault(require("../helpers/generateOtp"));
const sendStatusEmails_1 = require("../helpers/sendStatusEmails");
const getAssigns = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const agentId = req.id || '';
    const limit = req.query.limit;
    const query = req.params.query;
    try {
        const assigns = yield prisma_1.prisma.assign.findMany({
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
        res.send({ assigns, message: 'Assigns Found' });
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.getAssigns = getAssigns;
const sendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.orderId;
    const otp = (0, generateOtp_1.default)();
    if (!orderId)
        return next({ message: 'Invalid Params', status: 400 });
    try {
        const assigns = yield prisma_1.prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                code: otp
            }
        });
        (0, sendStatusEmails_1.SendStatusEmails)({ orderIds: [orderId], status: 'Out for Delivery' });
        res.send({ assigns, message: 'Assigns Found' });
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.sendOtp = sendOtp;
const orderDelivered = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId, assignId, code } = req.body;
    console.log(req.body);
    if (!orderId || !assignId || !code)
        return next({ message: 'Invalid Params', status: 400 });
    try {
        const order = yield prisma_1.prisma.order.findUnique({
            where: {
                id: orderId
            },
            select: {
                code: true
            }
        });
        if (!order)
            return next({ message: 'Order Not found', status: 404 });
        if (code !== order.code)
            return next({ message: 'Code doesnot match', status: 400 });
        yield prisma_1.prisma.order.update({ where: { id: orderId }, data: { status: 'delivered' } });
        yield prisma_1.prisma.assign.update({ where: { id: assignId }, data: { isCompleted: true } });
        // send mail
        (0, sendStatusEmails_1.SendStatusEmails)({ orderIds: [orderId], status: 'delivered' });
        res.send({ message: 'Order delivered' });
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.orderDelivered = orderDelivered;
