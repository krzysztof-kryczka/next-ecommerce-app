export type PaginationProps = {
   currentPage: number
   totalPages: number
   setCurrentPage: (page: number | ((prev: number) => number)) => void
   getPaginationButtons: (currentPage: number, totalPages: number) => (string | number)[]
}
