import { z } from 'zod'

export const AddressSchema = z.object({
   id: z.number().optional(),
   country: z.string().min(2, 'Country is required'),
   province: z.string().min(2, 'Province is required'),
   city: z.string().min(2, 'City is required'),
   postalCode: z.string().regex(/^\d{2}-\d{3}$/, 'Postal Code must be in format 00-000'),
   addressLine: z.string().min(5, 'Complete Address is required'),
   isMain: z.boolean().optional(),
})

export type AddressFormData = z.infer<typeof AddressSchema>
