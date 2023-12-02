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
exports.verifyAgent = exports.verifyAdmin = exports.verifyUser = void 0;
const jwt_1 = require("../helpers/jwt");
const prisma_1 = require("../config/prisma");
const verifyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token)
            return res.status(401).json({ message: 'Authentication failed! Token not found' });
        const decoded = yield (0, jwt_1.verifyToken)(token);
        const user = yield prisma_1.prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user)
            return res.status(401).json({ message: 'Authentication failed! User not found' });
        req.id = decoded.id;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Authentication failed.' });
    }
});
exports.verifyUser = verifyUser;
const verifyAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const token = (_b = req.headers['authorization']) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
        if (!token)
            return res.status(401).json({ message: 'Authentication failed! Token not found' });
        const decoded = yield (0, jwt_1.verifyToken)(token);
        const user = yield prisma_1.prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user || user.role !== 'admin')
            return res.status(401).json({ message: 'Authentication failed! User not found' });
        req.id = decoded.id;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Authentication failed.' });
    }
});
exports.verifyAdmin = verifyAdmin;
const verifyAgent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const token = (_c = req.headers['authorization']) === null || _c === void 0 ? void 0 : _c.split(' ')[1];
        if (!token)
            return res.status(401).json({ message: 'Authentication failed! Token not found' });
        const decoded = yield (0, jwt_1.verifyToken)(token);
        const user = yield prisma_1.prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user || user.role !== 'agent')
            return res.status(401).json({ message: 'Authentication failed! User not found' });
        req.id = decoded.id;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Authentication failed.' });
    }
});
exports.verifyAgent = verifyAgent;
