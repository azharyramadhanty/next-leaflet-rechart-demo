import { RadialBarChartType } from "@/utils/enums/ChartEnum";
import {
    Legend,
    RadialBar,
    RadialBarChart,
    Tooltip,
} from "recharts";
import { TooltipContainer } from "./Tooltip";
import { BubbleType, ContainerType } from "@/utils/enums/TooltipEnum";

const style = {
    top: '28%',
    right: -60,
    transform: 'translate(0, 0)',
    lineHeight: '25px',
    fontSize: '10px'
};

type MainRadialBarChartProps = {
    type?: RadialBarChartType;
    val?: number;
    valInsight1?: number;
    valInsight2?: number;
    valInsight3?: number;
    bg?: string;
    bgInsight1?: string;
    bgInsight2?: string;
    bgInsight3?: string;
    bgTrack?: string
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
            {console.log("payload: ", payload)}
            {payload.map((item, index) => {
                return (
                    <div key={index} className="w-20 font-normal font-[nunito]">
                        <span className="block text-xxs z-50">
                            {item.name.toUpperCase()}: {item.value.toFixed(2)}&#37;
                        </span>
                    </div>
                )
            })}
        </TooltipContainer>
    );
};

const MainRadialBarChart = ({
    type = RadialBarChartType.NORMAL,
    val = 0,
    valInsight1 = 0,
    valInsight2 = 0,
    valInsight3 = 0,
    bg = '#000000',
    bgInsight1 = '#000000',
    bgInsight2 = '#000000',
    bgInsight3 = '#000000',
    bgTrack = '#008AEB'
}: MainRadialBarChartProps) => {
    const dataNormal = [
        {
            name: '1',
            uv: val,
            fill: bg,
        },
        {
            name: '2',
            uv: 100,
            fill: '#FFFFFF',
        },
    ];

    const dataCompact = [
        {
            name: '1',
            uv: val,
            fill: bg,
        },
        {
            name: '2',
            uv: 200,
            fill: '#FFFFFF',
        },
    ];

    const dataInsight = [
        {
            name: 'Cargo Load',
            data: valInsight3,
            fill: bgInsight3,
        },
        {
            name: 'AVG Speed',
            data: valInsight2,
            fill: bgInsight2,
        },
        {
            name: 'Deviation From TCP',
            data: valInsight1,
            fill: bgInsight1,
        },
    ];
    return (
        <>
            {type == RadialBarChartType.NORMAL && (
                <div className="relative flex w-52 h-24 items-center justify-around">
                    <h3 className="absolute font-medium text-black">{val}%</h3>
                    <RadialBarChart
                        width={200}
                        height={200}
                        cx="50%"
                        cy="50%"
                        innerRadius="30%"
                        outerRadius="40%"
                        barSize={7}
                        data={dataNormal}
                        startAngle={270}
                        endAngle={-90}
                    >
                        <RadialBar
                            label={{ position: 'insideEnd', fill: 'transparent' }}
                            background={{ fill: bgTrack }}
                            dataKey="uv"
                        />
                        {/* <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={style} /> */}
                    </RadialBarChart>
                </div>
            )}
            {type === RadialBarChartType.INSIGHT && (
                <div className="flex max-w-80 h-48 bg-white rounded-2xl">
                    <RadialBarChart
                        width={330}
                        height={350}
                        barCategoryGap="30%"
                        innerRadius="35%"
                        cx="38%"
                        cy="18%"
                        outerRadius="80%"
                        data={dataInsight}
                    // startAngle={270}
                    // endAngle={-90}
                    >
                        <RadialBar
                            label={{ position: 'insideEnd', fill: 'transparent' }}
                            background={{ fill: bgTrack }}
                            dataKey="data"
                        />
                        <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={style} />
                        <Tooltip content={<CustomTooltip />} />
                    </RadialBarChart>
                    <p className="flex flex-col items-start -translate-x-12 translate-y-8 font-[nunito]">
                        <span className="font-bold text-3xl text-black">{val}&#37;</span>
                        <span className="font-normal text-[15px] text-[#030C13]/75">Efficiency</span>
                    </p>
                </div>
            )}
            {type === RadialBarChartType.COMPACT && (
                <div className="relative flex items-center justify-around">
                    <h3 className="absolute flex text-[22px] font-semibold text-black z-50">{val}</h3>
                    <h3 className="absolute flex text-[8px] font-semibold text-black pt-9 z-50">knot</h3>
                    <RadialBarChart
                        width={200}
                        height={200}
                        innerRadius="100%"
                        outerRadius="15%"
                        barSize={12}
                        cy={"56%"}
                        data={dataCompact}
                        startAngle={180}
                        endAngle={0}
                    >
                        <RadialBar
                            label={{ position: 'insideEnd', fill: 'transparent' }}
                            cornerRadius={8}
                            strokeLinejoin="round"
                            background={{ fill: bgTrack }}
                            dataKey="uv"
                        />
                        {/* <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={style} /> */}
                    </RadialBarChart>
                </div>
            )}
        </>
    );
}

export default MainRadialBarChart;