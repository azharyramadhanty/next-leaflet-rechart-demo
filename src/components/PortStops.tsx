import Image from "next/image"
import DropdownSelect, { SelectOptionsType } from "./DropdownSelect"
import { ContentType, SelectType } from "@/utils/enums/SelectEnum"
import React, { useEffect, useRef, useState } from "react";
import { DataType } from "@/utils/Types";

type OptionsType = DataType & { days: number }
export type PortStopsOptionsType = {
    id: number,
    options: OptionsType
}

type PortStopsProp = {
    ports: SelectOptionsType[] | null,
    selected?: PortStopsOptionsType[];
    disabled?: boolean;
    onChange: (selected: PortStopsOptionsType[] | null) => void;
}

const PortStops: React.FC<PortStopsProp> = ({ports, selected, onChange, disabled = false}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [destination, setDestinations] = useState<PortStopsOptionsType[]>(selected || 
    [{ id: 1, options: { key: '', value: "", days: 0 }},
    { id: 2, options: { key: '', value: "" , days: 0 }}
    ]);

    useEffect(() => {
        onChange(destination)
    }, [destination])

    const handleAdd = () => {
        setDestinations((prevRows) => [...prevRows,  { id: prevRows.length + 1, options: { key: '', value: "", days: 0 }}]);
    }

    const handleChange = (value: DataType, items) => {
        setDestinations((prev) => {
            const exist = prev.find(i => i.id === items.id)
            return exist ? prev.map((i) => 
                i.id === items.id ? {...i, id: items.id, options: {...value, days: 3}} : i
            ) : [...prev, {id: items.id, options: {...value, days: 3}}]
        })
    }

    const handleRemove = (idx: number) => {
        setDestinations((prev) =>  {
            return prev.filter((_, index) => index !== idx)
                        .map((i, index) => {
                            return {...i, id: index}
                        })
        })
    }

    const handleFocusScroll = (event: React.FocusEvent<HTMLDivElement>) => {
        if (containerRef.current) {
            const elementPosition = event.currentTarget.offsetTop - containerRef.current.offsetTop - 5;
            
            containerRef.current.scrollTo({
                top: elementPosition,
                behavior: "smooth",
            });
        }
    }
    
    return (
        <div className={`flex flex-col h-full ${disabled ? 'justify-start' : 'justify-between'} pt-2 gap-2`}>
            <h3 className="text-[15px] text-start font-bold font-[nunito]">Port Stops</h3>
            <div ref={containerRef} className="flex flex-col p-2 h-[155px] overflow-y-auto rounded-scrollbar">
                {destination.map((items, index) => {
                    let imgSrc, imgAlt

                    switch (index) {
                        case 0:
                            imgSrc = "port-stops-blue-icon"
                            imgAlt = "Transit stops Icon"
                        break;
                        case destination.length - 1:
                            imgSrc = "end-port"
                            imgAlt = "To Port Icon"
                        break;
                        default:
                            imgSrc = "port-stops-blue-icon"
                            imgAlt = "Transit Port Icon"
                    }

                    return (
                        <React.Fragment key={index}>
                            <div className="flex items-center gap-2 w-full" onFocus={handleFocusScroll}>
                                <Image src={`assets/${imgSrc}.svg`} alt={imgAlt} width={0} height={0} style={{width: 'auto'}} />
                                <DropdownSelect
                                    type={SelectType.SINGLE}
                                    placeholder="Destination Port"
                                    name={`destination-port-${index}`}
                                    value={items.options}
                                    disabled={disabled}
                                    fixedWidth={false}
                                    contentType={ContentType.PORTAL}
                                    options={ports}
                                    onChange={(value) => handleChange(value,items)}
                                />
                                { disabled || (
                                    <button onClick={() => handleRemove(items.id)} className="flex h-6 w-7 items-center justify-center rounded-full border-2 border-black/20 text-black">x</button>
                                )}
                            </div>
                            { index < destination.length - 1 && (
                                <div className="ml-1 w-[4px] -mt-1 -mb-1 min-h-[30px] bg-[radial-gradient(circle,_#9ca3af_2px,_transparent_2px)] bg-[length:4px_10px]"></div>
                            )}
                        </React.Fragment>
                    )
                })}
            </div>
            { disabled || (
                <button onClick={handleAdd} className="flex items-center gap-3 mb-2 mt-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-black/20 text-black">+</div>
                    <span className="text-gray-700 text-sm font-bold">Add destination</span>
                </button>
            )}
        </div>
    )
}

export default PortStops