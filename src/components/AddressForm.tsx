import { FormProvider, useForm } from 'react-hook-form'
import { Button } from './ui/button'
import Text from '@/components/ui/text'
import CustomFormField from './CustomFormField'
import { AddressFormData, AddressSchema } from '@/schema/addressSchema'
import { zodResolver } from '@hookform/resolvers/zod'

const AddressForm = ({ onSubmit }: { onSubmit: (data: AddressFormData) => void }) => {
   const methods = useForm<AddressFormData>({
      resolver: zodResolver(AddressSchema),
      defaultValues: {
         country: '',
         province: '',
         city: '',
         postalCode: '',
         addressLine: '',
         isMain: false,
      },
   })

   return (
      <FormProvider {...methods}>
         <form onSubmit={methods.handleSubmit(onSubmit)} className='flex flex-col gap-y-8'>
            {/* Pierwszy rząd: Kraj + Prowincja */}
            <div className='flex gap-x-[41px]'>
               <CustomFormField name='country' type='select' label='' placeholder='Country' classNameItem='gap-0' />
               <CustomFormField name='province' type='select' label='' placeholder='Province' classNameItem='gap-0' />
            </div>

            {/* Drugi rząd: Miasto + Kod pocztowy */}
            <div className='flex gap-x-[41px]'>
               <CustomFormField name='city' type='select' label='' placeholder='City' classNameItem='gap-0' />
               <CustomFormField name='postalCode' type='text' label='' placeholder='00-000' classNameItem='gap-0' />
            </div>

            {/* Pełny adres */}
            <CustomFormField
               name='addressLine'
               type='text'
               label=''
               placeholder='Input Complete Address'
               classNameInput='w-[841px] h-[130px]'
               classNameItem='gap-0'
            />

            {/* Checkbox powiązany z isMain */}
            <div className='flex justify-between'>
               <label className='flex cursor-pointer items-center'>
                  <div className='modal-order-service-checkbox relative'>
                     <input type='checkbox' className='absolute opacity-0' {...methods.register('isMain')} />
                     <span className={`checkmark -top-5 ${methods.watch('isMain') ? 'bg-orange-500' : ''}`}></span>
                  </div>
                  <Text as='span' variant='textMmedium' className='ml-11'>
                     Make it the main address
                  </Text>
               </label>
               <Button type='submit' className=''>
                  Add Address
               </Button>
            </div>
         </form>
      </FormProvider>
   )
}

export default AddressForm
