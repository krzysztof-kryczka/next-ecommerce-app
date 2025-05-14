import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { handleError } from '@/lib/helpers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' })

export async function GET(req: Request) {
   const { searchParams } = new URL(req.url)
   const sessionId = searchParams.get('sessionId')

   if (!sessionId) {
      return NextResponse.json({ error: '🚨 Session ID is required' }, { status: 400 })
   }

   try {
      const session = await stripe.checkout.sessions.retrieve(sessionId)

      if (!session.metadata) {
         return NextResponse.json({ error: '🚨 Metadata is missing in session' }, { status: 400 })
      }

      const additionalCharges = JSON.parse(session.metadata.additional_charges || '{}')
      const products = JSON.parse(session.metadata.products || '[]')

      return NextResponse.json({
         paymentIntentId: session.payment_intent as string,
         status: session.status as string,
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
      return handleError(error)
   }
}
