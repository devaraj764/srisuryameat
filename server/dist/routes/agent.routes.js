"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const agentControllers_1 = require("../controllers/agentControllers");
const router = (0, express_1.Router)();
router.get('/get-assigns/:query', (0, express_async_handler_1.default)(agentControllers_1.getAssigns));
router.get('/send-otp/:orderId', (0, express_async_handler_1.default)(agentControllers_1.sendOtp));
router.patch('/order-delivered', (0, express_async_handler_1.default)(agentControllers_1.orderDelivered));
exports.default = router;
