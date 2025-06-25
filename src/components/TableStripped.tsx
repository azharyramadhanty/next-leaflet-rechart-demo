import { Table } from "flowbite-react"
import { RadarLegendType } from "./ComparisonRadarChart"
import { LegendType } from "@/utils/enums/RadarEnum"

type ValueDetailType = {
  id: string | number,
  value: string | number
}

export type TableDetailType = {
  id: string | number,
  label: string,
  items: ValueDetailType[],
}

type TableStrippedCustomProps = {
  headers: RadarLegendType[],
  details: TableDetailType[],
}

const TableStrippedCustom: React.FC<TableStrippedCustomProps> = ({headers, details}) => {

  const colorSelection = (key) => {
    switch (key) {
      case LegendType.A:
        return '82BCE5'
      case LegendType.B:
        return '907ED9'
      case LegendType.C:
        return 'B875C7'
      default:
        return '00000'
    }
  }
  return (
    <Table striped className="rounded-2x border-separate border-spacing-y-1 border-spacing-x-2">
      <Table.Head>
        <Table.HeadCell className="rounded-tl-2xl rounded-bl-2xl bg-[#ACB9B9] text-gray-900"></Table.HeadCell>
        {headers && (
          headers.map((header, index) => {
            // const color = colorSelection(header.key)
            return (
              <Table.HeadCell key={index} className={`text-center ${header.key === LegendType.A ? 'bg-[#82BCE5]' : (header.key === LegendType.B ? 'bg-[#907ED9]' : 'bg-[#B875C7]')} text-white${ index === headers.length - 1 ? ' rounded-tr-2xl rounded-br-2xl' : (index === headers.length - 1 ? ' rounded-tr-2xl' : ' border-r-0')}`}>{header.label || "-"}</Table.HeadCell>
            )
          })
        )}
      </Table.Head>
      <Table.Body className="text-xs">
        {details && (
          details.map((detail, index) => {
            return (
              <Table.Row key={index} className="bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className={`rounded-tl-2xl rounded-bl-2xl py-3 bg-[#F9FAFA] whitespace-nowrap font-medium text-gray-900 dark:text-white`}>
                  {detail.label}
                </Table.Cell>
                {detail.items.map((i, index) => {
                  return (
                    <Table.Cell key={index} className={`${ index === detail.items.length - 1 ? ' rounded-tr-2xl rounded-br-2xl' : (index === detail.items.length - 1 ? ' rounded-tr-2xl' : ' border-r-0')} py-3 text-center ${i.id === 'A' ? 'bg-[rgba(130,188,229,0.20)]' : (i.id === 'B' ? 'bg-[rgba(144,126,217,0.20)]' : 'bg-[rgba(184,117,199,0.20)]')} text-gray-900`}>
                      {i.value || "-"}
                    </Table.Cell>
                  )
                })}
              </Table.Row>
            )
          })
        )}
      </Table.Body>
    </Table>
  )
}

export default TableStrippedCustom