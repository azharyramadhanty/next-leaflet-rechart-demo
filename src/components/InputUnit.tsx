
type InputUnitProps = {
    value: string | number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (value: any) => void;
    placeholder?: string | number;
    unit: string;
    isError: boolean;
    disabled?: boolean;
}

const InputUnit: React.FC<InputUnitProps> = ({
    value,
    onChange,
    placeholder,
    unit,
    isError,
    disabled = false
}) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.replace(/\D/g, "");
        onChange(newValue);
    };
    
    return (
        <div className={`flex items-center justify-between gap-1 rounded-2xl h-8 border ${(isError ? 'border-[0.1rem] border-danger' : 'border-gray-300')} p-2 pl-3 text-black text-sm focus-within:ring-2  focus-within:ring-blue-500`}>
            <input
                disabled={disabled}
                inputMode="numeric"
                pattern="[0-9]*"
                className='w-full focus:outline-none focus:ring-0'
                value={value}
                placeholder={placeholder.toString()}
                onChange={handleChange}
            />
            <span>{unit}</span>
        </div>
    )
}

export default InputUnit