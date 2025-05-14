import { StepPasswordProps } from '@/types/Auth'
import { StepForm } from './StepForm'

export const StepPassword: React.FC<StepPasswordProps> = ({ form, handleVerifyPassword }) => {
   return (
      <StepForm
         form={form}
         handleSubmit={handleVerifyPassword}
         fields={[
            {
               name: 'password',
               label: 'Password',
               placeholder: 'Password',
               isPassword: true,
               type: 'password',
            },
         ]}
         buttonLabel='Log in'
      />
   )
}
