import { FormProvider, useForm } from 'react-hook-form'
import { Button } from './ui/button'
import Text from '@/components/ui/text'
import CustomFormField from './CustomFormField'
import { AddressFormData, AddressSchema } from '@/schema/addressSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { AddressFormProps } from '@/types/AddressFormProps'
import { JSX } from 'react'

const AddressForm = ({ onSubmit, initialData, onCancel }: AddressFormProps): JSX.Element => {
   const methods = useForm<AddressFormData>({
      resolver: zodResolver(AddressSchema),
      defaultValues: initialData ?? {
         country: '',
         province: '',
         city: '',
         postalCode: '',
         addressLine: '',
         isMain: false,
      },
      mode: 'onBlur',
   })

   const handleSubmit = methods.handleSubmit(data => {
      const finalData = initialData ? { ...data, id: initialData.id } : data
      // console.log('🔄 Debug:', initialData ? 'Editing existing address' : 'Adding new address', finalData)
      onSubmit(finalData)
   })

   return (
      <FormProvider {...methods}>
         <form onSubmit={handleSubmit} className='flex flex-col gap-y-8'>
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
               <div className='flex gap-x-4'>
                  <Button type='submit'>{initialData ? 'Update Address' : 'Add Address'}</Button>
                  {initialData && (
                     <Button type='button' onClick={onCancel}>
                        Cancel
                     </Button>
                  )}
               </div>
            </div>
         </form>
      </FormProvider>
   )
}

export default AddressForm
