import { z } from "zod";

export const createShippingAddressSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email deve ter um formato válido"),
  fullName: z
    .string()
    .min(1, "Nome completo é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres"),
  document: z
    .string()
    .min(1, "Documento é obrigatório")
    .refine((val) => {
      const cleanVal = val.replace(/\D/g, "");
      return cleanVal.length === 11 || cleanVal.length === 14;
    }, "CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos"),
  phone: z
    .string()
    .min(1, "Celular é obrigatório")
    .refine((val) => {
      const cleanVal = val.replace(/\D/g, "");
      return cleanVal.length === 11;
    }, "Celular deve ter 11 dígitos"),
  zipCode: z
    .string()
    .min(1, "CEP é obrigatório")
    .refine((val) => {
      const cleanVal = val.replace(/\D/g, "");
      return cleanVal.length === 8;
    }, "CEP deve ter 8 dígitos"),
  address: z
    .string()
    .min(1, "Endereço é obrigatório")
    .min(5, "Endereço deve ter pelo menos 5 caracteres"),
  number: z
    .string()
    .min(1, "Número é obrigatório")
    .regex(/^\d+$/, "Número deve conter apenas dígitos"),
  complement: z.string().optional(),
  neighborhood: z
    .string()
    .min(1, "Bairro é obrigatório")
    .min(2, "Bairro deve ter pelo menos 2 caracteres"),
  city: z
    .string()
    .min(1, "Cidade é obrigatória")
    .min(2, "Cidade deve ter pelo menos 2 caracteres"),
  state: z
    .string()
    .min(1, "Estado é obrigatório")
    .min(2, "Estado deve ter pelo menos 2 caracteres")
    .max(2, "Estado deve ter no máximo 2 caracteres (UF)")
});

export type CreateShippingAddressSchema = z.infer<typeof createShippingAddressSchema>;
