import { InputType } from "@/utils/enums/DatatableEnum";
import { useReactTable, ColumnDef, getCoreRowModel, flexRender, getPaginationRowModel, SortingState, getSortedRowModel, getExpandedRowModel, getFilteredRowModel } from "@tanstack/react-table"
import React, { useEffect, useRef, useState } from "react";
import AiInsight from "./AiInsight";
import { DataType } from "@/utils/Types";
import { TooltipContainer } from "./Tooltip";
import { BubbleType, ContainerType, PositionType } from "@/utils/enums/TooltipEnum";
import { createPortal } from "react-dom";
import Image from "next/image";
import DatePicker from "react-datepicker";
import ReactMarkdown from "react-markdown";
import DropdownSelect, { SelectOptionsType } from "./DropdownSelect";
import { ContentType, SelectType } from "@/utils/enums/SelectEnum";

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData, TValue> {
        editable?: boolean;
        emptyNotShow?: boolean;
        editAction?: boolean;
        saveAction?: boolean;
        inputType?: InputType;
        optionsDropdown?: DataType[];
        additionalValue?: any;
    }
}

export type DataTableDataType = DataType

// type BaseFilterColumnType =  {
//     id: number,
//     name: string
// }
// export type FilterValueType = {
//     type: FilterType.DATEPICKER,
//     value: {
//         startDate: Date | null,
//         endDate: Date | null,
//     } | null
// } | {
//     type: FilterType.DROPDOWN_SEARCH,
//     value: DataType | null
// }

export type PaginationType = {
    pageIndex: number,
    pageSize: number,
    totalRows: number,
    totalPage: number
};

// export type FilterColumnType = BaseFilterColumnType & FilterValueType

export type ExpandRow = {
    expandItems: {
        label: string,
        items: DataTableDataType[]
    }
}

interface DataTableProps<T extends object, E extends boolean = false> {
    columns: ColumnDef<T>[];
    data: E extends true ? (T & ExpandRow)[] : T[];
    enablePagination?: boolean;
    paginationProp?: PaginationType;
    sortingProp?: SortingState;
    onPaginationChange?: (newPageIndex: number, newPageSize: number) => void;
    onSortingChange?: (sort: SortingState) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateData?: (rowIndex: number, value: any) => void;
    enableExpand?: E;
    isBordered?: boolean;
    isScrollable?: boolean;
    minData?: number;
    onInitEdit?: (handlers: { handleEdit: (id: number) => void }) => void;
    // filterColumn?: FilterColumnType[];
}

type EditableCellProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
    additionalValue?: any;
    rowIndex: number;
    columnId: string;
    updateData: (columnId: string, value: any) => void;
    options?: DataType[];
    inputType?: InputType;
};

type ShowTooltip = {
    indexRow: number;
    indexCell: number;
    top: number;
    left: number;
}

const EditableCell = ({
    value,
    additionalValue,
    columnId,
    updateData,
    options,
    inputType = InputType.TEXT
}: EditableCellProps) => {
    let newValue = value
    if (inputType === InputType.DROPDOWN) {
        newValue = options.find(i => i.value === value)
    }
    const [inputValue, setInputValue] = useState(newValue);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        updateData(columnId, e.target.value);
    };

    const handleSelectDate = (date: Date | null) => {
        setInputValue(date)
        updateData(columnId, date);
    };

    const handleSelectDropdown = (value: SelectOptionsType | null) => {
        setInputValue(value)
        updateData(columnId, value.value);
    };

    return inputType === InputType.TEXT ? (
      <input
        value={inputValue}
        onChange={handleChange}
        placeholder={value}
        className="text-xs font-medium text-gray-900 px-2 py-1 border border-gray-300 rounded-2xl inline-flex w-auto max-w-full"
      />
    ) : inputType === InputType.DATE ? (
        <DatePicker
            selected={inputValue}
            onSelect={(date) => {
                handleSelectDate(date)
            }}
            dateFormat="dd MMM yyyy"
            minDate={new Date()}
            maxDate={new Date(new Date().setDate(new Date().getDate() + Number(additionalValue)))}
            className="w-[90px] text-xs font-semibold p-2 rounded-2xl h-8 border border-[#C7D1D1] bg-white/60"
        />
    ) : inputType === InputType.DROPDOWN ? (
        <DropdownSelect
            type={SelectType.SINGLE}
            name={columnId}
            position={PositionType.TOP}
            contentType={ContentType.PORTAL}
            placeholder={`Select ${columnId}`}
            value={inputValue}
            options={options}
            onChange={handleSelectDropdown}
        />
    ) : null;
};

const DataTable = <T extends object, E extends boolean>({
    columns,
    data,
    enablePagination = false,
    paginationProp,
    sortingProp,
    onPaginationChange,
    onSortingChange,
    updateData,
    enableExpand,
    isBordered = false,
    // filterColumn,
    isScrollable = false,
    minData = 0,
    onInitEdit
}: DataTableProps<T, E>) => {
    const [localSorting, setLocalSorting] = useState<SortingState>([]);
    const sorting = sortingProp ?? localSorting;
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const tableBodyRef = useRef<HTMLTableSectionElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null); 
    const [maxHeight, setMaxHeight] = useState(null);
    const [showTooltip, setShowTooltip] = useState<ShowTooltip>({
        indexRow: null,
        indexCell: null,
        top: null,
        left: null
    });
    const [position, setPosition] = useState(PositionType.RIGHT);
    const [editRowIdx, setEditRowIdx] = useState<number | null>(null);
    const [updatedRow, setUpdatedRow] = useState<T>(null);
    const [editTriggerId, setEditTriggerId] = useState<number | null>(null);
    // const [filteredData, setFilterData] = useState(null);

    // useEffect(() => {
    //     if (filterColumn) {
    //         let filtered = null;
    //         Object.entries(filterColumn).forEach(([_, filter]) => {
    //             if (filter.type === FilterType.DROPDOWN_SEARCH && filter.value) {
    //                 filtered = filtered || data
    //                 filtered = filtered.filter((row) => {
    //                     return row[filter.name].toLowerCase().includes(filter.value.value.toString().toLowerCase())
    //                 });
    //             }
                
    //             if (filter.type === FilterType.DATEPICKER && (filter.value.startDate && filter.value.endDate)) {
    //                 filtered = filtered || data
    //                 filtered = filtered.filter((row) => {
    //                     const rawDate = new Date(row[filter.name]);
    //                     return rawDate >= filter.value.startDate && rawDate <= filter.value.endDate;
    //                 });
    //             }
    //         });
    //         setFilterData(filtered)
    //     }
    // }, [filterColumn]);

    const {
        getHeaderGroups,
        nextPage,
        previousPage,
        getCanNextPage,
        getCanPreviousPage,
        getRowModel,
        getPageCount,
        setPageSize,
        setPageIndex,
        getState
    } = useReactTable({
        data: data, // || filteredData
        columns,
        pageCount: enablePagination ? paginationProp.totalPage : undefined,
        state: {
            sorting,
            expanded,
            ...(enablePagination && {
              pagination: {
                pageIndex: paginationProp.pageIndex,
                pageSize: paginationProp.pageSize
              }
            })
        },
        onPaginationChange: enablePagination ? (updater) => {
            if (!onPaginationChange) return;
            const next =
                typeof updater === "function"
                ? updater({ pageIndex: paginationProp.pageIndex, pageSize: paginationProp.pageSize })
                : updater;
            onPaginationChange(next.pageIndex, next.pageSize);
        } : undefined,
        onSortingChange: (sortUpdater: SortingState | ((old: SortingState) => SortingState)) => {
            const nextSort =
                typeof sortUpdater === "function"
                ? sortUpdater(sorting)
                : sortUpdater;
            if (onSortingChange) onSortingChange(nextSort)
            else setLocalSorting(nextSort)
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onExpandedChange: setExpanded,
        manualSorting: sortingProp !== undefined,
        manualPagination: enablePagination,
        ...(enablePagination && {
            getPaginationRowModel: getPaginationRowModel(),
            getExpandedRowModel: getExpandedRowModel(),
            meta: {
                pageIndex: paginationProp.pageIndex,
                pageSize: paginationProp.pageSize
            }
        })
        // ...(filterColumn && {
        //     getFilteredRowModel: getFilteredRowModel(),
        // })
    });

    useEffect(() => {
        if (isScrollable && tableBodyRef.current && data.length > minData) {
            const rows = tableBodyRef.current.querySelectorAll("tr")
            let total = 0

            for (let i = 0; i < Math.min(minData, rows.length); i++) {
                total += rows[i].getBoundingClientRect().height;
            }
            setMaxHeight(total + 25);
        }
    }, [data]);

    useEffect(() => {
        if (showTooltip && tooltipRef.current) {
            const tooltip = tooltipRef.current.getBoundingClientRect();
            const maxWidth = window.innerWidth;
            
            setPosition((prev) => showTooltip.left + 10 + tooltip.width > maxWidth ? PositionType.LEFT : prev)
        }
    }, [showTooltip]);

    const handleHoverTruncate = (e: React.MouseEvent<HTMLDivElement>, idxRow: number, idxCell: number) => {
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();

        if (target.scrollWidth > target.clientWidth) {
            setShowTooltip((prev) => ({
                ...prev,
                indexRow: idxRow, 
                indexCell: idxCell,
                top: rect.top + window.scrollY,
                left: rect.right + window.scrollX
            }))
        }
    }

    const handleEdit = (id) => {
        setEditRowIdx(old => {
            if (old === null) {
                setUpdatedRow(data.find((_, index) => index === id))
                return id
            } else {
                setEditTriggerId(id)
                return null
            }
        })
    };

    const updateDataRow = (columnId, value) => {
        setUpdatedRow((oldData) => (
            {...oldData, [columnId]: value}
        ));
    };

    useEffect(() => {
        if (onInitEdit) {
            onInitEdit({ handleEdit })
        }
    }, [onInitEdit]);

    useEffect(() => {
        if (editTriggerId !== null && updatedRow !== null) {
            updateData(editTriggerId, updatedRow)
            setUpdatedRow(null)
            setEditTriggerId(null)
        }
    }, [updatedRow, editTriggerId]);

    return (
        <>
            <table className="table-fixed w-full min-w-full rounded-2x border-separate border-spacing-y-1">
                <thead className={`${isScrollable ? 'sticky top-0 z-10' : ''}`}>
                    {getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="text-gray-700 bg-blue-100">
                            { enableExpand && (
                                <th className={`text-left px-3 py-2 rounded-tl-2xl rounded-bl-2xl`}></th>
                            )}
                            { headerGroup.headers.map((header, index) => (
                                <th
                                    key={header.id}
                                    className={`text-left ${isBordered || !isScrollable ? 'px-3 py-2' : `px-2 py-1`}${ index === 0 && !enableExpand ? ' rounded-tl-2xl rounded-bl-2xl' : ''}${ index === headerGroup.headers.length - 1 ? ' rounded-tr-2xl rounded-br-2xl' : ''}`}
                                    style={{width: header.column.columnDef.size !== 150 && header.column.columnDef.size+"%"}}
                                    onClick={
                                        header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined
                                    }
                                >
                                    { header.isPlaceholder
                                    ? null
                                    : (
                                        <div className="flex gap-2">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getCanSort() && (
                                                <button
                                                    onClick={() => {
                                                        header.column.getToggleSortingHandler()
                                                    }}
                                                >
                                                {{
                                                    asc: (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-3 w-3"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 15l7-7 7 7"
                                                            />
                                                        </svg>
                                                    ),
                                                    desc: (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-3 w-3"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 9l-7 7-7-7"
                                                            />
                                                        </svg>
                                                    ),
                                                }[header.column.getIsSorted() as string] ?? (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-3 w-3 opacity-50"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 15l7-7 7 7"
                                                        />
                                                    </svg>
                                                )}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
            </table>

            <div 
                className={`${(isScrollable && data.length > minData) ? 'overflow-y-auto rounded-scrollbar' : ''}`}
                style={{ maxHeight: maxHeight ? `${maxHeight}px` : 'auto' }}
            >
                <table className="table-fixed w-full min-w-full rounded-2x border-separate border-spacing-y-1">
                    <tbody ref={tableBodyRef} className="text-sm">
                        { getRowModel().rows.length > 0 ? getRowModel().rows.map((row, indexRow) => (
                            <React.Fragment key={row.id}>
                                <tr className="text-gray-700">
                                    { enableExpand && (
                                        <td className={`px-1 py-2 border border-r-0 border-b-gray-400 border-t-gray-400 border-l-gray-400 rounded-tl-2xl bg-[#F9FAFA]${!row.getIsExpanded() ? ' rounded-bl-2xl' : ''}`}>
                                            <button 
                                                onClick={() => row.toggleExpanded()}
                                                className="flex items-center"
                                            >
                                                { row.getIsExpanded() ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none" className="transform -rotate-90">
                                                            <path d="M8.99953 6.71173C8.60953 7.10173 8.60953 7.73173 8.99953 8.12173L12.8795 12.0017L8.99953 15.8817C8.60953 16.2717 8.60953 16.9017 8.99953 17.2917C9.38953 17.6817 10.0195 17.6817 10.4095 17.2917L14.9995 12.7017C15.3895 12.3117 15.3895 11.6817 14.9995 11.2917L10.4095 6.70173C10.0295 6.32173 9.38953 6.32173 8.99953 6.71173Z" fill="#030C13"/>
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none" className="transform rotate-90">
                                                            <path d="M8.99953 6.71173C8.60953 7.10173 8.60953 7.73173 8.99953 8.12173L12.8795 12.0017L8.99953 15.8817C8.60953 16.2717 8.60953 16.9017 8.99953 17.2917C9.38953 17.6817 10.0195 17.6817 10.4095 17.2917L14.9995 12.7017C15.3895 12.3117 15.3895 11.6817 14.9995 11.2917L10.4095 6.70173C10.0295 6.32173 9.38953 6.32173 8.99953 6.71173Z" fill="#030C13"/>
                                                        </svg>
                                                    )
                                                }
                                                <div className="flex items-center gap-1">
                                                    <Image 
                                                        src={'assets/ai-insight-icon.svg'} 
                                                        alt={'ai insight logo'}
                                                        width={16} 
                                                        height={16} 
                                                        style={{width: 16, height: 16}} 
                                                    />
                                                    <span className="text-start text-xs text-blue-400">
                                                        { `${row.getIsExpanded() ? 'Hide' : 'Show'} ${(row.original as T & ExpandRow).expandItems?.label}` }
                                                    </span>
                                                </div>
                                            </button>
                                        </td>
                                    )}
                                    { row.getVisibleCells().map((cell, indexCell) => {
                                        return (
                                            <td key={cell.id} 
                                                className={`relative ${isBordered || !isScrollable ? `px-3 py-2${enableExpand ? ' border border-b-gray-400 border-t-gray-400' : ''} bg-[#F9FAFA]${ indexCell === 0 && !enableExpand ? ` rounded-tl-2xl rounded-bl-2xl ${enableExpand ? 'border-l-gray-400' : ''}`: ' border-l-0'}${ indexCell === row.getVisibleCells().length - 1 && !row.getIsExpanded() ? ` rounded-tr-2xl rounded-br-2xl${enableExpand ? ' border-r-gray-400' : ''}` : (indexCell === row.getVisibleCells().length - 1 && row.getIsExpanded() ? ` rounded-tr-2xl${enableExpand ? ' border-r-gray-400' : ''}` : ' border-r-0')}` : `px-2 py-1`}`}
                                                style={{width: cell.column.columnDef.size !== 150 && cell.column.columnDef.size+"%"}}
                                            >
                                                <div
                                                    className="truncate overflow-hidden text-ellipsis"
                                                    onMouseEnter={(e) => handleHoverTruncate(e, indexRow, indexCell)}
                                                    onMouseLeave={() => {
                                                        setShowTooltip({
                                                            indexRow: null,
                                                            indexCell: null,
                                                            top: null,
                                                            left: null
                                                        })
                                                        setPosition(PositionType.RIGHT)
                                                    }}
                                                >
                                                    { cell.column.columnDef.meta?.editAction ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            <button
                                                                onClick={() => handleEdit(row.index)}
                                                                className="bg-white border border-[#C7D1D1] font-bold text px-4 py-1 rounded-[99px] inline-flex items-center justify-center gap-2 text-xs"
                                                            >
                                                                {editRowIdx === null && <Image src={`/assets/pencil-paper-icon.svg`} alt={'download icon'} width={16} height={16} style={{width: 16, height: 16}} />}
                                                                <span>{editRowIdx === null ? 'Edit' : 'Done Editing'}</span>
                                                            </button>
                                                        </div>
                                                    ) : updateDataRow && cell.column.columnDef.meta?.editable && !(cell.column.columnDef.meta?.emptyNotShow && (cell.getValue() === null || cell.getValue() === "" || cell.getValue() === 0 || cell.getValue() === "-")) && editRowIdx === row.index ? (
                                                        <EditableCell
                                                            value={updatedRow[cell.column.id] || cell.getValue()}
                                                            additionalValue={cell.column.columnDef.meta?.additionalValue}
                                                            rowIndex={row.index}
                                                            columnId={cell.column.id}
                                                            options={cell.column.columnDef.meta?.inputType === InputType.DROPDOWN && cell.column.columnDef.meta?.optionsDropdown}
                                                            updateData={updateDataRow}
                                                            inputType={cell.column.columnDef.meta?.inputType || InputType.TEXT}
                                                        />
                                                    ) : (
                                                        flexRender(cell.column.columnDef.cell, cell.getContext())
                                                    )}
                                                </div>
                                                { !(cell.column.columnDef.meta?.editable && editRowIdx === row.index) && showTooltip.indexRow === indexRow && showTooltip.indexCell === indexCell && 
                                                    createPortal(
                                                        // <div
                                                        //     ref={tooltipRef}
                                                        //     className="absolute bg-gray-800 text-white text-xs p-1 rounded shadow-lg z-[9999] whitespace-nowrap"
                                                        //     style={{
                                                        //         top: showTooltip.top, // Position above the cell
                                                        //         left: showTooltip.left, // Dynamically updated
                                                        //     }}
                                                        //     >
                                                        //     {cek}
                                                        //     {cell.getValue() as string}
                                                        // </div>
                                                        <TooltipContainer
                                                            ref={tooltipRef}
                                                            type={ContainerType.DEFAULT}
                                                            bubble={BubbleType.DEFAULT}
                                                            top={showTooltip.top}
                                                            left={showTooltip.left}
                                                            position={position}
                                                        >
                                                            <span className="text-xs font-normal">
                                                                {cell.getValue() as string}
                                                            </span>
                                                        </TooltipContainer>
                                                        , document.body
                                                    )
                                                }
                                            </td>
                                        )
                                    })}
                                </tr>
                                { enableExpand && row.getIsExpanded() && "expandItems" in row.original && (
                                    <tr className="text-gray-700 bg-[#F2F3F3] -mt-16">
                                        {
                                            (row.original as T & ExpandRow).expandItems?.items.map((i, index) => (
                                                <td key={index} colSpan={row.getVisibleCells().length + 1} className={`p-4 border border-gray-400${ index === 0 ? ' rounded-bl-2xl' : ''}${ index === (row.original as T & ExpandRow).expandItems?.items.length - 1  ? ' rounded-br-2xl' : ''}`}>
                                                    <AiInsight key={i.key}>
                                                        <div className="prose prose-sm max-w-none [&_*]:marker:text-gray-800 prose-li:text-gray-800">
                                                            <ReactMarkdown>{String(i.value)}</ReactMarkdown>
                                                        </div>
                                                    </AiInsight>
                                                </td>
                                            ))
                                        }
                                    </tr>
                                )}
                            </React.Fragment>
                        )) : (
                            <tr className="text-gray-700">
                                <td colSpan={getHeaderGroups()[0].headers.length} className="relative px-3 py-2 bg-[#F9FAFA] border-l-0 border-r-0 flex justify-center">
                                    No Result
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            { enablePagination && (
                <div className="mt-4 flex items-center justify-between text-gray-700 font-normal font-[nunito]">
                    <div className="flex items-center gap-4">
                        <span className="text-xs">Items per page:</span>
                        <select
                            value={getState().pagination.pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="px-2 py-1 rounded-[20px] border border-slate-300 text-xs"
                        >
                            {[5, 10, 20, 50].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                        <span className="text-xs">
                            {getState().pagination.pageIndex * getState().pagination.pageSize + 1}-{Math.min((getState().pagination.pageIndex + 1) * getState().pagination.pageSize, paginationProp.totalRows)} Showing of {paginationProp.totalRows} items
                        </span>
                    </div>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={previousPage}
                            disabled={!getCanPreviousPage()}
                            className={`px-2 py-2 group border-white rounded-full disabled:opacity-50${getCanPreviousPage() && ' hover:bg-gray-300'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={`text-gray-300 ${getCanPreviousPage() && "group-hover:text-white"}`}>
                                <path d="M14.9995 6.70656C14.6095 6.31656 13.9795 6.31656 13.5895 6.70656L8.99953 11.2966C8.60953 11.6866 8.60953 12.3166 8.99953 12.7066L13.5895 17.2966C13.9795 17.6866 14.6095 17.6866 14.9995 17.2966C15.3895 16.9066 15.3895 16.2766 14.9995 15.8866L11.1195 11.9966L14.9995 8.11656C15.3895 7.72656 15.3795 7.08656 14.9995 6.70656Z" fill="currentColor"/>
                            </svg>
                        </button>
                        {(() => {
                            const startPage = Math.max(0, getState().pagination.pageIndex - 1);
                            const endPage = Math.min(getPageCount() - 1, getState().pagination.pageIndex + 1);
                            const pagesToShow = [];

                            for (let i = startPage; i <= endPage; i++) {
                                pagesToShow.push(i);
                            }

                            return pagesToShow.map((page) => (
                                <button
                                    key={page}
                                    disabled={getState().pagination.pageIndex === page}
                                    onClick={() => setPageIndex(page)}
                                    className={`px-3 py-2 border ${
                                        getState().pagination.pageIndex === page
                                            ? "bg-gray-300 text-white text-xs"
                                            : "border-white text-xs text-gray-300 hover:bg-gray-300 hover:border-gray-300 hover:text-white"
                                        } rounded-full`}
                                >
                                    {page + 1}
                                </button>
                            ));
                        })()}
                        <button
                            onClick={nextPage}
                            disabled={!getCanNextPage()}
                            className={`px-2 py-2 group border-white rounded-full disabled:opacity-50${getCanNextPage() && ' hover:bg-gray-300'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={`text-gray-300 ${getCanNextPage() && "group-hover:text-white"}`}>
                                <path d="M8.99953 6.71173C8.60953 7.10173 8.60953 7.73173 8.99953 8.12173L12.8795 12.0017L8.99953 15.8817C8.60953 16.2717 8.60953 16.9017 8.99953 17.2917C9.38953 17.6817 10.0195 17.6817 10.4095 17.2917L14.9995 12.7017C15.3895 12.3117 15.3895 11.6817 14.9995 11.2917L10.4095 6.70173C10.0295 6.32173 9.38953 6.32173 8.99953 6.71173Z" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default DataTable