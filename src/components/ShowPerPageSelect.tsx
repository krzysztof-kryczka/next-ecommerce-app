import React, { JSX } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { ShowPerPageSelectProps } from '@/types/ShowPerPageSelectProps'

const ShowPerPageSelect = ({ showPerPage, setShowPerPage, setCurrentPage }: ShowPerPageSelectProps): JSX.Element => {
   return (
      <Select
         value={String(showPerPage)}
         onValueChange={value => {
            const newPageCount = Number(value)
            setShowPerPage(newPageCount)
            setCurrentPage(1)
         }}
      >
         <SelectTrigger className='px-4 py-2 text-sm font-medium'>{showPerPage}</SelectTrigger>
         <SelectContent>
            <SelectItem value='9'>9</SelectItem>
            <SelectItem value='12'>12</SelectItem>
            <SelectItem value='15'>15</SelectItem>
         </SelectContent>
      </Select>
   )
}

export default ShowPerPageSelect
