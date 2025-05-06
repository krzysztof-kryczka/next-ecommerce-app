import { useController } from 'react-hook-form'
import { countries } from 'countries-list'
import { CountrySelectProps } from '@/types/CountrySelectProps'

export default function CountrySelect({ name, control, errors, className = '' }: CountrySelectProps) {
   const { field } = useController({ name, control })
   const countryNames = Object.values(countries).map(country => country.name)

   return (
      <select
         {...field}
         id={name}
         className={`w-full rounded-md border px-5 py-3.5 text-base text-[var(--color-base-white)] placeholder-[var(--color-neutral-300)] focus:border-[var(--color-warning-500)] ${errors?.[name] ? 'border-[var(--color-danger-500)]' : 'border-[var(--color-neutral-500)]'} ${className}`}
      >
         <option value=''>Select country</option>
         {countryNames.map(country => (
            <option key={country} value={country}>
               {country}
            </option>
         ))}
      </select>
   )
}
