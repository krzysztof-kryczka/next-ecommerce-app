import { z } from 'zod'

export const registerSchema = z
   .object({
      // name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
      email: z.string().email({ message: 'Invalid email address', }),
      phone: z.string().regex(/^[0-9]+$/, { message: 'Mobile number must only contain digits', }),
      country: z.string().min(2, { message: 'Country is required', }),
      password: z
         .string()
         .min(8, { message: 'Password must be at least 8 characters long', })
         .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter', })
         .regex(/[0-9]/, { message: 'Password must contain at least one digit', })
         .regex(/[@$!%*?&]/, { message: 'Password must contain at least one special character', }),
      repeatPassword: z.string(),
      terms: z.boolean().refine(val => val === true, { message: 'You must accept the terms and conditions', }),
   })
   .refine(data => data.password === data.repeatPassword, {
      message: 'Passwords must match',
      path: ['repeatPassword',],
   })

export type RegisterFormData = z.infer<typeof registerSchema>
