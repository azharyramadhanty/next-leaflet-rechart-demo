import Tooltip from "./Tooltip"
import { ButtonType } from "@/utils/enums/TooltipEnum"

type BaseVoyageType = {
    id: string | number,
    fuel?: number,
    voyageNo: number,
    date: string,
    discharge: string,
    bunker: string,
    seaDays?: number,
    portBunkeringLocation?: string
    isPortBunkering?: boolean,
}

type WithBunkerType = BaseVoyageType & {
    isBunker: true,
    remark: string
}

type NoBunkerType = BaseVoyageType & {
    isBunker?: false,
    remark?: string
}

export type VoyageDataType = WithBunkerType | NoBunkerType

type VoyageProp = {
    title: string,
    status?: string,
    data: VoyageDataType[]
}

const VoyageCard: React.FC<VoyageProp> = ({ title, status, data }) => {

    return (
        <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col gap-4 font-[nunito] border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">{title}</h3>
                {status && (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status === 'Monitor' ? 'bg-[#FAD1D2] text-[#EA3A3D]' : (status === 'Warning' ? 'bg-[#FFF0E5] text-[#FF9B42]' : (status === 'Safe' ? 'bg-[#CCFFDF] text-[#00B843]' : 'bg-gray-300 text-gray-600'))}`}>
                        {status}
                    </span>
                )}
            </div>
            <ul role="list" className="flex flex-row justify-center">
                {data.slice().reverse().map((i, index) => {
                    let statusClass;

                    switch (true) {
                        case i.fuel >= 80:
                            statusClass = "bg-success-light text-success";
                            break;
                        case i.fuel >= 70 && i.fuel < 80:
                            statusClass = "bg-warning-light text-warning";
                            break;
                        case i.fuel >= 0 && i.fuel < 70:
                            statusClass = "bg-danger-light text-danger";
                            break;
                        default:
                            statusClass = "bg-none text-[#11466E] border border-[#C7D1D1]";
                            break;
                    }

                    return (
                        <li key={i.id} className="py-2 items-center justify-between">
                            <div className="flex flex-row items-center">
                                <div className="flex flex-col items-center">
                                    <div className="flex gap-1">
                                        {i.portBunkeringLocation ? (
                                            <>
                                                <img src="/assets/water-drop-icon.svg" alt="water drop icon" className="w-auto" />
                                                <span className="mb-1 text-[0.5rem] text-black font-light">{i.portBunkeringLocation}</span>
                                            </>
                                        ) : (<span className="mb-4"></span>)}
                                    </div>
                                    <div className={`flex flex-row ${i.isBunker ? 'pl-4' : ''}`}>
                                        <img src="/assets/vessel-logo.svg" alt="vessel logo" className="w-5 h-6" />
                                        {i.isBunker && (
                                            <Tooltip
                                                type={ButtonType.WATER_DROP}
                                                title="Remarks"
                                            >
                                                <div className="w-[100px]">
                                                    <span className="block whitespace-normal text-[0.563rem] font-normal">
                                                        There is a bunkering activity for this voyage
                                                    </span>
                                                </div>
                                            </Tooltip>
                                        )}
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xxs font-semibold ${statusClass}`}>
                                        {i.isPortBunkering ?
                                            (i.seaDays != null ? i.seaDays.toFixed(2).concat(' days') : '- days')
                                            : (i.fuel != null ? i.fuel.toFixed(2).concat('%') : '- %')}
                                    </span>
                                    <span className="py-1 flex gap-1">
                                        <label className="text-xxs font-bold text-gray-900">
                                            {i.voyageNo}
                                        </label>
                                        <span className="text-xxs font-normal text-gray-900">
                                            -
                                        </span>
                                        <label className="text-xxs font-normal text-gray-900">
                                            {i.date}
                                        </label>
                                    </span>
                                    <div className="py-1 flex items-center gap-1">
                                        <label className="text-xxs font-normal text-gray-900">
                                            {i.discharge}
                                        </label>
                                        <span className="-translate-y-0.5">
                                            <img src="/assets/arrow-right.svg" alt="vessel logo" className="w-5" />
                                        </span>
                                        <label className="text-xxs font-normal text-gray-900">
                                            {i.bunker}
                                        </label>
                                    </div>
                                </div>
                                {index < data.length - 1 && (
                                    <div className="w-10 translate-y-4 flex-shrink-0 border-t-2 border-dashed border-gray-200"></div>
                                )}
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default VoyageCard