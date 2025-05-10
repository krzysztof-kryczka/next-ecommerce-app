import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { Item } from '@/types/Item'
import { exchangeRates } from '@/utils/exchangeRates'
import { handleError } from '@/lib/helpers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' })

const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
   if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) return amount
   const baseValue = amount / exchangeRates[fromCurrency]
   return Math.round(baseValue * exchangeRates[toCurrency] * 100)
}

export async function POST(req: Request) {
   try {
      const body = await req.json()

      const {
         items,
         currency = 'USD',
         productProtectionPrice,
         shippingPrice,
         shippingInsurancePrice,
         serviceFees,
      } = body

      const lineItems = [
         ...items.map((item: Item) => ({
            price_data: {
               currency,
               product_data: { name: item.name },
               unit_amount: convertCurrency(item.price, 'USD', currency),
            },
            quantity: item.quantity,
         })),
         {
            price_data: {
               currency,
               product_data: { name: 'Product Protection' },
               unit_amount: convertCurrency(productProtectionPrice, 'USD', currency),
            },
            quantity: 1,
         },
         {
            price_data: {
               currency,
               product_data: { name: 'Shipping Price' },
               unit_amount: convertCurrency(shippingPrice, 'USD', currency),
            },
            quantity: 1,
         },
         {
            price_data: {
               currency,
               product_data: { name: 'Shipping Insurance' },
               unit_amount: convertCurrency(shippingInsurancePrice, 'USD', currency),
            },
            quantity: 1,
         },
         {
            price_data: {
               currency,
               product_data: { name: 'Service Fees' },
               unit_amount: convertCurrency(serviceFees, 'USD', currency),
            },
            quantity: 1,
         },
      ]

      const session = await stripe.checkout.sessions.create({
         payment_method_types: ['card'],
         line_items: lineItems,
         mode: 'payment',
         success_url: `${req.headers.get('origin')}/payment-success?sessionId={CHECKOUT_SESSION_ID}`,
         cancel_url: `${req.headers.get('origin')}/payment-failed`,
         metadata: {
            currency,
            products: JSON.stringify(items),
            payment_method: 'Stripe (Credit Card)',
            shipping_method: 'NexusHub Courier',
            additional_charges: JSON.stringify({
               productProtectionPrice,
               shippingPrice,
               shippingInsurancePrice,
               serviceFees,
            }),
         },
      })

      return NextResponse.json({ id: session.id })
   } catch (error) {
      return handleError(error)
   }
}
