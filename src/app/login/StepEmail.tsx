import { StepForm } from './StepForm'
import { StepEmailProps } from '@/types/Auth'

export const StepEmail: React.FC<StepEmailProps> = ({ form, handleCheckUser }) => {
   return (
      <StepForm
         form={form}
         handleSubmit={handleCheckUser}
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
