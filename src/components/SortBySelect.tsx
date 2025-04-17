import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { SortByOptions } from '@/types/SortByOptions'

const SortBySelect: React.FC<{
   sortBy: SortByOptions
   setSortBy: (value: SortByOptions) => void
}> = ({ sortBy, setSortBy }) => {
   return (
      <Select value={sortBy} onValueChange={setSortBy}>
         <SelectTrigger className='px-4 py-2 text-sm font-medium'>
            {sortBy === 'latest' ? 'Latest' : sortBy === 'price_asc' ? 'Descending' : 'Ascending'}
         </SelectTrigger>
         <SelectContent>
            <SelectItem value='latest'>Latest</SelectItem>
            <SelectItem value='price_asc'>Ascending</SelectItem>
            <SelectItem value='price_desc'>Descending</SelectItem>
         </SelectContent>
      </Select>
   )
}

export default SortBySelect
