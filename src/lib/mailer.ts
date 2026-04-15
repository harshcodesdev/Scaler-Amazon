import { Resend } from 'resend';
import { formatINR } from './formatPrice';
import { prisma } from './prisma';

// Replace string to prevent errors if not set
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

export async function sendOrderEmail(
  email: string,
  orderId: string,
  name: string,
  address: string
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log('[EMAIL NOT CONFIGURED] Skipping order email dispatch.');
      return;
    }

    const fullOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!fullOrder || fullOrder.items.length === 0) {
      console.error('[EMAIL ERROR] Order not found or has no items:', orderId);
      return;
    }

    const itemsHtml = fullOrder.items.map(orderItem => `
      <div style='display: flex; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px;'>
        <img
          src='https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg'
          alt='Amazon'
          width='50'
          style='margin-right: 20px;'
        />
        <div>
          <p style='margin: 0 0 5px 0; color: #007185; font-size: 14px; font-weight: bold;'>${orderItem.product.title}</p>
          <p style='margin: 0 0 5px 0; color: #555; font-size: 13px;'>Quantity: ${orderItem.quantity}</p>
          <p style='margin: 0; font-size: 14px; font-weight: bold;'>${formatINR(orderItem.unitPrice)}</p>
        </div>
      </div>
    `).join('');

    const htmlBody = `
      <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f1111; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;'>

        <div style='background-color: #232f3e; color: white; padding: 15px; text-align: center; font-size: 14px;'>
          <span style='margin: 0 10px;'>Your <span style='color: #FF9900; font-weight: bold;'>Orders</span></span>
          <span style='margin: 0 10px;'>Your Account</span>
          <span style='margin: 0 10px;'>Buy Again</span>
        </div>

        <div style='padding: 30px;'>
          <h2 style='text-align: center; font-weight: normal; margin-top: 0;'>Thanks for your <span style='color: #FF9900; font-weight: bold;'>order</span>, ${name.split(' ')[0]}!</h2>

          <div style='display: flex; justify-content: space-between; align-items: center; margin: 25px 0; position: relative;'>
            <div style='height: 4px; background: #007185; position: absolute; z-index: 1; top: 8px; left: 10%; right: 50%;'></div>
            <div style='height: 4px; background: #e7e7e7; position: absolute; z-index: 0; top: 8px; left: 10%; right: 10%;'></div>

            <div style='text-align: center; z-index: 2; width: 25%;'>
              <div style='width: 20px; height: 20px; border-radius: 50%; background: #007185; margin: 0 auto 5px;'></div>
              <span style='font-size: 12px; font-weight: bold;'>Ordered</span>
            </div>
            <div style='text-align: center; z-index: 2; width: 25%;'>
              <div style='width: 20px; height: 20px; border-radius: 50%; background: #e7e7e7; margin: 0 auto 5px;'></div>
              <span style='font-size: 12px; color: #555;'>Shipped</span>
            </div>
            <div style='text-align: center; z-index: 2; width: 25%;'>
               <div style='width: 20px; height: 20px; border-radius: 50%; background: #e7e7e7; margin: 0 auto 5px;'></div>
               <span style='font-size: 12px; color: #555;'>Out for delivery</span>
            </div>
            <div style='text-align: center; z-index: 2; width: 25%;'>
               <div style='width: 20px; height: 20px; border-radius: 50%; background: #e7e7e7; margin: 0 auto 5px;'></div>
               <span style='font-size: 12px; color: #555;'>Delivered</span>
            </div>
          </div>

          <hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;' />

          <div style='margin-bottom: 20px;'>
            <h3 style='margin: 0 0 5px 0; font-size: 18px;'>Arriving soon</h3>
            <p style='margin: 0; font-size: 14px; color: #555;'>Ordered on <span style='font-weight: bold; color: #FF9900;'>Amazon</span></p>
          </div>

          <div style='font-size: 14px; line-height: 1.5; margin-bottom: 20px;'>
            <p style='margin: 0; font-weight: bold;'>${name} &ndash; ${address.toUpperCase()}</p>
            <p style='margin: 0;'><span style='color: #FF9900; font-weight: bold;'>Order</span> # ${orderId}</p>
          </div>

          <div style='margin-bottom: 30px;'>
             <a href='${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/orders/${orderId}' style='background-color: #FFD814; color: #0f1111; text-decoration: none; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: bold; border: 1px solid #FCD200; display: inline-block;'>View or edit <span style='font-weight: normal;'>order</span></a>
          </div>

          ${itemsHtml}

          <div style='display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; margin-top: 20px;'>
            <span>Total</span>
            <span>${formatINR(fullOrder.total)}</span>
          </div>

        </div>

        <div style='background-color: #f3f3f3; padding: 20px; text-align: center; font-size: 12px; color: #555;'>
          &copy; ${new Date().getFullYear()} <span style='font-weight: bold; color: #FF9900;'>Amazon</span>.com, Inc. or its affiliates. All rights reserved.
        </div>
      </div>
    `;

    const data = await resend.emails.send({
      from: 'Amazon <harsh-amazon@support.nippongo.app>',
      to: [email],
      subject: `Amazon - Order Confirmation for ${fullOrder.items[0].product.title.substring(0, 30)}...`,
      html: htmlBody,
    });
    console.log('[EMAIL SENT] Order confirmation sent to', email, data);
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send order email:', error);
  }
}

export async function sendOtpEmail(email: string, code: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log(`[EMAIL NOT CONFIGURED] Mock OTP: ${code}`);
      return;
    }

    const data = await resend.emails.send({
      from: 'Amazon <harsh-amazon@support.nippongo.app>',
      to: [email],
      subject: 'Your OTP Verification Code',
      html: `
        <div style='font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; color: #0f1111; border: 1px solid #ddd; border-radius: 8px;'>
          <h2 style='font-weight: normal; margin-top: 0;'>Verify your email address</h2>
          <p style='font-size: 15px; line-height: 1.6;'>Your One-Time Password (OTP) is:</p>
          <div style='font-size: 32px; font-weight: bold; letter-spacing: 0.3em; text-align: center; padding: 20px; background: #f3f3f3; border-radius: 8px; margin: 20px 0;'>${code}</div>
          <p style='font-size: 13px; color: #555;'>This code expires in <strong>10 minutes</strong>. If you didn&apos;t request this, you can safely ignore this email.</p>
        </div>
      `,
    });
    console.log('[EMAIL SENT] OTP sent to', email, data);
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send OTP email:', error);
  }
}