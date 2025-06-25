import { useEffect, useRef, useState } from "react";
import { ButtonType } from "@/utils/enums/TooltipEnum";
import { ContainerType, BubbleType, PositionType } from "@/utils/enums/TooltipEnum";

type TooltipProps = {
    children: React.ReactNode
    type: ButtonType
    title: string
};

type TooltipContainerProps = {
    children: React.ReactNode
    title?: string
    ref?: React.RefObject<HTMLDivElement>
    top?: number | null,
    left?: number | null,
    type?: ContainerType
    position?: PositionType
    bubble?: BubbleType
}

export const TooltipContainer : React.FC<TooltipContainerProps> = ({
    children, 
    title, 
    ref,
    top,
    left,
    position, 
    type = ContainerType.DEFAULT, 
    bubble = BubbleType.DEFAULT
}) => {
    let containerPosition, bubblePosition, align 
    switch (position) {
        case PositionType.LEFT:
            containerPosition = "right-full top-1/2 transform -translate-y-1/2 mr-2"
            bubblePosition = "top-1/2 right-1 translate-x-full -translate-y-1/2 shadow-lg"
            align = "items-end"
            break;
        default:
            containerPosition = "left-full top-1/2 transform -translate-y-1/2"
            bubblePosition = "top-1/2 left-1 -translate-x-full -translate-y-1/2 shadow-md"
            align = "items-start"
    }

    return (
        <div
            ref={ref}
            className={`${type === ContainerType.DEFAULT ? 'absolute '+containerPosition+' z-[100] ml-2 ' : ''}rounded-3xl p-3 border shadow-md w-auto flex flex-col items-start flex-shrink-0 self-stretch bg-white text-black`}
            style={{
                top, left
            }}
        >
            { bubble === BubbleType.DEFAULT && (
                <div className={`absolute ${bubblePosition} w-2 h-2 bg-white rotate-45`}></div>
            )}
            <div className={`flex flex-col gap-1 whitespace-nowrap max-w-screen-sm items-start font-[nunito]`}>
                <span className="text-xs font-bold">
                    {title}
                </span>
                {children}
            </div>
        </div>
    )
}

const Tooltip: React.FC<TooltipProps> = ({children, title, type = ButtonType.TRIPLE_DOTS}) => {
    const [isOpen, setOpen] =  useState(false)
    const [position, setPosition] = useState<PositionType>(PositionType.RIGHT);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement  | null>(null);
    const buttonIcons: Record<ButtonType, React.JSX.Element> = {
        [ButtonType.QUESTION_MARK]: <img src="/assets/question-mark-icon.svg" alt="question mark icon" className="w-3" />,
        [ButtonType.QUESTION_MARK_WHITE]: <img src="/assets/question-mark-white-icon.svg" alt="question mark white icon" className="w-3" />,
        [ButtonType.TRIPLE_DOTS]: <img src="/assets/triple-dots.svg" alt="triple dots icon" className="w-auto" />,
        [ButtonType.WATER_DROP]: <img src="/assets/water-drop-icon.svg" alt="water drop icon" className="w-auto" />,
    };
    
    const toggleTooltip = () => setOpen((prev) => !prev)
 
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {

            if (event.target === buttonRef.current) return;

            if (
                (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) &&
                (buttonRef.current && !buttonRef.current.contains(event.target as Node))
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        if (!buttonRef.current || !tooltipRef.current) return;
        const btn = buttonRef.current.getBoundingClientRect();
        const tooltip = tooltipRef.current.getBoundingClientRect();
        const maxWidth = window.innerWidth;

        setPosition(prev => btn.right + tooltip.width > maxWidth ? PositionType.LEFT : prev)
    }, [isOpen])

    return (
        <div className="relative">
            <button 
                ref={buttonRef}
                onClick={toggleTooltip}
            >
                { buttonIcons[type] ?? buttonIcons[ButtonType.QUESTION_MARK] }
            </button>
            { isOpen && (
                <TooltipContainer
                    ref={tooltipRef}
                    position={position}
                    title={title}
                >
                    {children}
                </TooltipContainer>
            )}
        </div>
    )
}

export default Tooltip