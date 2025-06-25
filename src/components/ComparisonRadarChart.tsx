import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
  PolarRadiusAxis
} from "recharts";
import { SelectOptionsType } from "./DropdownSelect";
import { LegendType } from "@/utils/enums/RadarEnum";
import { TooltipContainer } from "./Tooltip";
import { BubbleType, ContainerType } from "@/utils/enums/TooltipEnum";
import { formatSeparatorNumber } from "@/utils/Utils";

export type RadarDataType = {
  subject: string | null;
  A: number;
  B: number;
  C: number;
  fullMark: number;
  unit: string;
  real_A: number;
  real_B: number;
  real_C: number;
}

export interface RadarLegendType extends SelectOptionsType {
  key: LegendType
  label: string
}

type RadarChartProps = {
  data: RadarDataType[];
  legends: RadarLegendType[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RadarTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  return (
    <TooltipContainer
      title={payload[0].payload.subject}
      type={ContainerType.CONTAINER}
      bubble={BubbleType.NONE}
    >
      { payload.map((item, index) => {
        return(
          <div key={index} className="w-full min-w-full">
            <span className="block text-xs font-normal">
              {item.name}: {formatSeparatorNumber(item.payload['real_' + item.dataKey])} {item.payload.unit}
            </span>
          </div>
        )
      })}
    </TooltipContainer>
  );
};

const ComparisonRadarChart: React.FC<RadarChartProps> = ({data, legends}) => {

  const colorSelection = (key) => {
    switch (key) {
      case LegendType.A:
        return '0096FF'
      case LegendType.B:
        return '3200F9'
      case LegendType.C:
        return 'D82CFF'
      default:
        return '00000'
    }
  }
  
  return (
    <div className="col-span-4 flex flex-col">
      <div className="flex justify-center items-center">
        <RadarChart
          outerRadius={100}
          width={600}
          height={250}
          data={data}
          margin={{
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        >
          <PolarGrid gridType="polygon" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }}/>
          <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 120]} />
          {legends && legends.map((i, index) => {
            const color = colorSelection(i.key)
            return (
              <Radar
                key={index}
                name={i.label.toString()}
                dataKey={i.key.toString()}
                fill={`#${color}`}
                stroke={`#${color}`}
                strokeWidth={0.5}
                fillOpacity={0.2}
              />
            )
          })}
          <Tooltip content={<RadarTooltip />} />
        </RadarChart>
      </div>
      <div className="flex justify-center p-2 text-black gap-6 text-xs">
        {legends && legends.map((subject, index) => {
          return (
            <div key={index} className="flex items-center gap-2">
              <span className={`h-1 w-5 rounded-lg ${subject.key === LegendType.A ? 'bg-[#0096FF]' : (subject.key === LegendType.B ? 'bg-[#3200F9]' : 'bg-[#D82CFF]')} items-center`}></span>
              {subject.label || "-"}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ComparisonRadarChart