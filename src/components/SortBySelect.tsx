import React, { JSX, memo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { SortBySelectProps } from '@/types/SortBySelectProps'

const SortBySelect = ({ sortBy, setSortBy }: SortBySelectProps): JSX.Element => {
   return (
      <Select value={sortBy} onValueChange={setSortBy}>
         <SelectTrigger className='px-4 py-2 text-sm font-medium' aria-label='Sort products'>
            {sortBy === 'latest' ? 'Latest' : sortBy === 'price_asc' ? 'Ascending' : 'Descending'}
         </SelectTrigger>
         <SelectContent>
            <SelectItem value='latest'>Latest</SelectItem>
            <SelectItem value='price_asc'>Ascending</SelectItem>
            <SelectItem value='price_desc'>Descending</SelectItem>
         </SelectContent>
      </Select>
   )
}

export default memo(SortBySelect)
