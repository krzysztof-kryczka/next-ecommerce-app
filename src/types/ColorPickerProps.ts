export type ColorPickerProps = {
   colors: { name: string; value: string }[]
   selectedColor: string
   setSelectedColor: React.Dispatch<React.SetStateAction<string>>
}
