import { Address } from './Address'

export type MainAddressDisplayProps = {
   loading: boolean
   error: string | null
   addresses: Address[]
   onSelectAddress: (address: Address) => void
}
