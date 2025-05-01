import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { Item } from '@/types/Item'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' })

export async function POST(req: Request) {
   try {
      const { items, productProtectionPrice, shippingPrice, shippingInsurancePrice, serviceFees } = await req.json()
      const lineItems = [
         ...items.map((item: Item) => ({
            price_data: {
               currency: 'usd',
               product_data: { name: item.name },
               unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
         })),
         {
            price_data: {
               currency: 'usd',
               product_data: { name: 'Product Protection' },
               unit_amount: Math.round(productProtectionPrice * 100),
            },
            quantity: 1,
         },
         {
            price_data: {
               currency: 'usd',
               product_data: { name: 'Shipping Price' },
               unit_amount: Math.round(shippingPrice * 100),
            },
            quantity: 1,
         },
         {
            price_data: {
               currency: 'usd',
               product_data: { name: 'Shipping Insurance' },
               unit_amount: Math.round(shippingInsurancePrice * 100),
            },
            quantity: 1,
         },
         {
            price_data: {
               currency: 'usd',
               product_data: { name: 'Service Fees' },
               unit_amount: Math.round(serviceFees * 100),
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
   } catch (err) {
      if (err instanceof Error) {
         console.error('❌ Error creating Stripe session:', err.message)
         return NextResponse.json({ error: '🚨 Error creating Stripe session:', details: err.message }, { status: 500 })
      } else {
         console.error('🚨 Unknown error occurred:', err)
         return NextResponse.json({ error: '🚨 Unknown error occurred' }, { status: 400 })
      }
   }
}
