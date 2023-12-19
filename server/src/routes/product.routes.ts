import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { addToCart, toogleWishlist, createManyProducts, createProduct, deleteProduct, getProductById, getProducts, updateProduct, getCartProducts, getWishlistProducts, removeFromCart } from '../controllers/productController';
import { verifyAdmin, verifyUser } from '../middlewares/authMiddleware';

const router = Router();

router.post('/create', verifyAdmin, expressAsyncHandler(createProduct));
router.post('/create-many', verifyAdmin, expressAsyncHandler(createManyProducts))
router.get('/all', expressAsyncHandler(getProducts))
router.get('/wishlist', expressAsyncHandler(getWishlistProducts))
router.get('/cart', expressAsyncHandler(getCartProducts))
router.get('/:id', expressAsyncHandler(getProductById))
router.patch('/:id', verifyAdmin, expressAsyncHandler(updateProduct))
router.post('/add-to-cart', verifyUser, expressAsyncHandler(addToCart))
router.delete('/remove-cart-item/:productId', verifyUser, expressAsyncHandler(removeFromCart))
router.patch('/toogle-wishlist/:productId', verifyUser, expressAsyncHandler(toogleWishlist))

export default router;