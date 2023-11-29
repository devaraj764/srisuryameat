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
exports.SendStatusEmails = void 0;
const prisma_1 = require("../config/prisma");
const html_templets_1 = require("./html_templets");
function SendStatusEmails({ orderIds, status }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const orders = yield prisma_1.prisma.order.findMany({
                where: {
                    id: { in: orderIds }
                },
                include: {
                    user: {
                        select: {
                            email: true
                        }
                    }
                }
            });
            for (let order of orders) {
                const emails = [order.user.email];
                const subject = `Order ${status}! ID: ${order.id}`;
                yield (0, html_templets_1.sendOrderHtml)({ order, emails, subject });
            }
            console.log('Done sending emails');
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.SendStatusEmails = SendStatusEmails;
