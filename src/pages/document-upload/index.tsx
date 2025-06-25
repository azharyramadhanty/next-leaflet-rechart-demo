import { ColumnDef } from "@tanstack/react-table";
import DataTableFilterCard from "@/components/DataTableFilterCard";
import { useEffect, useRef, useState } from "react";
import { useTitle } from "@/context/TitleContext";
import Image from "next/image";
import { format } from "date-fns";
import { DocumentUpladType, DataType, FileUploadsType } from "@/utils/Types";
import { PaginationType } from "@/components/DataTable";
import { Button, FileInput, Label, Modal } from "flowbite-react";
import BannerCard from "@/components/BannerCard";
import { BannerType } from "@/utils/enums/BannerEnum";
import { toEpochSeconds } from "@/utils/Utils";

type FileUploadModalProps = {
    isOpen?: boolean;
    handleShow: (open: boolean) => void;
    handleVerify: (files: FileUploadsType) => void;
    dataFile?: FileUploadsType[],
    maxUpload?: number;
    maxSize?: number;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
    isOpen = false,
    handleShow,
    handleVerify,
    dataFile,
    maxUpload,
    maxSize
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null)
    const [fileUploads, setFileUploads] = useState<FileUploadsType[]>(dataFile || [])

    const handleFileDelete = (rowIndex: number) => {
        const newFiles = fileUploads.filter((_, index) => index !== rowIndex)
                            .map((file, index) => {
                                return { ...file, id: index}
                            })
        setFileUploads(newFiles)
    };

    const handleClickFileInput = (e?: React.ChangeEvent<HTMLInputElement>) => {
        handleFileSelect(e.target.files);
    };

    const handleFileUpload = (file: File) => {
        // setFileUploads((prev) =>
        //     [...prev, 
        //         {id: prev.length, name: file.name, path: 'http://localhost:3000/download', extension: file.type}
        //     ]
        // );
    };

    const validateFile = (file: File) => {
        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
        const checkMax = maxSize * 1024 * 1024;
    
        if (!allowedTypes.includes(file.type) || file.size > checkMax) {
            setError("Invalid attachment. Please upload a document in .docx or .pdf format, with a maximum file size of 10MB.");
            return false;
        }
        
        return true;
    };

    const handleFileSelect = (files: FileList | null) => {
        if (files && files.length > 0) {
            const uploadedFile = files[0]
            if (validateFile(uploadedFile)) {
                handleFileUpload(uploadedFile)
            }
        }
    };

    const onHandleVerify = () => {
        if (fileUploads.length < 1) {
            setError("Evidence document have to be uploaded")
        }

        handleVerify(fileUploads[0])
        handleShow(false)
    }

    return (
        <Modal dismissible show={isOpen} size="2xl" onClose={() => handleShow(false)}>
            <Modal.Header>Document Upload</Modal.Header>
            <Modal.Body>
                <div className="flex flex-col gap-4 font-[nunito]">
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
                    Confirm Upload
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

const DocumentUpload = () => {
    const [paginationDocumentUpload, setPaginationDocumentUpload] = useState<PaginationType>({
        pageIndex: 0,
        pageSize: 5,
        totalRows: 5,
        totalPage: 1
    });
    const [modalIdx, setModalIdx] =  useState<number | null>(null);
    const [dataFiles, setDataFiles] =  useState<FileUploadsType[]>([]);
    const { setTitle } = useTitle();
    const columnDocumentUpload: ColumnDef<DocumentUpladType>[] = [
        {
            id: "no",
            enableSorting: false,
            size: 6,
            header: "No.",
            cell: ({ row }) => {
                // const meta = table.options.meta as { pageIndex: number; pageSize: number };
                return row.index + 1
                        {/* {meta.pageIndex * meta.pageSize + row.index + 1} */}
            }
        },
        {
            accessorKey: "name",
            enableSorting: false,
            size: 25,
            header: "Name"
        },
        {
            accessorKey: "excelFile",
            enableSorting: false,
            size: 35,
            header: "Excel File",
            cell: ({ getValue }) => {
                const val = getValue() as string
                return val || (
                    <span className='italic text-[#ACB9B9]'>no file</span>
                )
            },
        },
        {
            accessorKey: "lastUpdated",
            enableSorting: false,
            size: 15,
            header: "Last Updated",
            accessorFn: (row) => format(row.lastUpdated, "EEE, dd MMM yyyy"),
        },
        {
            accessorKey: "action",
            header: "Action",
            cell: ({ row }) => {
                const {name, icon} = buttonActionList(row.original.excelFile);

                return (
                    <div className="flex gap-0.5">
                        <button
                            onClick={name === "Upload" ? () => setModalIdx(row.index) : () => {}}
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
                        { row.original.excelFile && (
                            <button
                                onClick={() => onHandleReplaceModal(row.index)}
                                className="bg-white border border-[#C7D1D1] font-bold text px-2 py-0.5 rounded-[99px] inline-flex items-center justify-center gap-2 text-[0.625rem]"
                            >
                                <Image 
                                    src={'assets/circular-arrow-icon.svg'} 
                                    alt={'replace file icon'}
                                    width={12} 
                                    height={12} 
                                />
                                <span>Replace</span>
                            </button>
                        )}
                    </div>
                )
            },
            enableSorting: false
        }
    ];
    const data: DocumentUpladType[] = [
        {
            id: 1,
            name: "Baseline SLA",
            excelFile: "TCP_2024_Baseline_Complete.xlsx",
            lastUpdated: 1693501200
        },
        {
            id: 2,
            name: "Cargo Grades",
            excelFile: "Cargo Grades (new-2).xlsx",
            lastUpdated: 1693501200
        },
        {
            id: 3,
            name: "Discrepancy",
            excelFile: "Discrepancy Bunker 2024 Profile.xlsx",
            lastUpdated: 1693501200
        },
        {
            id: 4,
            name: "Port Bunkering Type",
            excelFile: "",
            lastUpdated: 0
        },
        {
            id: 5,
            name: "Port Distance",
            excelFile: "",
            lastUpdated: 0
        }
    ]
    const [dataDocument, setDataDocument] = useState<DocumentUpladType[]>(data);

    useEffect(() => {
        setTitle("Document Upload");
    }, []);

    const buttonActionList = (value): {name: string | null, icon: string | null} => {
        let name: string | null;
        let icon: string | null;
    
        switch (value) {
            case "":
                name = "Upload";
                icon = "upload-file-icon";
                break;
            default:
                name = "Download";
                icon = "download-icon";
        }
    
        return {
            name, icon
        }
    };

    const onHandleReplaceModal = (row: number) => {
        const selected = dataDocument.find((_, index) => index === row)
        // setDataFiles([
        //     {
        //         id: 1,
        //         name: selected.excelFile,
        //         path: "http://localhost:3000/",
        //         extension: "application/pdf"
        //     }
        // ])
        setModalIdx(row)
    }

    const onPaginationDocumentUploadChange = (newPageIndex: number, newPageSize: number) => {
        setPaginationDocumentUpload((prev) => ({...prev, pageIndex: newPageIndex, pageSize: newPageSize}))
    };

    const onHandleVerify = (files: FileUploadsType) => {
        setDataDocument(prev => {
            return prev.map((i, index) => 
                index === modalIdx ? {...i, excelFile: files.name, lastUpdated: toEpochSeconds(new Date())} : i
            )
        })
        setModalIdx(null)
    }
 
    return (
        <div className="flex-1 overscroll-auto overflow-auto font-[nunito] py-4">
            <div className="flex flex-col justify-between items-start px-4">
                <div className="flex flex-col mt-2 px-2">
                    <h2 className="text-lg font-bold font-[nunito]">Sources</h2>
                </div>
            </div>
            <div className="flex flex-col items-start p-4 pt-1">
                <div className="bg-white shadow-md p-4 rounded-2xl border border-gray-200">
                    <DataTableFilterCard 
                        columns={columnDocumentUpload}
                        data={dataDocument}
                        enablePagination={true}
                        pagination={paginationDocumentUpload}
                        onPaginationChange={onPaginationDocumentUploadChange}
                    />
                    { modalIdx !== null && (
                        <FileUploadModal
                            isOpen={modalIdx !== null}
                            handleShow={(open) => {
                                setModalIdx(!open && null)
                                if (!open) setDataFiles([])
                            }}
                            handleVerify={onHandleVerify}
                            dataFile={dataFiles}
                            maxUpload={1}
                            maxSize={10}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default DocumentUpload;