import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'

const ShowPerPageSelect: React.FC<{
   showPerPage: number
   setShowPerPage: (value: number) => void
   setCurrentPage: (value: number) => void
}> = ({ showPerPage, setShowPerPage, setCurrentPage }) => {
   return (
      <Select
         value={String(showPerPage)}
         onValueChange={value => {
            setShowPerPage(Number(value))
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
