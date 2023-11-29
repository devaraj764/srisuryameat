import { Order } from "@prisma/client";
import { sendMails } from "./mailer";

const generateItemsTable = (items: any) => {
    return items.map((item: any) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.units}</td> 
        <td>${item.price}</td>
      </tr>
    `
    ).join('')
};

// Function to create HTML for order placed
export async function sendOrderHtml({ order, subject, emails }: { order: Order, subject: string, emails: string[] }) {
    try {
        const itemsTable = generateItemsTable(order.items)
        const html = `
        <html>
        <head>
        <style>
        /* CSS styles for the order details */
    
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333;
            }
            p {
              margin: 10px 0;
            }
            .order-details {
              border-top: 2px solid #ccc;
              padding-top: 10px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${subject}</h1>
            <div class="order-details">
              ${(order?.status === 'out_for_delivery' && order?.code)? `<h3>OTP: ${order?.code}</h3>` : ''}
              <p><strong>Order ID:</strong> ${order.id}</p>
              <p><strong>Status:</strong> <span style="font-size:18px;color:green;font-weight:bold;">${order.status}</span></p>
              <p><strong>Created At:</strong> ${order.createdAt}</p>
              <p><strong>Number of Items:</strong> ${order.items.length}</p>
              <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Units</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsTable}
              </tbody>
            </table>
              <p><strong>Amount to be Paid:</strong> <span style="font-size:20px">Rs ${order.totalPrice}/-</span></p>
              <p>Thank you for shopping with us!</p>
            </div>
          </div>
        </body>
      </html>
        `;
        await sendMails(subject, html, emails)
    }
    catch (err: any) {
        throw new Error(err.message)
    }
    
}