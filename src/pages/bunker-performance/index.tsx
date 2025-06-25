import { useTitle } from "@/context/TitleContext";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import GradientCard from "@/components/GradientCard";
import { BarChartType, LegendAlignType, LegendType } from "@/utils/enums/ChartEnum";
import DropdownSelect, { SelectOptionsType } from "@/components/DropdownSelect";
import { SelectType } from "@/utils/enums/SelectEnum";
import { ColumnDef } from "@tanstack/react-table";
import { AlignType, FilterType } from "@/utils/enums/DatatableEnum";
import DataTable, { PaginationType } from "@/components/DataTable";
import DataTableFilterCard, { FilterDataType } from "@/components/DataTableFilterCard";
import Datepicker from "@/components/Datepicker";
import { BarLegendType } from "@/components/MainBarChart";
import { DatepickerType } from "@/utils/enums/DatepickerEnum";
import { usePort } from "@/hooks/port/usePort";
import { useBarge } from "@/hooks/barge/useBarge";
import { useBunker } from "@/hooks/bunker/useBunker";
import { checkedDataEmpty, formatCurrency, toEpochSeconds } from "@/utils/Utils";
import { BarDataType, BunkerHandlingBargePerformanceType, BunkerSupplyPerformanceKpiType, DataType } from "@/utils/Types";
import { useVessel } from "@/hooks/vessels/useVessel";
import BaseCard from "@/components/BaseCard";
import PerformanceCard from "@/components/PerformanceCard";
import { PerformanceCardType } from "@/utils/enums/CardEnum";

type Transporter = {
  id: number,
  transporter: string,
  port: string,
  totalLoss: number
};

type Vessel = {
  id: number,
  vessel: string,
  transporter: string,
  totalLoss: number
};

type History = {
  id: number,
  vessel: string,
  transporter: string,
  call: number,
  totalLoss: number
};

const MainBarChart = dynamic(() => import("@/components/MainBarChart"), { ssr: false })

const BunkerPerformance = () => {
  const { setTitle } = useTitle()
  const [selectedPort, setSelectedPort] = useState<SelectOptionsType | null>(null);
  const [selectedVesselFilterOption, setSelectedVesselFilter] = useState<SelectOptionsType | null>(null);
  const [selectedTransporterFilterOption, setSelectedTransporterFilter] = useState<SelectOptionsType | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(new Date().getFullYear(), 0, 1), new Date()]);
  const [paginationLossHistory, setPaginationLossHistory] = useState<PaginationType>({
    pageIndex: 0,
    pageSize: 5,
    totalRows: 0,
    totalPage: 0
  });

  const { usePortSearchAllQuery } = usePort();
  const { useBargeSearchAllQuery } = useBarge();
  const { useVesselAllListQuery } = useVessel();
  const {
    useBunkerSupplyPortQuery,
    useBunkerSupplyPortForecastQuery,
    useBunkeringPerformanceQuery,
    useBunkerHandlingBargePerformanceQuery,
    useBunkerHandlingTransporterRankQuery,
    useBunkerHandlingVesselRankQuery,
    useBunkerHandlingLossHistoryQuery
  } = useBunker();
  const fetchBunkeringPerformanceQry = useBunkeringPerformanceQuery(toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()), toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date()), selectedPort ? String(selectedPort.key) : "");
  const bunkerSupplyPortQuery = useBunkerSupplyPortQuery(selectedPort ? String(selectedPort.key) : "", toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()), toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date()));
  const bunkerSupplyPortForecastQuery = useBunkerSupplyPortForecastQuery(selectedPort ? String(selectedPort.key) : "", toEpochSeconds(new Date(new Date().getFullYear(), new Date().getMonth(), 2)), toEpochSeconds(new Date(new Date().setMonth(new Date().getMonth() + 4, 0))));
  const bargePerformanceQuery = useBunkerHandlingBargePerformanceQuery(selectedPort ? String(selectedPort.key) : "", toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()), toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date()));
  const bunkerHandlingTransporterQuery = useBunkerHandlingTransporterRankQuery(selectedPort ? String(selectedPort.key) : "", toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()), toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date()));
  const bunkerHandlingVesselQuery = useBunkerHandlingVesselRankQuery(selectedPort ? String(selectedPort.key) : "", toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()), toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date()));
  const bunkerHandlingLossHistoryQuery = useBunkerHandlingLossHistoryQuery(selectedPort ? String(selectedPort.key) : "", selectedTransporterFilterOption ? String(selectedTransporterFilterOption.key) : "", selectedVesselFilterOption ? String(selectedVesselFilterOption.key) : "", toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()), toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date()), paginationLossHistory.pageIndex + 1, paginationLossHistory.pageSize);
  const [bunkeringPerformanceKpi, setBunkeringPerformanceKpi] = useState<BunkerSupplyPerformanceKpiType>(null);
  const [bargePerformanceKpi, setBargePerformanceKpi] = useState<BunkerHandlingBargePerformanceType>(null);
  const {
    data: fetchPortSearchAllData,
    error: fetchPortSearchErrorData,
    isError: fetchPortSearchError,
    isSuccess: fetchPortSearchSuccess
  } = usePortSearchAllQuery(true);
  const {
    data: fetchBargeSearchAllData,
    error: fetchBargeSearchAllErrorData,
    isError: fetchBargeSearchAllError,
    isSuccess: fetchBargeSearchAllSuccess
  } = useBargeSearchAllQuery();
  const {
    data: fetchVesselAllListData,
    error: fetchVesselAllListErrorData,
    isError: fetchVesselAllListError,
    isSuccess: fetchVesselAllListSuccess
  } = useVesselAllListQuery();
  const [portOptions, setPortOption] = useState<SelectOptionsType[]>([]);
  const [legends, setLegend] = useState<BarLegendType>({
    align: LegendAlignType.RIGHT,
    items: []
  });
  const [bunkerSupplyData, setBunkerSupplyData] = useState<BarDataType[]>([]);
  const [bunkerSupplyForecastData, setBunkerSupplyForecastData] = useState<BarDataType[]>([]);
  const [transporterHistoryList, setTransporterHistoryList] = useState<DataType[]>([]);
  const [vesselHistoryList, setVesselHistoryList] = useState<DataType[]>([]);
  const columnTransporter: ColumnDef<Transporter>[] = [
    {
      id: "rank",
      enableSorting: false,
      size: 15,
      header: () => (
        <div className="text-center">Rank</div>
      ),
      cell: ({ row, table }) => {
        const sortedRows = table.getSortedRowModel().rows;
        const indexInSorted = sortedRows.findIndex(r => r.id === row.id);
        const sortingState = table.getState().sorting;
        const isTotalLossAsc = sortingState?.length
        ? sortingState[0].id === "totalLoss" && sortingState[0].desc === false
        : false;
        return (
          <div
            className='text-center'
          >
            {isTotalLossAsc ? sortedRows.length - indexInSorted : indexInSorted + 1}
          </div>
        )
      }
    },
    {
      accessorKey: "transporter",
      size: 45,
      header: () => (
        <div className="text-left">Transporter</div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "port",
      size: 40,
      header: () => (
        <div className="text-left">Port</div>
      ),
      enableSorting: false
    },
    {
      accessorKey: "totalLoss",
      header: "Total Loss (L15)",
      size: 35,
      enableSorting: true,
      cell: ({ getValue }) => {
        return (
          <div
            className='text-[#E21328]'
          >
            {getValue() as string}
          </div>
        )
      }
    }
  ];
  const columnVessel: ColumnDef<Vessel>[] = [
    {
      id: "rank",
      enableSorting: false,
      size: 15,
      header: () => (
        <div className="text-center">Rank</div>
      ),
      cell: ({ row, table }) => {
        const sortedRows = table.getSortedRowModel().rows;
        const indexInSorted = sortedRows.findIndex(r => r.id === row.id);
        const sortingState = table.getState().sorting;
        const isTotalLossAsc = sortingState?.length
        ? sortingState[0].id === "totalLoss" && sortingState[0].desc === false
        : false;
        return (
          <div
            className='text-center'
          >
            {isTotalLossAsc ? sortedRows.length - indexInSorted : indexInSorted + 1}
          </div>
        )
      }
    },
    {
      accessorKey: "vessel",
      enableSorting: false,
      size: 45,
      header: () => (
        <div className="text-left">Vessel</div>
      )
    },
    {
      accessorKey: "transporter",
      size: 40,
      header: () => (
        <div className="text-left">Transporter</div>
      ),
      enableSorting: false
    },
    {
      accessorKey: "totalLoss",
      header: "Total Loss (L15)",
      size: 35,
      enableSorting: true,
      cell: ({ getValue }) => {
        return (
          <div
            className='text-[#E21328]'
          >
            {getValue() as string}
          </div>
        )
      }
    }
  ];
  const filterHistory: FilterDataType = {
    align: AlignType.ALIGN_ITEM_LEFT,
    list: [
      {
        type: FilterType.DROPDOWN_SEARCH,
        nameColumn: "transporter",
        name: "transpoter-history",
        placeholder: "Select Transporter",
        data: transporterHistoryList,
        value: selectedTransporterFilterOption,
        fnOnChange: setSelectedTransporterFilter
      },
      {
        type: FilterType.DROPDOWN_SEARCH,
        nameColumn: "vessel",
        name: "vessel-history",
        placeholder: "Select Vessel",
        data: vesselHistoryList,
        value: selectedVesselFilterOption,
        fnOnChange: setSelectedVesselFilter
      },
    ]
  }
  const columnHistory: ColumnDef<History>[] = [
    {
      id: "no",
      enableSorting: false,
      size: 6,
      header: () => (
        <div className="font-bold">No.</div>
      ),
      cell: ({ row, table }) => {
        const meta = table.options.meta as { pageIndex: number; pageSize: number };
        return (
          <div
            className='text-center font-bold'
          >
            {meta.pageIndex * meta.pageSize + row.index + 1}
          </div>
        )
      }
    },
    {
      accessorKey: "vessel",
      size: 45,
      header: () => (
        <div className="text-center">Vessel Name</div>
      ),
      enableSorting: false,
      cell: ({ getValue }) => {
        return (
          <div
            className='font-bold'
          >
            {getValue() as string}
          </div>
        )
      }
    },
    {
      accessorKey: "transporter",
      header: "Transporter",
      size: 45,
      enableSorting: false
    },
    {
      accessorKey: "call",
      header: "Call",
      size: 15,
      enableSorting: false
    },
    {
      accessorKey: "totalLoss",
      header: "Total Loss (L15)",
      size: 20,
      enableSorting: false,
      cell: ({ getValue }) => {
        return (
          <div
            className='text-[#E21328]'
          >
            {getValue() as string}
          </div>
        )
      }
    }
  ];

  const [dataTransporter, setDataTransporter] = useState<Transporter[]>([]);
  const [dataVessel, setDataVessel] = useState<Vessel[]>([]);
  const [dataHistory, setDataHistory] = useState<History[]>([])
  const [defaultDateChanged, setDefaultDateChanged] = useState(false);
  const [isDataEmpty, setIsDataEmpty] = useState<{bunker: boolean, barge: boolean}>({
    bunker: false,
    barge: false
  });

  const updatePorts = useCallback(() => {
    if (fetchPortSearchSuccess) {
      setPortOption(fetchPortSearchAllData.data.map(it => ({
        key: it.port_id,
        value: it.port_name
      })));
    }
  }, [fetchPortSearchAllData]);

  const updateBarges = useCallback(() => {
    if (fetchBargeSearchAllSuccess) {
      setTransporterHistoryList(fetchBargeSearchAllData.data.map(it => ({
        key: it.barge_code,
        value: it.barge_name
      })));
    }
  }, [fetchBargeSearchAllData]);

  const updateVessels = useCallback(() => {
    if (fetchVesselAllListData) {
      setVesselHistoryList(fetchVesselAllListData.data.map(it => ({
        key: it.vessel_code,
        value: it.vessel_name
      })));
    }
  }, [fetchVesselAllListData]);

  const updateBunkeringPerformance = useCallback(() => {
    fetchBunkeringPerformanceQry.mutateAsync()
      .then(it => {
        setIsDataEmpty(prev => ({
          ...prev,
          bunker: checkedDataEmpty(it.data)
        }))
        setBunkeringPerformanceKpi(it)
      })
      .catch(error => {
        setIsDataEmpty(prev => ({
          ...prev,
          bunker: true
        }))
        // console.log("Error Retrieve Bunkering Performance API: ", error);
        setBunkeringPerformanceKpi(null);
      });
  }, [bunkeringPerformanceKpi]);

  const updateBargePerformance = useCallback(() => {
    bargePerformanceQuery.mutateAsync()
      .then(it => {
        setIsDataEmpty(prev => ({
          ...prev,
          barge: checkedDataEmpty(it.data)
        }))
        setBargePerformanceKpi(it)
      })
      .catch(error => {
        setIsDataEmpty(prev => ({
          ...prev,
          barge: true
        }))
        // console.log("Error Retrieve Barge Performance API: ", error);
        setBargePerformanceKpi(null);
      });
  }, [bargePerformanceKpi]);

  const updateTransporterRank = useCallback(() => {
    let dataTransporter: Transporter[] = [];
    bunkerHandlingTransporterQuery.mutateAsync()
      .then(it => {
        it.data.map((each, index) => {
          dataTransporter = [...dataTransporter, {
            id: index,
            transporter: each.transporter,
            port: each.port,
            totalLoss: each.total_loss
          }];
        });
        setDataTransporter(dataTransporter);
      })
      .catch(error => {
        // console.log("Error Retrieve TransporterRank API: ", error);
        setDataTransporter([]);
      });
  }, []);

  const updateVesselRank = useCallback(() => {
    let dataVesselRank: Vessel[] = [];
    bunkerHandlingVesselQuery.mutateAsync()
      .then(it => {
        it.data.map((each, index) => {
          dataVesselRank = [...dataVesselRank, {
            id: index,
            transporter: each.transporter,
            vessel: each.vessel,
            totalLoss: each.total_loss
          }];
        });
        setDataVessel(dataVesselRank);
      })
      .catch(error => {
        // console.log("Error Retrieve VesselRank API: ", error);
        setDataVessel([]);
      });
  }, []);

  const updateLossHistory = useCallback(() => {
    let dataLossHistory: History[] = [];
    bunkerHandlingLossHistoryQuery.mutateAsync()
      .then(it => {
        it.data.map((each, index) => {
          dataLossHistory = [...dataLossHistory, {
            id: index,
            transporter: each.transporter,
            vessel: each.vessel,
            call: each.call,
            totalLoss: each.total_loss
          }];
        });
        setDataHistory(dataLossHistory);
        setPaginationLossHistory((prev) => ({
          ...prev,
          totalRows: it.total,
          totalPage: it.total_page
        }))
      })
      .catch(error => {
        // console.log("Error Retrieve BunkerLossHistory API: ", error);
        setDataHistory([]);
      });
  }, []);

  const updateBunkerSupplyPort = () => {
    let bunkerSupplyData: BarDataType[] = [];

    bunkerSupplyPortQuery.mutateAsync()
      .then(it => it.data.map(each => {
        bunkerSupplyData = [...bunkerSupplyData, {
          name: each.month_year,
          mfo: each.fuel_type.mfo ?? null,
          lfo: each.fuel_type.lfo ?? null,
          hfo: each.fuel_type.hfo ?? null,
          mdf: each.fuel_type.mdf ?? null,
          mgo: each.fuel_type.mgo ?? null,
          hsd: each.fuel_type.hsd ?? null,
        }];
        setBunkerSupplyData(bunkerSupplyData);
      }))
      .catch(error => {
        // console.log("Error retrieve Bunker Supply data: ", error);
        setBunkerSupplyData([]);
      });
  }

  const updateBunkerSupplyForecastPort = () => {
    let bunkerSupplyForecastData: BarDataType[] = [];

    bunkerSupplyPortForecastQuery.mutateAsync()
      .then(it => it.data.map(each => {
        bunkerSupplyForecastData = [...bunkerSupplyForecastData, {
          name: each.month_year,
          mfo: each.fuel_type.mfo ?? null,
          lfo: each.fuel_type.lfo ?? null,
          hfo: each.fuel_type.hfo ?? null,
          mdf: each.fuel_type.mdf ?? null,
          mgo: each.fuel_type.mgo ?? null,
          hsd: each.fuel_type.hsd ?? null,
        }];
        setBunkerSupplyForecastData(bunkerSupplyForecastData);
      }))
      .catch(error => {
        // console.log("Error retrieve Bunker Supply data: ", error);
        setBunkerSupplyForecastData([]);
      });
  }

  useEffect(() => {
    setTitle('Bunker Supply Performance');

    if (fetchPortSearchError) {
      console.log("Error retrieve port list data" + fetchPortSearchErrorData);
    } else {
      if (portOptions.length === 0) updatePorts();
    }

    if (fetchBargeSearchAllError) {
      console.log("Error retrieve barge list data" + fetchVesselAllListErrorData);
    } else {
      if (transporterHistoryList.length === 0) updateBarges();
    }

    if (fetchVesselAllListError) {
      console.log("Error retrieve vessel list data" + fetchVesselAllListErrorData);
    } else {
      if (vesselHistoryList.length === 0) updateVessels();
    }

  }, [
    fetchPortSearchError,
    fetchPortSearchSuccess,
    fetchBargeSearchAllError,
    fetchBargeSearchAllSuccess,
    fetchVesselAllListSuccess,
    fetchVesselAllListError
  ]);

  useEffect(() => {
    updateBunkerSupplyPort();
    updateBunkerSupplyForecastPort();
    if (dateRange.length > 1) updateBunkeringPerformance()
    updateBargePerformance();
    updateTransporterRank();
    updateVesselRank();
  }, [
    selectedPort,
    dateRange
  ])

  useEffect(() => {
    updateLossHistory();
  }, [
    selectedPort,
    dateRange,
    paginationLossHistory.pageIndex,
    paginationLossHistory.pageSize,
    selectedVesselFilterOption,
    selectedTransporterFilterOption
  ])

  useEffect(() => {
    setPaginationLossHistory((prev) => ({
      ...prev,
      pageIndex: 0
    }))
  }, [
    selectedPort,
    dateRange,
    selectedVesselFilterOption,
    selectedTransporterFilterOption
  ])

  useEffect(() => {
    if (bunkerSupplyData.length === 0 && bunkerSupplyForecastData.length === 0) {
      setLegend({ align: LegendAlignType.RIGHT, items: [] });
      return;
    }
    const filteredBunkerMonthly = bunkerSupplyData.map(it => {
      const result: Record<string, string | number> = {};
      for (const [key, value] of Object.entries(it)) {
        if (!!value) {
          result[key] = value;
        }
      }
      return result;
    });
    const filteredBunkerMonthlyForecast = bunkerSupplyForecastData.map(it => {
      const result: Record<string, string | number> = {};
      for (const [key, value] of Object.entries(it)) {
        if (!!value) {
          result[key] = value;
        }
      }
      return result;
    });
    setLegend({
      align: LegendAlignType.RIGHT,
      items: [
        (filteredBunkerMonthly.find(it => Object.keys(it).some(key => key.toLowerCase().includes("mfo"))) || filteredBunkerMonthlyForecast.find(it => Object.keys(it).some(key => key.toLowerCase().includes("mfo")))) && { key: LegendType.A, label: "MFO" },
        (filteredBunkerMonthly.find(it => Object.keys(it).some(key => key.toLowerCase().includes("lfo"))) || filteredBunkerMonthlyForecast.find(it => Object.keys(it).some(key => key.toLowerCase().includes("lfo")))) && { key: LegendType.B, label: "LFO" },
        (filteredBunkerMonthly.find(it => Object.keys(it).some(key => key.toLowerCase().includes("hfo"))) || filteredBunkerMonthlyForecast.find(it => Object.keys(it).some(key => key.toLowerCase().includes("hfo")))) && { key: LegendType.C, label: "HFO" },
        (filteredBunkerMonthly.find(it => Object.keys(it).some(key => key.toLowerCase().includes("mdf"))) || filteredBunkerMonthlyForecast.find(it => Object.keys(it).some(key => key.toLowerCase().includes("mdf")))) && { key: LegendType.D, label: "MDF" },
        (filteredBunkerMonthly.find(it => Object.keys(it).some(key => key.toLowerCase().includes("mgo"))) || filteredBunkerMonthlyForecast.find(it => Object.keys(it).some(key => key.toLowerCase().includes("mgo")))) && { key: LegendType.E, label: "MGO" },
        (filteredBunkerMonthly.find(it => Object.keys(it).some(key => key.toLowerCase().includes("hsd"))) || filteredBunkerMonthlyForecast.find(it => Object.keys(it).some(key => key.toLowerCase().includes("hsd")))) && { key: LegendType.F, label: "HSD" },
      ]
    });
  }, [
    bunkerSupplyData,
    bunkerSupplyForecastData
  ]);

  const onPaginationLossHistoryChange = (newPageIndex: number, newPageSize: number) => {
    setPaginationLossHistory((prev) => ({...prev, pageIndex: newPageIndex, pageSize: newPageSize}))
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto text-[#030C13] text-[nunito]">
      <div className="pr-4 pb-5 flex justify-end items-center space-x-1">
        <img src="/assets/clock-icon.svg" alt="Clock Icon" className="w-3" />
        <p className="text-[#90A2A2] text-[12px]">Last Updated 25-01-2025 10:10</p>
      </div>

      {/* Filter section */}
      <div className="flex flex-col justify-between items-start -mt-5 pr-4 pb-4 pl-4 transition">
        <h2 className="text-xl font-semibold font-[nunito]">Port Performance</h2>
        <div className="flex justify-start items-center mt-4 gap-4">
          <div className="flex flex-col items-start">
            <h2 className="text-[11px] font-normal text-black">Port</h2>
            <DropdownSelect
              type={SelectType.SINGLE}
              placeholder="All Ports"
              name="ports"
              value={selectedPort}
              options={portOptions}
              onChange={(value) => setSelectedPort(value)}
            />
          </div>
          <div className="flex flex-col items-start">
            <h2 className="text-[11px] font-normal text-black">Period</h2>
            <Datepicker
              type={DatepickerType.RANGE}
              selected={dateRange}
              onChange={(date: [Date | null, Date | null] | null) => {
                if (date.every(it => !it)) {
                  setDateRange([new Date(new Date().getFullYear(), 0, 1), new Date()]);
                  setDefaultDateChanged(false);
                } else {
                  setDateRange(date);
                  setDefaultDateChanged(true);
                }
              }}
              placeholder="YTD"
              maxDate={new Date()}
              isClearable={defaultDateChanged}
            />
          </div>
        </div>
      </div>

      { isDataEmpty.bunker ? (
        <div className="grid grid-cols-1 p-4 w-full bg-none italic">
          No bunker data matches the selected filter. Please adjust the filter and try again.
        </div>
      ) : (
        <>
          {/* Port Performance */}
          <h2 className="mt-2 pl-4 text-lg font-bold font-[nunito]">All Ports</h2>
          <div className="flex p-4 gap-2">
            <div className="bg-white shadow-md pt-3 pl-3 pr-3 rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overscroll-auto overflow-hidden">
              <h3 className="text-[15px] text-start font-bold font-[nunito]">Port Performance</h3>
              <div className="flex flex-col mt-3 justify-between items-center gap-3">
                <BaseCard
                  title="Bunker Inventory"
                  value={bunkeringPerformanceKpi && bunkeringPerformanceKpi.data.bunker_inventory != null ? formatCurrency(+bunkeringPerformanceKpi.data.bunker_inventory.toFixed(1)) : '-'}
                  dateSourceValue={`Stock as of ${new Date().toLocaleDateString("id-ID", {day: "2-digit", month: 'short', year: '2-digit'})}`}
                  notation={"MT"} />
                <BaseCard
                  title="Bunker Supplied"
                  value={bunkeringPerformanceKpi && bunkeringPerformanceKpi.data.bunker_supplied != null ? formatCurrency(+bunkeringPerformanceKpi.data.bunker_supplied.toFixed(1)) : '-'}
                  notation={"MT"} />
              </div>
            </div>
            <div className="bg-white shadow-md pt-3 pl-3 pr-3 rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overscroll-auto overflow-hidden">
              <h3 className="text-[15px] text-start font-bold font-[nunito]">Media Performance</h3>
              <div className="flex mt-3 justify-between items-center gap-2">
                <BaseCard
                  title="Pit Bunker Supplied"
                  value={bunkeringPerformanceKpi && bunkeringPerformanceKpi.data.pit_bunker != null ? formatCurrency(+bunkeringPerformanceKpi.data.pit_bunker.bunker_supplied.toFixed(1)) : '-'}
                  notation={"MT"} />
                <BaseCard
                  title="Barge Bunker Supplied"
                  value={bunkeringPerformanceKpi && bunkeringPerformanceKpi.data.barge_bunker.bunker_supplied != null ? formatCurrency(+bunkeringPerformanceKpi.data.barge_bunker.bunker_supplied.toFixed(1)) : '-'}
                  notation={"MT"} />
                <BaseCard
                  title="STS Bunker Supplied"
                  value={bunkeringPerformanceKpi && bunkeringPerformanceKpi.data.sts_bunker.bunker_supplied != null ? formatCurrency(+bunkeringPerformanceKpi.data.sts_bunker.bunker_supplied.toFixed(1)) : '-'}
                  notation={"MT"} />
              </div>
              <div className="flex mt-2 justify-between items-center gap-2">
                <PerformanceCard
                  mainTitle="Pit Discrepancy"
                  thirdTitle=""
                  type={bunkeringPerformanceKpi && bunkeringPerformanceKpi.data.pit_bunker.discrepancy_percentage != null ? (bunkeringPerformanceKpi.data.pit_bunker.discrepancy_percentage > 4 ? PerformanceCardType.LOW_SCORE : PerformanceCardType.HIGH_SCORE) : PerformanceCardType.LOW_SCORE}
                  value={bunkeringPerformanceKpi && bunkeringPerformanceKpi.data.pit_bunker.discrepancy_percentage != null ? bunkeringPerformanceKpi.data.pit_bunker.discrepancy_percentage.toFixed(1) : '-'}
                  valueDeviation={bunkeringPerformanceKpi && bunkeringPerformanceKpi.data.pit_bunker.discrepancy_volume != null ? (Math.sign(bunkeringPerformanceKpi.data.pit_bunker.discrepancy_volume) === 1 ? '+'.concat(bunkeringPerformanceKpi.data.pit_bunker.discrepancy_volume.toFixed(1)) : bunkeringPerformanceKpi.data.pit_bunker.discrepancy_volume.toFixed(1)).concat(" MT") : "-"}
                  notation="%"
                />
                <PerformanceCard
                  mainTitle="Barge Discrepancy"
                  thirdTitle=""
                  type={bunkeringPerformanceKpi && bunkeringPerformanceKpi.data.barge_bunker.discrepancy_percentage > 4 ? PerformanceCardType.LOW_SCORE : PerformanceCardType.HIGH_SCORE}
                  value={bunkeringPerformanceKpi && bunkeringPerformanceKpi.data.barge_bunker.discrepancy_percentage ? bunkeringPerformanceKpi.data.barge_bunker.discrepancy_percentage.toFixed(1) : '-'}
                  valueDeviation={bunkeringPerformanceKpi && bunkeringPerformanceKpi.data.barge_bunker.discrepancy_percentage != null ? (Math.sign(bunkeringPerformanceKpi.data.barge_bunker.discrepancy_volume) === 1 ? '+'.concat(bunkeringPerformanceKpi.data.barge_bunker.discrepancy_volume.toFixed(1)) : bunkeringPerformanceKpi.data.barge_bunker.discrepancy_volume.toFixed(1)).concat(" MT") : "-"}
                  notation="%"
                />
                <PerformanceCard
                  mainTitle="STS Discrepancy"
                  thirdTitle=""
                  type={bunkeringPerformanceKpi && bunkeringPerformanceKpi.data.sts_bunker.discrepancy_percentage > 4 ? PerformanceCardType.LOW_SCORE : PerformanceCardType.HIGH_SCORE}
                  value={bunkeringPerformanceKpi && bunkeringPerformanceKpi.data.sts_bunker.discrepancy_percentage ? bunkeringPerformanceKpi.data.sts_bunker.discrepancy_percentage.toFixed(1) : '-'}
                  valueDeviation={bunkeringPerformanceKpi && bunkeringPerformanceKpi.data.sts_bunker.discrepancy_volume != null? (Math.sign(bunkeringPerformanceKpi.data.sts_bunker.discrepancy_volume) === 1 ? '+'.concat(bunkeringPerformanceKpi.data.sts_bunker.discrepancy_volume.toFixed(1)) : bunkeringPerformanceKpi.data.sts_bunker.discrepancy_volume.toFixed(1)).concat(" MT") : "-"}
                  notation="%"
                />
              </div>
            </div>
            <div className="bg-white shadow-md p-4 rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overscroll-auto overflow-hidden">
              <h3 className="text-[15px] text-start font-bold font-[nunito]">Bunker Supplied (MT)</h3>
              <div className="items-center mt-5 pb-1 space-x-2">
                <MainBarChart width={300} height={200} legends={legends} type={BarChartType.STACKED} data={bunkerSupplyData} dataForecast={bunkerSupplyForecastData} />
              </div>
            </div>
          </div>

          {/* Barge Performance */}
          <h2 className="mt-2 pl-4 text-lg font-bold font-[nunito]">Transporter Performance</h2>
          { isDataEmpty.barge ? (
            <div className="grid grid-cols-1 p-4 w-full bg-none italic">
              No transporter data matches the selected filter. Please adjust the filter and try again.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 p-4 gap-2">
                <div className="flex flex-col gap-2 bg-white shadow-md pt-3 pl-3 pr-3 pb-2 rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overscroll-auto overflow-hidden">
                  <h3 className="text-[15px] text-start font-bold font-[nunito]">Transporter Supply</h3>
                  <div className="flex justify-between items-center gap-2">
                    <GradientCard
                      title="No Losses"
                      value={bargePerformanceKpi && bargePerformanceKpi.data.no_losses !=null ? formatCurrency(+bargePerformanceKpi.data.no_losses.toFixed(1)) : "-"}
                      notation=""
                      bgCol="bg-card-accent-img bg-cover bg-center" />
                    <GradientCard
                      title="Vol. No Losses"
                      value={bargePerformanceKpi && bargePerformanceKpi.data.vol_no_losses != null ? formatCurrency(+bargePerformanceKpi.data.vol_no_losses.toFixed(1)): "-"}
                      notation="MT"
                      bgCol="bg-card-accent-img bg-cover bg-center" />
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <GradientCard
                      title="Losses"
                      value={bargePerformanceKpi && bargePerformanceKpi.data.losses != null ? formatCurrency(+bargePerformanceKpi.data.losses.toFixed(1)) : "-"}
                      notation=""
                      bgCol="bg-card-accent-img-red bg-cover bg-right-bottom" />
                    <GradientCard
                      title="Vol. Losses"
                      value={bargePerformanceKpi && bargePerformanceKpi.data.vol_losses != null ? formatCurrency(+bargePerformanceKpi.data.vol_losses.toFixed(1)) : "-"}
                      notation="MT"
                      bgCol="bg-card-accent-img-red bg-cover bg-right-bottom" />
                  </div>
                </div>
                <div className="p-0 col-span-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="bg-white shadow-md rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="font-bold font-[nunito] text-[15px] pl-4 pt-4 pb-3 text-start">Transport Rank by Losses</h3>
                    <div className="px-4 text-slate-100 justify-normal text-xs">
                      <DataTable
                        columns={columnTransporter}
                        data={dataTransporter}
                        isScrollable={true}
                        minData={5}
                      />
                    </div>
                  </div>
                  <div className="bg-white shadow-md rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="font-bold font-[nunito] text-[15px] pl-4 pt-4 pb-3 text-start">Vessel Rank by Losses</h3>
                    <div className="p-4 pt-0 text-slate-100 justify-normal text-xs">
                      <DataTable
                        columns={columnVessel}
                        data={dataVessel}
                        isScrollable={true}
                        minData={5}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Loss History */}
              <div className="grid grid-cols-3 p-4 gap-1">
                <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 gap-3 bg-white shadow-md p-4 rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overscroll-auto overflow-hidden">
                  <div className="p-0 col-span-3 grid grid-cols-1 md:grid-cols-2">
                    <div className="flex flex-col">
                      <h2 className="text-xl font-bold font-[nunito]">Loss History</h2>
                    </div>
                  </div>
                  <div className="p-0 col-span-3 grid grid-cols-1 md:grid-cols-2">
                    <div className="col-span-2">
                      <DataTableFilterCard
                        columns={columnHistory}
                        data={dataHistory}
                        filters={filterHistory}
                        enablePagination={true}
                        pagination={paginationLossHistory}
                        onPaginationChange={onPaginationLossHistoryChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default BunkerPerformance;
