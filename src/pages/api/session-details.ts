import Stripe from 'stripe'
import { NextApiRequest, NextApiResponse } from 'next'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
   apiVersion: '2025-03-31.basil',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   const { sessionId } = req.query

   if (!sessionId) {
      res.status(400).json({ error: 'Session ID is required' })
      return
   }

   try {
      const session = await stripe.checkout.sessions.retrieve(sessionId as string)
      const paymentMethod = session.metadata.payment_method || 'Not specified'
      const shippingMethod = session.metadata.shipping_method || 'Not specified'
      const paymentIntentId = session.payment_intent as string

      res.status(200).json({
         paymentIntentId,
         created: session.created,
         amount_total: session.amount_total,
         paymentMethod,
         shippingMethod,
      })
   } catch (error) {
      console.error(`Error retrieving session details: ${error}`)
      res.status(500).json({ error: 'Failed to retrieve session details' })
   }
}
