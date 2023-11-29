import { Router } from 'express'
const router = Router();
import { autheticateUser, logout } from '../controllers/userControllers';
import expressAsyncHandler from 'express-async-handler';
import { verifyUser, verifyAdmin, verifyAgent } from '../middlewares/authMiddleware';

import userRoutes from './user.routes';
import productRoutes from './product.routes';
import adminRoutes from './admin.routes';
import orderRoutes from './order.routes';
import agentRoutes from './agent.routes';
// import userRoutes from './routes/users';
// import orderRoutes from './routes/orders';

router.post('/authenticate', expressAsyncHandler(autheticateUser))
router.get('/logout', expressAsyncHandler(logout))

router.use('/users', verifyUser, userRoutes);
router.use('/products', productRoutes);
router.use('/admin', verifyAdmin, adminRoutes)
router.use('/agent', verifyAgent, agentRoutes)
router.use('/orders', verifyUser, orderRoutes)
// app.use('/orders', authMiddleware, orderRoutes)


export default router;