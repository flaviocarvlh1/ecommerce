import { shippingAddressTable } from "@/db/schema";

type ShippingAddress = typeof shippingAddressTable.$inferSelect;

export const formatAddress = (address: ShippingAddress) => {
  return `${address.recipientName} • ${address.street}, ${address.number}${
    address.complement ? `, ${address.complement}` : ""
  }, ${address.provincia}, ${address.city} • CP: ${address.codigoPostal}`;
};
