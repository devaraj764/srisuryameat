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
exports.createProfile = exports.autheticateUser = void 0;
const prisma_1 = require("../config/prisma");
const autheticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.email || req.body.name)
        return res.status(400).send({ message: 'Invalid params' });
    try {
        const user = yield prisma_1.prisma.user.upsert({
            where: {
                email: req.body.email,
            },
            update: {},
            create: {
                email: req.body.email,
                name: req.body.name
            },
        });
        if (user) {
            res.send({ user, message: 'Successfully authenticated user' });
        }
        else {
            res.status(400).send({ message: 'Error authenticating user' });
        }
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.autheticateUser = autheticateUser;
const createProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.prisma.user.create({
            data: req.body
        });
        if (user) {
            res.send({ user, message: 'Successfully created user' });
        }
        else {
            res.status(400).send({ message: 'Error creating new user' });
        }
    }
    catch (err) {
        console.log(err);
        next({ message: err.message });
    }
});
exports.createProfile = createProfile;
