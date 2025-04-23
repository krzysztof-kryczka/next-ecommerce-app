import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { Item } from '@/types/Item'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
   apiVersion: '2025-03-31.basil',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      try {
         const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: req.body.items.map((item: Item) => ({
               price_data: {
                  currency: 'usd',
                  product_data: {
                     name: item.name,
                  },
                  unit_amount: item.price * 100,
               },
               quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${req.headers.origin}/payment-success?sessionId={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/payment-failed`,
            metadata: {
               payment_method: 'Stripe (Credit Card)',
               shipping_method: 'NexusHub Courier',
            },
         })

         res.status(200).json({ id: session.id })
      } catch (err) {
         res.status(500).json({ error: 'Something went wrong' })
      }
   } else {
      res.setHeader('Allow', 'POST')
      res.status(405).end('Method Not Allowed')
   }
}
