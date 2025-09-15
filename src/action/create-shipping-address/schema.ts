import { z } from "zod";

export const createShippingAddressSchema = z.object({
  email: z.email("E-mail inválido"),
  recipientName: z.string().min(1, "Nome completo é obrigatório"),
  nif: z.string().min(9, "NIF inválido"),
  telemovel: z.string().min(16, "Telemóvel inválido"),
  codigoPostal: z.string().min(4, "Código Postal inválido"),
  street: z.string().min(1, "Endereço é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  provincia: z.string().min(1, "Província é obrigatória"),
  city: z.string().min(1, "Cidade é obrigatória"),
  country: z.literal("Portugal"),
});

export type CreateShippingAddressSchema = z.infer<
  typeof createShippingAddressSchema
>;
