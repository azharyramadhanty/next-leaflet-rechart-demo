import { BarChartType, LegendType, LegendAlignType } from "@/utils/enums/ChartEnum";
import { BarDataType } from "@/utils/Types";
import { Bar, CartesianGrid, ComposedChart, Line, Tooltip, XAxis, YAxis } from "recharts";
import { TooltipContainer } from "./Tooltip";
import { BubbleType, ContainerType } from "@/utils/enums/TooltipEnum";

export type BarLegendType = {
    align: LegendAlignType,
    items: {
        key: LegendType;
        label: string;
    }[]
}

type BarChartProps = {
    width?: number,
    height?: number,
    data: BarDataType[],
    dataForecast?: BarDataType[],
    type: BarChartType,
    legends?: BarLegendType,
    showLabel?: boolean,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    return (
        <TooltipContainer
            title={payload[0].payload.name}
            type={ContainerType.CONTAINER}
            bubble={BubbleType.NONE}
        >
            {payload.map((item, index) => {
                return (
                    <div key={index} className="w-24 font-normal font-[nunito]">
                        <span className="block text-xxs z-50">
                            {item.name.toUpperCase()}: {item.value.toFixed(2)}
                        </span>
                    </div>
                )
            })}
        </TooltipContainer>
    );
};

const MainBarChart = ({ width = 250, height = 210, data, dataForecast, legends, type = BarChartType.GROUPED, showLabel = false }: BarChartProps) => {

    return (
        <div className={`${legends?.align === LegendAlignType.BOTTOM ? 'flex flex-col' : legends?.align === LegendAlignType.RIGHT ? 'flex' : ''}`}>
            <div className="flex flex-row">
                <ComposedChart
                    width={width}
                    height={height}
                    data={data}
                    margin={{
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                    }}
                    barGap={0}
                >
                    <CartesianGrid stroke="#E5E5EF" vertical={false} strokeDasharray="0" strokeWidth={1} />
                    <XAxis dataKey="name" stroke="#000000" scale="auto" label={showLabel && { value: 'History', offset: 186, position: 'top', fontSize: 11, fontFamily: "Nunito", stroke: '#00000050' }} axisLine={false} tickLine={false} fontWeight={600} fontSize={10} fontFamily="Nunito" />
                    <YAxis stroke="#D0D0D0" strokeWidth={0} strokeOpacity={0} fontWeight={600} fontSize={17} fontFamily="Nunito" />
                    <Bar dataKey="mfo" stackId={type === BarChartType.STACKED ? 1 : undefined} barSize={type === BarChartType.STACKED ? 15 : 10} fill="#073862" radius={type === BarChartType.STACKED ? [0, 0, 0, 0] : [10, 10, 0, 0]} />
                    <Bar dataKey="lfo" stackId={type === BarChartType.STACKED ? 1 : undefined} barSize={type === BarChartType.STACKED ? 15 : 10} fill="#0E5998" radius={type === BarChartType.STACKED ? [0, 0, 0, 0] : [10, 10, 0, 0]} />
                    <Bar dataKey="hfo" stackId={type === BarChartType.STACKED ? 1 : undefined} barSize={type === BarChartType.STACKED ? 15 : 10} fill="#1B81D8" radius={type === BarChartType.STACKED ? [0, 0, 0, 0] : [10, 10, 0, 0]} />
                    <Bar dataKey="mdf" stackId={type === BarChartType.STACKED ? 1 : undefined} barSize={type === BarChartType.STACKED ? 15 : 10} fill="#44B2FF" radius={type === BarChartType.STACKED ? [0, 0, 0, 0] : [10, 10, 0, 0]} />
                    <Bar dataKey="mgo" stackId={type === BarChartType.STACKED ? 1 : undefined} barSize={type === BarChartType.STACKED ? 15 : 10} fill="#9CD1FF" radius={type === BarChartType.STACKED ? [0, 0, 0, 0] : [10, 10, 0, 0]} />
                    <Bar dataKey="hsd" stackId={type === BarChartType.STACKED ? 1 : undefined} barSize={type === BarChartType.STACKED ? 15 : 10} fill="#CCEAFF" radius={[10, 10, 0, 0]} />
                    <Line type="monotone" activeDot={false} dataKey="baselineMfo" stroke="#ED1B2F" strokeWidth={2} strokeDasharray="0" hide={type !== BarChartType.GROUPED} />
                    <Line type="monotone" activeDot={false} dataKey="baselineLfo" stroke="#ED1B2F" strokeWidth={2} strokeDasharray="6" hide={type !== BarChartType.GROUPED} />
                    <Line type="monotone" activeDot={false} dataKey="baselineHfo" stroke="#ED1B2F" strokeWidth={2} strokeDasharray="4 1 1 6" hide={type !== BarChartType.GROUPED} />
                    <Line type="monotone" activeDot={false} dataKey="baselineMdf" stroke="#000000" strokeWidth={2} strokeDasharray="0" hide={type !== BarChartType.GROUPED} />
                    <Line type="monotone" activeDot={false} dataKey="baselineMgo" stroke="#000000" strokeWidth={2} strokeDasharray="6" hide={type !== BarChartType.GROUPED} />
                    <Line type="monotone" activeDot={false} dataKey="baselineHsd" stroke="#000000" strokeWidth={2} strokeDasharray="4 1 1 6" hide={type !== BarChartType.GROUPED} />
                    <Line type="linear" activeDot={false} dataKey="base" stroke="#90A2A2" strokeWidth={2} strokeDasharray="0" hide={type !== BarChartType.STACKED} />
                    <Tooltip content={<CustomTooltip />} />
                </ComposedChart>
                <ComposedChart
                    width={width}
                    height={height}
                    data={dataForecast}
                    margin={{
                        top: 0,
                        right: 10,
                        bottom: 0,
                        left: 0,
                    }}
                    barGap={0}
                    className={dataForecast ? '' : 'hidden'}
                >
                    <CartesianGrid stroke="#E5E5EF" vertical={false} fill="#E6E6E6" fillOpacity={0.5} strokeDasharray="0" strokeWidth={0.9} />
                    <XAxis dataKey="name" stroke="#000000" scale="auto" label={showLabel &&{ value: 'Forecast', offset: 186, position: 'top', fontSize: 11, fontFamily: "Nunito", stroke: '#00000050' }} axisLine={false} tickLine={false} fontWeight={600} fontSize={10} fontFamily="Nunito" />
                    <YAxis strokeWidth={0} strokeOpacity={0.0} hide={true} />
                    <Bar dataKey="mfo" stackId={type === BarChartType.STACKED ? 1 : undefined} barSize={type === BarChartType.STACKED ? 15 : 10} fill="#073862" radius={type === BarChartType.STACKED ? [0, 0, 0, 0] : [10, 10, 0, 0]} />
                    <Bar dataKey="lfo" stackId={type === BarChartType.STACKED ? 1 : undefined} barSize={type === BarChartType.STACKED ? 15 : 10} fill="#0E5998" radius={type === BarChartType.STACKED ? [0, 0, 0, 0] : [10, 10, 0, 0]} />
                    <Bar dataKey="hfo" stackId={type === BarChartType.STACKED ? 1 : undefined} barSize={type === BarChartType.STACKED ? 15 : 10} fill="#1B81D8" radius={type === BarChartType.STACKED ? [0, 0, 0, 0] : [10, 10, 0, 0]} />
                    <Bar dataKey="mdf" stackId={type === BarChartType.STACKED ? 1 : undefined} barSize={type === BarChartType.STACKED ? 15 : 10} fill="#44B2FF" radius={type === BarChartType.STACKED ? [0, 0, 0, 0] : [10, 10, 0, 0]} />
                    <Bar dataKey="mgo" stackId={type === BarChartType.STACKED ? 1 : undefined} barSize={type === BarChartType.STACKED ? 15 : 10} fill="#9CD1FF" radius={type === BarChartType.STACKED ? [0, 0, 0, 0] : [10, 10, 0, 0]} />
                    <Bar dataKey="hsd" stackId={type === BarChartType.STACKED ? 1 : undefined} barSize={type === BarChartType.STACKED ? 15 : 10} fill="#CCEAFF" radius={[10, 10, 0, 0]} />
                    <Line type="monotone" activeDot={false} dataKey="baselineMfo" stroke="#ED1B2F" strokeWidth={2} strokeDasharray="0" hide={type !== BarChartType.GROUPED} />
                    <Line type="monotone" activeDot={false} dataKey="baselineLfo" stroke="#ED1B2F" strokeWidth={2} strokeDasharray="6" hide={type !== BarChartType.GROUPED} />
                    <Line type="monotone" activeDot={false} dataKey="baselineHfo" stroke="#ED1B2F" strokeWidth={2} strokeDasharray="4 1 1 6" hide={type !== BarChartType.GROUPED} />
                    <Line type="monotone" activeDot={false} dataKey="baselineMdf" stroke="#000000" strokeWidth={2} strokeDasharray="0" hide={type !== BarChartType.GROUPED} />
                    <Line type="monotone" activeDot={false} dataKey="baselineMgo" stroke="#000000" strokeWidth={2} strokeDasharray="6" hide={type !== BarChartType.GROUPED} />
                    <Line type="monotone" activeDot={false} dataKey="baselineHsd" stroke="#000000" strokeWidth={2} strokeDasharray="4 1 1 6" hide={type !== BarChartType.GROUPED} />
                    <Line type="linear" activeDot={false} dataKey="base" stroke="#90A2A2" strokeWidth={2} strokeDasharray="0" hide={type !== BarChartType.STACKED} />
                    <Tooltip content={<CustomTooltip />} />
                </ComposedChart>
            </div>
            <div className={`flex ${legends?.align === LegendAlignType.RIGHT ? 'flex-col pl-3 gap-5' : 'pl-2 pr-2'} justify-center text-black text-[8px] font-normal font-[nunito]`}>
                {legends && legends.items.map((subject, index) => {
                    switch (subject && subject.key) {
                        case LegendType.A:
                            return (
                                <div key={index} className="flex items-center gap-0.5 pr-1.5">
                                    <span className={`${legends.align === LegendAlignType.BOTTOM ? 'h-1 w-5 rounded-lg' : 'h-3 w-3'} bg-[#073862] items-center`}></span>
                                    {subject ? subject.label : "-"}
                                </div>
                            )
                        case LegendType.B:
                            return (
                                <div key={index} className="flex items-center gap-0.5 pr-1.5">
                                    <span className={`${legends.align === LegendAlignType.BOTTOM ? 'h-1 w-5 rounded-lg' : 'h-3 w-3'} bg-[#0E5998] items-center`}></span>
                                    {subject ? subject.label : "-"}
                                </div>
                            )
                        case LegendType.C:
                            return (
                                <div key={index} className="flex items-center gap-0.5 pr-1.5">
                                    <span className={`${legends.align === LegendAlignType.BOTTOM ? 'h-1 w-5 rounded-lg' : 'h-3 w-3'} bg-[#1B81D8] items-center`}></span>
                                    {subject ? subject.label : "-"}
                                </div>
                            )
                        case LegendType.D:
                            return (
                                <div key={index} className="flex items-center gap-0.5 pr-1.5">
                                    <span className={`${legends.align === LegendAlignType.BOTTOM ? 'h-1 w-5 rounded-lg' : 'h-3 w-3'} bg-[#44B2FF] items-center`}></span>
                                    {subject ? subject.label : "-"}
                                </div>
                            )
                        case LegendType.E:
                            return (
                                <div key={index} className="flex items-center gap-0.5 pr-1.5">
                                    <span className={`${legends.align === LegendAlignType.BOTTOM ? 'h-1 w-5 rounded-lg' : 'h-3 w-3'} bg-[#9CD1FF] items-center`}></span>
                                    {subject ? subject.label : "-"}
                                </div>
                            )
                        case LegendType.F:
                            return (
                                <div key={index} className="flex items-center gap-0.5 pr-1.5">
                                    <span className={`${legends.align === LegendAlignType.BOTTOM ? 'h-1 w-5 rounded-lg' : 'h-3 w-3'} bg-[#CCEAFF] items-center`}></span>
                                    {subject ? subject.label : "-"}
                                </div>
                            )
                    }
                })}
            </div>
            <div className={`flex justify-center gap-4 text-black text-[8px] font-normal font-[nunito]`}>
                {legends && legends.items.map((subject, index) => {
                    switch (subject && subject.key) {
                        case LegendType.AA:
                            return (
                                <div key={index} className="flex items-center gap-1 pr-1.5">
                                    {LegendAlignType.BOTTOM && (
                                        <div className="border-t-2 border border-[#ED1B2F] w-full my-4" />
                                    )}
                                    {subject ? subject.label : "-"}
                                </div>
                            )
                        case LegendType.BB:
                            return (
                                <div key={index} className="flex items-center gap-1 pr-1.5">
                                    {LegendAlignType.BOTTOM && (
                                        <div className="border-t-2 border-dashed border-[#ED1B2F] w-full my-4" />
                                    )}
                                    {subject ? subject.label : "-"}
                                </div>
                            )
                        case LegendType.CC:
                            return (
                                <div key={index} className="flex items-center gap-1 pr-1.5">
                                    {LegendAlignType.BOTTOM && (
                                        <div className="border-t-2 border-dotted border-[#ED1B2F] w-full my-4" />
                                    )}
                                    {subject ? subject.label : "-"}
                                </div>
                            )
                        case LegendType.DD:
                            return (
                                <div key={index} className="flex items-center gap-1 pr-1.5">
                                    {LegendAlignType.BOTTOM && (
                                        <div className="border-t-2 border border-[#000000] w-full my-4" />
                                    )}
                                    {subject ? subject.label : "-"}
                                </div>
                            )
                        case LegendType.EE:
                            return (
                                <div key={index} className="flex items-center gap-1 pr-1.5">
                                    {LegendAlignType.BOTTOM && (
                                        <div className="border-t-2 border-dashed border-[#000000] w-full my-4" />
                                    )}
                                    {subject ? subject.label : "-"}
                                </div>
                            )
                        case LegendType.FF:
                            return (
                                <div key={index} className="flex items-center gap-1 pr-1.5">
                                    {LegendAlignType.BOTTOM && (
                                        <div className="border-t-2 border-dotted border-[#000000] w-full my-4" />
                                    )}
                                    {subject ? subject.label : "-"}
                                </div>
                            )
                    }
                })}
            </div>
        </div>
    );
}

export default MainBarChart;