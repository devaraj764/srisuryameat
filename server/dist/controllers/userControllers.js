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
exports.cancelOrder = exports.sendFeedback = exports.createComplaint = exports.getAllAddresses = exports.addAddress = exports.updateUserDetails = exports.getUserData = exports.logout = exports.autheticateUser = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const prisma_1 = require("../config/prisma");
const jwt_1 = require("../helpers/jwt");
const sendStatusEmails_1 = require("../helpers/sendStatusEmails");
const autheticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.name)
        res.status(400).send({ message: 'Invalid params' });
    try {
        const user = yield prisma_1.prisma.user.upsert({
            where: {
                email: req.body.email,
            },
            update: {},
            create: Object.assign({}, req.body),
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
            const token = (0, jwt_1.createToken)({ id: user.id }, '30d');
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
                secure: process.env.NODE_ENV === 'production'
            }).send({ user, message: 'Successfully authenticated user', authToken: token });
        }
        else {
            res.status(400).send({ message: 'Error authenticating user' });
        }
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.autheticateUser = autheticateUser;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie('token', '', { httpOnly: true }).send({ message: 'Logged out' });
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.logout = logout;
const getUserData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.id;
        const user = yield prisma_1.prisma.user.findUnique({
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
            res.send({ user, message: 'User Found' });
        }
        else {
            res.status(400).send({ message: 'User Not found' });
        }
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.getUserData = getUserData;
const updateUserDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.id;
        const user = yield prisma_1.prisma.user.update({
            where: { id },
            data: req.body
        });
        if (user) {
            res.send({ user, message: 'Successfully updated profile' });
        }
        else {
            res.status(400).send({ message: 'Error creating new user' });
        }
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.updateUserDetails = updateUserDetails;
const addAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id || '';
    const { address1, city, pincode, state, country } = req.body;
    if (!address1 || !city || !pincode || !state || !country)
        next({ status: 400, message: "Invalid data payload" });
    try {
        const address = yield prisma_1.prisma.address.create({
            data: Object.assign(Object.assign({}, req.body), { userId: id })
        });
        if (!address)
            next({ status: 400, message: 'Error adding address' });
        yield prisma_1.prisma.user.update({
            where: { id },
            data: { currentAddressId: address.id }
        });
        res.send({ address, message: 'Address added successfully' });
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.addAddress = addAddress;
const getAllAddresses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id || '';
    try {
        const addresses = yield prisma_1.prisma.address.findMany({
            where: { userId: id }
        });
        if (!addresses)
            next({ status: 400, message: 'Error adding address' });
        res.send({ addresses, message: 'Address Found' });
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.getAllAddresses = getAllAddresses;
const createComplaint = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id || '';
    const { message, orderId } = req.body;
    if (!message || !orderId)
        return next({ status: 400, message: "Invalid Params" });
    try {
        const complaint = yield prisma_1.prisma.complaint.create({
            data: {
                userId: id,
                orderId,
                message
            }
        });
        res.send({ complaint, message: 'Complaint Raised' });
    }
    catch (error) {
        console.log(error);
        next({ message: error.message });
    }
});
exports.createComplaint = createComplaint;
const sendFeedback = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id || '';
    const { message } = req.body;
    if (!message)
        return next({ status: 400, message: "Invalid Params" });
    try {
        const feedback = yield prisma_1.prisma.feedback.create({
            data: {
                userId: id,
                message
            }
        });
        res.send({ feedback, message: 'Feedback Sent' });
    }
    catch (error) {
        console.log(error);
        next({ message: error.message });
    }
});
exports.sendFeedback = sendFeedback;
const cancelOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.id || '';
    const { orderId } = req.params;
    if (!orderId)
        return next({ status: 400, message: 'Invalid params' });
    try {
        const assigns = yield prisma_1.prisma.order.update({
            where: {
                id: orderId,
                userId: userId
            },
            data: {
                status: 'cancelled'
            }
        });
        (0, sendStatusEmails_1.SendStatusEmails)({ orderIds: [orderId], status: 'cancelled' });
        res.send({ assigns, message: 'Cancelled Order' });
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.cancelOrder = cancelOrder;
