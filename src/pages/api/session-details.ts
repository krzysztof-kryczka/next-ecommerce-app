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

      const additionalCharges = JSON.parse(session.metadata.additional_charges || '{}')
      const products = JSON.parse(session.metadata.products || '[]')

      console.log('Session Metadata:', session.metadata)
      console.log('Parsed Additional Charges:', additionalCharges)
      console.log('Parsed Products:', products)

      res.status(200).json({
         paymentIntentId: session.payment_intent as string,
         created: session.created,
         amount_total: session.amount_total,
         paymentMethod: session.metadata.payment_method || 'Not specified',
         shippingMethod: session.metadata.shipping_method || 'Not specified',
         productProtectionPrice: additionalCharges.productProtectionPrice || 0,
         shippingPrice: additionalCharges.shippingPrice || 0,
         shippingInsurancePrice: additionalCharges.shippingInsurancePrice || 0,
         serviceFees: additionalCharges.serviceFees || 0,
         products,
      })
   } catch (error) {
      console.error(`Error retrieving session details: ${error}`)
      res.status(500).json({ error: 'Failed to retrieve session details' })
   }
}
