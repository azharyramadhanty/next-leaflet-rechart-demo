import { useEffect, useRef, useState } from "react";
import { ButtonType } from "@/utils/enums/TooltipEnum";
import { ContainerType, BubbleType, PositionType } from "@/utils/enums/TooltipEnum";
import Image from "next/image";
import { createPortal } from "react-dom";

export type ButtonGroupDataType = {
    body: React.ReactNode,
    disabled?: boolean,
    fnOnClick: (value: number) => void
};

export type ButtonGroupProps = {
    rowId: number,
    ref?: React.RefObject<HTMLDivElement>
    list: ButtonGroupDataType[];
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
    ref,
    rowId,
    list
}) => {
    const [isOpen, setOpen] =  useState(false)
    const btnGroupRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement  | null>(null);
    const [position, setPosition] = useState({
        top: null,
        left: null
    });
    
    const toggleButtonGroup = () => setOpen((prev) => !prev)
 
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (event.target === buttonRef.current) return;
            if (
                (btnGroupRef.current && !btnGroupRef.current.contains(event.target as Node)) &&
                (buttonRef.current && !buttonRef.current.contains(event.target as Node))
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        if (!buttonRef.current || !btnGroupRef.current) return;
        const btn = buttonRef.current.getBoundingClientRect();
        const btnGrp = btnGroupRef.current.getBoundingClientRect();

        setPosition({
            top: btn.top,
            left: btn.left - btnGrp.width - 5
        })
    }, [isOpen])

    return (
        <div className="relative">
            <button 
                ref={buttonRef}
                onClick={toggleButtonGroup}
                className="rounded-3xl p-1 border border-[#C7D1D1] bg-white"
            >
                <img src="/assets/triple-black-dots.svg" alt="triple dots icon" className="w-auto" />
            </button>
            { isOpen && createPortal(
                <div
                    ref={btnGroupRef}
                    className="absolute z-[100] rounded-2xl py-1 border shadow-md w-auto flex flex-col items-start flex-shrink-0 self-stretch bg-white text-black"
                    style={{
                        top: position.top,
                        left: position.left
                    }}
                >
                    <div className={`flex flex-col items-start font-[nunito]`}>
                        <span className="items-start p-3 text-xs text-[#969696] font-[nunito]">Choose an action.</span>
                        { list.map((btn, index) => (
                            <button
                                key={index}
                                disabled={btn.disabled}
                                onClick={() => btn.fnOnClick(rowId)}
                                className={`flex self-stretch gap-2 items-start p-3 text-xs ${btn.disabled ? 'opacity-45' : 'hover:bg-slate-200'}`}
                            >
                                {btn.body}
                            </button>
                        ))}
                    </div>
                </div>
                , document.body
            )}
        </div>
    )
}

export default ButtonGroup