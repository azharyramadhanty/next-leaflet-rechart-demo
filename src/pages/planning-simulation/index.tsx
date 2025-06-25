import { ColumnDef, SortingState } from "@tanstack/react-table";
import DataTableFilterCard, { FilterDataType } from "@/components/DataTableFilterCard";
import { AlignType, FilterType, InputType } from "@/utils/enums/DatatableEnum";
import { useCallback, useEffect, useState } from "react";
import { PaginationType } from "@/components/DataTable";
import BaseCard from "@/components/BaseCard";
import { BaseCardType } from "@/utils/enums/CardEnum";
import { useTitle } from "@/context/TitleContext";
import DropdownSelect, { SelectOptionsType } from "@/components/DropdownSelect";
import { SelectType } from "@/utils/enums/SelectEnum";
import Image from "next/image";
import VoyageDetailCard from "@/components/VoyageDetailCard";
import { format } from "date-fns";
import VoyageCard, { VoyageDataType } from "@/components/VoyageCard";
import { VesselToBunkerDataModel, VesselToBunkerDetailType, VesselToBunkerSimulationResultDataModel } from "@/utils/Types";
import { useVessel } from "@/hooks/vessels/useVessel";
import { formatCurrency, toEpochSeconds } from "@/utils/Utils";
import { usePort } from "@/hooks/port/usePort";
import Spinner from "@/components/Spinner";
import { VesselToBunkerFuelIndicatorType, VesselToBunkerSimulationSaveStatus, VesselToBunkerSimulationStatus } from "@/utils/enums/VesselEnum";
import { useSimulationCtx } from "@/context/SimulationContext";
import { Alert } from "flowbite-react";

const PlanningAndSimulation = () => {
    const { setTitle } = useTitle();
    const { simulationLoading, setSimulationLoading } = useSimulationCtx();
    // const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(new Date().getFullYear(), 0, 1), new Date()]);
    const [vesselOptions, setVesselOptions] = useState<SelectOptionsType[]>([]);
    const [selectedVesselOption, setSelectedVessel] = useState<SelectOptionsType | null>(null);
    const [vesselFilterListOptions, setVesselFilterListOptions] = useState<SelectOptionsType[]>([]);
    const [selectedVesselFilterOption, setSelectedVesselFilter] = useState<SelectOptionsType>(null);
    const [reportStatusOptions, setReportStatusOptions] = useState<SelectOptionsType[]>([]);
    const [selectedStatusOption, setSelectedStatus] = useState<SelectOptionsType>(null);
    const [portOptions, setPortOptions] = useState<SelectOptionsType[]>([]);
    const [selectedPort, setSelectedPort] = useState<SelectOptionsType>(null);
    const [totalDaysVoyage, setTotalDaysVoyage] = useState<number>(null);
    const [plannedDate, setPlannedDate] = useState<Date>(new Date());
    const [sortCoverageDays, setSortCoverageDays] = useState("desc");
    const [sortVesselToBunker, setSortVesselToBunker] = useState<SortingState>([
        {id: "coverageDays", desc: true}
    ]);
    const [simulationRunId, setSimulationRunId] = useState(0);
    const [simulationId, setSimulationId] = useState("");
    const [vesselToBunkerList, setVesselToBunkerList] = useState<VesselToBunkerDataModel[]>([]);
    const [vesselToBunkerDetail, setVesselToBunkerDetail] = useState<VesselToBunkerDetailType>(null);
    const [latestVoyage, setLatestVoyages] = useState<VoyageDataType[]>([]);
    const [placeholderDays, setPlaceholderDays] = useState<number>(null);
    const [voyageNumber, setVoyageNumber] = useState<string | number>(null);
    const [placeholderDate, setPlaceholderDate] = useState<Date>(null);
    const [vesselToBunkerSimulationResult, setVesselToBunkerSimulationResult] = useState<VesselToBunkerSimulationResultDataModel[] | null>([]);
    const [paginationVesselBunker, setPaginationVesselBunker] = useState<PaginationType>({
        pageIndex: 0,
        pageSize: 5,
        totalRows: 0,
        totalPage: 0
    });
    
    const {
        useVesselAllListQuery,
        useVesselToBunkerReportQuery,
        useVesselToBunkerStatusQuery,
        useVesselToBunkerDetailQuery,
        useLatestVoyagesQuery,
        useVesselToBunkerRunSimulationQuery,
        useVesselToBunkerSimulationStatusQuery,
        useVesselToBunkerSimulationResultQuery,
        useVesselToBunkerSimulationSaveQuery,
        useVesselToBunkerExportQuery
    } = useVessel();
    const {
        data: fetchVesselListData,
        error: fetchVesselListErrorData,
        isError: fetchVesselListError,
        isSuccess: fetchVesselListSuccess
    } = useVesselAllListQuery();
    const {
        data: fetchVesselToBunkerStatusData,
        error: fetchVesselToBunkerStatusErrorData,
        isError: fetchVesselToBunkerStatusError,
        isSuccess: fetchVesselToBunkerStatusSuccess
    } = useVesselToBunkerStatusQuery();
    const { usePortSearchAllQuery } = usePort();
    const {
        data: fetchPortSearchAllData,
        error: fetchPortSearchErrorData,
        isError: fetchPortSearchError,
        isSuccess: fetchPortSearchSuccess
      } = usePortSearchAllQuery(true);
    const vesselToBunkerReportQuery = useVesselToBunkerReportQuery(selectedStatusOption ? String(selectedStatusOption.value) : "", selectedVesselFilterOption ? String(selectedVesselFilterOption.key) : "", sortCoverageDays, paginationVesselBunker.pageIndex + 1, paginationVesselBunker.pageSize);
    const vesselToBunkerDetailQuery = useVesselToBunkerDetailQuery(selectedVesselOption ? String(selectedVesselOption.key) : "");
    const vesselToBunkerRunSimulationQuery = useVesselToBunkerRunSimulationQuery(vesselToBunkerDetail && vesselToBunkerDetail.data.vessel_code, vesselToBunkerDetail && vesselToBunkerDetail.data.vessel_type, vesselToBunkerDetail && vesselToBunkerDetail.data.vessel_name, totalDaysVoyage, toEpochSeconds(plannedDate), selectedPort && String(selectedPort.value));
    const vesselToBunkerSimulationCheckStatusQuery = useVesselToBunkerSimulationStatusQuery(simulationRunId);
    const vesselToBunkerSimulationGetResultQuery = useVesselToBunkerSimulationResultQuery(simulationLoading.split(" ")[1]);
    const vesselToBunkerSimulationSaveResultQuery = useVesselToBunkerSimulationSaveQuery(
        simulationId && simulationId, 
        vesselToBunkerSimulationResult && vesselToBunkerSimulationResult.length > 0 ? vesselToBunkerSimulationResult[0].vesselCode : "", 
        vesselToBunkerSimulationResult && vesselToBunkerSimulationResult.length > 0 ? String(portOptions.find(it => String(it.value).includes(vesselToBunkerSimulationResult[0].bunkerPort)) ? portOptions.find(it => String(it.value).includes(vesselToBunkerSimulationResult[0].bunkerPort)).key : "") : "", 
        vesselToBunkerSimulationResult && vesselToBunkerSimulationResult.length > 0 ? toEpochSeconds(vesselToBunkerSimulationResult[0].bunkerDate) : 0, 
        vesselToBunkerSimulationResult && vesselToBunkerSimulationResult.length > 0 && +vesselToBunkerSimulationResult[0].hfo,
        vesselToBunkerSimulationResult && vesselToBunkerSimulationResult.length > 0 && +vesselToBunkerSimulationResult[0].mdf,
        vesselToBunkerSimulationResult && vesselToBunkerSimulationResult.length > 0 && +vesselToBunkerSimulationResult[0].mgo,
        vesselToBunkerSimulationResult && vesselToBunkerSimulationResult.length > 0 && +vesselToBunkerSimulationResult[0].mfo,
        vesselToBunkerSimulationResult && vesselToBunkerSimulationResult.length > 0 && +vesselToBunkerSimulationResult[0].lfo,
        vesselToBunkerSimulationResult && vesselToBunkerSimulationResult.length > 0 && +vesselToBunkerSimulationResult[0].hsd,
        vesselToBunkerSimulationResult && vesselToBunkerSimulationResult.length > 0 && vesselToBunkerSimulationResult[0].coverageDays,
    )
    const vesselToBunkerExportQuery = useVesselToBunkerExportQuery(selectedVesselFilterOption ? String(selectedVesselFilterOption.key) : "", selectedStatusOption ? String(selectedStatusOption.value) : "");
    // const vesselLatestVoyageQuery = useLatestVoyagesQuery(selectedVesselOption ? String(selectedVesselOption.key) : "", toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()), toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date()));
    const vesselLatestVoyageQuery = useLatestVoyagesQuery(selectedVesselOption ? String(selectedVesselOption.key) : "", 0, toEpochSeconds(new Date()));
    const [simulateBunkerPortEmpty, setSimulateBunkerPortEmpty] = useState(true);
    const [simulateCoverageDayEmpty, setSimulateCoverageDayEmpty] = useState(true);
    const [vesselAlreadyHasPlan, setVesselAlreadyHasPlan] = useState(false);
    const [isToastVesselPlanVisible, setToastVesselPlanVisible] = useState(false);
    const indicatorIcons: Record<VesselToBunkerFuelIndicatorType, React.JSX.Element> = {
        [VesselToBunkerFuelIndicatorType.FUEL_LOW]: <Image width={0} height={0} className="w-auto h-[11rem]" src={"assets/fuel-rob-diagram-0-20.svg"} alt={"Fuel ROB Diagram 0-20"} />,
        [VesselToBunkerFuelIndicatorType.FUEL_LOW_TO_MIDDLE]: <Image width={0} height={0} className="w-auto h-[11rem]" src={"assets/fuel-rob-diagram-20-60.svg"} alt={"Fuel ROB Diagram 20-60"} />,
        [VesselToBunkerFuelIndicatorType.FUEL_MIDDLE]: <Image width={0} height={0} className="w-auto h-[11rem]" src={"assets/fuel-rob-diagram-60-80.svg"} alt={"Fuel ROB Diagram 60-80"} />,
        [VesselToBunkerFuelIndicatorType.FUEL_MIDDLE_TO_FULL]: <Image width={0} height={0} className="w-auto h-[11rem]" src={"assets/fuel-rob-diagram-80-full.svg"} alt={"Fuel ROB Diagram 80-full"} />,
    };

    // Datatable stuff
    const columnVesselBunker: ColumnDef<VesselToBunkerDataModel>[] = [
        {
            accessorKey: "no",
            enableSorting: false,
            size: 3.5,
            header: () => (
                <div className="text-[0.688rem]">No.</div>
            ),
            cell: ({ row, table }) => {
                const meta = table.options.meta as { pageIndex: number; pageSize: number };
                return (
                    <div
                        className='text-center text-[0.563rem]'
                    >
                        {meta.pageIndex * meta.pageSize + row.index + 1}
                    </div>
                )
            }
        },
        {
            accessorKey: "vesselName",
            enableSorting: false,
            size: 12,
            header: () => (
                <div className="text-[0.688rem]">Vessel Name</div>
            ),
            cell: ({ getValue }) => {
                return (
                    <div
                        className='text-[0.563rem]'
                    >
                        {getValue() as string}
                    </div>
                )
            }
        },
        {
            accessorKey: "mfoRob",
            enableSorting: false,
            size: 8,
            header: () => (
                <div className="text-[0.688rem]">MFO ROB</div>
            ),
            cell: ({ getValue }) => {
                return (
                    <div
                        className='text-[0.563rem]'
                    >
                        {getValue() as string}
                    </div>
                )
            }
        },
        {
            accessorKey: "lfoRob",
            enableSorting: false,
            size: 8,
            header: () => (
                <div className="text-[0.688rem]">LFO ROB</div>
            ),
            cell: ({ getValue }) => {
                return (
                    <div
                        className='text-[0.563rem]'
                    >
                        {getValue() as string}
                    </div>
                )
            }
        },
        {
            accessorKey: "hfoRob",
            enableSorting: false,
            size: 8,
            header: () => (
                <div className="text-[0.688rem]">HFO ROB</div>
            ),
            cell: ({ getValue }) => {
                return (
                    <div
                        className='text-[0.563rem]'
                    >
                        {getValue() as string}
                    </div>
                )
            }
        },
        {
            accessorKey: "mdfRob",
            enableSorting: false,
            size: 8,
            header: () => (
                <div className="text-[0.688rem]">MDF ROB</div>
            ),
            cell: ({ getValue }) => {
                return (
                    <div
                        className='text-[0.563rem]'
                    >
                        {getValue() as string}
                    </div>
                )
            }
        },
        {
            accessorKey: "mgoRob",
            enableSorting: false,
            size: 8,
            header: () => (
                <div className="text-[0.688rem]">MGO ROB</div>
            ),
            cell: ({ getValue }) => {
                return (
                    <div
                        className='text-[0.563rem]'
                    >
                        {getValue() as string}
                    </div>
                )
            }
        },
        {
            accessorKey: "hsdRob",
            enableSorting: false,
            size: 8,
            header: () => (
                <div className="text-[0.688rem]">HSD ROB</div>
            ),
            cell: ({ getValue }) => {
                return (
                    <div
                        className='text-[0.563rem]'
                    >
                        {getValue() as string}
                    </div>
                )
            }
        },
        {
            accessorKey: "coverageDays",
            enableSorting: true,
            size: 5.5,
            header: () => (
                <div className="text-[0.688rem]">Cover Days</div>
            ),
            cell: ({ getValue }) => {
                const value = getValue() as number
                return (
                    <div
                        className='text-[0.563rem]'
                    >
                        {value > 0 ? value : '-'}
                    </div>
                )
            },
        },
        // {
        //     accessorKey: "vesselRequestDate",
        //     enableSorting: false,
        //     size: 10,
        //     header: () => (
        //         <div className="text-[0.688rem]">Vessel Req Date</div>
        //     ),
        //     accessorFn: (row) => format(row.vesselRequestDate, "EEE, dd MMM yyyy"),
        //     cell: ({ getValue, row }) => {
        //         return (
        //             <div
        //                 className='text-[0.563rem]'
        //             >
        //                 {row.original.vesselRequestDate === 0 ? "-" : getValue() as string}
        //             </div>
        //         )
        //     }
        // },
        {
            accessorKey: "latestUpdated",
            enableSorting: false,
            size: 10,
            header: () => (
                <div className="text-[0.688rem]">Latest Updated Date</div>
            ),
            accessorFn: (row) => format(row.latestUpdated, "EEE, dd MMM yyyy"),
            cell: ({ getValue, row }) => {
                return (
                    <div
                        className='text-[0.563rem]'
                    >
                        {row.original.latestUpdated === 0 ? "-" : getValue() as string}
                    </div>
                )
            }
        },
        {
            accessorKey: "status",
            size: 9,
            enableSorting: false,
            header: () => (
                <div className="text-[0.688rem]">Status</div>
            ),
            cell: ({ getValue }) => {
                const status = getValue() as string;
                let statusClass: string;

                switch (status) {
                    case "Critical Fuel ROB":
                        statusClass = "bg-[#FAD1D2] text-[#EA3A3D]";
                        break;
                    case "Safe":
                        statusClass = "bg-[#CCFFDF] text-[#00802F]";
                        break;
                    default:
                        statusClass = "bg-white text-[#11466E]";
                }

                return (
                    <span
                        className={`py-1 pl-1.5 pr-1.5 rounded-full text-[0.563rem] font-semibold ${statusClass}`}
                    >
                        {status}
                    </span>
                )
            },
        },
        {
            accessorKey: "action",
            header: () => (
                <div className="text-[0.688rem]">Action</div>
            ),
            cell: ({ row }) => {
                const handleClick = () => {
                    setSelectedVessel({
                        key: row.original.vesselCode,
                        value: row.original.vesselName
                    })
                    setSelectedPort(null);
                    setTotalDaysVoyage(null);
                    if (vesselToBunkerSimulationResult.length > 0) setVesselToBunkerSimulationResult([]);
                };

                return (
                    <button
                        onClick={handleClick}
                        disabled={row.original.hasPlan}
                        className={`${row.original.hasPlan ? 'bg-[#C7D1D1] text-white' : 'bg-white border text-black'} border-[#C7D1D1] font-bold font-[nunito] text-xs px-4 py-1 rounded-[99px] inline-flex items-center justify-center gap-2`}
                    >
                        <span>Make Plan</span>
                        <Image src={`/assets/arrow-right-short-icon.svg`} alt={'arrow right'} width={13} height={13} />
                    </button>
                )
            },
            enableSorting: false
        }
    ];
    const columnResult: ColumnDef<VesselToBunkerSimulationResultDataModel>[] = [
        {
            accessorKey: "vesselName",
            enableSorting: false,
            size: 12,
            header: () => (
                <div className="text-xs">Vessel Name</div>
            ),
            cell: ({ getValue }) => {
                return (
                    <div
                        className='text-xs'
                    >
                        {getValue() as string}
                    </div>
                )
            }
        },
        {
            accessorKey: "hfo",
            enableSorting: false,
            size: 6,
            meta: { editable: true, emptyNotShow: true, inputType: InputType.TEXT },
            header: () => (
                <div className="text-xs">HFO Vol.</div>
            ),
            cell: ({ getValue }) => {
                return (
                    <div
                        className='text-xs'
                    >
                        {getValue() as string}
                    </div>
                )
            }
        },
        {
            accessorKey: "lfo",
            enableSorting: false,
            size: 6,
            header: () => (
                <div className="text-xs">LFO Vol.</div>
            ),
            meta: { editable: true, emptyNotShow: true, inputType: InputType.TEXT },
            cell: ({ getValue }) => {
                return (
                    <div
                        className='text-xs'
                    >
                        {getValue() as string}
                    </div>
                )
            }
        },
        {
            accessorKey: "mgo",
            enableSorting: false,
            size: 6,
            meta: { editable: true, emptyNotShow: true, inputType: InputType.TEXT },
            header: () => (
                <div className="text-xs">MGO Vol.</div>
            ),
            cell: ({ getValue }) => {
                return (
                    <div
                        className='text-xs'
                    >
                        {getValue() as string}
                    </div>
                )
            }
        },
        {
            accessorKey: "mfo",
            enableSorting: false,
            size: 6,
            meta: { editable: true, emptyNotShow: true,inputType: InputType.TEXT },
            header: () => (
                <div className="text-xs">MFO Vol.</div>
            ),
            cell: ({ getValue }) => {
                return (
                    <div
                        className='text-xs'
                    >
                        {getValue() as string}
                    </div>
                )
            }
        },
        {
            accessorKey: "hsd",
            enableSorting: false,
            size: 6,
            meta: { editable: true, emptyNotShow: true,inputType: InputType.TEXT },
            header: () => (
                <div className="text-xs">HSD Vol.</div>
            ),
            cell: ({ getValue }) => {
                return (
                    <div
                        className='text-xs'
                    >
                        {getValue() as string}
                    </div>
                )
            }
        },
        {
            accessorKey: "mdf",
            enableSorting: false,
            size: 6,
            meta: { editable: true, emptyNotShow: true,inputType: InputType.TEXT },
            header: () => (
                <div className="text-xs">MDF Vol.</div>
            ),
            cell: ({ getValue }) => {
                return (
                    <div
                        className='text-xs'
                    >
                        {getValue() as string}
                    </div>
                )
            }
        },
        {
            accessorKey: "coverageDays",
            enableSorting: false,
            size: 5.5,
            meta: { editable: true, inputType: InputType.TEXT },
            header: () => (
                <div className="text-xs">Coverage Days</div>
            ),
            cell: ({ getValue }) => {
                return (
                    <div
                        className='text-xs'
                    >
                        {getValue() as string}
                    </div>
                )
            }
        },
        {
            accessorKey: "bunkerPort",
            enableSorting: false,
            size: 10,
            meta: { editable: true, inputType: InputType.DROPDOWN, optionsDropdown: portOptions},
            header: () => (
                <div className="text-xs">Bunker Port</div>
            ),
            cell: ({ getValue }) => {
                return (
                    <div
                        className='text-xs'
                    >
                        {getValue() as string}
                    </div>
                )
            }
        },
        {
            accessorKey: "bunkerDate",
            enableSorting: false,
            size: 10,
            meta: { editable: true, inputType: InputType.DATE, additionalValue: vesselToBunkerDetail ? vesselToBunkerDetail.data.total_coverage_days : 0 },
            header: () => (
                <div className="text-xs">Bunker Date</div>
            ),
            accessorFn: (row) => format(row.bunkerDate, "dd MMM yyyy"),
            cell: ({ getValue }) => {
                return (
                    <div
                        className='text-xs'
                    >
                        {getValue() as string}
                    </div>
                )
            }
        },
        {
            accessorKey: "seaState",
            enableSorting: false,
            size: 5.5,
            header: () => (
                <div className="text-xs">Sea State</div>
            ),
            cell: ({ getValue }) => {
                return (
                    <div
                        className='text-xs'
                    >
                        {getValue() as string}
                    </div>
                )
            }
        },
        {
            accessorKey: "action",
            header: () => (
                <div className="text-xs">Action</div>
            ),
            meta: { editAction: vesselAlreadyHasPlan ? false : true },
            enableSorting: false,
            cell: ({ row, column }) => {
                const handleClick = () => {
                    putSaveSimulationResult();
                };

                return (
                    <button
                        onClick={handleClick}
                        disabled={vesselAlreadyHasPlan}
                        className={`${vesselAlreadyHasPlan ? 'bg-[#C7D1D1] text-white' : 'bg-white border text-black'} border-[#C7D1D1] font-bold font-[nunito] text-xs px-4 py-1 rounded-[99px] inline-flex items-center justify-center gap-2`}
                    >
                        <Image src={`${vesselAlreadyHasPlan ? '/assets/check-mark-white.svg' : '/assets/download-icon.svg'}`} alt={'download icon'} width={16} height={16} style={{ width: 16, height: 16 }} />
                        <span>{vesselAlreadyHasPlan ? "Saved" : "Save"}</span>
                    </button>
                )
            }
        }
    ];
    const filterVesselBunker: FilterDataType = {
        align: AlignType.ALIGN_ITEM_LEFT,
        list: [
            {
                nameColumn: "vessel",
                type: FilterType.DROPDOWN_SEARCH,
                name: 'vessel',
                placeholder: "Select Vessel",
                data: vesselFilterListOptions,
                value: selectedVesselFilterOption,
                fnOnChange: setSelectedVesselFilter
            },
            {
                nameColumn: "status",
                type: FilterType.DROPDOWN_SEARCH,
                name: 'status',
                placeholder: "Select Status",
                data: reportStatusOptions,
                value: selectedStatusOption,
                fnOnChange: setSelectedStatus
            }
        ]
    }

    const updateResult = (rowIndex, value) => {
        setVesselToBunkerSimulationResult((oldData) =>
            oldData.map((row, index) => index === rowIndex ? value : row)
        );
    };

    const updateSimulationResult = () => {
        vesselToBunkerSimulationGetResultQuery.mutateAsync()
            .then(it => {
                setVesselToBunkerSimulationResult([{
                    id: 0,
                    vesselCode: it.data.vessel_code,
                    vesselName: it.data.vessel_name,
                    hfo: it.data.hfo.toFixed(0),
                    mdf: it.data.mdf.toFixed(0),
                    mgo: it.data.mgo.toFixed(0),
                    mfo: it.data.mfo.toFixed(0),
                    lfo: it.data.lfo.toFixed(0),
                    hsd: it.data.hsd.toFixed(0),
                    coverageDays: it.data.coverage_days,
                    bunkerPort: it.data.bunker_port,
                    bunkerDate: it.data.bunker_date,
                    seaState: it.data.sea_state,
                    expandItems: {
                        label: "AI Insights",
                        items: [{ key: "insight", value: it.data.insight }]
                    },
                    savedStatus: VesselToBunkerSimulationSaveStatus.SIMULATION_NOT_SAVED
                }]);
                setSimulationId(simulationLoading.split(" ")[1]);
                setTotalDaysVoyage(it.data.coverage_days);
                setSelectedPort({key: "", value: it.data.bunker_port});
                setSimulateBunkerPortEmpty(false);
                setSimulateCoverageDayEmpty(false);
            })
            .catch(error => { 
                setVesselToBunkerSimulationResult([]);
                /*console.log("Error Vessel To Bunker Get Simulation Result", error) */
            });
    }

    const putSaveSimulationResult = () => {
        vesselToBunkerSimulationSaveResultQuery.mutateAsync()
            .then(it => {
                if (it.data === VesselToBunkerSimulationSaveStatus.SIMULATION_SUCCESS) {
                    setVesselAlreadyHasPlan(true);
                    // setVesselToBunkerSimulationResult(
                    //     vesselToBunkerSimulationResult.map((it, idx) => idx === 0 ? {...it, status: VesselToBunkerSimulationSaveStatus.SIMULATION_SUCCESS} : it)
                    // )
                    // reload vesselToBunkerReport
                    setPaginationVesselBunker({
                        pageIndex: 0,
                        pageSize: 5,
                        totalRows: 0,
                        totalPage: 0
                    });
                }
            })
            .catch(error => { 
                alert("Failed to Save Simulation Result");
                /*console.log("Error Vessel To Bunker Get Simulation Result", error) */
            });
    }

    const handleRunSimulation = () => {
        if (selectedPort !== null && totalDaysVoyage > 0) {
            setSimulationLoading("Loading");
            if (vesselToBunkerSimulationResult.length > 0) setVesselToBunkerSimulationResult([]);
            vesselToBunkerRunSimulationQuery.mutateAsync()
                .then(it => {
                    setSimulationRunId(it.data.run_id);
                })
                .catch(error => {/* console.log("Error Run Vessel To Bunker Simulation", error) */});
    
            // background task to check simulation status
            const housekeeper = setInterval(() => {
                console.log("this is housekeeper run simulation duty");
                if (simulationLoading !== 'Success') {
                    vesselToBunkerSimulationCheckStatusQuery.mutateAsync()
                        .then(it => {
                            // console.log("job id: ", it.data.job_id);
                            // console.log("simulation status: ", it.data.status);
                            if (it.data.status === VesselToBunkerSimulationStatus.SIMULATION_SUCCESS) {
                                setSimulationLoading(`Success ${it.data.simulation_id} ${selectedVesselOption.key} ${selectedVesselOption.value}`);
                                setSimulationId(it.data.simulation_id);
                                clearInterval(housekeeper);
                                setTimeout(() => setSimulationLoading("Run Simulation"), 3000);
                            } 
                            if (it.data.status === VesselToBunkerSimulationStatus.SIMULATION_FAILED) {
                                setSimulationLoading("Failed");
                                clearInterval(housekeeper);
                                setTimeout(() => setSimulationLoading("Run Simulation"), 3000);
                            }
                        })
                        .catch(error => {
                            // console.log("Error Vessel To Bunker Check Simulation", error);
                            setSimulationLoading("Failed");
                            clearInterval(housekeeper);
                            setTimeout(() => setSimulationLoading("Run Simulation"), 3000);
                        });
                }
            }, 3000);
        } else {
            if (selectedPort === null) setSimulateBunkerPortEmpty(true);
            if (totalDaysVoyage === 0) setSimulateCoverageDayEmpty(true);
        }
    }

    const updateVessels = useCallback(() => {
        if (fetchVesselListSuccess) {
            setVesselOptions(fetchVesselListData.data.map(it => ({
                key: it.vessel_code,
                value: it.vessel_name
            })));
            setVesselFilterListOptions(fetchVesselListData.data.map(it => ({
                key: it.vessel_code,
                value: it.vessel_name
            })));
        }
    }, [fetchVesselListData]);

    const fetchPort = useCallback(() => {
        if (fetchPortSearchSuccess) {
            setPortOptions(fetchPortSearchAllData.data.map(each => ({
                key: each.port_id,
                value: each.port_name
            })))
        }
    }, [fetchPortSearchAllData]);

    const updateVesselToBunkerStatus = useCallback(() => {
        if (fetchVesselToBunkerStatusSuccess) {
            setReportStatusOptions(fetchVesselToBunkerStatusData.data.map((it, idx) => ({
                key: idx,
                value: it
            })));
        }
    }, [fetchVesselToBunkerStatusData]);

    const updateVesselToBunkerReport = useCallback(() => {
        vesselToBunkerReportQuery.mutateAsync()
            .then(it => {
                setVesselToBunkerList(it.data.map((each, idx) => ({
                    id: idx,
                    vesselCode: each.vessel_code,
                    vesselName: each.vessel_name,
                    vesselType: each.vessel_type,
                    lfoRob: each.lfo ? formatCurrency(each.lfo).concat(" MT") : "-",
                    hfoRob: each.hfo ? formatCurrency(each.hfo).concat(" MT") : "-",
                    mgoRob: each.mgo ? formatCurrency(each.mgo).concat(" MT") : "-",
                    hsdRob: each.hsd ? formatCurrency(each.hsd).concat(" MT") : "-",
                    mdoRob: each.mdo ? formatCurrency(each.mdo).concat(" MT") : "-",
                    mfoRob: each.mfo ? formatCurrency(each.mfo).concat(" MT") : "-",
                    mdfRob: each.mdf ? formatCurrency(each.mdf).concat(" MT") : "-",
                    hasPlan: each.has_plan,
                    coverageDays: each.coverage_days || 0,
                    // vesselRequestDate: each.request_time ? each.report_time.getTime() : 0,
                    latestUpdated: each.report_time ? each.report_time.getTime() : 0,
                    status: each.status ?? "-"
                })))

                setPaginationVesselBunker((prev) => ({
                    ...prev,
                    totalRows: it.total,
                    totalPage: it.total_page
                }))

                if (isToastVesselPlanVisible) setToastVesselPlanVisible(false);
            })
            .catch(error => {
                setVesselToBunkerList([]);
                setPaginationVesselBunker({
                    pageIndex: 0,
                    pageSize: 5,
                    totalRows: 0,
                    totalPage: 0
                })
                // console.log("Error Retrieve VesselToBunkerReport API: ", error);
            });
    }, [vesselToBunkerList]);

    const updateVesselLatestVoyage = useCallback(() => {
        vesselLatestVoyageQuery.mutateAsync()
            .then(it => {
                setLatestVoyages(it.data.voyages.map((each, idx) => ({
                    id: idx,
                    voyageNo: +each.voyage_no,
                    date: each.complete_date.toLocaleString("id-ID", { month: 'short', year: '2-digit' }),
                    discharge: each.start_port.port_name,
                    bunker: each.end_port.port_name,
                    seaDays: each.sea_days,
                    portBunkeringLocation: each.port_bunkering.length > 0 && each.port_bunkering[0].port_name,
                    isPortBunkering: true
                })))
            })
            .catch(error => {
                setLatestVoyages([]);
                // console.log("Error Retrieve VesselLatestVoyage API: ", error);
            });
    }, [vesselToBunkerList]);

    const updateVesselToBunkerDetail = useCallback(() => {
        vesselToBunkerDetailQuery.mutateAsync()
            .then(it => {
                setVesselToBunkerDetail(it);
                setVesselAlreadyHasPlan(it.data.has_plan);
                setToastVesselPlanVisible(it.data.has_plan);
            })
            .catch(error => {
                setVesselToBunkerDetail(null);
                setVesselAlreadyHasPlan(false);
                setToastVesselPlanVisible(false);
                // console.log("Error Retrieve VesselToBunker API: ", error);
            });
    }, [vesselToBunkerDetail]);

    const goVesselToBunkerExport = () => {
        vesselToBunkerExportQuery.mutateAsync()
            .then(it => { window.open(it) })
            .catch(error => console.log(error))
    };

    useEffect(() => {
        setTitle("Planning & Simulation");
        if (fetchVesselListError) {
            // console.log("Error retrieve Vessel List data ", fetchVesselListErrorData);
        } else {
            if (vesselOptions.length === 0) updateVessels();
        }

        if (fetchVesselToBunkerStatusError) {
            // console.log("Error retrieve Vessel-to-bunker status data", fetchVesselToBunkerStatusErrorData);
        } else {
            if (reportStatusOptions.length === 0) updateVesselToBunkerStatus();
        }

        if (fetchPortSearchError) {
            // console.log("Error retrieve Port Search Data", fetchPortSearchErrorData);
        } else {
            if (portOptions.length === 0) fetchPort();
        }

    }, [
        fetchVesselListSuccess,
        fetchVesselListError,
        fetchPortSearchError,
        fetchPortSearchSuccess,
        fetchVesselToBunkerStatusSuccess,
        fetchVesselToBunkerStatusError,
    ]);

    useEffect(() => {
        updateVesselToBunkerReport();
    }, [
        paginationVesselBunker.pageIndex,
        paginationVesselBunker.pageSize,
        selectedStatusOption,
        selectedVesselFilterOption,
        sortCoverageDays
    ]);

    useEffect(() => {
        setPaginationVesselBunker((prev) => ({
            ...prev,
            pageIndex: 0
        }))
    }, [
        selectedStatusOption,
        selectedVesselFilterOption
    ]);

    useEffect(() => {
        if (selectedVesselOption) {
            updateVesselToBunkerDetail();
            updateVesselLatestVoyage();
        }
    }, [selectedVesselOption]);

    useEffect(() => { 
        if (simulationLoading.startsWith("Success")) {
            if (!vesselToBunkerDetail) {
                setSelectedVessel({key: simulationLoading.split(" ")[2], value: simulationLoading.split(" ")[3]})
                updateVesselToBunkerReport();
                updateVesselLatestVoyage();
            }
            updateSimulationResult();
        };
    }, [simulationLoading]);

    const onPaginationVesselBunkerChange = (newPageIndex: number, newPageSize: number) => {
        setPaginationVesselBunker((prev) => ({...prev, pageIndex: newPageIndex, pageSize: newPageSize}))
    };

    const onSortingVesselBunkerChange = (newSort: SortingState) => {
        const finalSort = newSort.length > 0 ? newSort : [{ id: "coverageDays", desc: true }];
        const getSort = finalSort.find(i => i.id === "coverageDays")
        setSortVesselToBunker(finalSort)
        setSortCoverageDays(getSort?.desc ? "desc" : "asc")
    };

    return (
        <div className="flex-1 overscroll-auto overflow-auto font-[nunito]">
            <div className="flex flex-col justify-between items-start px-4">
                <div className="flex flex-col mt-2 px-2">
                    <h2 className="text-lg font-bold font-[nunito]">Vessel to Bunker</h2>
                </div>
            </div>
            <div className="flex flex-col items-start p-4 pt-1">
                <div className="bg-white shadow-md p-4 rounded-2xl border border-gray-200">
                    <DataTableFilterCard
                        columns={columnVesselBunker}
                        data={vesselToBunkerList}
                        enablePagination={true}
                        filters={filterVesselBunker}
                        pagination={paginationVesselBunker}
                        sorting={sortVesselToBunker}
                        enableExport={true}
                        onPaginationChange={onPaginationVesselBunkerChange}
                        onSortingChange={onSortingVesselBunkerChange}
                        onExport={goVesselToBunkerExport}
                    />
                </div>
            </div>
            {!selectedVesselOption && simulationLoading.startsWith('Loading') && (
                <div className="flex mt-4 justify-center items-center gap-2">
                    <Spinner type="regular" />
                    <span className="text-black text-base font-[nunito] font-normal">There is ongoing make plan simulation run. Please wait until it finishes. </span>
                </div>
            )}
            {(vesselToBunkerDetail || !simulationLoading.startsWith('Loading')) && (
                <div className="flex flex-col justify-between items-start p-4">
                    <div className="flex flex-col px-2">
                        <h2 className="text-lg font-bold font-[nunito]">Bunker Simulation</h2>
                        <h2 className="text-xs font-light font-[nunito]">
                            This is a bunker planning simulation for vessels. The result can be saved as a scheduled bunker plan item. To begin, select a vessel.
                        </h2>
                        <div className="flex justify-start items-center mt-4 gap-4">
                            <div className="flex flex-col items-start">
                                <h2 className="text-[11px] font-normal text-black">Vessel</h2>
                                <DropdownSelect
                                    type={SelectType.SINGLE}
                                    name="vessel"
                                    placeholder="Select Vessel"
                                    value={selectedVesselOption}
                                    options={vesselOptions}
                                    onChange={(selected) => {
                                        setSelectedVessel(selected);
                                        setSelectedPort(null);
                                        setTotalDaysVoyage(null);
                                        if (vesselToBunkerSimulationResult.length > 0) setVesselToBunkerSimulationResult([]);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {vesselToBunkerDetail && vesselToBunkerDetail.data.has_plan && isToastVesselPlanVisible && (
                <Alert color="gray" className="font-[nunito] ml-4 mr-4" onDismiss={() => setToastVesselPlanVisible(false)} rounded withBorderAccent>
                    <span className="font-semibold">This vessel already has an ongoing bunker plan.</span> Please complete or cancel the existing plan before saving a new one. Simulation is still available.
                </Alert>
            )}
            {selectedVesselOption && (
                <div className="flex-1 md:flex-row p-4">
                    <div className="bg-white shadow-md p-4 rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <h3 className="text-[15px] text-start font-bold">{vesselToBunkerDetail && vesselToBunkerDetail.data.vessel_name && vesselToBunkerDetail.data.vessel_name.length > 0 ? vesselToBunkerDetail.data.vessel_name : String(selectedVesselOption.value)}</h3>
                        <div className="flex justify-center items-start bg-white shadow-md mt-4 p-4 pt-3 gap-2 rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overscroll-auto overflow-hidden">
                            {vesselToBunkerDetail && vesselToBunkerDetail.data.fuel_details && vesselToBunkerDetail.data.fuel_details.map((it, idx) => (
                                <div key={idx} className="flex-col">
                                    <h3 className="mb-2 text-[15px] text-start font-bold font-[nunito]">{
                                        it.fuel_type.includes("LFO") || it.fuel_type.includes("MFO") || it.fuel_type.includes("HFO") ?
                                            "MFO, LFO, HFO"
                                            : "MDF, MGO, HSD"
                                    }</h3>
                                    <div className="flex items-center gap-2">
                                        {it.fuel_rob_percentage != null ? it.fuel_rob_percentage >= 0 && it.fuel_rob_percentage <= 20 && indicatorIcons.fuel_low : <div></div>}
                                        {it.fuel_rob_percentage != null ? it.fuel_rob_percentage > 20 && it.fuel_rob_percentage <= 60 && indicatorIcons.fuel_low_to_middle : <div></div>}
                                        {it.fuel_rob_percentage != null? it.fuel_rob_percentage > 60 && it.fuel_rob_percentage <= 80 && indicatorIcons.fuel_middle : <div></div>}
                                        {it.fuel_rob_percentage != null? it.fuel_rob_percentage > 80 && it.fuel_rob_percentage <= 100 && indicatorIcons.fuel_middle_to_full : <div></div>}
                                        {it.fuel_rob_percentage != null? it.fuel_rob_percentage > 100 && indicatorIcons.fuel_middle_to_full : <div></div>}
                                        {it.fuel_rob_percentage == null && indicatorIcons.fuel_low}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between gap-3">
                                                <BaseCard title="Bunker Cons / Day TCP" type={BaseCardType.NORMAL} value={it.bunker_cons_per_tcp != null ? formatCurrency(+it.bunker_cons_per_tcp) : "-"} notation="MT/day" />
                                                <BaseCard title="Bunkerr Cons / Day History" type={BaseCardType.NORMAL} value={it.bunker_cons_per_day != null ? formatCurrency(+it.bunker_cons_per_day) : "-"} notation="MT/day" />
                                            </div>
                                            <div className="flex justify-between gap-3">
                                                <BaseCard title="Fuel ROB" type={BaseCardType.NORMAL} value={it.fuel_rob != null ? formatCurrency(+it.fuel_rob) : "-"} additionalValue={it.fuel_rob_percentage != null ? it.fuel_rob_percentage.toFixed(1) : "-"} notation={`/${it.tank_capacity != null ? formatCurrency(it.tank_capacity) : "-"} MT`} />
                                                <BaseCard title="Coverage Days" type={BaseCardType.NORMAL} value={it.coverage_days != null ? String(it.coverage_days) : "-"} notation="days" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* {vesselToBunkerDetail && vesselToBunkerDetail.data.fuel_details.length === 2 && (
                                 <div className="flex-col">
                                    <h3 className="text-[15px] text-start font-bold font-[nunito]">Fuel Type N/A</h3>
                                    <div className="flex justify-between items-center gap-2">
                                        <Image width={0} height={0} className="w-auto h-[10rem]" src={"assets/unknown-fueltype-placeholder.svg"} alt={"Fuel ROB Diagram unknown"} />
                                    </div>
                                 </div>
                            )} */}
                            {!vesselToBunkerDetail && (
                                <div className="flex-grow">
                                    <div className="flex justify-center items-center gap-2">
                                        <Image width={0} height={0} className="w-auto h-[13rem]" src={"assets/unknown-fueltype-placeholder.svg"} alt={"Fuel ROB Diagram unknown"} />
                                        <Image width={0} height={0} className="w-auto h-[13rem]" src={"assets/unknown-fueltype-placeholder.svg"} alt={"Fuel ROB Diagram unknown"} />
                                        {/* <Image width={0} height={0} className="w-auto h-[10rem]" src={"assets/unknown-fueltype-placeholder.svg"} alt={"Fuel ROB Diagram unknown"} /> */}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 pt-4">
                            <VoyageCard title={'Latest Voyages Information'} data={latestVoyage} />
                        </div>

                        {/* <div className="bg-white shadow-md p-4 mt-4 mx-auto rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                            <p className="text-sm mb-4 text-start font-bold font-[nunito]">Vessel Captain Request</p>
                            <p className="min-w-16 mb-1 text-xs font-normal text-[#030C13] truncate">Details</p>
                            <div className="grid grid-cols-3 mt-1 mb-4">
                                <div className="flex-col items-center font-[nunito] gap-2">
                                    <p className="min-w-16 text-[0.625rem] font-normal text-[#90A2A2] truncate">Voyage Number</p>
                                    <p className="min-w-16 text-[0.76rem] font-normal text-[#030C13] truncate">-</p>
                                </div>
                                <div className="flex-col items-center font-[nunito] gap-2">
                                    <p className="min-w-16 text-[0.625rem] font-normal text-[#90A2A2] truncate">Bunker Port</p>
                                    <p className="min-w-16 text-[0.76rem] font-normal text-[#030C13] truncate">-</p>
                                </div>
                                <div className="flex-col items-center font-[nunito] gap-2">
                                    <p className="min-w-16 text-[0.625rem] font-normal text-[#90A2A2] truncate">Bunker Date</p>
                                    <p className="min-w-16 text-[0.76rem] font-normal text-[#030C13] truncate">-</p>
                                </div>
                            </div>

                            <p className="min-w-16 mb-1 text-xs font-normal text-[#030C13] truncate">Amount Detail</p>
                            <div className="grid grid-cols-3 mt-1 mb-4">
                                <div className="flex-col items-center font-[nunito] gap-2">
                                    <p className="min-w-16 text-[0.625rem] font-normal text-[#90A2A2] truncate">HFO
                                        <span className="w-16 ml-1 pl-1 pr-1 bg-white border border-[#90A2A2] rounded-2xl text-[0.55rem] text-center text-[#686868] font-normal font-[nunito]">Observed: <b>- MT</b> fuel ROB, <b>- MT/day</b> consumption</span>
                                    </p>
                                    <p className="min-w-16 text-[0.76rem] font-normal text-[#030C13] truncate">- MT</p>
                                </div>
                                <div className="flex-col items-center font-[nunito] gap-2">
                                    <p className="min-w-16 text-[0.625rem] font-normal text-[#90A2A2] truncate">LFO
                                        <span className="w-16 ml-1 pl-1 pr-1 bg-white border border-[#90A2A2] rounded-2xl text-[0.55rem] text-center text-[#686868] font-normal font-[nunito]">Observed: <b>- MT</b> fuel ROB, <b>- MT/day</b> consumption</span>
                                    </p>
                                    <p className="min-w-16 text-[0.76rem] font-normal text-[#030C13] truncate">- MT</p>
                                </div>
                                <div className="flex-col items-center font-[nunito] gap-2">
                                    <p className="min-w-16 text-[0.625rem] font-normal text-[#90A2A2] truncate">MGO
                                        <span className="w-16 ml-1 pl-1 pr-1 bg-white border border-[#90A2A2] rounded-2xl text-[0.55rem] text-center text-[#686868] font-normal font-[nunito]">Observed: <b>- MT</b> fuel ROB, <b>- MT/day</b> consumption</span>
                                    </p>
                                    <p className="min-w-16 text-[0.76rem] font-normal text-[#030C13] truncate">- MT</p>
                                </div>
                            </div>

                        </div> */}

                        <div className="flex-1">
                            <VoyageDetailCard
                                vesselCode={""}
                                vesselStatus={vesselToBunkerDetail ? vesselToBunkerDetail.data.status : ""}
                                voyageNumber={voyageNumber}
                                totalCoverageDays={vesselToBunkerDetail ? vesselToBunkerDetail.data.total_coverage_days : 0}
                                totalDaysVoyage={totalDaysVoyage}
                                placeholderPort={selectedPort}
                                placeholderDate={placeholderDate}
                                placeholderDays={placeholderDays}
                                onChangeTotalDaysVoyage={(val) => {
                                    setTotalDaysVoyage(val);
                                    setSimulateCoverageDayEmpty(false);
                                }}
                                plannedDate={plannedDate}
                                portListOptions={portOptions}
                                isSimulatePortEmpty={simulateBunkerPortEmpty}
                                isSimulateCoverageDayEmpty={simulateCoverageDayEmpty}
                                onChangePlannedDate={setPlannedDate}
                                onChangePort={(selected) => {
                                    setSelectedPort(selected);
                                    setSimulateBunkerPortEmpty(false);
                                }} />
                        </div>

                        <div className="flex justify-end pt-5">
                            <button 
                                className={`flex gap-1 p-2 pl-4 pr-4 ${simulationLoading.startsWith("Run Simulation") ? 'bg-red-600' : 'bg-[#030C13]'} text-[0.7rem] text-white font-normal font-[nunito] rounded-full`} 
                                onClick={handleRunSimulation}
                                disabled={simulationLoading.startsWith("Loading")}
                            >
                                {simulationLoading.startsWith("Run Simulation") ?
                                    <Image width={0} height={0} src={'assets/gear-icon.svg'} alt={'gear logo'} className="w-4" />
                                    : <Spinner type="regular" />}
                                {simulationLoading.startsWith("Success") ? simulationLoading.split(" ")[0] : simulationLoading}
                            </button>
                        </div>

                        {vesselToBunkerSimulationResult.length > 0 && (
                            <div className="flex flex-col mt-10 pt-3 border-t gap-4 ">
                                <h3 className="font-bold text-lg">Result</h3>
                                <DataTableFilterCard
                                    columns={columnResult}
                                    data={vesselToBunkerSimulationResult}
                                    updateData={updateResult}
                                    enableExpand={true}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default PlanningAndSimulation;