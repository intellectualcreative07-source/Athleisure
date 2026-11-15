import { formatInr } from '../data/catalog';
import type { CartItem, UnisexSize } from '../types/store';

const DEFAULT_WHATSAPP_NUMBER = '919876543210';

export function getWhatsAppNumber(): string {
  const configured = import.meta.env.VITE_WHATSAPP_NUMBER;
  if (typeof configured === 'string' && /^\d{8,15}$/.test(configured.trim())) {
    return configured.trim();
  }
  return DEFAULT_WHATSAPP_NUMBER;
}

export function buildWhatsAppUrl(message: string): string {
  const phone = getWhatsAppNumber();
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export function buildProductWhatsAppUrl(
  productName: string,
  colorName: string,
  size: UnisexSize,
  quantity: number,
  totalInr: number
): string {
  const msg = `Hi Stylesse team! I'd like to inquire / order:\n• Item: ${productName}\n• Color: ${colorName}\n• Unisex Size: ${size}\n• Quantity: ${quantity}\n• Listed Total: ${formatInr(totalInr)}\nPlease assist me with this order.`;
  return buildWhatsAppUrl(msg);
}

export function buildCartWhatsAppUrl(
  items: CartItem[],
  promoCode: string | null,
  discountInr: number,
  shippingInr: number,
  totalInr: number
): string {
  const lines = items.map(
    (item, index) =>
      `${index + 1}. ${item.name} (${item.colorName}, Size ${item.size}) × ${item.quantity} — ${formatInr(
        item.unitPriceInr * item.quantity
      )}`
  );

  const summaryParts = [
    `Hi Stylesse! I'd like to place my order via WhatsApp:`,
    '',
    ...lines,
    '',
    promoCode && discountInr > 0
      ? `Promo Applied (${promoCode}): -${formatInr(discountInr)}`
      : null,
    `Shipping: ${shippingInr === 0 ? 'Free Express' : formatInr(shippingInr)}`,
    `Total Payable: ${formatInr(totalInr)}`,
    '',
    `Please confirm availability and Cash on Delivery / UPI payment link.`,
  ].filter((part): part is string => part !== null);

  return buildWhatsAppUrl(summaryParts.join('\n'));
}

export function buildOrderSupportWhatsAppUrl(orderId: string): string {
  const msg = `Hi Stylesse team! I'd like an update or assistance regarding my order ${orderId}.`;
  return buildWhatsAppUrl(msg);
}

export function buildChatHandoffWhatsAppUrl(
  messages: { role: 'user' | 'model'; text: string }[]
): string {
  const userMessages = messages.filter((m) => m.role === 'user');
  const latestUserQuestion = userMessages[userMessages.length - 1]?.text;
  if (!latestUserQuestion) {
    return buildWhatsAppUrl(
      'Hi Stylesse! I have a question about sizing, AeroWeave fabrics, or placing an order.'
    );
  }
  const msg = `Hi Stylesse team! Continuing from your site assistant:\n"${latestUserQuestion}"`;
  return buildWhatsAppUrl(msg);
}
