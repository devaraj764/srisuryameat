import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import {  getAssigns, orderDelivered, sendOtp } from '../controllers/agentControllers';

const router = Router();

router.get('/get-assigns/:query', expressAsyncHandler(getAssigns));
router.get('/send-otp/:orderId', expressAsyncHandler(sendOtp));
router.patch('/order-delivered', expressAsyncHandler(orderDelivered));

export default router;