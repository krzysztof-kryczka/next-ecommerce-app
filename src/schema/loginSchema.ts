import { z } from 'zod'

export const loginStepOneSchema = z.object({
   emailOrPhone: z
      .string()
      .min(1, { message: 'Email or phone number is required', })
      .regex(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$|^\+?[1-9]\d{1,14}$/, {
         message: 'Please enter a valid email address or phone number.',
      }),
})

export const loginStepTwoSchema = z.object({
   password: z.string().min(8, { message: 'Please enter your password. Password must be at least 8 characters long', }),
})