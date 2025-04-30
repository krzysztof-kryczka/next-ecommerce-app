import { z } from 'zod'

export const updateUserSchema = z.object({
   name: z.string().min(3, { message: 'Name must be at least 3 characters long' }).optional(),
   email: z.string().email({ message: 'Invalid email address' }).optional(),
   phone: z
      .string()
      .regex(/^[0-9]+$/, { message: 'Mobile number must only contain digits' })
      .optional(),
   country: z.string().min(2, { message: 'Country is required' }).optional(),
   password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one digit' })
      .regex(/[@$!%*?&]/, { message: 'Password must contain at least one special character' })
      .optional(),
})

export type UpdateUserFormData = z.infer<typeof updateUserSchema>
