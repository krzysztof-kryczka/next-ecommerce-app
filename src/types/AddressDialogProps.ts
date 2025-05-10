import { Address } from './Address'

export type AddressDialogProps = {
   addresses: Address[]
   onSelectAddress: (address: Address) => void
}
