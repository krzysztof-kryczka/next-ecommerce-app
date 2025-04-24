import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { Item } from '@/types/Item'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
   apiVersion: '2025-03-31.basil',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      try {
         const { items, productProtectionPrice, shippingPrice, shippingInsurancePrice, serviceFees } = req.body
         console.log('Request Body:', req.body)

         const lineItems = [
            ...items.map((item: Item) => ({
               price_data: {
                  currency: 'usd',
                  product_data: {
                     name: item.name,
                  },
                  unit_amount: Math.round(item.price * 100),
               },
               quantity: item.quantity,
            })),
            {
               price_data: {
                  currency: 'usd',
                  product_data: {
                     name: 'Product Protection',
                  },
                  unit_amount: Math.round(productProtectionPrice * 100),
               },
               quantity: 1,
            },
            {
               price_data: {
                  currency: 'usd',
                  product_data: {
                     name: 'Shipping Price',
                  },
                  unit_amount: Math.round(shippingPrice * 100),
               },
               quantity: 1,
            },
            {
               price_data: {
                  currency: 'usd',
                  product_data: {
                     name: 'Shipping Insurance',
                  },
                  unit_amount: Math.round(shippingInsurancePrice * 100),
               },
               quantity: 1,
            },
            {
               price_data: {
                  currency: 'usd',
                  product_data: {
                     name: 'Service Fees',
                  },
                  unit_amount: Math.round(serviceFees * 100),
               },
               quantity: 1,
            },
         ]

         const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${req.headers.origin}/payment-success?sessionId={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/payment-failed`,
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

         res.status(200).json({ id: session.id })
      } catch (err) {
         console.error('Error creating Stripe session:', err)
         res.status(500).json({ error: 'Something went wrong', details: err.message })
      }
   } else {
      console.log('Invalid Request Method:', req.method)
      res.setHeader('Allow', 'POST')
      res.status(405).end('Method Not Allowed')
   }
}
