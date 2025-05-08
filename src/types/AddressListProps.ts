import { Address } from './Address'

export type AddressListProps = {
   addresses: Address[]
   onEdit?: (address: Address) => void
   onDelete?: (id: Number) => void
   onSelect?: (address: Address) => void
   selectedAddress?: Address | null
   variant?: 'list' | 'dialog'
}
