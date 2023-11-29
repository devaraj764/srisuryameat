import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { assignOrder, changeStatus, getAgents, getAllUsers, getComplaints, getFeedbacks, updateUser } from '../controllers/adminControllers';
import { createManyProducts, createProduct } from '../controllers/productController';

const router = Router();

router.get('/get-all-users', expressAsyncHandler(getAllUsers));
router.get('/get-agents', expressAsyncHandler(getAgents));
router.post('/assign-agent', expressAsyncHandler(assignOrder));
router.patch('/update-user/:userId', expressAsyncHandler(updateUser))
router.post('/products/create', expressAsyncHandler(createProduct));
router.post('/products/create-many', expressAsyncHandler(createManyProducts))
router.patch('/order/change-status', expressAsyncHandler(changeStatus))
router.get('/get-complaints', expressAsyncHandler(getComplaints))
router.get('/get-feedbacks', expressAsyncHandler(getFeedbacks))

export default router;