import React, { JSX } from 'react'

const LoadingIndicator = (): JSX.Element => {
   return (
      <div className='flex h-full items-center justify-center'>
         <div className='h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-[var(--color-primary-400)]'></div>
      </div>
   )
}

export default LoadingIndicator
