import { RefObject, useEffect, useRef, useState } from "react"
import { DataType } from "@/utils/Types"
import { Checkbox } from "flowbite-react"
import { SelectType, ContentType } from "@/utils/enums/SelectEnum"
import { createPortal } from "react-dom"
import Image from "next/image"
import { PositionType } from "@/utils/enums/TooltipEnum"

export type SelectOptionsType = DataType
const parentUlId = 'parent-ul'
type BaseSelectProps<T extends SelectType> = {
    key?: number | string;
    type: T;
    name: string;
    options: SelectOptionsType[];
    loading?: boolean;
    fixedWidth?: boolean;
    disabled?: boolean;
    placeholder?: string;
    isClearable?: boolean;
    isLoading?: boolean;
    isError?: boolean;
    position?: PositionType
}
export type SelectProps<T extends SelectType> = BaseSelectProps<T> & 
(
    T extends SelectType.SINGLE ? {
        onChange: (selected: SelectOptionsType | null) => void;
        onFocus?: () => void;
        value: SelectOptionsType | null;
        contentType?: ContentType;
    } : T extends SelectType.MULTIPLE ? {
        onChange: (selected: SelectOptionsType[]) => void;
        value: SelectOptionsType[];
        max?: number;
    } : null
)
type BaseSelectInputProps = {
    key?: number | string;
    type: SelectType;
    fixedWidth?: boolean;
    name: string;
    contentType?: ContentType;
    disabled?: boolean;
    isClearable?: boolean;
    renderInput: (props: {
        value: string;
        isOpen: boolean;
        iconRef: RefObject<HTMLImageElement>;
        inputRef?: RefObject<HTMLInputElement>;
    }) => React.ReactNode;
    options: SelectOptionsType[];
    renderOptions: () => React.ReactNode;
    isLoading?: boolean;
    isError?: boolean;
    position?: PositionType;
}

const BaseSelectInput = ({
    key = 1,
    type,
    name,
    fixedWidth = true,
    contentType = ContentType.DEFAULT,
    renderInput,
    renderOptions,
    disabled = false,
    options,
    isLoading = false,
    isError = false,
    position = PositionType.BOTTOM
}: BaseSelectInputProps ) => {
    const containerSelectRef = useRef<HTMLDivElement>(null)
    const containerListRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const clearRef = useRef<HTMLImageElement>(null)
    const [dynamicWidth, setDynamicWidth] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false)
    const selectId = parentUlId + '-' + name
    const [dropdownPosition, setDropdownPosition] = useState({
        top:0,
        left:0,
        // width:0
    });

    const createHiddenUl = () => {
        let parent = document.getElementById(selectId);

        if (!parent) {
            parent = document.createElement("ul");
            parent.id = selectId;
            parent.classList.add("absolute")
            options.forEach((option) => {
                const listItem = document.createElement("li");
                listItem.textContent = option.value.toString();
                parent.appendChild(listItem)
            });
            document.body.appendChild(parent);
        }
        
        const maxItemWidth = Array.from(parent.children).reduce(
            (maxWidth, item) => Math.max(maxWidth, (item as HTMLElement).offsetWidth),
            0
        );
        setDynamicWidth(maxItemWidth);
        return parent
    }

    const calculatePosition = () => {
        if (!containerSelectRef.current || !containerListRef.current) return;
        const containerRect = containerSelectRef.current.getBoundingClientRect();
        setDropdownPosition({
            top: containerRect.top + containerRect.height + window.scrollY,
            left: containerRect.left,
            // width: containerRect.width
        })
    };

    useEffect(() => {
        const parentUl = createHiddenUl()
        parentUl?.remove()
    }, [options]);

    useEffect(() => {
        if (!isOpen) {
            inputRef.current?.blur()
        } else {
            inputRef.current?.focus()
        }
        calculatePosition()
    }, [isOpen])

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            const target = e.target as Node;

            const clickedInsideSelect = containerSelectRef.current?.contains(target);
            const clickedInsideDropdown = containerListRef.current?.contains(target);

            if (!clickedInsideSelect && !clickedInsideDropdown) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("mousedown", handleOutsideClick);
        return () => {
            window.removeEventListener("mousedown", handleOutsideClick);
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, []);
   
    const toggleSelect = (e) => {
        setIsOpen((prev) => {
            if (type === SelectType.MULTIPLE && (containerListRef.current && containerListRef.current.contains(e.target as Node) || inputRef.current && inputRef.current.contains(e.target as Node))) return true
            if (clearRef.current && clearRef.current.contains(e.target as Node)) return false
            return !prev
        })
    }

    switch (contentType) {
        case ContentType.PORTAL:
            return (
                <div
                    key={key}
                    onClick={(e) => toggleSelect(e)}
                    ref={containerSelectRef}
                    className={`relative w-full rounded-2xl ${isOpen ? ' ring-1 ring-blue-500 border-blue-500' : ''}${disabled ? 'pointer-events-none opacity-70' : ''}`}
                >
                    <div 
                        className={`w-full flex p-2 justify-between bg-white border border-gray-300 rounded-2xl`}
                    >
                        {renderInput({
                            value: '',
                            isOpen: isOpen,
                            iconRef: clearRef,
                            inputRef: inputRef
                        })}
                    </div>
                    {isOpen && createPortal(
                        <div ref={containerListRef} className="absolute z-[100] mt-2 bg-white border border-gray-300 rounded-3xl shadow-lg max-w-full dark:bg-gray-700 p-3"
                            style={{
                                top: dropdownPosition.top,
                                left: dropdownPosition.left
                            }}
                        >
                            <div className="max-h-60 max-w-full overflow-y-auto rounded-scrollbar">
                                <ul className="flex flex-col w-auto text-xs font-medium text-gray-700 dark:text-gray-200">
                                    {isLoading ? (
                                        <div className="p-2 text-gray-500">Loading...</div>
                                    ) : (
                                        renderOptions()
                                    )}
                                </ul>
                            </div>
                        </div>
                        , document.body
                    )}
                </div>
            );
        default:
            return (
                <div
                    key={key}
                    onClick={(e) => toggleSelect(e)}
                    ref={containerSelectRef}
                    className={`relative w-full rounded-2xl ${isOpen ? ' ring-1 ring-blue-500 border-blue-500' : (isError ? 'ring-1 ring-danger border-danger' : '')}`}
                    // style={{width: fixedWidth ? dynamicWidth > 160 ? dynamicWidth+"px" : "168px" : ''}}
                    style={{width: dynamicWidth > 150 ? dynamicWidth+"px" : "150px"}}
                >
                    <div 
                        className={`w-full flex p-1.5 justify-between bg-white border border-gray-300 rounded-2xl`}
                    >
                        {renderInput({
                            value: '',
                            isOpen: isOpen,
                            iconRef: clearRef,
                            inputRef: inputRef
                        })}
                    </div>
                    
                    {isOpen && (
                        <div ref={containerListRef} className="absolute z-[100] mt-2 bg-white border border-gray-300 rounded-3xl shadow-lg w-auto min-w-full dark:bg-gray-700 p-3">
                            <div className="max-h-60 overflow-y-auto rounded-scrollbar">
                                <ul className="flex flex-col w-auto text-xs font-medium text-gray-700 dark:text-gray-200">
                                    {isLoading ? (
                                        <div className="p-2 text-gray-500">Loading...</div>
                                    ) : (
                                        renderOptions()
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )
    }
}

const SingleSelectInput = ({
    key,
    value,
    name,
    onChange,
    onFocus,
    disabled = false,
    fixedWidth,
    contentType = ContentType.DEFAULT,
    isLoading,
    isClearable = true,
    isError = false,
    options,
    placeholder,
    position = PositionType.BOTTOM
}: SelectProps<SelectType.SINGLE>) => {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [isOpen, setOpen] = useState(false);

    const filteredOptions = options.filter(option => 
        option.value.toString().toLowerCase().includes(filter.toLowerCase())
    );

    const handleSelect = (option: SelectOptionsType) => {
        onChange(option);
        // setSearch(option.value.toString())
        setFilter('')
    };

    useEffect(() => {
        setFilter((prev) => isOpen && value?.value ? '' : value?.value ? '' : prev)
    }, [isOpen]);

    const handleClear = () => {
        // setSearch('')
        onChange(null)
        setFilter('')
    };

    return (
        <BaseSelectInput
            key={key}
            name={name}
            type={SelectType.SINGLE}
            options={options}
            disabled={disabled}
            contentType={contentType}
            fixedWidth={fixedWidth}
            isLoading={isLoading}
            isError={isError}
            position={position}
            renderInput={(inputProps) => {
                setOpen(inputProps.isOpen)
                return (
                    <>
                        <input
                            disabled={disabled}
                            ref={inputProps.inputRef}
                            className="text-[10px] w-full focus:outline-none focus:ring-0"
                            placeholder={placeholder || "Select Options"}
                            value={(inputProps.isOpen ? filter : value?.value) || ''}
                            onChange={(e) => setFilter(e.target.value)}
                            onFocus={onFocus}
                        />
                        { !disabled ? value?.value && isClearable ? (
                            <Image
                                ref={inputProps.iconRef}
                                onClick={handleClear}
                                className="w-auto cursor-pointer" 
                                alt={'close icon'}
                                src={'assets/close-icon.svg'}
                                width={0} height={0} style={{width: 'auto'}}
                            />
                        ) : (
                            <Image
                                className={`w-auto cursor-pointer ${
                                    isOpen ? "rotate-180" : ""
                                }`}
                                alt={'arrow down icon'}
                                src={'assets/arrow-down.svg'}
                                width={0} height={0} style={{width: '0.6rem'}}
                            />
                        ) : null}
                    </>
                )
            }}
            renderOptions={() =>
                filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                        <li 
                            key={option.key}
                            className="inline-flex p-2 rounded-3xl cursor-pointer hover:bg-gray-100 text-gray-900 whitespace-nowrap dark:hover:bg-gray-600 dark:text-gray-300"
                            onClick={() => handleSelect(option)}
                        >
                            {option.value}
                        </li>
                    ))
                ) : (
                    <li className="px-4 py-2 text-gray-500">No options found</li>
                )
            }
        />
    )
}

const MultipleSelectInput = ({
    key,
    name,
    value,
    onChange,
    disabled = false,
    fixedWidth,
    isLoading,
    isClearable = true,
    options,
    placeholder,
    max = 1,
    position = PositionType.BOTTOM
}: SelectProps<SelectType.MULTIPLE>) => {
    const [search, setSearch] = useState('');

    const filteredOptions = options.filter(option => 
        option.value.toString().toLowerCase().includes(search.toLowerCase())
    );

    const handleToggleCheckbox = (option: SelectOptionsType) => {
        const selectValues = value.some(v => v.key === option.key)
        ? value.filter(v => v.key !== option.key)
        : [...value, option]
        
        setSearch('')
        onChange(selectValues)
    }

    const handleClear = () => {
        setSearch('')
        onChange([])
    };

    return (
        <BaseSelectInput
            key={key}
            type={SelectType.MULTIPLE}
            name={name}
            disabled={disabled}
            fixedWidth={fixedWidth}
            options={options}
            position={position}
            isLoading={isLoading}
            renderInput={(inputProps) => (
                <>
                    <div className="flex flex-wrap gap-1 w-full text-xs">
                        {value.map(option => (
                            <span
                                key={option.key}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                            >
                                {option.value}
                                <button
                                    onClick={() => handleToggleCheckbox(option)}
                                    className="ml-1 hover:text-blue-600"
                                >
                                    x
                                </button>
                            </span>
                        ))}
                        { value.length < max &&
                            <input
                                disabled={disabled}
                                ref={inputProps.inputRef}
                                className="flex-1 min-w-[50px] focus:outline-none focus:ring-0"
                                placeholder={placeholder || "Search Options"}
                                value={search || ''}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        }
                    </div>
                    { !disabled ? value.length > 0 && isClearable ? (
                        <Image
                            ref={inputProps.iconRef}
                            onClick={handleClear}
                            className="w-auto cursor-pointer" 
                            alt={'close icon'}
                            src={'assets/close-icon.svg'}
                            width={0} height={0} style={{width: 'auto'}}
                        />
                    ) : (
                        <Image
                            className={`w-auto cursor-pointer ${
                                inputProps.isOpen ? "rotate-180" : ""
                            }`}
                            alt={'arrow down icon'}
                            src={'assets/arrow-down.svg'}
                            width={0} height={0} style={{width: '0.6rem'}}
                        />
                    ) : null}
                </>
            )}
            renderOptions={() =>
                filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                        <li 
                            key={option.key}
                            className={`inline-flex p-2 rounded-3xl ${value.length >= max && !value.some(v => v.key === option.key) ? 'pointer-events-none opacity-50 text-gray-400' : 'cursor-pointer hover:bg-gray-100 text-gray-900'} whitespace-nowrap dark:hover:bg-gray-600 dark:text-gray-300`}
                            onClick={() => handleToggleCheckbox(option)}
                        >
                            <div className="flex max-w-md items-center gap-2 text-xs">
                                <Checkbox
                                    id={option.key.toString()}
                                    checked={value.some(v => v.key === option.key)}
                                    onChange={() => handleToggleCheckbox(option)}
                                    className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                {option.value.toString()}
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="px-4 py-2 text-gray-500">No options found</li>
                )
            }
        />
    )
}

const DropdownSelect = <T extends SelectType>(props: SelectProps<T>) => {
    switch (props.type) {
        case SelectType.SINGLE:
            return <SingleSelectInput {...props as SelectProps<SelectType.SINGLE>} />;
        case SelectType.MULTIPLE:
            return <MultipleSelectInput {...props as SelectProps<SelectType.MULTIPLE>} />;
        default:
            const _exhaustiveCheck = props.type;
            throw new Error(`Unhandled type: ${_exhaustiveCheck}`);
    }
};
export default DropdownSelect