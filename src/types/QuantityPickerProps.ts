export type QuantityPickerProps = {
   quantity: number
   setQuantity: React.Dispatch<React.SetStateAction<number>>
   stock: number
   showTitle?: boolean
   size?: 'md' | 'lg'
   hideStock?: boolean
}
