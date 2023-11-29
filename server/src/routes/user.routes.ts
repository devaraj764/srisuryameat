import { Router } from 'express';
import { updateUserDetails, getUserData, addAddress, getAllAddresses, createComplaint, sendFeedback, cancelOrder } from '../controllers/userControllers';
import expressAsyncHandler from 'express-async-handler';

const router = Router();

router.get('/get-my-data', expressAsyncHandler(getUserData))
router.patch('/update-profile', expressAsyncHandler(updateUserDetails))
router.post('/add-address', expressAsyncHandler(addAddress))
router.get('/get-addresses', expressAsyncHandler(getAllAddresses))
router.post('/create-complaint', expressAsyncHandler(createComplaint))
router.post('/send-feedback', expressAsyncHandler(sendFeedback))
router.delete('/cancel-order/:orderId', expressAsyncHandler(cancelOrder))

export default router;