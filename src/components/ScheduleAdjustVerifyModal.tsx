import { Button, FileInput, Label, Modal } from "flowbite-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import DataTable from "./DataTable";
import { ColumnDef, Row } from "@tanstack/react-table";
import Image from "next/image";
import Datepicker from "./Datepicker";
import { DatepickerType } from "@/utils/enums/DatepickerEnum";
import { format } from "date-fns";
import { BannerType } from "@/utils/enums/BannerEnum";
import BannerCard from "./BannerCard";
import DropdownSelect, { SelectOptionsType } from "./DropdownSelect";
import { SelectType } from "@/utils/enums/SelectEnum";
import { BunkerConfirmModalCloseType, BunkerType } from "@/utils/enums/ScheduleAdjustVerifyEnum";
import { parseToIntOrNull } from "@/utils/Utils";
import { BunkerValueType, DataType, FileUploadsType } from "@/utils/Types";
import { useBarge } from "@/hooks/barge/useBarge";

interface VerifyBunkerBase {
    actualReceiveDate: Date;
    remarks: string;
    files?: FileUploadsType[]
}
interface VerifyBunkerPitOrSTS extends VerifyBunkerBase {
    bunkerMedia: 'Bunker PIT' | 'Bunker STS';
    dataMedia: Bunker[];
}
interface VerifyBunkerBarge extends VerifyBunkerBase {
    bunkerMedia: 'Bunker Barge';
    bunkerBarge: string;
    dataMedia: Barge[];
}
export type VerifyBunker = VerifyBunkerPitOrSTS | VerifyBunkerBarge;

type ScheduleAdjustVerifyModalProps = {
    isOpen?: boolean;
    handleShow: (type: BunkerConfirmModalCloseType, open: boolean) => void;
    vesselName: string;
    bunkerPort: string;
    actualReceiveDate: Date | null;
    bunkerValue: BunkerValueType[];
    handleVerify: (value: VerifyBunker) => void;
    maxUpload?: number;
    maxSize?: number;
}

export type Bunker = {
    id: string,
    bunkerType: BunkerType,
    plannedBunkerVol: string,
    billOfLading?: number | null,
    bolL15?: number | null,
    actualReceipt?: number | null,
    actRecL15?: number | null
};

export type Barge = {
    id: string,
    bunkerType: BunkerType,
    plannedBunkerVol: string,
    sfblTransporter?: number | null,
    sfblL15?: number | null,
    sfalTransporter?: number | null,
    sfalL15?: number | null,
    sfbdTransporter?: number | null,
    sfbdL15?: number | null,
    sfadTransporter?: number | null,
    sfadL15?: number | null,
    billOfLading?: number | null,
    bolL15?: number | null,
    actualReceipt?: number | null,
    actRecL15?: number | null
};

interface CellComponentProps<T> {
    row: Row<T>;
    column: string;
    handleInputChange: (rowIndex: number, column: string, newValue: number | null) => void;
}

const CellComponent = <T extends Bunker>({ 
    row, 
    column,
    handleInputChange 
}: CellComponentProps<T>) => {
    const rowId = row.index
    const [inputValues, setInputValues] = useState<{ [key: number]: string | number | null }>({});
  
    return (
        <input
            placeholder={row.original.plannedBunkerVol}
            value={inputValues[rowId] ?? row.original[column] ?? ''}
            onChange={(e) => {
                const newValue = e.target.value.replace(/\D/g, "");
                setInputValues((prev) => ({
                    ...prev,
                    [rowId]: newValue
                }))
            }}
            onBlur={() => {
                handleInputChange(rowId, column, inputValues[rowId] ?? row.original[column])
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            className="text-xs h-7 font-medium text-gray-900 px-2 py-1 border border-gray-300 rounded-2xl inline-flex w-auto max-w-full focus:outline-blue-500 focus:ring-1"
        />
    )
};

const ScheduleAdjustVerifyModal: React.FC<ScheduleAdjustVerifyModalProps> = ({
    isOpen = false,
    handleShow,
    vesselName,
    bunkerPort,
    actualReceiveDate,
    bunkerValue,
    handleVerify,
    maxUpload,
    maxSize
}) => {
    const dataSourceBunker: Bunker[] = ([
        {
            id: '',
            bunkerType: BunkerType.MFO,
            plannedBunkerVol: '',
            bolL15: null,
            actualReceipt: null,
            actRecL15: null
        },
        {
            id: '',
            bunkerType: BunkerType.HFO,
            plannedBunkerVol: '',
            bolL15: null,
            actualReceipt: null,
            actRecL15: null
        },
        {
            id: '',
            bunkerType: BunkerType.LFO,
            plannedBunkerVol: '',
            bolL15: null,
            actualReceipt: null,
            actRecL15: null
        },
        {
            id: '',
            bunkerType: BunkerType.MDF,
            plannedBunkerVol: '',
            bolL15: null,
            actualReceipt: null,
            actRecL15: null
        },
        {
            id: '',
            bunkerType: BunkerType.MGO,
            plannedBunkerVol: '',
            bolL15: null,
            actualReceipt: null,
            actRecL15: null
        },
        {
            id: '',
            bunkerType: BunkerType.HSD,
            plannedBunkerVol: '',
            bolL15: null,
            actualReceipt: null,
            actRecL15: null
        }
    ])
    const dataSourceBarge: Barge[] = ([
        {
            id: '',
            bunkerType: BunkerType.MFO,
            plannedBunkerVol: '',
            sfblTransporter: null,
            sfbdL15: null,
            sfalTransporter: null,
            sfalL15: null,
            sfbdTransporter: null,
            sfblL15: null,
            sfadTransporter: null,
            sfadL15: null,
            billOfLading: null,
            bolL15: null,
            actualReceipt: null,
            actRecL15: null
        },
        {
            id: '',
            bunkerType: BunkerType.HFO,
            plannedBunkerVol: '',
            sfblTransporter: null,
            sfbdL15: null,
            sfalTransporter: null,
            sfalL15: null,
            sfbdTransporter: null,
            sfblL15: null,
            sfadTransporter: null,
            sfadL15: null,
            billOfLading: null,
            bolL15: null,
            actualReceipt: null,
            actRecL15: null
        },
        {
            id: '',
            bunkerType: BunkerType.LFO,
            plannedBunkerVol: '',
            sfblTransporter: null,
            sfbdL15: null,
            sfalTransporter: null,
            sfalL15: null,
            sfbdTransporter: null,
            sfblL15: null,
            sfadTransporter: null,
            sfadL15: null,
            billOfLading: null,
            bolL15: null,
            actualReceipt: null,
            actRecL15: null
        },
        {
            id: '',
            bunkerType: BunkerType.MDF,
            plannedBunkerVol: '',
            sfblTransporter: null,
            sfbdL15: null,
            sfalTransporter: null,
            sfalL15: null,
            sfbdTransporter: null,
            sfblL15: null,
            sfadTransporter: null,
            sfadL15: null,
            billOfLading: null,
            bolL15: null,
            actualReceipt: null,
            actRecL15: null
        },
        {
            id: '',
            bunkerType: BunkerType.MGO,
            plannedBunkerVol: '',
            sfblTransporter: null,
            sfbdL15: null,
            sfalTransporter: null,
            sfalL15: null,
            sfbdTransporter: null,
            sfblL15: null,
            sfadTransporter: null,
            sfadL15: null,
            billOfLading: null,
            bolL15: null,
            actualReceipt: null,
            actRecL15: null
        },
        {
            id: '',
            bunkerType: BunkerType.HSD,
            plannedBunkerVol: '',
            sfblTransporter: null,
            sfbdL15: null,
            sfalTransporter: null,
            sfalL15: null,
            sfbdTransporter: null,
            sfblL15: null,
            sfadTransporter: null,
            sfadL15: null,
            billOfLading: null,
            bolL15: null,
            actualReceipt: null,
            actRecL15: null
        }
    ])
    const dataBunkerMedia: SelectOptionsType[] = [
        { key: 'A', value: "PIT" },
        { key: 'B', value: "BARGE" },
        { key: 'C', value: "STS" }
    ]
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showDate, setShowDate] = useState<boolean>(false)
    const [showMedia, setShowMedia] = useState<boolean>(false)
    const [showTransporter, setShowTransporter] = useState<boolean>(false)
    const [selectBunkerMedia, setSelectBunkerMedia] = useState<SelectOptionsType>({ key: 'A', value: "PIT" })
    const [selectTransporter, setSelectTransporter] = useState<SelectOptionsType | null>(null)
    const [receiveDate, setReceiveDate] = useState<Date | null>(actualReceiveDate)
    const [dataBunker, setDataBunker] = useState<Bunker[]>(dataSourceBunker)
    const [dataBarge, setDataBarge] = useState<Barge[]>(dataSourceBarge)
    const [dataBunkerSts, setDataBunkerSts] = useState<Bunker[]>(dataSourceBunker)
    const [remarks, setRemarks] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const [transporterList, setTransporterList] = useState<DataType[]>([]);
    const [fileUploads, setFileUploads] = useState<FileUploadsType[]>([])
    const { useBargeSearchAllQuery } = useBarge();
    const fetchBargeSearchAllQuery = useBargeSearchAllQuery();
    const columnBunker: ColumnDef<Bunker>[] = [
        {
            accessorKey: "no",
            enableSorting: false,
            size: 3,
            header: () => (
                <div className="text-center text-xs">No.</div>
            ),
            cell: ({ row }) => {
                return (
                    <div
                    className='text-center text-xs'
                    >
                    {row.index + 1}
                    </div>
                )
            }
        },
        {
            accessorKey: "bunkerType",
            size: 7,
            header: () => (
                <div className="text-left text-xs">Bunker Type</div>
            ),
            enableSorting: false,
        },
        {
            accessorKey: "plannedBunkerVol",
            size: 7,
            header: () => (
                <div className="text-left text-xs">Planned Vol.</div>
            ),
            enableSorting: false
        },
        {
            accessorKey: "billOfLading",
            size: 7,
            header: () => (
                <div className="text-left text-xs">Bill of Lading<br /><i>Liter Obs.</i></div>
            ),
            enableSorting: false,
            cell: ({ row, column }) => {
                return <CellComponent row={row} column={column.id} handleInputChange={handleInputChange} />;
            }
        },
        {
            accessorKey: "bolL15",
            size: 5,
            header: () => (
                <div className="text-left text-xs italic">L 15</div>
            ),
            enableSorting: false,
            cell: ({ row, column }) => {
                return <CellComponent row={row} column={column.id} handleInputChange={handleInputChange} />;
            }
        },
        {
            accessorKey: "actualReceipt",
            size: 7,
            header: () => (
              <div className="text-left text-xs">Actual Receipt<br /><i>Liter Obs.</i></div>
            ),
            enableSorting: false,
            cell: ({ row, column }) => {
              return <CellComponent row={row} column={column.id} handleInputChange={handleInputChange} />;
            }
        },
        {
            accessorKey: "actRecL15",
            size: 5,
            header: () => (
                <div className="text-left text-xs italic">L 15</div>
            ),
            enableSorting: false,
            cell: ({ row, column }) => {
                return <CellComponent row={row} column={column.id} handleInputChange={handleInputChange} />;
            }
        },
    ];
    const columnBarge: ColumnDef<Barge>[] = [
        {
            id: "no",
            enableSorting: false,
            size: 2,
            header: () => (
                <div className="text-center text-xs">No.</div>
            ),
            cell: ({ row }) => {
                return (
                    <div
                        className='text-center text-xs'
                    >
                        {row.index + 1}
                    </div>
                )
            }
        },
        {
            accessorKey: "bunkerType",
            size: 7,
            header: () => (
                <div className="text-left text-xs">Bunker Type</div>
            ),
            enableSorting: false
        },
        {
            accessorKey: "plannedBunkerVol",
            size: 7,
            header: () => (
                <div className="text-left text-xs">Planned Vol.</div>
            ),
            enableSorting: false
        },
        {
            accessorKey: "sfblTransporter",
            size: 7,
            header: () => (
                <div className="text-left text-xs">SFBL Transporter<br /><i>Liter Obs.</i></div>
            ),
            enableSorting: false,
            cell: ({ row, column }) => {
                return <CellComponent row={row} column={column.id} handleInputChange={handleInputChange} />;
            }
        },
        {
            accessorKey: "sfblL15",
            size: 5,
            header: () => (
                <div className="text-left text-xs italic">L 15</div>
            ),
            enableSorting: false,
            cell: ({ row, column }) => {
                return <CellComponent row={row} column={column.id} handleInputChange={handleInputChange} />;
            }
        },
        {
            accessorKey: "sfalTransporter",
            size: 7,
            header: () => (
              <div className="text-left text-xs">SFAL Transporter<br /><i>Liter Obs.</i></div>
            ),
            enableSorting: false,
            cell: ({ row, column }) => {
              return <CellComponent row={row} column={column.id} handleInputChange={handleInputChange} />;
            }
        },
        {
            accessorKey: "sfalL15",
            size: 5,
            header: () => (
                <div className="text-left text-xs italic">L 15</div>
            ),
            enableSorting: false,
            cell: ({ row, column }) => {
                return <CellComponent row={row} column={column.id} handleInputChange={handleInputChange} />;
            }
        },
        {
            accessorKey: "sfbdTransporter",
            size: 7,
            header: () => (
                <div className="text-left text-xs">SFBD Transporter<br /><i>Liter Obs.</i></div>
            ),
            enableSorting: false,
            cell: ({ row, column }) => {
                return <CellComponent row={row} column={column.id} handleInputChange={handleInputChange} />;
            }
        },
        {
            accessorKey: "sfbdL15",
            size: 5,
            header: () => (
                <div className="text-left text-xs italic">L 15</div>
            ),
            enableSorting: false,
            cell: ({ row, column }) => {
                return <CellComponent row={row} column={column.id} handleInputChange={handleInputChange} />;
            }
        },
        {
            accessorKey: "sfadTransporter",
            size: 7,
            header: () => (
                <div className="text-left text-xs">SFAD Transporter<br /><i>Liter Obs.</i></div>
            ),
            enableSorting: false,
            cell: ({ row, column }) => {
                return <CellComponent row={row} column={column.id} handleInputChange={handleInputChange} />;
            }
        },
        {
            accessorKey: "sfadL15",
            size: 5,
            header: () => (
                <div className="text-left text-xs italic">L 15</div>
            ),
            enableSorting: false,
            cell: ({ row, column }) => {
                return <CellComponent row={row} column={column.id} handleInputChange={handleInputChange} />;
            }
        },
        {
            accessorKey: "billOfLading",
            size: 7,
            header: () => (
                <div className="text-left text-xs">Bill of Lading<br /><i>Liter Obs.</i></div>
            ),
            enableSorting: false,
            cell: ({ row, column }) => {
                return <CellComponent row={row} column={column.id} handleInputChange={handleInputChange} />;
            }
        },
        {
            accessorKey: "bolL15",
            size: 5,
            header: () => (
                <div className="text-left text-xs italic">L 15</div>
            ),
            enableSorting: false,
            cell: ({ row, column }) => {
                return <CellComponent row={row} column={column.id} handleInputChange={handleInputChange} />;
            }
        },
        {
            accessorKey: "actualReceipt",
            size: 7,
            header: () => (
                <div className="text-left text-xs">Actual Receipt<br /><i>Liter Obs.</i></div>
            ),
            enableSorting: false,
            cell: ({ row, column }) => {
                return <CellComponent row={row} column={column.id} handleInputChange={handleInputChange} />;
            }
        },
        {
            accessorKey: "actRecL15",
            size: 5,
            header: () => (
                <div className="text-left text-xs italic">L 15</div>
            ),
            enableSorting: false,
            cell: ({ row, column }) => {
                return <CellComponent row={row} column={column.id} handleInputChange={handleInputChange} />;
            }
        },
    ];

    useEffect(() => {
        setDataBunker((prev) => {
            var filled = prev.map((i) => {
                const newValue = bunkerValue.find(val => val.type === i.bunkerType)
                return {...i, id: newValue.id, plannedBunkerVol: newValue.value}
            })
            setDataBunkerSts(filled)
            return filled
        })
        setDataBarge((prev) => {
            return prev.map((i) => {
                const newValue = bunkerValue.find(val => val.type === i.bunkerType)
                return {...i, id: newValue.id, plannedBunkerVol: newValue.value}
            })
        })
    }, [bunkerValue])

    useEffect(() => {
        if (fetchBargeSearchAllQuery.isError) {
            console.log("Error retrieve barge list data" + fetchBargeSearchAllQuery.error);
        } else {
          if (transporterList.length === 0) updateTransporters();
        }
    }, [
        fetchBargeSearchAllQuery.isError,
        fetchBargeSearchAllQuery.isSuccess
    ]);

    const updateTransporters = useCallback(() => {
        if (fetchBargeSearchAllQuery.isSuccess) {
            setTransporterList(fetchBargeSearchAllQuery.data.data.map(it => ({
                key: it.barge_code,
                value: it.barge_name
            })));
            setSelectTransporter({
                key: fetchBargeSearchAllQuery.data.data.find(i => i.barge_name !== '-').barge_code,
                value: fetchBargeSearchAllQuery.data.data.find(i => i.barge_name !== '-').barge_name
            })
        }
    }, [fetchBargeSearchAllQuery.data]);

    const handleFileDelete = (rowIndex: number) => {
        const newFiles = fileUploads.filter((_, index) => index !== rowIndex)
                            .map((file, index) => {
                                return { ...file, id: index}
                            })
        setFileUploads(newFiles)
    };

    const handleClickFileInput = (e) => {
        const files = e.target.files
        if (files && files.length > 0) {
            const uploadedFile = files[0]
            if (validateFile(uploadedFile)) {
                handleFileUpload(uploadedFile)
            }
        }
        e.target.value = ''
    };

    const handleFileUpload = (file: File) => {
        setFileUploads((prev) =>
            [...prev, 
                {id: prev.length, name: file.name, path: URL.createObjectURL(file), extension: file.type, originalFile: file}
            ]
        );
    };

    const validateFile = (file: File) => {
        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
        const checkMax = maxSize * 1024 * 1024;
    
        if (!allowedTypes.includes(file.type) || file.size > checkMax) {
            setError(`Invalid attachment. Please upload a document in .docx or .pdf format, with a maximum file size of ${maxSize}MB.`);
            return false;
        }

        if (fileUploads.find(i => i.name === file.name)) {
            setError("This file is already uploaded.");
            return false;
        }
        
        return true;
    };

    const filledInputData  = (dataSource: Bunker[] | Barge[], rowIndex: number, columnName: string, newValue: string | number | null) => dataSource.map((row, index) => 
            index === rowIndex ? { ...row, [columnName]: parseToIntOrNull(newValue) } : row
        )

    const handleInputChange = (rowIndex: number, columnName: string, newValue: string | number | null) => {
        if (selectBunkerMedia.key === 'A') {
            setDataBunker((prevData) => filledInputData(prevData, rowIndex, columnName, newValue));
        } else if (selectBunkerMedia.key === 'B') {
            setDataBarge((prevData) => filledInputData(prevData, rowIndex, columnName, newValue));
        } else {
            setDataBunkerSts((prevData) => filledInputData(prevData, rowIndex, columnName, newValue));
        }
    };

    const onHandleVerify = () => {   
        var dataSource
        if (selectBunkerMedia.key === 'B') {
            dataSource = dataBarge
            const emptyData = dataSource.find(i => (i.plannedBunkerVol && i.plannedBunkerVol !== '-') && (
                !i.actualReceipt || !i.actRecL15 || 
                !i.billOfLading || !i.bolL15 ||
                !i.sfblTransporter || !i.sfblL15 ||
                !i.sfalTransporter || !i.sfadL15 ||
                !i.sfbdTransporter || !i.sfbdL15 ||
                !i.sfadTransporter || !i.sfadL15
            ))
            if (emptyData) {
                setError("There's still an empty SFBL Transporter or SFAL Transporter or SFBD Transporter or SFAD Transporter or actual receipt or bill of lading")
                return;
            }
        } else {
            dataSource = selectBunkerMedia.key === 'A' ? dataBunker : dataBunkerSts
            const emptyData = dataSource.find(i => (i.plannedBunkerVol && i.plannedBunkerVol !== '-') && (!i.actualReceipt || !i.actRecL15 || !i.billOfLading || !i.bolL15))
            if (emptyData) {
                setError("There's still an empty actual receipt and bill of lading")
                return;
            }
        }

        if (fileUploads.length < 1) {
            setError("Evidence document have to be uploaded")
            return;
        }

        let verifySpecificUpdates: Partial<VerifyBunker> = {}
        verifySpecificUpdates.actualReceiveDate = receiveDate
        verifySpecificUpdates.remarks = remarks
        verifySpecificUpdates.files = fileUploads
        verifySpecificUpdates.bunkerMedia = selectBunkerMedia.key === 'A' ? "Bunker PIT" : selectBunkerMedia.key === 'B' ? "Bunker Barge" : "Bunker STS"
        verifySpecificUpdates.dataMedia = dataSource

        if (selectBunkerMedia.key === "B") {
            handleVerify({
                bunkerMedia: "Bunker Barge",
                dataMedia: dataSource,
                bunkerBarge: selectTransporter.key as string,
                actualReceiveDate: receiveDate,
                remarks: remarks,
                files: fileUploads
            })
        } else {
            handleVerify({
                bunkerMedia: selectBunkerMedia.key === 'A' ? "Bunker PIT" : "Bunker STS",
                dataMedia: dataSource,
                actualReceiveDate: receiveDate,
                remarks: remarks,
                files: fileUploads
            })
        }
        handleShow(BunkerConfirmModalCloseType.SAVED, false)
    }

    return (
        <Modal dismissible show={isOpen} size="2xl" onClose={() => handleShow(BunkerConfirmModalCloseType.CLOSED, false)}>
            <Modal.Header>{vesselName}</Modal.Header>
            <Modal.Body>
                <div className="flex flex-col gap-4 font-[nunito]">
                    <div className={`flex ${selectBunkerMedia.key !== 'B' ? 'space-x-12' : 'space-x-6'}`}>
                        <div className="flex flex-col">
                            <span className="text-[#90A2A2] text-[0.688rem]">Bunker Port</span>
                            <span className="text-sm font-bold">{bunkerPort}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[#90A2A2] text-[0.688rem]">Bunker Media</span>
                            <span className="flex gap-2 text-sm font-bold">
                                { showMedia ? (
                                    <>
                                        <DropdownSelect
                                            type={SelectType.SINGLE}
                                            name="bunker-media"
                                            value={selectBunkerMedia}
                                            options={dataBunkerMedia}
                                            isClearable={false}
                                            onChange={(value) => setSelectBunkerMedia(value ?? selectBunkerMedia)}
                                        />
                                        <button onClick={() => setShowMedia(false)}>
                                            X
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {selectBunkerMedia.value}
                                        <button onClick={() => setShowMedia(true)}>
                                            <Image
                                                className="mr-3"
                                                alt={'arrow down icon'}
                                                src={'assets/arrow-down.svg'}
                                                width={0} height={0} style={{width: 'auto'}}
                                            />
                                        </button>
                                    </>
                                )}
                            </span>
                        </div>
                        { selectBunkerMedia.key === 'B' && (
                            <div className="flex flex-col">
                                <span className="text-[#90A2A2] text-[0.688rem]">Transporter</span>
                                <span className="flex text-sm gap-1 font-bold">
                                    { showTransporter ? (
                                        <>
                                            <DropdownSelect
                                                type={SelectType.SINGLE}
                                                name="transporter"
                                                value={selectTransporter}
                                                options={transporterList}
                                                isClearable={false}
                                                onChange={(value) => setSelectTransporter(value ?? selectTransporter)}
                                            />
                                            <button onClick={() => setShowTransporter(false)}>
                                                X
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {selectTransporter.value}
                                            <button 
                                                onClick={() => setShowTransporter(true)}
                                            >
                                                <Image className="mr-3" src={'assets/pencil-paper-icon.svg'} alt={'tick icon'} width={0} height={0} style={{width: 'auto'}} />
                                            </button>
                                        </>
                                    )}
                                </span>
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="text-[#90A2A2] text-[0.688rem]">Actual Receive Date</span>
                            <span className="flex gap-1 text-sm font-bold">
                                { showDate ? (
                                    <>
                                        <Datepicker
                                            type={DatepickerType.SINGLE}
                                            selected={receiveDate}
                                            isClearable={false}
                                            dateFormat="dd MMM yyyy"
                                            onChange={(date: Date | null) => {
                                                setReceiveDate(date ?? receiveDate)
                                            }}
                                            className="w-[155px] text-sm font-semibold p-2 rounded-2xl h-8 border border-[#C7D1D1] bg-white/60"
                                        />
                                        <button onClick={() => setShowDate(false)}>
                                            X
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {format(receiveDate, "dd MMM yyyy")}
                                        <button onClick={() => setShowDate(true)}>
                                            <Image className="mr-3" src={'assets/pencil-paper-icon.svg'} alt={'tick icon'} width={0} height={0} style={{width: 'auto'}} />
                                        </button>
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="p-0 overflow-x-auto whitespace-nowrap">
                        <div className={selectBunkerMedia.key === 'B' ? "min-w-[1600px]" : undefined}>
                            <DataTable
                                columns={selectBunkerMedia.key === 'B' ? columnBarge : columnBunker} 
                                data={selectBunkerMedia.key === 'B' ? dataBarge : (selectBunkerMedia.key === 'A' ? dataBunker : dataBunkerSts)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold">Remarks</span>
                        <input
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Add notes here..."
                            className="text-xs h-10 font-medium text-gray-900 px-2 py-1 border border-gray-300 rounded-lg inline-flex w-auto max-w-full focus:outline-blue-500 focus:ring-1"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-bold">Upload Evidence Document</span>
                            { error && (
                                <BannerCard
                                    type={BannerType.DANGER}
                                    title={error}
                                    onDismiss={() => setError(null)}
                                />
                            )}
                            <div className="flex w-full items-center justify-center">
                                <Label
                                    htmlFor="dropzone-file"
                                    className={`flex h-25 w-full ${fileUploads.length >= maxUpload ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} flex-col items-center justify-center rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
                                >
                                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 16L12 12M12 12L16 16M12 12V21M20 16.7428C21.2215 15.734 22 14.2079 22 12.5C22 9.46243 19.5376 7 16.5 7C16.2815 7 16.0771 6.886 15.9661 6.69774C14.6621 4.48484 12.2544 3 9.5 3C5.35786 3 2 6.35786 2 10.5C2 12.5661 2.83545 14.4371 4.18695 15.7935" stroke="#030C13" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="mt-1 mb-1 font-[nunito] text-black">
                                            <span className="text-[0.8rem] font-bold underline">Click to upload</span>
                                        </p>
                                        <p className="text-xs text-gray-500">docx or pdf (max. {maxSize}mb)</p>
                                    </div>
                                    { fileUploads.length >= maxUpload || (
                                        <FileInput 
                                            ref={fileInputRef}
                                            onChange={handleClickFileInput}
                                            id="dropzone-file" 
                                            className="hidden" 
                                        />
                                    )}
                                </Label>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            { fileUploads.map((file, index) => (
                                <div key={index} className="flex justify-between p-4 rounded-[20px] border border-[#C7D1D1]">
                                    <a href="#" className="flex gap-2 justify-start">
                                        <Image src={'assets/file-icon.svg'} alt={'file icon'} width={0} height={0} style={{width: 'auto'}} />
                                        <span className="underline">{file.name}</span>
                                    </a>
                                    <button onClick={() => handleFileDelete(index)}>
                                        <Image src={'assets/trash-icon.svg'} alt={'trash icon'} width={0} height={0} style={{width: 'auto'}} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="flex justify-end">
                <Button 
                    color="failure" 
                    className="text-white rounded-full border" 
                    onClick={onHandleVerify}
                    size="xs"
                >
                    <Image className="mr-3" src={'assets/tick-icon.svg'} alt={'tick icon'} width={15} height={15} />
                    Verify Bunker Realization
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ScheduleAdjustVerifyModal