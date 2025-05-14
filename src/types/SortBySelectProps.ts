import { SortByOptions } from '../enum/SortByOptions'

export type SortBySelectProps = {
   sortBy: SortByOptions
   setSortBy: (value: SortByOptions) => void
}
