import { ColumnDef } from "@tanstack/react-table"
import DataTable, {ExpandRow, PaginationType} from "./DataTable"
import DropdownSelect, {SelectOptionsType} from "./DropdownSelect"
import Datepicker from "./Datepicker"
import { FilterType, AlignType } from "@/utils/enums/DatatableEnum"
import { useState } from "react"
import { SelectType } from "@/utils/enums/SelectEnum"
import { FilterSelectType, FilterDateType } from "@/utils/Types"
import { DatepickerType } from "@/utils/enums/DatepickerEnum"
import Image from "next/image"
import { SortingState } from "@tanstack/react-table"

type FilterDataFixedType = {nameColumn: string, placeholder?: string;}
type FilterDataOptionType = 
{ 
    type: FilterType.DROPDOWN_SEARCH,
    name: string,
    data: SelectOptionsType[],
    value: SelectOptionsType | null,
    fnOnChange: (selected: SelectOptionsType | null) => void
} | { 
    type: FilterType.DATEPICKER,
    value: [Date | null, Date | null] | null,
    fnOnChange: (selected: [Date | null, Date | null] | null) => void,
    maxDate?: Date,
    isClearable?: boolean
}
export type FilterDataType = {
    align: AlignType,
    list: (FilterDataFixedType & FilterDataOptionType)[]
};

interface DataTableFilterCardProps<T extends object, E extends boolean = false> {
    title?: string;
    columns: ColumnDef<T>[];
    data: E extends true ? (T & ExpandRow)[] : T[];
    filters?: FilterDataType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateData?: (rowIndex: number, value: any) => void;
    enableExpand?: E;
    enableExport?: boolean;
    enablePagination?: boolean;
    pagination?: PaginationType;
    sorting?: SortingState;
    onPaginationChange?: (newPageIndex: number, newPageSize: number) => void;
    onSortingChange?: (sort: SortingState) => void;
    onInitEdit?: (handlers: { handleEdit: (id: number) => void }) => void;
    onExport?: () => void;
}

const DataTableFilterCard = <T extends object, E extends boolean>({
    columns, 
    data, 
    filters, 
    updateData,
    enableExpand,
    enableExport,
    enablePagination = false,
    pagination,
    sorting,
    onPaginationChange,
    onSortingChange,
    onInitEdit,
    onExport
}: DataTableFilterCardProps<T, E>) => {
    // const [selected, setSelected] = useState<FilterSelectType[]>([]);
    // const [dateRange, setDateRange] = useState<FilterDateType[]>([]);
    // const [filterData, setFilterData] = useState<FilterColumnType[]>([]);

    // const handleChangeFilter = (name: string, type: FilterType, value) => {
    //     setFilterData((prevData) => {
    //         const exist = prevData.find(i => i.name === name)
    //         return exist ? prevData.map((i) => 
    //             i.name === exist.name ? {...i, value: value} : i
    //         ) : [...prevData, {id: prevData.length+1, name: name, type: type, value: value}] 
    //     })
    // }

    return (
        <div className="flex flex-col gap-3">
            <div className={`flex ${!filters && enableExport ? 'justify-end' : 'justify-between'}`}>
                {(filters || enableExport) && ( 
                   <>
                        {filters && (
                            <div className={`flex gap-2${
                                filters && filters.align === AlignType.ALIGN_ITEM_RIGHT
                                    ? ' justify-end'
                                    : ' justify-start'
                            } items-center`}>
                                <div className="flex">
                                    <span className="text-xs font-light w-auto">Filter by:</span>
                                </div>
                                <div className="flex gap-2">
                                    { filters.list.filter(i => i.type === FilterType.DROPDOWN_SEARCH)
                                        .map((filter, index) => {
                                            return (
                                                <DropdownSelect 
                                                    key={index}
                                                    name={filter.name}
                                                    type={SelectType.SINGLE}
                                                    options={filter.data} 
                                                    placeholder={filter.placeholder}
                                                    value={filter.value /*selected.find(i => i.name === filter.nameColumn)?.options*/}
                                                    onChange={filter.fnOnChange
                                                        /*(value) => {
                                                        setSelected((prev) => {
                                                            const exist = prev.find(i => i.name === filter.nameColumn)
                                                            return exist ? prev.map((i) => 
                                                                i.id === index ? {...i, id: index, options: value} : i
                                                            ) : [...prev, {id: index, name: filter.nameColumn, options: value}]
                                                        })

                                                        handleChangeFilter(filter.nameColumn, FilterType.DROPDOWN_SEARCH, value)
                                                    }*/}
                                                />
                                            )
                                        }
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    { filters.list.filter(i => i.type === FilterType.DATEPICKER)
                                        .map((filter, index) => {
                                            return (
                                                <Datepicker 
                                                    key={index}
                                                    type={DatepickerType.RANGE}
                                                    placeholder={filter.placeholder}
                                                    maxDate={filter.maxDate}
                                                    selected={filter.value/*dateRange.find(i => i.name === filter.nameColumn)?.dates*/}
                                                    isClearable={filter.isClearable}
                                                    onChange={filter.fnOnChange
                                                        /*(value) => {
                                                        setDateRange((prev) => {
                                                            const exist = prev.find(i => i.name === filter.nameColumn)
                                                            const selected = exist ? prev.map((i) => 
                                                                i.id === index ? {...i, id: index, dates: value} : i
                                                            ) : [...prev, {id: index, name: filter.nameColumn, dates: value}]
                                                            return selected
                                                        })

                                                        // handleChangeFilter(filter.nameColumn, FilterType.DATEPICKER, {startDate: value[0], endDate: value[1]})
                                                    }*/} 
                                                />
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )}
                        {enableExport && (
                            <button className="flex gap-1 p-6 pt-1.5 pb-1.5 text-xs justify-end items-end text-black font-normal font-[nunito] border border-[#C7D1D1] hover:bg-gray-100 rounded-md" onClick={onExport}>
                                <Image width={0} height={0} src={'assets/upload-icon.svg'} alt={'gear logo'} className="w-4" />
                                Export
                            </button>
                        )}
                   </>
                )}
            </div>
            <div className="text-slate-100 justify-normal text-sm">
                <DataTable
                    columns={columns}
                    data={data}
                    updateData={updateData}
                    enableExpand={enableExpand}
                    enablePagination={enablePagination}
                    paginationProp={pagination}
                    sortingProp={sorting}
                    onPaginationChange={onPaginationChange}
                    onSortingChange={onSortingChange}
                    isBordered={true}
                    onInitEdit={onInitEdit}
                    // filterColumn={filterData}
                />
            </div>
        </div>
    )
}

export default DataTableFilterCard