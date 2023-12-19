"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers_1 = require("../controllers/userControllers");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = (0, express_1.Router)();
router.get('/get-my-data', (0, express_async_handler_1.default)(userControllers_1.getUserData));
router.patch('/update-profile', (0, express_async_handler_1.default)(userControllers_1.updateUserDetails));
router.post('/add-address', (0, express_async_handler_1.default)(userControllers_1.addAddress));
router.post('/update-address/:addressId', (0, express_async_handler_1.default)(userControllers_1.updateAddress));
router.get('/get-addresses', (0, express_async_handler_1.default)(userControllers_1.getAllAddresses));
router.post('/create-complaint', (0, express_async_handler_1.default)(userControllers_1.createComplaint));
router.post('/send-feedback', (0, express_async_handler_1.default)(userControllers_1.sendFeedback));
router.delete('/cancel-order/:orderId', (0, express_async_handler_1.default)(userControllers_1.cancelOrder));
exports.default = router;
