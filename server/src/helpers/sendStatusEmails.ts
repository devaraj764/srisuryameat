import { prisma } from "../config/prisma";
import { sendOrderHtml } from "./html_templets";

export async function SendStatusEmails({ orderIds, status }: { orderIds: string[], status: string }) {
    try {
        const orders = await prisma.order.findMany({
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
            await sendOrderHtml({ order, emails, subject })
        }

        console.log('Done sending emails')
    } catch (err) {
        console.log(err)
    }
}