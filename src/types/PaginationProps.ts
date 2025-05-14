export type PaginationProps = {
   currentPage: number
   totalPages: number
   // setCurrentPage: (page: number | ((prev: number) => number)) => void
   setCurrentPage: React.Dispatch<React.SetStateAction<number>>
   getPaginationButtons: (currentPage: number, totalPages: number) => (string | number)[]
}
