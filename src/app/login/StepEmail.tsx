import { JSX } from 'react'
import { StepForm } from './StepForm'
import { StepEmailProps } from '@/types/Auth'

export const StepEmail = ({ form, handleNextStep }: StepEmailProps): JSX.Element => {
   return (
      <StepForm
         form={form}
         handleSubmit={handleNextStep}
         fields={[
            {
               name: 'emailOrPhone',
               label: 'Email or mobile phone number',
               placeholder: 'Email or mobile phone number',
            },
         ]}
         buttonLabel='Continue'
      />
   )
}
