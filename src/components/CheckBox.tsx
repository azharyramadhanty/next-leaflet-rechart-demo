import { Checkbox, Label } from "flowbite-react"

export type CheckboxDataType = {
  value: string,
  label: string,
  checked: boolean,
  disabled?: boolean
}

type CheckboxProps = CheckboxDataType & {
  onHandleChange?: (value: string) => void;
  checkboxClass?: string;
  labelClass?: string ;
}

const CheckBox: React.FC<CheckboxProps> = ({
  value, 
  label, 
  checked, 
  checkboxClass, 
  disabled, 
  labelClass, 
  onHandleChange
}) => {

  return (
    <div className="flex max-w-md items-center gap-2">
      <Checkbox
        id={value}
        disabled={disabled}
        checked={checked} 
        onChange={() => onHandleChange(value)}
        className={checkboxClass}
      />
      <Label htmlFor={value} className={labelClass}>
        {label}
      </Label>
    </div>
  )
}

export default CheckBox