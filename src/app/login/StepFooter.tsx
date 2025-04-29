import Text from '@/components/ui/text'
import { StepFooterProps } from '@/types/Auth'

export const StepFooter: React.FC<StepFooterProps> = ({ step, isSavePasswordChecked, handleSavePasswordChange }) => {
   if (step === 'email') {
      return (
         <Text as='p' variant='textMregular'>
            Don’t have an account?{' '}
            <Text
               as='a'
               variant='textMmedium'
               href='/register'
               className='text-[var(--color-neutral-900)] hover:underline'
            >
               Register
            </Text>
         </Text>
      )
   }

   if (step === 'password') {
      return (
         <div className='flex w-full items-center justify-between'>
            <div className='flex items-center gap-2'>
               <div className='modal-order-service-checkbox relative !top-0'>
                  <label htmlFor='savePassword' className='flex cursor-pointer items-center gap-2'>
                     <input
                        type='checkbox'
                        id='savePassword'
                        checked={isSavePasswordChecked}
                        onChange={handleSavePasswordChange}
                        className='absolute h-0 w-0 opacity-0'
                     />
                     <span
                        className={`checkmark flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${
                           isSavePasswordChecked ? 'border-orange-500 bg-orange-500' : 'border-gray-300 bg-white'
                        }`}
                     ></span>
                     <Text as='span' variant='textMregular' className='pl-10 text-[var(--color-neutral-100)]'>
                        Save password
                     </Text>
                  </label>
               </div>
            </div>
            <div>
               <Text as='a' variant='textMmedium' href='#' className='text-[var(--color-neutral-900)] hover:underline'>
                  Forgot your password?
               </Text>
            </div>
         </div>
      )
   }

   return null
}
