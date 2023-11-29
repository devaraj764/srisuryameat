import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { createOrder, getActiveOrders, getMyOrders, getOrders,  } from '../controllers/orderControllers';

const router = Router();

router.get('/get-my-orders', expressAsyncHandler(getMyOrders));
router.get('/all', expressAsyncHandler(getOrders));
router.get('/active', expressAsyncHandler(getActiveOrders))
router.post('/create', expressAsyncHandler(createOrder));

export default router;