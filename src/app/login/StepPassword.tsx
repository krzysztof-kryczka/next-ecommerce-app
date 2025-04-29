import { StepPasswordProps } from '@/types/Auth'
import { StepForm } from './StepForm'

export const StepPassword: React.FC<StepPasswordProps> = ({
   form,
   handleVerifyPassword,
   isSavePasswordChecked,
   handleSavePasswordChange,
}) => {
   return (
      <StepForm
         form={form}
         handleSubmit={handleVerifyPassword}
         fields={[
            {
               name: 'password',
               label: 'Password',
               placeholder: 'Password',
               type: 'password',
            },
         ]}
         buttonLabel='Log in'
      />
   )
}
