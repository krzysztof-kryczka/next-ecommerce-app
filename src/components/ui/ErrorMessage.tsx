import Text from '@/components/ui/text'
import ErrorIcon from '@/components/icons/ErrorIcon'
import { ErrorMessageProps } from '@/types/ErrorMessageProps'

function ErrorMessage({ sectionName, errorDetails }: ErrorMessageProps) {
   return (
      <Text
         as='p'
         variant='textMmedium'
         className='flex items-center gap-x-4 rounded-md border-2 border-red-600 bg-red-100 px-6 py-4 text-lg font-semibold text-red-600 shadow-lg'
      >
         <ErrorIcon />
         Unable to Load {sectionName}
         {errorDetails && (
            <>
               <br />
               {errorDetails}
            </>
         )}
      </Text>
   )
}

export default ErrorMessage
