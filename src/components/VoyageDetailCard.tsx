import { useState } from "react";
import InputUnit from "./InputUnit"
import Datepicker from "./Datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { DatepickerType } from "@/utils/enums/DatepickerEnum";
import DropdownSelect, { SelectOptionsType } from "./DropdownSelect";
import { SelectType } from "@/utils/enums/SelectEnum";

type VoyageDetailProp = {
    vesselCode: string | null;
    vesselStatus: string,
    voyageNumber: string | number | null;
    totalCoverageDays: number,
    totalDaysVoyage: number | null;
    placeholderDays: number | null;
    onChangeTotalDaysVoyage: (value: number | null) => void;
    placeholderPort: SelectOptionsType,
    plannedDate: Date | null;
    placeholderDate: Date | null;
    portListOptions: SelectOptionsType[];
    isSimulatePortEmpty: boolean;
    isSimulateCoverageDayEmpty: boolean;
    onChangePlannedDate: (value: Date | null) => void;
    onChangePort: (selected: SelectOptionsType | null) => void;
}

const VoyageDetailCard: React.FC<VoyageDetailProp> = ({
    vesselCode,
    vesselStatus,
    voyageNumber,
    totalCoverageDays,
    totalDaysVoyage,
    onChangeTotalDaysVoyage,
    placeholderPort,
    placeholderDays,
    plannedDate,
    placeholderDate,
    portListOptions,
    isSimulatePortEmpty,
    isSimulateCoverageDayEmpty,
    onChangePlannedDate,
    onChangePort
}) => {

    return (
        <div className="bg-white shadow-md p-4 mt-4 mx-auto rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <p className="text-sm mt-0 text-start font-bold font-[nunito]">Voyage Details</p>
            {vesselStatus.length > 0 && vesselStatus.toLowerCase().includes("no reporting") && (<p className="mt-5 mb-5 text-xs text-justify font-normal font-[nunito] italic">Note: The vessel has not submitted reports for the past 5 days, which may affect the accuracy of the remaining coverage day.</p>)}

            <div className="flex mt-12 justify-between">
                <div className="flex-col gap-2">
                    <div className="flex items-center font-[nunito] gap-2">
                        <p className="min-w-16 w-full text-xs font-normal text-[#030C13] truncate">Bunker Date</p>
                        <Datepicker
                            type={DatepickerType.SINGLE}
                            selected={plannedDate}
                            dateFormat="dd MMM yyyy"
                            onChange={(date: Date | null) => {
                                onChangePlannedDate(date)
                            }}
                            placeholder={placeholderDate ? format(placeholderDate, "dd MMM yyyy") : '-'}
                            className="text-justify text-xs font-normal p-2 rounded-2xl h-8 border border-[#C7D1D1] bg-white/60"
                            minDate={new Date()}
                            maxDate={new Date(new Date().setDate(new Date().getDate() + totalCoverageDays))}
                        />
                    </div>
                </div>
                <div className="flex items-center font-[nunito] gap-2">
                    <p className="min-w-16 text-xs font-normal text-[#030C13] truncate">Bunker Port</p>
                    <DropdownSelect
                        type={SelectType.SINGLE}
                        placeholder="Select Port"
                        name="port"
                        value={placeholderPort}
                        options={portListOptions}
                        onChange={onChangePort}
                        isError={isSimulatePortEmpty}
                    />
                </div>
                <div className="flex items-center font-[nunito] gap-2">
                    <p className="min-w-16 text-xs font-normal text-[#030C13] truncate">
                        Desired Coverage Days
                    </p>
                    <div className="min-w-20 w-32">
                        <InputUnit
                            value={totalDaysVoyage > 0 ? totalDaysVoyage : ''}
                            onChange={val => onChangeTotalDaysVoyage(Number(val))}
                            placeholder={placeholderDays > 0 ? placeholderDays : '-'}
                            unit="days"
                            isError={isSimulateCoverageDayEmpty}
                        />
                    </div>
                </div>
            </div>
            <p className="min-w-16 mt-2 text-[0.625rem] text-justify font-normal text-[#90A2A2] italic">
                {`*remaining fuel coverage is ${totalCoverageDays} days (sufficient until ${new Date(new Date().setDate(new Date().getDate() + totalCoverageDays)).toLocaleDateString("id-ID", {day: '2-digit', month: 'short', year: 'numeric'})}).`}<br /> Please select a date prior to this date.
            </p>
        </div>
    )
}

export default VoyageDetailCard