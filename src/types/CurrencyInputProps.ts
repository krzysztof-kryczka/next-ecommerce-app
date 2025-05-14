export type CurrencyInputProps = {
   value: string
   onChange: (newValue: string) => void
   placeholder?: string
   currency: string
   setCurrency: (newCurrency: string) => void
}
