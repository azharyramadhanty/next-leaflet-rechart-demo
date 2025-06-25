import { ColumnDef } from "@tanstack/react-table";
import DataTableFilterCard, { FilterDataType } from "@/components/DataTableFilterCard";
import { AlignType, FilterType, InputType } from "@/utils/enums/DatatableEnum";
import { useCallback, useEffect, useState } from "react";
import { useTitle } from "@/context/TitleContext";
import ScheduleAdjustVerifyModal, { Barge, VerifyBunker } from "@/components/ScheduleAdjustVerifyModal";
import { format } from "date-fns";
import SlidingTabBar from "@/components/SlidingTabBar";
import { BunkerConfirmModalCloseType, BunkerConfirmModalType, BunkerType } from "@/utils/enums/ScheduleAdjustVerifyEnum";
import { ScheduleBunkerPlanType } from "@/utils/enums/StatusEnum";
import { changeFormatEnumValue, convertStringToNumber, formatCurrency, getCookie, toCamelCase, toEpochSeconds } from "@/utils/Utils";
import Image from "next/image";
import {SelectOptionsType} from "@/components/DropdownSelect";
import { BunkerPlanDetailDataType, BunkerPlanListDataType, BunkerPlanListVerifyDataType, BunkerPlanScheduledType, BunkerPlanVerifiedType, BunkerValueType, EvidenceType, UploadEvidencesDataType } from "@/utils/Types";
import ButtonGroup, { ButtonGroupDataType } from "@/components/ButtonGroup";
import { usePort } from "@/hooks/port/usePort";
import { useBunker } from "@/hooks/bunker/useBunker";
import { PaginationType } from "@/components/DataTable";
import BunkerPlanConfirmationModal from "@/components/BunkerPlanConfirmationModal";
import Skeleton from "@/components/Skeleton";
import { useVessel } from "@/hooks/vessels/useVessel";
import FileDownloadModal from "@/components/FileDownloadModal";

const ScheduleAndRealization = () => {
    const [activeTabId, setActiveTabId] = useState(0);
    const [modalAdjustIdx, setModalAjustIdx] =  useState<number>(null);
    const [modalBunkerIdx, setModalBunkerIdx] =  useState<number>(null);
    const [handlers, setHandlers] = useState<{ handleEdit: (id: number) => void }>(null);
    const [editButton, setEditButton] = useState<number>(null);
    const [dateRange, setDateRange] = useState<[Date, Date]>([new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)]);
    const [defaultDateChanged, setDefaultDateChanged] = useState(false);
    const [bunkerPortFilterOptions, setBunkerPortFilterOption] = useState<SelectOptionsType[]>([]);
    const [selectedBunkerPortFilterOption, setSelectedBunkerPortFilterOption] = useState<SelectOptionsType>(null);
    const [selectedStatusFilterOption, setSelectedStatusFilterOption] = useState<SelectOptionsType>(null);
    const [selectedVesselFilterOption, setSelectedVesselFilterOption] = useState<SelectOptionsType>(null);
    const [bunkerVesselFilterOptions, setBunkerVesselFilterOption] = useState<SelectOptionsType[]>([]);
    const [paginationBunkerPlan, setPaginationBunkerPlan] = useState<PaginationType>({
        pageIndex: 0,
        pageSize: 5,
        totalRows: 0,
        totalPage: 0
    });
    const [updateDataBunkerPlanList, setUpdateDataBunkerPlanList] = useState<BunkerPlanListDataType>({
        idx: null,
        simulationId: null,
        bunkerSchema: "Bunker PIT",
        bunkerDate: null,
        status: null,
        mfo: null,
        hfo: null,
        lfo: null,
        mdf: null,
        mgo: null,
        hsd: null
    });
    const [updateDataBunkerPlanVerify, setUpdateDataBunkerPlanVerify] = useState<BunkerPlanListVerifyDataType[]>([]);
    const [selectedBunkerPlanAdjust, setSelectedBunkerPlanAdjust] = useState<BunkerPlanDetailDataType | null>(null);
    const [uploadDataEvidences, setUploadDataEvidences] = useState<UploadEvidencesDataType[]>([]);
    const [clickedRowIdx, setClickedRowIdx] = useState<number>(null);
    
    const { setTitle } = useTitle();
    const { usePortSearchAllQuery } = usePort();
    const {
        data: fetchPortSearchAllData,
        error: fetchPortSearchErrorData,
        isError: fetchPortSearchError,
        isSuccess: fetchPortSearchSuccess
      } = usePortSearchAllQuery(true);
    const { useVesselBoundaryQuery } = useVessel();
    const { 
        useBunkerPlanListQuery, 
        useBunkerPlanListVerifiedQuery, 
        useBunkerPlanUpdateQuery, 
        useBunkerPlanExportQuery,
        useBunkerPlanUpdateBatchQuery,
        useBunkerPlanUpdateStatusQuery,
        useUploadEvidencesQuery,
        useBunkerPlanDetailQuery,
        useBunkerPlanVerifiedExportQuery,
        useBunkerPlanTelexQuery
    } = useBunker();
    const [dataVesselBunkerScheduled, setDataVesselBunkerScheduled] = useState<BunkerPlanScheduledType[]>([]);
    const [dataVesselBunkerVerified, setDataVesselBunkerVerified] = useState<BunkerPlanVerifiedType[]>([]);
    const tabData = [
        {
          id: "schedule",
          name: "Scheduled",
        },
        {
          id: "verified",
          name: "Verified",
        },
    ];
    const [showBunkerConfirmation, setShowBunkerConfirmation] = useState(false);
    const [showBunkerRejection, setShowBunkerRejection] = useState(false);
    const [isLoading, setLoading] = useState(true);

    const buttonGroupVesselBunker: ButtonGroupDataType[] = [
        {
            body:
                <>
                    <span className="text-font-normal font-[nunito]">
                        Create Work Order
                    </span>
                    <Image src={`/assets/paper-gear-icon.svg`} alt={'pencil-paper-icon'} width={14} height={14} style={{width: 14, height: 14}} />
                </>
            ,
            fnOnClick: (value) => {
                const recipient = 'user@example.com';
                const recipientCc = 'userCC@example.com';
                const senderName = getCookie("name");
                const fuelType = `${dataVesselBunkerScheduled[value].hfoVol != null ? 'HFO'.concat(",") : ""}${dataVesselBunkerScheduled[value].mfoVol != null ? 'MFO'.concat(",") : ""}${dataVesselBunkerScheduled[value].lfoVol != null ? 'LFO'.concat(",") : ""}${dataVesselBunkerScheduled[value].mgoVol != null ? 'MGO'.concat(",") : ""}${dataVesselBunkerScheduled[value].mdfVol != null ? 'MDF'.concat(",") : ""}${dataVesselBunkerScheduled[value].hsdVol != null ? 'HSD'.concat(",") : ""}`;
                const subject = `Persetujuan Pembelian Bunker ${toCamelCase(dataVesselBunkerScheduled[value].vesselName)} di ${toCamelCase(dataVesselBunkerScheduled[value].bunkerPort)} est ${new Date().toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric' })} (${fuelType} Vendor dari ${toCamelCase(dataVesselBunkerScheduled[value].bunkerPort)})`;
                const body = `Kepada Tim PT Vendor,
                \nBerikut disampaikan persetujuan pembelian suplai bunker.
                \n@Tim PT PTK (Pengawasan Bunker & Bunker Handling):
                \nMohon Mengacu pada:
                \n\tPerjanjian 
                \nMohon rencana suplai disesuaikan dengan jadwal kapal dan diinformasikan ke Tim Ops PIS bila ada kendala.
                \nMohon PIC dapat on board untuk mengawasi suplai, monitor ROB & losses. Bila via transportir, pisahkan ROB kargo dan fresh bunker. Hasil pengecekan ROB mohon dikirim ke Tim Ops PIS beserta dokumen suplai.\nDokumen kegiatan mohon disubmit via BRO di IPMAN maksimal 3 hari kalender.
                \n@Tim Programmer Kapal:\nMohon lakukan Off Hire bila suplai dilakukan <14 hari sebelum kapal beroperasi.
                \n@Master:\nMohon kirim hasil sounding & BDN sebelum/sesudah suplai, balas email ini maksimal 3 hari kalender.
                \nTerima kasih atas perhatian dan kerja samanya.
                \n\nRegards,\n${senderName}`;
                const mailto = `mailto:${encodeURIComponent(recipient)}?` +
                    `subject=${encodeURIComponent(subject)}&` +
                    `body=${encodeURIComponent(body)}`;
                    // `cc=${encodeURIComponent(recipientCc)}`;
                window.open(mailto, '_blank', 'noopener,noreferrer');
            }
        },
        // {
        //     body: 
        //         <>
        //             <span className="text-font-normal font-[nunito]">
        //                 Edit
        //             </span>
        //             <Image src={`/assets/pencil-paper-icon.svg`} alt={'pencil paper icon'} width={14} height={14} style={{width: 14, height: 14}} />
        //         </>
        //     ,
        //     disabled: editButton !== null,
        //     fnOnClick: (value) => {
        //         handlers?.handleEdit(value)
        //         setEditButton(value)
        //     }
        // },
        {
            body: 
                <>
                    <span className="text-font-normal font-[nunito]">
                        Complete
                    </span>
                    <Image src={`/assets/tick-black-icon.svg`} alt={'tick black icon'} width={14} height={14} style={{width: 14, height: 14}} />
                </>
            ,
            fnOnClick: (value) => {
                setShowBunkerConfirmation(true);
                setModalBunkerIdx(value)
            }
        },
        {
            body: 
                <>
                    <span className="text-font-normal font-[nunito]">
                        Cancel
                    </span>
                    <Image src={`/assets/round-stop-icon.svg`} alt={'round cancel icon'} width={14} height={14} style={{width: 14, height: 14}} />
                </>
            ,
            fnOnClick: (value) => {
                setShowBunkerRejection(true);
                setModalBunkerIdx(value)
            }
        }
    ];
    const columnBunkerPlanScheduled: ColumnDef<BunkerPlanScheduledType>[] = [
        {
            id: "no",
            enableSorting: false,
            size: 3.2,
            header: () => (
              <div className="text-center text-[0.688rem]">No.</div>
            ),
            cell: ({ row, table }) => {
                // const meta = table.options.meta as { pageIndex: number; pageSize: number };
                return (
                    <div
                        className="text-[0.625rem]"
                    >
                        {row.index + 1}
                        {/* {meta.pageIndex * meta.pageSize + row.index + 1} */}
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
                    className="text-[0.625rem] font-bold"
                >
                    {getValue() as string}
                </div>
                )
            }
        },
        {
            accessorKey: "mfoVol",
            enableSorting: false,
            size: 7,
            meta: { editable: true, emptyNotShow: true, inputType: InputType.TEXT },
            header: () => (
                <div className="text-[0.688rem]">MFO Vol.</div>
            ),
            cell: ({ getValue }) => {
                return (
                <div
                    className="text-[0.625rem]"
                >
                    {getValue() ? getValue() as string : '-'}
                </div>
                )
            }
        },
        {
            accessorKey: "hfoVol",
            enableSorting: false,
            size: 7,
            meta: { editable: true, emptyNotShow: true, inputType: InputType.TEXT },
            header: () => (
                <div className="text-[0.688rem]">HFO Vol.</div>
            ),
            cell: ({ getValue }) => {
                return (
                <div
                    className="text-[0.625rem]"
                >
                    {getValue() ? getValue() as string : '-'}
                </div>
                )
            }
        },
        {
            accessorKey: "lfoVol",
            enableSorting: false,
            size: 7,
            meta: { editable: true, emptyNotShow: true, inputType: InputType.TEXT },
            header: () => (
                <div className="text-[0.688rem]">LFO Vol.</div>
            ),
            cell: ({ getValue }) => {
                return (
                <div
                    className="text-[0.625rem]"
                >
                    {getValue() ? getValue() as string : '-'}
                </div>
                )
            }
        },
        {
            accessorKey: "mdfVol",
            enableSorting: false,
            size: 7,
            meta: { editable: true, emptyNotShow: true, inputType: InputType.TEXT },
            header: () => (
                <div className="text-[0.688rem]">MDF Vol.</div>
            ),
            cell: ({ getValue }) => {
                return (
                <div
                    className="text-[0.625rem]"
                >
                    {getValue() ? getValue() as string : '-'}
                </div>
                )
            }
        },
        {
            accessorKey: "mgoVol",
            enableSorting: false,
            size: 7,
            meta: { editable: true, emptyNotShow: true, inputType: InputType.TEXT },
            header: () => (
                <div className="text-[0.688rem]">MGO Vol.</div>
            ),
            cell: ({ getValue }) => {
                return (
                <div
                    className="text-[0.625rem]"
                >
                    {getValue() ? getValue() as string : '-'}
                </div>
                )
            }
        },
        {
            accessorKey: "hsdVol",
            enableSorting: false,
            size: 7,
            meta: { editable: true, emptyNotShow: true, inputType: InputType.TEXT },
            header: () => (
                <div className="text-[0.688rem]">HSD Vol.</div>
            ),
            cell: ({ getValue }) => {
                return (
                <div
                    className="text-[0.625rem]"
                >
                    {getValue() ? getValue() as string : '-'}
                </div>
                )
            }
        },
        {
            accessorKey: "bunkerPort",
            enableSorting: false,
            size: 11,
            header: () => (
                <div className="text-[0.688rem]">Bunker Port</div>
            ),
            cell: ({ getValue }) => {
                return (
                <div
                    className="text-[0.625rem]"
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
            meta: { editable: true, inputType: InputType.DATE },
            header: () => (
                <div className="text-[0.688rem]">Bunker Date</div>
            ),
            accessorFn: (row) => format(row.bunkerDate, "EEE, dd MMM yyyy"),
            cell: ({ getValue }) => {
                return (
                <div
                    className="text-[0.625rem]"
                >
                    {getValue() as string}
                </div>
                )
            }
        },
        {
            accessorKey: "status",
            size: 8,
            header: () => (
                <div className="text-[0.688rem]">Status</div>
            ),
            enableSorting: false,
            cell: ({ getValue }) => {
                const status = statusBasedRole(getValue() as ScheduleBunkerPlanType);
                let statusClass: string;
    
                switch (status) {
                    case ScheduleBunkerPlanType.CANCELED:
                        statusClass = "bg-red-100 text-red-800";
                        break;
                    case ScheduleBunkerPlanType.COMPLETED:
                        statusClass = "bg-[#CCFFDF] text-[#00802F]";
                        break;
                    default:
                        statusClass = "border border-[#90A2A2] bg-white text-[#686868]";
                }
    
                return (
                    <span
                        className={`px-1 rounded-full inline-flex items-center justify-center text-[0.5rem] ${statusClass}`}
                    >
                        {changeFormatEnumValue(status)}
                    </span>
                )
            }
        },
        {
            accessorKey: "action",
            header: () => (
                <div className="text-center text-[0.688rem]">Action</div>
            ),
            cell: ({ row }) => {
                const rowId = row.index
                const status = row.original.status as ScheduleBunkerPlanType;
                const {name, icon} = buttonActionList(status);

                return editButton!== null && editButton === rowId ? (
                    <button
                        onClick={() => {
                            handlers?.handleEdit(rowId)
                            setEditButton(null)
                        }}
                        className="bg-white border border-[#C7D1D1] font-bold text px-2 py-0.5 rounded-[99px] inline-flex items-center justify-center gap-2 text-[0.625rem]"
                    >
                        <Image 
                            src={`assets/tick-black-icon.svg`} 
                            alt={'Save edit icon'}
                            width={12}
                            height={12}
                        />
                        <span>Save Edit</span>
                    </button>
                ) : name && name !== "Cancel" ? (
                    <div className="flex gap-0.5">
                        <button
                            onClick={() => name === "Adjust & Verify" ? onHandleVerifyModal(rowId) : goGenerateTelex(rowId)}
                            className="bg-white border border-[#C7D1D1] font-bold text px-2 py-0.5 rounded-[99px] inline-flex items-center justify-center gap-2 text-[0.625rem]"
                        >
                            <Image 
                                src={`assets/${icon}.svg`} 
                                alt={name + ' icon'}
                                width={12} 
                                height={12} 
                            />
                            <span>{name}</span>
                        </button>
                        { name !== "Adjust & Verify" && (
                            <ButtonGroup
                                rowId={rowId}
                                list={buttonGroupVesselBunker}
                            />
                        )}
                    </div>
                ) : null
            },
            enableSorting: false
        }
    ];
    const columnBunkerPlanVerified: ColumnDef<BunkerPlanVerifiedType>[] = [
        {
            id: "no",
            enableSorting: false,
            size: 3.2,
            header: () => (
              <div className="text-center text-[0.688rem]">No.</div>
            ),
            cell: ({ row, table }) => {
                // const meta = table.options.meta as { pageIndex: number; pageSize: number };
                return (
                    <div
                        className="text-[0.625rem]"
                    >
                        {row.index + 1}
                        {/* {meta.pageIndex * meta.pageSize + row.index + 1} */}
                    </div>
                )
            }
        },
        {
            accessorKey: "vesselName",
            enableSorting: false,
            size: 10,
            header: () => (
                <div className="text-[0.688rem]">Vessel Name</div>
            ),
            cell: ({ getValue }) => {
                return (
                <div
                    className="text-[0.625rem] font-bold"
                >
                    {getValue() as string}
                </div>
                )
            }
        },
        {
            accessorKey: "supplyDate",
            enableSorting: false,
            size: 6.8,
            accessorFn: (row) => format(row.supplyDate, "EEE, dd MMM yyyy"),
            header: () => (
                <div className="text-[0.688rem]">Supply Date</div>
            ),
            cell: ({ getValue }) => {
                return (
                <div
                    className="text-[0.625rem]"
                >
                    {getValue() as string}
                </div>
                )
            }
        },
        {
            accessorKey: "supplyPort",
            enableSorting: false,
            size: 6,
            meta: { editable: true, inputType: InputType.TEXT },
            header: () => (
                <div className="text-[0.688rem]">Supply Port</div>
            ),
            cell: ({ getValue }) => {
                return (
                <div
                    className="text-[0.625rem]"
                >
                    {getValue() as string}
                </div>
                )
            }
        },
        {
            accessorKey: "bunkerMedia",
            enableSorting: false,
            size: 5,
            meta: { editable: true, inputType: InputType.TEXT },
            header: () => (
                <div className="text-[0.688rem]">Scheme</div>
            ),
            cell: ({ getValue }) => {
                return (
                <div
                    className="text-[0.625rem]"
                >
                    {getValue() as string}
                </div>
                )
            }
        },
        {
            accessorKey: "fuelType",
            enableSorting: false,
            size: 5,
            meta: { editable: true, inputType: InputType.TEXT },
            header: () => (
                <div className="text-[0.688rem]">Fuel Type</div>
            ),
            cell: ({ getValue }) => {
                return (
                <div
                    className="text-[0.625rem]"
                >
                    {getValue() as string}
                </div>
                )
            }
        },
        {
            accessorKey: "plannedVol",
            enableSorting: false,
            size: 5,
            meta: { editable: true, inputType: InputType.TEXT },
            header: () => (
                <div className="text-[0.688rem]">Planned Vol.</div>
            ),
            cell: ({ getValue }) => {
                return (
                <div
                    className="text-[0.625rem]"
                >
                    {getValue() as string}
                </div>
                )
            }
        },
        {
            accessorKey: "actualReceipt",
            enableSorting: false,
            size: 6,
            meta: { editable: true, inputType: InputType.TEXT },
            header: () => (
                <div className="text-[0.688rem]">Actual <br/>Receipt L15</div>
            ),
            cell: ({ getValue }) => {
                return (
                <div
                    className="text-[0.625rem]"
                >
                    {getValue() as string}
                </div>
                )
            }
        },
        {
            accessorKey: "billOfLading",
            enableSorting: false,
            size: 6,
            header: () => (
                <div className="text-[0.688rem]">Bill of <br/>Lading L15</div>
            ),
            cell: ({ getValue }) => {
                return (
                <div
                    className="text-[0.625rem]"
                >
                    {getValue() as string}
                </div>
                )
            }
        },
        {
            accessorKey: "discrepancyVal",
            enableSorting: false,
            size: 5.5,
            header: () => (
                <div className="text-[0.688rem]">Discre<br/>pancy</div>
            ),
            cell: ({ getValue }) => {
                return (
                <div
                    className="text-[0.625rem]"
                >
                    {getValue() as string}
                </div>
                )
            }
        },
        {
            accessorKey: "discrepancyPercent",
            enableSorting: false,
            size: 5.5,
            header: () => (
                <div className="text-[0.688rem]">Discre<br/>pancy %</div>
            ),
            cell: ({ getValue }) => {
                return (
                <div
                    className="text-[0.625rem]"
                >
                    {getValue() as string}
                </div>
                )
            }
        },
        {
            accessorKey: "attachment",
            size: 6.5,
            header: () => (
                <div className="text-[0.688rem]">Attachments</div>
            ),
            cell: ({ row }) => {
                const rowId = row.index

                return (
                    <div className="flex">
                        <button
                            onClick={() => onHandleEvidenceModal(rowId)}
                            className="bg-white border border-[#C7D1D1] font-bold text px-2 py-0.5 rounded-[99px] inline-flex items-center justify-center gap-2 text-[0.625rem]"
                        >
                            <Image 
                                src={`assets/download-icon.svg`} 
                                alt={'Download icon'}
                                width={12} 
                                height={12} 
                            />
                            <span>Download</span>
                        </button>
                    </div>
                )
            },
            enableSorting: false
        }
    ];
    const filterVesselBunker: FilterDataType = {
        align: AlignType.ALIGN_ITEM_LEFT,
        list: [
            {
                nameColumn: "status",
                type: FilterType.DROPDOWN_SEARCH,
                name: 'status',
                placeholder: "Search Status",
                data: [
                    { key: ScheduleBunkerPlanType.ON_PROGRESS, value: changeFormatEnumValue(ScheduleBunkerPlanType.ON_PROGRESS) },
                    { key: ScheduleBunkerPlanType.COMPLETED, value: changeFormatEnumValue(ScheduleBunkerPlanType.COMPLETED) },
                    { key: ScheduleBunkerPlanType.CANCELED, value: changeFormatEnumValue(ScheduleBunkerPlanType.CANCELED) }
                ],
                value: selectedStatusFilterOption,
                fnOnChange: setSelectedStatusFilterOption
            },
            {
                nameColumn: "bunkerPort",
                type: FilterType.DROPDOWN_SEARCH,
                name: 'bunkerPort',
                placeholder: "Select Port",
                data: bunkerPortFilterOptions,
                value: selectedBunkerPortFilterOption,
                fnOnChange: setSelectedBunkerPortFilterOption
            },
            {
                nameColumn: "bunkerDate",
                type: FilterType.DATEPICKER,
                placeholder: "Select Date",
                value: dateRange,
                fnOnChange: (date: [Date | null, Date | null] | null) => {
                    if (date.every(it => !it)) {
                      setDateRange([new Date(new Date().getFullYear(), 0, 1), new Date()]);
                      setDefaultDateChanged(false);
                    } else {
                      setDateRange(date);
                      setDefaultDateChanged(true);
                    }
                },
                isClearable: defaultDateChanged
            },
        ]
    };
    const filterVesselBunkerVerified: FilterDataType = {
        align: AlignType.ALIGN_ITEM_LEFT,
        list: [
            {
                nameColumn: "vessel",
                type: FilterType.DROPDOWN_SEARCH,
                name: 'vessel',
                placeholder: "Search Vessel",
                data: bunkerVesselFilterOptions,
                value: selectedVesselFilterOption,
                fnOnChange: setSelectedVesselFilterOption
            },
            {
                nameColumn: "bunkerPort",
                type: FilterType.DROPDOWN_SEARCH,
                name: 'bunkerPort',
                placeholder: "Select Port",
                data: bunkerPortFilterOptions,
                value: selectedBunkerPortFilterOption,
                fnOnChange: setSelectedBunkerPortFilterOption
            },
            {
                nameColumn: "bunkerDate",
                type: FilterType.DATEPICKER,
                placeholder: "Select Date",
                value: dateRange,
                fnOnChange: (date: [Date | null, Date | null] | null) => {
                    if (date.every(it => !it)) {
                      setDateRange([new Date(new Date().getFullYear(), 0, 1), new Date()]);
                      setDefaultDateChanged(false);
                    } else {
                      setDateRange(date);
                      setDefaultDateChanged(true);
                    }
                },
                isClearable: defaultDateChanged
            },
        ]
    };

    const fetchVesselBoundary = useVesselBoundaryQuery();
    const bunkerPlanListQuery = useBunkerPlanListQuery(
        toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()), 
        toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date()), 
        selectedBunkerPortFilterOption ? String(selectedBunkerPortFilterOption.key) : "",
        selectedStatusFilterOption ? String(selectedStatusFilterOption.key) : "",
        paginationBunkerPlan.pageIndex + 1, 
        paginationBunkerPlan.pageSize);
    const bunkerPlanListVerifiedQuery = useBunkerPlanListVerifiedQuery(
        toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()), 
        toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date()), 
        selectedBunkerPortFilterOption ? String(selectedBunkerPortFilterOption.key) : "",
        selectedVesselFilterOption ? String(selectedVesselFilterOption.key) : "",
        paginationBunkerPlan.pageIndex + 1, 
        paginationBunkerPlan.pageSize);
    const bunkerPlanExportQuery = useBunkerPlanExportQuery(
        selectedBunkerPortFilterOption ? String(selectedBunkerPortFilterOption.key) : "", 
        selectedStatusFilterOption ? String(selectedStatusFilterOption.key) : "",
        toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()),
        toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date())
    );
    const bunkerPlanVerifiedExportQuery = useBunkerPlanVerifiedExportQuery(
        selectedBunkerPortFilterOption ? String(selectedBunkerPortFilterOption.key) : "", 
        selectedVesselFilterOption ? String(selectedVesselFilterOption.key) : "",
        toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()),
        toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date())
    );
    const bunkerPlanDetailQuery = useBunkerPlanDetailQuery(selectedBunkerPlanAdjust?.simulationId)
    const bunkerPlanUpdateResultQuery = useBunkerPlanUpdateQuery(
        updateDataBunkerPlanList.simulationId,
        updateDataBunkerPlanList.bunkerSchema,
        updateDataBunkerPlanList.status,
        updateDataBunkerPlanList.bunkerDate,
        updateDataBunkerPlanList.mfo,
        updateDataBunkerPlanList.hfo,
        updateDataBunkerPlanList.lfo,
        updateDataBunkerPlanList.mdf,
        updateDataBunkerPlanList.mgo,
        updateDataBunkerPlanList.hsd
    );
    const bunkerPlanUpdateStatusResultQuery = useBunkerPlanUpdateStatusQuery(
        updateDataBunkerPlanList.simulationId,
        updateDataBunkerPlanList.status
    );
    const bunkerPlanUpdateVerify = useBunkerPlanUpdateBatchQuery(updateDataBunkerPlanVerify);
    const uploadEvidencesQuery = useUploadEvidencesQuery(uploadDataEvidences);
    const bunkerPlanTelexQuery = useBunkerPlanTelexQuery(typeof clickedRowIdx === 'number'? dataVesselBunkerScheduled.find((_, index) => index === clickedRowIdx).simulationId : "");
    
    const onPaginationBunkerPlanChange = (newPageIndex: number, newPageSize: number) => {
        setPaginationBunkerPlan((prev) => ({...prev, pageIndex: newPageIndex, pageSize: newPageSize}))
    };

    const fetchPort = useCallback(() => {
        setBunkerPortFilterOption(fetchPortSearchAllData.data.map(each => ({
            key: each.port_id,
            value: each.port_name
        })));
    }, [fetchPortSearchAllData]);

    const fetchVessel = useCallback(() => {
        fetchVesselBoundary.mutateAsync().then(it => {
            setBunkerVesselFilterOption(it.data.map(each => ({
                key: each.vessel_code,
                value: each.vessel_name
            })))
        }).catch(error => {console.log("Error Retrieve Vessel Search Boundary API", error) });
    }, [bunkerPortFilterOptions]);

    const fetchBunkerPlanList = useCallback(() => {
        bunkerPlanListQuery.mutateAsync()
            .then(it => {
                if (it.success) {
                    setDataVesselBunkerScheduled(it.data.map((each, idx) => ({
                        id: idx,
                        simulationId: each.simulation_id,
                        vesselName: each.vessel_name,
                        mfoVol: each.mfo ? formatCurrency(each.mfo).concat(" MT") : null,
                        hfoVol: each.hfo ? formatCurrency(each.hfo).concat(" MT") : null,
                        lfoVol: each.lfo ? formatCurrency(each.lfo).concat(" MT") : null,
                        mdfVol: each.mdf ? formatCurrency(each.mdf).concat(" MT") : null,
                        mgoVol: each.mgo ? formatCurrency(each.mgo).concat(" MT") : null,
                        hsdVol: each.hsd ? formatCurrency(each.hsd).concat(" MT") : null,
                        bunkerPort: each.bunker_port_name,
                        bunkerDate: new Date(each.bunker_date),
                        status: each.status.includes("on progress") ? ScheduleBunkerPlanType.ON_PROGRESS 
                        : (each.status.includes("complete") ? ScheduleBunkerPlanType.COMPLETED : ScheduleBunkerPlanType.CANCELED)
                    })))
                } else {
                    setDataVesselBunkerScheduled([])
                }

                setPaginationBunkerPlan((prev) => ({
                    ...prev,
                    totalRows: it.total,
                    totalPage: it.total_page
                }))
            })
            .catch(error => {
                setDataVesselBunkerScheduled([])
                setPaginationBunkerPlan((prev) => ({
                    ...prev,
                    totalRows: 0,
                    totalPage: 0
                }))
                console.log("Error Retrieve bunker plan list API: " + error)
            })
            .finally(() => setLoading(false))
    }, [dataVesselBunkerScheduled]);

    const fetchBunkerPlanVerifiedList = useCallback(() => {
        bunkerPlanListVerifiedQuery.mutateAsync()
            .then(it => {
                if (it.success) {
                    setDataVesselBunkerVerified(it.data.map((each, idx) => ({
                        id: idx,
                        simulationId: each.simulation_id,
                        vesselName: each.vessel_name,
                        supplyDate: new Date(each.bunker_date),
                        supplyPort: each.port_name,
                        bunkerMedia: each.bunker_schema,
                        fuelType: each.fuel_type,
                        plannedVol: formatCurrency(each.quantity).concat(" MT"),
                        actualReceipt: each.ar15 !== null ? formatCurrency(each.ar15).concat(" MT") : '-',
                        billOfLading: each.bl15 !== null ? formatCurrency(each.bl15).concat(" MT") : '-',
                        discrepancyVal: each.discrepancy !== null ? formatCurrency(each.discrepancy).concat(" MT") : '-',
                        discrepancyPercent: each.discrepancy_percentage !== null ? formatCurrency(each.discrepancy_percentage).concat(" MT") : '-'
                    })))
                } else {
                    setDataVesselBunkerVerified([])
                }

                setPaginationBunkerPlan((prev) => ({
                    ...prev,
                    totalRows: it.total,
                    totalPage: it.total_page
                }))
            })
            .catch(error => {
                setDataVesselBunkerVerified([])
                setPaginationBunkerPlan((prev) => ({
                    ...prev,
                    totalRows: 0,
                    totalPage: 0
                }))
                console.log("Error Retrieve bunker plan list API: " + error)
            })
            .finally(() => setLoading(false))
    }, [dataVesselBunkerVerified]);

    const updateBunkerPlanList = useCallback(async () => {
        bunkerPlanUpdateResultQuery.mutateAsync()
        .then(it => {
            setLoading(true)
            fetchBunkerPlanList()
            setUpdateDataBunkerPlanList(prev => ({
                ...prev,
                id: null,
                simulationId: null,
                status: null,
                bunkerDate: null,
                mfo: null,
                hfo: null,
                mdf: null,
                mgo: null,
                lfo: null,
                hsd: null
            }))
        })
        .catch(error => console.log("Error update bunker plan list API: " + error))
    }, [updateDataBunkerPlanList]);

    const updateBunkerPlanStatus = useCallback(async () => {
        bunkerPlanUpdateStatusResultQuery.mutateAsync()
        .then(it => {
            setLoading(true)
            fetchBunkerPlanList()
            setUpdateDataBunkerPlanList(prev => ({
                ...prev,
                simulationId: null,
                status: null
            }))
        })
        .catch(error => console.log(error))
    }, [updateDataBunkerPlanList.status]);

    const updateBunkerPlanVerify = useCallback(async () => {
        bunkerPlanUpdateVerify.mutateAsync()
        .then(it => {
            if (it[0].success) {
                uploadEvidences()
            } else {
                console.log(it[0].errors)
            }
        })
        .catch(error => console.log(error))
    }, [updateDataBunkerPlanVerify]);

    const uploadEvidences = useCallback(async () => {
        uploadEvidencesQuery.mutateAsync()
        .then(it => {
            if (it.success) {
                setLoading(true)
                fetchBunkerPlanList()
                setUpdateDataBunkerPlanVerify([])
                setSelectedBunkerPlanAdjust(null)
                setModalAjustIdx(null)
            } else {
                console.log(it.errors)
            }
        })
        .catch(error => console.log(error))
    }, [uploadDataEvidences]);

    const fetchBunkerPlanDetail = useCallback(() => {
        bunkerPlanDetailQuery.mutateAsync()
            .then(it => {
                if (it.success) {
                    if (activeTabId === 0) {
                        setSelectedBunkerPlanAdjust(prev => ({
                            ...prev,
                            dataBunker: it.data.bunker_plans.map((v): BunkerValueType => ({
                                id: v.id,
                                type: v.fuel_type as BunkerType,
                                value: v.quantity > 0 ? v.quantity + " MT" : ""
                            }))
                        }))
                    } else {
                        setSelectedBunkerPlanAdjust(prev => ({
                            ...prev,
                            dataEvidence: it.data.evidences.map((v): EvidenceType => ({
                                evidenceId: v.evidence_id,
                                fileName: v.file_name,
                                fileUrl: v.file_url
                            }))
                        }))
                    }
                    
                    setModalAjustIdx(selectedBunkerPlanAdjust.id)
                }
            })
            .catch(error => console.log("Error Retrieve bunker plan detail API: " + error))
    }, [selectedBunkerPlanAdjust]);

    const goGenerateTelex = (rowIdx: number) => {
        setClickedRowIdx(rowIdx)
        setTimeout(() =>
            bunkerPlanTelexQuery.mutateAsync()
                .then(it => { setClickedRowIdx(null); window.open(it, '_blank', 'noopener,noreferrer') })
                .catch(error => { setClickedRowIdx(null); console.log("error telex query: ", error) })
        );
    };
    
    const goBunkerPlanExport = () => {
        bunkerPlanExportQuery.mutateAsync()
            .then(it => { window.open(it) })
            .catch(error => console.log(error))
    };

    const goBunkerPlanVerifiedExport = () => {
        bunkerPlanVerifiedExportQuery.mutateAsync()
            .then(it => { window.open(it) })
            .catch(error => console.log(error))
    };

    useEffect(() => {
        setTitle("Schedule & Realization");
    }, []);

    useEffect(() => {
        if (activeTabId === 0) {
            if (fetchPortSearchError) {
                // console.log("Error retrieve port search: ", fetchPortSearchErrorData);
            } 
            if (fetchPortSearchSuccess) {
                fetchPort();
            }
        }
        if (activeTabId === 1 && bunkerVesselFilterOptions.length === 0) fetchVessel();
        
        setLoading(true)
        setSelectedStatusFilterOption(null)
        setSelectedBunkerPortFilterOption(null)
        setSelectedVesselFilterOption(null)
        setDateRange([new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)])
        setDefaultDateChanged(false)
        setPaginationBunkerPlan((prev) => ({
            ...prev,
            totalRows: 0,
            totalPage: 0
        }))
        if (activeTabId === 0) {
            setTimeout(() => fetchBunkerPlanList(), 100);
        }
        if (activeTabId === 1) {
            setTimeout(() => fetchBunkerPlanVerifiedList(), 100);
        }
    }, [
        activeTabId,
        fetchPortSearchError,
        fetchPortSearchSuccess
    ]);

    useEffect(() => {
        if (updateDataBunkerPlanList?.simulationId) {
            if (updateDataBunkerPlanList.status !== ScheduleBunkerPlanType.ON_PROGRESS) {
                updateBunkerPlanStatus()
            } else {
                updateBunkerPlanList()
            }
        }
    }, [updateDataBunkerPlanList]);

    useEffect(() => {
        if (activeTabId === 0) fetchBunkerPlanList()
        else fetchBunkerPlanVerifiedList()
    }, [
        selectedStatusFilterOption,
        selectedVesselFilterOption,
        selectedBunkerPortFilterOption,
        paginationBunkerPlan.pageIndex,
        paginationBunkerPlan.pageSize,
        dateRange
    ]);

    useEffect(() => {
        if (selectedBunkerPlanAdjust?.simulationId) fetchBunkerPlanDetail()
    }, [
        selectedBunkerPlanAdjust?.simulationId
    ]);

    useEffect(() => {
        if (uploadDataEvidences.length > 0 && updateDataBunkerPlanVerify.length > 0) updateBunkerPlanVerify()
    }, [uploadDataEvidences, updateDataBunkerPlanVerify])

    const statusBasedRole = (value: ScheduleBunkerPlanType) => {
        switch (value) {
            case ScheduleBunkerPlanType.NEED_REVIEW:
                return ScheduleBunkerPlanType.ON_REVIEW
            case ScheduleBunkerPlanType.WAITING_FOR_APPROVAL:
                return ScheduleBunkerPlanType.REVIEWED
            default:
                return value
        }
    };

    const buttonActionList = (value: ScheduleBunkerPlanType): {name: string | null, icon: string | null} => {
        let name: string | null;
        let icon: string | null;
    
        switch (value) {
            case ScheduleBunkerPlanType.ON_PROGRESS:
                name = "Telex";
                icon = "download-icon";
                break;
            case ScheduleBunkerPlanType.COMPLETED:
                name = "Adjust & Verify";
                icon = "checked-note-icon";
                break;
            default:
                name = "Cancel";
                icon = "round-stop-icon";
        }
    
        return {
            name, icon
        }
    };

    const onHandleCancel = () => {
        const bunkerSelect = dataVesselBunkerScheduled.find((_, index) => index === modalBunkerIdx)
        setUpdateDataBunkerPlanList(prev => ({
            ...prev,
            idx: modalBunkerIdx,
            simulationId: bunkerSelect?.simulationId,
            status: ScheduleBunkerPlanType.CANCELED
        }));
        setShowBunkerRejection(false)
        setModalBunkerIdx(null)
    }
    const onHandleComplete = () => {
        const bunkerSelect = dataVesselBunkerScheduled.find((_, index) => index === modalBunkerIdx)
        setUpdateDataBunkerPlanList(prev => ({
            ...prev,
            idx: modalBunkerIdx,
            simulationId: bunkerSelect?.simulationId,
            status: ScheduleBunkerPlanType.COMPLETED
        }))
        setShowBunkerConfirmation(false)
        setModalBunkerIdx(null)
    }
    const updateSchedule = (rowIndex: number, value: any) => {
        setUpdateDataBunkerPlanList(prev => ({
            ...prev,
            idx: rowIndex,
            simulationId: dataVesselBunkerScheduled.find((_, index) => index === rowIndex)?.simulationId,
            bunkerDate: toEpochSeconds(value.bunkerDate),
            status: ScheduleBunkerPlanType.ON_PROGRESS,
            mfo: convertStringToNumber(value.mfoVol),
            hfo: convertStringToNumber(value.hfoVol),
            lfo: convertStringToNumber(value.lfoVol),
            mdf: convertStringToNumber(value.mdfVol),
            mgo: convertStringToNumber(value.mgoVol),
            hsd: convertStringToNumber(value.hsdVol)
        }));
    }

    const updateVerify = (rowIndex: number, value: any) => {
        // setDataVesselBunker(prev => prev.map((row, index) => index === rowIndex ? value : row));
    };

    const onHandleVerifyModal = (row: number) => {
        const selectedBunker = dataVesselBunkerScheduled.find((_, index) => index === row)
        setSelectedBunkerPlanAdjust(prev => ({
            ...prev,
            id: row,
            simulationId: selectedBunker.simulationId,
            vesselName: selectedBunker.vesselName,
            bunkerPort: selectedBunker.bunkerPort,
            receivedDate: selectedBunker.bunkerDate
        }))
    }

    const onHandleEvidenceModal = (row: number) => {
        const selectedBunker = dataVesselBunkerVerified.find((_, index) => index === row)
        setSelectedBunkerPlanAdjust(prev => ({
            ...prev,
            id: row,
            simulationId: selectedBunker.simulationId,
            vesselName: selectedBunker.vesselName
        }))
    }

    const onHandleVerify = (value: VerifyBunker) => {
        const bunkerSelect = dataVesselBunkerScheduled.find((_, index) => index === modalAdjustIdx)

        setUpdateDataBunkerPlanVerify(value.dataMedia.map(i => {
            let mediaSpecificUpdates: Partial<BunkerPlanListVerifyDataType> = {};
            
            mediaSpecificUpdates.id = i.id;
            mediaSpecificUpdates.billOfLading = i.billOfLading;
            mediaSpecificUpdates.bolL15 = i.bolL15;
            mediaSpecificUpdates.actualReceipt = i.actualReceipt;
            mediaSpecificUpdates.actRecL15 = i.actRecL15;
            mediaSpecificUpdates[i.bunkerType.toLowerCase()] = convertStringToNumber(bunkerSelect[i.bunkerType.toLowerCase() + "Vol"]);

            if (value.bunkerMedia === "Bunker Barge") {
                const bargeData = i as Barge;
                mediaSpecificUpdates.sfblTransporter = bargeData.sfblTransporter;
                mediaSpecificUpdates.sfblL15 = bargeData.sfblL15;
                mediaSpecificUpdates.sfalTransporter = bargeData.sfalTransporter;
                mediaSpecificUpdates.sfalL15 = bargeData.sfalL15;
                mediaSpecificUpdates.sfbdTransporter = bargeData.sfbdTransporter;
                mediaSpecificUpdates.sfbdL15 = bargeData.sfbdL15;
                mediaSpecificUpdates.sfadTransporter = bargeData.sfadTransporter;
                mediaSpecificUpdates.sfadL15 = bargeData.sfadL15;
                mediaSpecificUpdates.bargeCode = value.bunkerBarge;
            }
            return {
                idx: modalAdjustIdx,
                simulationId: bunkerSelect?.simulationId,
                bunkerDate: toEpochSeconds(bunkerSelect?.bunkerDate),
                receivedDate: toEpochSeconds(value.actualReceiveDate),
                remarks: value.remarks,
                bunkerSchema: value.bunkerMedia,
                status: ScheduleBunkerPlanType.VERIFIED,
                ...mediaSpecificUpdates
            }
        }));

        setUploadDataEvidences(value.files.map(i => {
            return {
                simulationId: bunkerSelect?.simulationId,
                fileName: i.name,
                isUpdated: false,
                isDeleted: false,
                files: i.originalFile
            }
        }))
    }
 
    return (
        <div className="flex-1 overscroll-auto overflow-auto font-[nunito] py-4">
            <div className="flex flex-col gap-3">
                <div className="flex px-4 justify-between items-start">
                    <h2 className="text-lg font-bold font-[nunito]">Bunker Plan List</h2>
                    <SlidingTabBar data={tabData} activeIndex={activeTabId} onActiveTabChange={setActiveTabId} />
                </div>
                <div className="flex flex-col items-start p-4 pt-1">
                    <BunkerPlanConfirmationModal 
                        type={BunkerConfirmModalType.COMPLETED} 
                        visible={showBunkerConfirmation} 
                        data={dataVesselBunkerScheduled[modalBunkerIdx]}
                        onOk={onHandleComplete} 
                        onClose={() => {setShowBunkerConfirmation(false)}} 
                    />
                    <BunkerPlanConfirmationModal 
                        type={BunkerConfirmModalType.CANCELED}
                        visible={showBunkerRejection} 
                        data={dataVesselBunkerScheduled[modalBunkerIdx]}
                        onOk={onHandleCancel} 
                        onClose={() => {setShowBunkerRejection(false)}} 
                    />
                    <div className="bg-white shadow-md p-4 rounded-2xl border border-gray-200">
                        {isLoading ? (
                            <div className="flex flex-row w-screen px-28 py-16 gap-10 items-center">
                                <Skeleton />
                                <Skeleton />
                            </div>
                        ) :
                            activeTabId === 0 ? (
                                <DataTableFilterCard
                                    columns={columnBunkerPlanScheduled}
                                    data={dataVesselBunkerScheduled}
                                    filters={filterVesselBunker}
                                    onInitEdit={setHandlers}
                                    updateData={updateSchedule}
                                    enableExport={true}
                                    enablePagination={true}
                                    pagination={paginationBunkerPlan}
                                    onPaginationChange={onPaginationBunkerPlanChange}
                                    onExport={goBunkerPlanExport}
                                />
                            ) : (
                                <DataTableFilterCard
                                    columns={columnBunkerPlanVerified}
                                    data={dataVesselBunkerVerified}
                                    filters={filterVesselBunkerVerified}
                                    enableExport={true}
                                    enablePagination={true}
                                    pagination={paginationBunkerPlan}
                                    onPaginationChange={onPaginationBunkerPlanChange}
                                    onExport={goBunkerPlanVerifiedExport}
                                />
                            )
                        }
                        { modalAdjustIdx !== null ? activeTabId === 0 ? (
                            <ScheduleAdjustVerifyModal
                                isOpen={modalAdjustIdx !== null}
                                handleShow={(type, open) => {
                                    if (!open && type === BunkerConfirmModalCloseType.CLOSED) {
                                        setUpdateDataBunkerPlanVerify([])
                                        setSelectedBunkerPlanAdjust(null)
                                    }
                                    setModalAjustIdx(!open && null)
                                }}
                                handleVerify={onHandleVerify}
                                vesselName={selectedBunkerPlanAdjust.vesselName}
                                bunkerPort={selectedBunkerPlanAdjust.bunkerPort}
                                actualReceiveDate={selectedBunkerPlanAdjust.receivedDate}
                                bunkerValue={selectedBunkerPlanAdjust.dataBunker}
                                maxUpload={5}
                                maxSize={10}
                            />
                        ) : (
                            <FileDownloadModal
                                title={selectedBunkerPlanAdjust.vesselName}
                                isOpen={modalAdjustIdx !== null}
                                // handleShow={(open) => setModalAjustIdx(!open && null)}
                                handleShow={(open) => {
                                    setUpdateDataBunkerPlanVerify([])
                                    setSelectedBunkerPlanAdjust(null)
                                    setModalAjustIdx(!open && null)
                                }}
                                dataFile={selectedBunkerPlanAdjust.dataEvidence}
                            />
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScheduleAndRealization;