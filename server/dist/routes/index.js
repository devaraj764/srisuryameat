"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const userControllers_1 = require("../controllers/userControllers");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const user_routes_1 = __importDefault(require("./user.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const admin_routes_1 = __importDefault(require("./admin.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const agent_routes_1 = __importDefault(require("./agent.routes"));
// import userRoutes from './routes/users';
// import orderRoutes from './routes/orders';
router.post('/authenticate', (0, express_async_handler_1.default)(userControllers_1.autheticateUser));
router.get('/logout', (0, express_async_handler_1.default)(userControllers_1.logout));
router.use('/users', authMiddleware_1.verifyUser, user_routes_1.default);
router.use('/products', product_routes_1.default);
router.use('/admin', authMiddleware_1.verifyAdmin, admin_routes_1.default);
router.use('/agent', authMiddleware_1.verifyAgent, agent_routes_1.default);
router.use('/orders', authMiddleware_1.verifyUser, order_routes_1.default);
// app.use('/orders', authMiddleware, orderRoutes)
exports.default = router;
