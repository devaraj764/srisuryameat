"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const orderControllers_1 = require("../controllers/orderControllers");
const router = (0, express_1.Router)();
router.get('/get-my-orders', (0, express_async_handler_1.default)(orderControllers_1.getMyOrders));
router.get('/all', (0, express_async_handler_1.default)(orderControllers_1.getOrders));
router.get('/active', (0, express_async_handler_1.default)(orderControllers_1.getActiveOrders));
router.post('/create', (0, express_async_handler_1.default)(orderControllers_1.createOrder));
exports.default = router;
