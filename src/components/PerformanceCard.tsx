import { PerformanceCardType } from "@/utils/enums/CardEnum";

type PerformanceCardProps = {
    mainTitle: string,
    secondaryTitle?: string,
    thirdTitle?: string,
    description?: string,
    deviationDescription?: string,
    value: string,
    valueDeviation?: string,
    valueFuelBaseline?: React.JSX.Element,
    notation: string,
    type: PerformanceCardType
}

const PerformanceCard = ({ mainTitle, secondaryTitle, thirdTitle, description, deviationDescription, value, valueDeviation, valueFuelBaseline, notation, type = PerformanceCardType.MEDIUM_SCORE }: PerformanceCardProps) => {
    return (
        <div className={`flex min-h-[130px] h-full min-w-[110px] w-full pt-2 pl-[0.8vw] pr-[0.1vw] pb-2 rounded-[20px] ${type === PerformanceCardType.HIGH_SCORE ? 'bg-[#CCFFDF]' : 'bg-danger'}`}>
            <div className="flex flex-col justify-between">
                <div className="flex items-start text-white">
                    <span className={`${type === PerformanceCardType.HIGH_SCORE ? 'text-[#00B843]' : 'text-white'} ${secondaryTitle ? 'text-xs font-bold' : 'text-sm font-light'} max-w-14 font-[nunito]`}>{mainTitle}</span>
                    <span className={`${type === PerformanceCardType.HIGH_SCORE ? 'text-[#00B843]' : 'text-white'} text-[0.7rem] font-thin font-[nunito] pl-1`}>{secondaryTitle}</span>
                </div>
                {thirdTitle && <span className={`${type === PerformanceCardType.HIGH_SCORE ? 'text-[#00B843]' : 'text-white'} text-[0.7rem] font-thin font-[nunito]`}>{thirdTitle}&nbsp;</span>}
                {deviationDescription && (<span className={`w-[8rem] truncate ${type !== PerformanceCardType.HIGH_SCORE ? 'text-white bg-[#FFFFFF40]' : 'text-[#00B843] bg-[#00B84320]'} text-center rounded-full py-[0.1rem] mt-1 text-[0.5rem] font-light font-[nunito]`}>{deviationDescription}</span>)}
                <div className="flex items-end">
                    <span className={`${type === PerformanceCardType.HIGH_SCORE ? 'text-[#00B843]' : 'text-white'} text-[1.5rem] font-bold font-[nunito] translate-y-[0.4rem]`}>{value}</span>
                    <span className={`${type === PerformanceCardType.HIGH_SCORE ? 'text-[#00B843]' : 'text-white'} text-xs font-light font-[nunito] pr-1 line-clamp-1`}>{notation}</span>
                    {type !== PerformanceCardType.HIGH_SCORE && (<img src="/assets/triangle-warning.svg" alt="triangle warning icon" className="w-5"/>)}
                </div>
                <div className="flex flex-col">
                    <span className={`${type === PerformanceCardType.HIGH_SCORE ? 'text-[#00B843]' : 'text-white'} text-[0.623rem] font-light font-[nunito]`}>{valueDeviation}&nbsp;</span>
                    {valueFuelBaseline}
                    {description && type !== PerformanceCardType.HIGH_SCORE && (<span className="w-[8rem] truncate text-white text-center bg-[#FFFFFF40] rounded-full py-[0.1rem] mt-1 text-[0.5rem] font-light font-[nunito]">{description}</span>)}
                </div>
            </div>
        </div>
    )
}

export default PerformanceCard