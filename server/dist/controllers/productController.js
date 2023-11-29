"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toogleWishlist = exports.removeFromCart = exports.addToCart = exports.getWishlistProducts = exports.getCartProducts = exports.updateProduct = exports.deleteProduct = exports.getProductById = exports.getProducts = exports.createManyProducts = exports.createProduct = void 0;
const prisma_1 = require("../config/prisma");
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { product } = req.body;
    try {
        const result = yield prisma_1.prisma.product.create({
            data: product
        });
        if (result) {
            res.send({ message: 'Successfully created product', result });
        }
        else {
            next({ status: 400, message: 'Error creating product' });
        }
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.createProduct = createProduct;
const createManyProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { products } = req.body;
    try {
        const result = yield prisma_1.prisma.product.createMany({
            data: products
        });
        if (result) {
            res.send({ message: 'Successfully uploaded products', result });
        }
        else {
            next({ status: 400, message: 'Error uploading products' });
        }
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.createManyProducts = createManyProducts;
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const category = ((_a = req.query.category) === null || _a === void 0 ? void 0 : _a.toString()) || 'all';
    const name = ((_b = req.query.productName) === null || _b === void 0 ? void 0 : _b.toString()) || '';
    console.log(name);
    try {
        const products = yield prisma_1.prisma.product.findMany({
            where: Object.assign(Object.assign({}, (category !== 'all' ? { category } : {})), (name !== '' ? {
                name: {
                    contains: name
                }
            } : {})),
            select: {
                id: true,
                name: true,
                description: true,
                thumbnail: true,
                prices: true,
                category: true,
                createdAt: true,
                updatedAt: true,
                ordersCount: true,
                inStock: true
            }
        });
        res.send({ products, message: 'Products list' });
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        next({ status: 400, message: 'Id is not sent' });
    try {
        const product = yield prisma_1.prisma.product.findUnique({ where: { id } });
        if (!product)
            next({ status: 404, message: 'Product not found' });
        res.send({ product, message: 'Product found' });
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.getProductById = getProductById;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        next({ status: 400, message: 'Id is not sent' });
    try {
        const product = yield prisma_1.prisma.product.delete({ where: { id } });
        if (!product)
            next({ status: 404, message: 'Product not found' });
        res.send({ product, message: 'Product Deleted' });
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.deleteProduct = deleteProduct;
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    if (!id)
        next({ status: 400, message: 'Id is not sent' });
    try {
        const product = yield prisma_1.prisma.product.update({ where: { id }, data });
        if (!product)
            next({ status: 404, message: 'Product not found' });
        res.send({ product, message: 'Product Updated' });
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.updateProduct = updateProduct;
const getCartProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id;
    try {
        const products = yield prisma_1.prisma.cart.findMany({
            where: {
                userId: id
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        thumbnail: true,
                        prices: true,
                        category: true,
                        createdAt: true,
                        updatedAt: true,
                        ordersCount: true
                    }
                }
            },
        });
        res.send({ products, message: 'Cart Products list' });
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.getCartProducts = getCartProducts;
const getWishlistProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id;
    try {
        const products = yield prisma_1.prisma.wishlist.findMany({
            where: {
                userId: id
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        thumbnail: true,
                        prices: true,
                        category: true,
                        createdAt: true,
                        updatedAt: true,
                        ordersCount: true
                    }
                }
            },
        });
        res.send({ products, message: 'Wishlist Products list' });
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.getWishlistProducts = getWishlistProducts;
const addToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id || '';
    const { productId, quantity, units, price } = req.body;
    if (!productId || !quantity || !units || !price)
        next({ status: 400, message: "Invalid data input" });
    try {
        const isProduct = yield prisma_1.prisma.product.findUnique({ where: { id: productId } });
        if (!isProduct)
            next({ status: 404, message: "Product Not Found" });
        const cartItem = yield prisma_1.prisma.cart.upsert({
            where: { cartId: { userId: id, productId } },
            update: { quantity, units, price },
            create: Object.assign(Object.assign({}, req.body), { userId: id })
        });
        if (!cartItem)
            next({ status: 404, message: 'Error adding product to cart' });
        res.send({ cartItem, message: `${isProduct === null || isProduct === void 0 ? void 0 : isProduct.name} is added to Cart` });
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.addToCart = addToCart;
const removeFromCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.id || '';
    const productId = req.params.productId;
    if (!productId)
        next({ status: 400, message: "Invalid data input" });
    try {
        yield prisma_1.prisma.cart.delete({ where: { cartId: { userId, productId } } });
        res.send({ message: `Item removed from cart` });
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.removeFromCart = removeFromCart;
const toogleWishlist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id || '';
    const { productId } = req.params;
    const { action } = req.query;
    console.log(action);
    if (!productId || id === '')
        next({ status: 400, message: "Invalid data input" });
    if (!action)
        next({ status: 400, message: "Action should be sent.. add or remove" });
    try {
        const isProduct = yield prisma_1.prisma.product.findUnique({ where: { id: productId } });
        if (!isProduct)
            next({ status: 404, message: "Product Not Found" });
        if (action === "add") {
            const wishItem = yield prisma_1.prisma.wishlist.create({ data: { productId, userId: id } });
            if (!wishItem)
                next({ status: 404, message: 'Error adding product to wishlist' });
            res.send({ wishItem, message: `${isProduct === null || isProduct === void 0 ? void 0 : isProduct.name} Added to Wishlist` });
        }
        else if (action === "remove") {
            const unWishItem = yield prisma_1.prisma.wishlist.delete({ where: { wishlistId: { productId, userId: id } } });
            if (!unWishItem)
                next({ status: 404, message: 'Error removing from wishlist' });
            res.send({ message: `${isProduct === null || isProduct === void 0 ? void 0 : isProduct.name} Removed from Wishlist` });
        }
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.toogleWishlist = toogleWishlist;
