export type ColorPickerProps = {
   colors: { name: string }[]
   selectedColor: string
   setSelectedColor: React.Dispatch<React.SetStateAction<string>>
}
