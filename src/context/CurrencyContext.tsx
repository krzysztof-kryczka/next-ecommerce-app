'use client'

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { exchangeRates } from '@/utils/exchangeRates'

const currencySymbols: Record<string, string> = {
   USD: '$',
   EUR: '€',
   GBP: '£',
   PLN: 'zł',
}

export const convertCurrency = (amount: string, fromCurrency: string, toCurrency: string): number => {
   const amountNum = parseFloat(amount)
   if (isNaN(amountNum)) return 0
   const baseValue = amountNum / exchangeRates[fromCurrency]
   return parseFloat((baseValue * exchangeRates[toCurrency]).toFixed(2))
}

type CurrencyContextType = {
   currency: string
   setCurrency: (newCurrency: string) => void
   convertCurrency: (amount: string, fromCurrency: string, toCurrency: string) => string
   currencySymbols: Record<string, string>
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
   const [currency, setCurrency] = useState<string>(localStorage.getItem('currency') || 'USD')

   useEffect(() => {
      localStorage.setItem('currency', currency)
   }, [currency])

   return (
      <CurrencyContext.Provider value={{ currency, setCurrency, convertCurrency, currencySymbols }}>
         {children}
      </CurrencyContext.Provider>
   )
}

export const useCurrency = () => {
   const context = useContext(CurrencyContext)
   if (!context) {
      throw new Error('useCurrency must be used within a CurrencyProvider')
   }
   return context
}
