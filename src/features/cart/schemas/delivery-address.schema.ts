import { z } from 'zod';

const optionalPosta = z
    .string()
    .max(10, 'En fazla 10 karakter')
    .optional()
    .or(z.literal(''));

export const deliveryAddressFormSchema = z.object({
    baslik: z
        .string()
        .min(2, 'Adres başlığı en az 2 karakter olmalı')
        .max(100, 'Adres başlığı en fazla 100 karakter olabilir'),
    teslimatAdres: z
        .string()
        .min(10, 'Açık adres en az 10 karakter olmalı')
        .max(2000, 'Açık adres çok uzun'),
    teslimatIl: z
        .string()
        .min(2, 'İl giriniz')
        .max(50, 'En fazla 50 karakter'),
    teslimatIlce: z
        .string()
        .min(2, 'İlçe giriniz')
        .max(50, 'En fazla 50 karakter'),
    teslimatPostaKodu: optionalPosta,
});

export type DeliveryAddressFormValues = z.infer<typeof deliveryAddressFormSchema>;
