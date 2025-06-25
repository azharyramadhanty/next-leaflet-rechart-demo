import { PortDetailPerformanceType, VesselDetailPerformanceType } from "@/utils/Types";
import { formatCurrency } from "@/utils/Utils";
import ProgressBarGeneral from "./ProgressbarGeneral";
import { OverviewType } from "@/utils/enums/CardEnum";

type OverviewCardType = {
    isVisible: boolean,
    afterTransition: () => void,
    onClose: () => void,
    source: VesselDetailPerformanceType | PortDetailPerformanceType
    type: OverviewType,
}

const OverviewCard = ({ isVisible, afterTransition, onClose, source, type }: OverviewCardType) => {
    const vesselSource = source as VesselDetailPerformanceType;
    const portSource = source as PortDetailPerformanceType;
    let vesselPerformance = type === OverviewType.VESSEL_OVERVIEW && vesselSource && vesselSource.data.last_voyages.reduce((prev, current) => (prev + current.performance), 0) / 5;
    let portDiscrepancy = type === OverviewType.PORT_OVERVIEW && portSource && portSource.data.discrepancy != null ? portSource.data.discrepancy.toFixed(1) : '-';

    return (
        <>
            {/* <div className={`absolute bottom-0 left-0 top-5 right-10 max-w-[305px] mx-auto bg-gray-50 rounded-[20px] space-y-3 shadow-lg z-50 transition-transform duration-500 ${isVisible ? "-translate-x-0" : "translate-x-full"}`} */}
            <div className={`fixed bottom-10 right-0 max-w-[305px] bg-gray-50 rounded-[20px] shadow-lg z-50 transition-transform duration-500 ${isVisible ? "-translate-x-20" : "translate-x-full"}`}
                onTransitionEnd={() => afterTransition()} >
                <div className="py-2 px-4">
                    <div className="flex justify-between">
                        <div className="flex flex-col">
                            <p className="text-[12px] text-left font-normal font-[nunito]">
                                {type === OverviewType.VESSEL_OVERVIEW ? "Vessel " : ""}
                                <span className="font-bold text-gray-800">{type === OverviewType.VESSEL_OVERVIEW ? vesselSource && vesselSource.data.vessel_name : portSource && portSource.data.port_name}</span>
                                {type === OverviewType.PORT_OVERVIEW ? " Port" : ""}
                            </p>
                            <h3 className="text-[8px] text-black font-normal font-[nunito]">{type === OverviewType.VESSEL_OVERVIEW ? 'VO ' : 'ID '}{type === OverviewType.VESSEL_OVERVIEW ? vesselSource && vesselSource.data.voyage_no : portSource && portSource.data.port_id}</h3>
                        </div>
                        <button onClick={() => onClose()}>
                            <img src="/assets/close-icon.svg" alt="Close Icon" className="w-auto" />
                        </button>
                    </div>
                </div>

                <div className="flex h-px bg-slate-300 border-t-1" />

                <div className="py-2 px-4">
                    <div className="flex items-center justify-between text-[0.563rem] font-[nunito]">
                        <div className="flex gap-1 justify-start items-center">
                            <img src="/assets/clock-icon.svg" alt="Clock Icon" className="w-3 pb-[0.1rem]" />
                            <p className="text-gray-500 font-light">Last Updated <span className="ml-1">{type === OverviewType.VESSEL_OVERVIEW ? vesselSource && vesselSource.data.updated_time.toLocaleString("id-ID") : portSource && portSource.data.updated_time.toLocaleString("id-ID")}</span></p>
                        </div>
                        {type === OverviewType.VESSEL_OVERVIEW ?
                            (
                                vesselPerformance > 85 ?
                                    <span className="bg-[#CCFFDF] text-[#00802F] font-bold me-2 px-2.5 py-1 rounded-full">Safe</span>
                                    : (vesselPerformance > 74 && vesselPerformance <= 85 ? 
                                    <span className="bg-[#FFF2E5] text-[#EB6200] font-bold me-2 px-2.5 py-1 rounded-full">Warning</span> 
                                    : <span className="bg-red-500 text-white font-bold me-2 px-2.5 py-1 rounded-full">Monitor</span>)
                            ) : (
                                +portDiscrepancy < 5 ?
                                    (<div>
                                        <span className="bg-[#CCFFDF] text-[#00802F] font-bold me-2 px-2.5 py-1 rounded-full">Safe</span>
                                    </div>)
                                    :
                                    (portDiscrepancy === '-' ?
                                        (<div>
                                            <span className="font-bold me-2 px-2.5 py-1"></span>
                                        </div>) :
                                        (<div>
                                            <span className="bg-red-500 text-white font-bold me-2 px-2.5 py-1 rounded-full">Monitor</span>
                                        </div>)
                                    )
                            )
                        }
                    </div>

                    <div className="flex justify-center py-[0.20rem]">
                        <img className="h-16 rounded-lg" src={`${type === OverviewType.VESSEL_OVERVIEW ? vesselSource && vesselSource.data.img_url : portSource && portSource.data.img_url}`}></img>
                    </div>

                    {type === OverviewType.PORT_OVERVIEW && (
                        <>
                            <div className="flex flex-col pb-2 gap-1">
                                <div className="flex justify-between items-center">
                                    <p className="text-[0.563rem] font-normal font-[nunito]"><span className="font-bold">{portSource && portSource.data.on_going_vessel ? portSource.data.on_going_vessel : 0} Vessels</span> on going</p>
                                    <p className="text-[0.563rem] font-normal font-[nunito]">{portSource && portSource.data.port_name}</p>
                                </div>
                                <div className="flex gap-1 justify-between items-center">
                                    <img src="/assets/start-port.svg" alt="From Port Icon" className="w-auto" />
                                    <ProgressBarGeneral value={portSource && portSource.data.mileage_percentage} />
                                    <img src="/assets/end-port.svg" alt="To Port Icon" className="w-auto" />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex border rounded-lg justify-between items-end p-2 gap-2">
                        <div className="">
                            <p className="w-20 text-black font-semibold font-[nunito] text-[0.625rem]">{type === OverviewType.VESSEL_OVERVIEW ? (vesselSource && vesselSource.data.fuel_type != null ? vesselSource.data.fuel_type.map(it => it + ' ') : '' ) : portSource && portSource.data.port_type != null ? portSource.data.port_type : "-"}</p>
                            <p className="text-[0.563rem] font-light font-[nunito] -mt-1">{type === OverviewType.VESSEL_OVERVIEW ? 'Fuel Type' : 'Port Type'}</p>
                        </div>

                        <div className="">
                            <p className="text-black font-semibold text-[0.625rem]">{type === OverviewType.VESSEL_OVERVIEW ? (vesselSource && vesselSource.data.cargo_capacity != null ? vesselSource.data.cargo_capacity.toFixed(0).concat(' KL') : "-") : (portSource && portSource.data.bunker_inventory != null ? portSource.data.bunker_inventory.toFixed(0).concat(' MT') : "-")}</p>
                            <p className="text-[0.563rem] font-light -mt-1">{type === OverviewType.VESSEL_OVERVIEW ? 'Cargo Capacity' : 'Bunker Inv YTD'}</p>
                        </div>

                        <div className="">
                            <p className="text-black font-semibold text-[0.625rem]">{type === OverviewType.VESSEL_OVERVIEW ? (vesselSource && vesselSource.data.vessel_type != null ? vesselSource.data.vessel_type.vessel_type_name : "-" ) : (portSource && portSource.data.weekly_demand != null ? portSource.data.weekly_demand.toFixed(0).concat(' MT') : "-")}</p>
                            <p className="text-[0.563rem] font-light -mt-1">{type === OverviewType.VESSEL_OVERVIEW ? 'Vessel Type' : 'Weekly Demand'}</p>
                        </div>
                    </div>

                    {type === OverviewType.VESSEL_OVERVIEW && (
                        <div className=" flex py-1 justify-between items-center">
                            <h5 className="text-[0.650rem] font-normal font-[nunito] text-left translate-y-1">Last 5 Voyages</h5>
                            <div className="flex gap-0.5">
                                {vesselSource && vesselSource.data.last_voyages.map((it, idx) => (
                                    <>
                                        {it.performance == null && (<img key={idx} src="/assets/badge-null-leaderboard-item.svg" className="h-auto mt-1" />)}
                                        {it.performance > 0 && it.performance < 75 && (<img key={idx} src="/assets/badge-danger-leaderboard-item.svg" className="h-auto mt-1" />)}
                                        {it.performance > 74 && it.performance <= 85 && (<img key={idx} src="/assets/badge-none-leaderboard-item.svg" className="h-auto mt-1" />)}
                                        {it.performance > 85 && (<img key={idx} src="/assets/badge-done-leaderboard-item.svg" className="h-auto mt-1" />)}
                                    </>
                                ))}
                            </div>
                        </div>
                    )}

                    {type === OverviewType.PORT_OVERVIEW && (
                        <div className="flex py-1 justify-between items-center">
                            <h5 className="text-[12px] font-normal font-[nunito]">Bunker Supplied</h5>
                            <div className="flex pl-3 pr-3 pt-2 pb-2 bg-[#F9FAFA] items-end rounded-xl shadow-sm">
                                <h3 className="text-[12px] font-semibold font-[nunito] text-black">{portSource && portSource.data.bunker_supplied != null ? portSource.data.bunker_supplied.toFixed(1) : "-"}</h3>
                                <span className="text-xxs ml-2 font-semibold font-[nunito] text-black">MT</span>
                            </div>
                        </div>
                    )}

                    <div className="flex py-1 gap-1 justify-between items-center text-black">
                        {type === OverviewType.VESSEL_OVERVIEW && (
                            <>
                                <div className="flex flex-col pt-2 pb-1 ps-3 pe-3 min-w-20 w-full min-h-20 h-full justify-between bg-[#F9FAFA] font-[nunito] rounded-xl text-left shadow-sm">
                                    <h5 className="font-normal text-[8px] ">Profit / Loss YTD</h5>
                                    <div className="text-center font-bold transition flex items-center">
                                        <span className="text-[15px]">{vesselSource && vesselSource.data.kpi && vesselSource.data.kpi.profit_loss != null ? formatCurrency(+vesselSource.data.kpi.profit_loss.toFixed(1)) : "-"}</span>
                                        <span className="-mb-1 pl-1 text-[8px]">USD</span>
                                    </div>
                                </div>
                                <div className="flex flex-col pt-2 pb-1 ps-3 pe-3 min-w-20 w-full min-h-20 h-full justify-between bg-[#F9FAFA] font-[nunito] rounded-xl text-left shadow-sm">
                                    <h5 className="font-normal text-[8px] ">Shipping Cost / Vol Cargo YTD</h5>
                                    <div className="text-center font-bold transition flex items-center">
                                        <span className="text-[15px] ">{vesselSource && vesselSource.data.kpi && vesselSource.data.kpi.shipping_cost_vol_cargo != null ? formatCurrency(+vesselSource.data.kpi.shipping_cost_vol_cargo.toFixed(1)) : "-"}</span>
                                        <span className="-mb-1 pl-1 text-[8px]">USD/KL</span>
                                    </div>
                                </div>
                            </>
                        )}
                        <div className={`flex flex-col pt-2 pb-1 ps-3 pe-3 min-w-20 w-full min-h-20 h-full justify-between ${+portDiscrepancy < 5 ? 'bg-[#CCFFDF]' : 'bg-[#F9FAFA]'}  font-[nunito] rounded-xl text-left shadow-sm`}>
                            <h5 className="font-normal text-[8px] ">{type === OverviewType.VESSEL_OVERVIEW ? 'Bunker Supply / Vol Cargo YTD' : 'Discrepancy'}</h5>
                            <div className="text-center font-bold transition flex items-center">
                                <span className="text-[15px]">{type === OverviewType.VESSEL_OVERVIEW ? (vesselSource && vesselSource.data.kpi && vesselSource.data.kpi.bunker_supply_vol_cargo != null ? formatCurrency(+vesselSource.data.kpi.bunker_supply_vol_cargo.toFixed(1)) : '-') : (portDiscrepancy)}</span>
                                <span className="-mb-1 pl-1 text-[8px]">{type === OverviewType.VESSEL_OVERVIEW ? 'MT/KL' : '%'}</span>
                            </div>
                        </div>
                    </div>

                    {type === OverviewType.VESSEL_OVERVIEW && (
                        <div className="pt-1 pb-2 col-span-2">
                            <div className="p-0 flex justify-between items-center transition">
                                <p className="text-[8px] font-normal font-[nunito]">Departure From <span className="font-bold">{vesselSource && vesselSource.data.start_port.port_name ? vesselSource.data.start_port.port_name : "-"}</span></p>
                                <p className="text-[8px] font-normal font-[nunito]">Arrive at <span className="font-bold">{vesselSource && vesselSource.data.end_port.port_name ? vesselSource.data.end_port.port_name : "-"}</span></p>
                            </div>
                            <div className="flex pt-1 pb-1 gap-1 justify-between items-center">
                                <img src="/assets/start-port.svg" alt="From Port Icon" className="w-auto" />
                                <ProgressBarGeneral value={type === OverviewType.VESSEL_OVERVIEW && vesselSource && vesselSource.data.milleage} />
                                <img src="/assets/end-port.svg" alt="To Port Icon" className="w-auto" />
                            </div>
                            <div className="pt-0 pb-2 flex justify-between items-center transition">
                                <h5 className="text-black text-[10px]">{vesselSource && vesselSource.data.start_port.country_code}&nbsp;{vesselSource && vesselSource.data.start_port.un_code}</h5>
                                <h5 className="text-black text-[10px]">{vesselSource && vesselSource.data.end_port.country_code}&nbsp;{vesselSource && vesselSource.data.end_port.un_code}</h5>
                            </div>
                            <div className="pt-0 font-[nunito] flex justify-between items-center transition">
                                <div>
                                    <p className="text-slate-500 text-[8px] font-normal">Bunker Supplied YTD</p>
                                    <p className="text-black text-[10px] font-semibold">{vesselSource && vesselSource.data.total_bunker_supplied != null ? vesselSource.data.total_bunker_supplied : "-"} <span>MT</span></p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-[8px] font-normal">Fuel ROB</p>
                                    <p className="text-black text-[10px] font-semibold">{vesselSource && vesselSource.data.fuel_rob != null ? vesselSource.data.fuel_rob : "-"} <span>MT</span></p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-[8px] font-normal">Cargo Shipped YTD</p>
                                    <p className="text-black text-[10px] font-semibold">{vesselSource && vesselSource.data.cargo_shipped != null ? vesselSource.data.cargo_shipped : "-"} <span>KL</span></p>
                                </div>
                            </div>
                        </div>
                    )}
                </div >
            </div>
        </>
    );
}

export default OverviewCard;