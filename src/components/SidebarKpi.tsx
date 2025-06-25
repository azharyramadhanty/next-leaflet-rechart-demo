import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ButtonType } from "@/utils/enums/TooltipEnum";
import GradientCard from "./GradientCard";
import { formatCurrency, getCookie, getOS, toEpochSeconds } from "@/utils/Utils";
import Tooltip from "./Tooltip";
import DropdownSelect, { SelectOptionsType } from "./DropdownSelect";
import { SelectType } from "@/utils/enums/SelectEnum";
import { useVessel } from "@/hooks/vessels/useVessel";
import { usePort } from "@/hooks/port/usePort";
import {
  BarDataType,
  BunkerSupplyPerformanceKpiType,
  PortLeaderboardKpiType,
  VesselConsPerformanceKpiType,
  VesselLeaderboardKpiType,
  VesselPerformanceKpiType
} from "@/utils/Types";
import { useBunker } from "@/hooks/bunker/useBunker";
import Datepicker from "./Datepicker";
import BunkerSupplyModal from "./BunkerSupplyModal";
import { BarLegendType } from "./MainBarChart";
import { LegendAlignType, LegendType } from "@/utils/enums/ChartEnum";
import { DatepickerType } from "@/utils/enums/DatepickerEnum";
import Image from "next/image";
import { useToastAlert } from "@/context/ToastAlertContext";

type PaginationType = {
  totalPages: number,
  currentPage: number,
  pageSize: number,
  isOpen: boolean
}

const SidebarKpi: React.FC = () => {
  const { addToastAlert } = useToastAlert();
  const [isPortView, setPortView] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null] | null>([new Date(new Date().getFullYear(), 0, 1), new Date()]);
  const [segmentId, setSegmentId] = useState("");
  const [vesselTypeId, setVesselTypeid] = useState("");
  const [sortBestFirst, setSortBestFirst] = useState(true);
  const selectPageRef = useRef<HTMLDivElement>(null)
  const [pagination, setPagination] = useState<PaginationType>({
    totalPages: 1,
    currentPage: 1,
    pageSize: 5,
    isOpen: false
  });
  const {
    useVesselSegmentQuery,
    useVesselTypeQuery,
    useVesselPerformKpiQry,
    useVesselConsPerformKpiQry,
    useVesselLeaderboardQuery
  } = useVessel();
  const { usePortLeaderboardQuery } = usePort()
  const { useBunkeringPerformanceQuery, useBunkerSupplyPerformanceQuery } = useBunker();
  const fetchVesselSegmentQry = useVesselSegmentQuery();
  const fetchVesselTypeQry = useVesselTypeQuery();
  const fetchBunkeringPerformanceQry = useBunkeringPerformanceQuery(toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()), toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date()));
  const fetchBunkerSupplyPerformanceQry = useBunkerSupplyPerformanceQuery(toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()), toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date()), segmentId, vesselTypeId);
  const fetchVesselPerformanceKpiQry = useVesselPerformKpiQry(toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()), toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date()), segmentId, vesselTypeId);
  const fetchVesselConsPerformanceKpiQry = useVesselConsPerformKpiQry(toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()), toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date()), segmentId, vesselTypeId);
  const fetchVesselLeaderboardKpiQry = useVesselLeaderboardQuery(toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()), toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date()), segmentId, vesselTypeId, pagination.currentPage, pagination.pageSize, sortBestFirst);
  const fetchPortLeaderboardKpiQry = usePortLeaderboardQuery(toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()), toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date()), pagination.currentPage, pagination.pageSize, sortBestFirst);
  const [vesselPerformanceKpi, setVesselPerformanceKpi] = useState<VesselPerformanceKpiType>(null);
  const [vesselConsPerformanceKpi, setVesselConsPerformanceKpi] = useState<VesselConsPerformanceKpiType>(null);
  const [vesselLeaderboardKpi, setVesselLeaderboardKpi] = useState<VesselLeaderboardKpiType>(null);
  const [portLeaderboardKpi, setPortLeaderboardKpi] = useState<PortLeaderboardKpiType>(null);
  const [bunkeringPerformanceKpi, setBunkeringPerformanceKpi] = useState<BunkerSupplyPerformanceKpiType>(null);
  const [vesselSegmentOptions, setVesselSegmentOptions] = useState<SelectOptionsType[]>([]);
  const [vesselTypeOptions, setVesselTypeOptions] = useState<SelectOptionsType[]>([]);
  const [segmentOption, setSegmentOption] = useState<SelectOptionsType | null>(null);
  const [typeOption, setTypeOption] = useState<SelectOptionsType | null>(null);
  const [showBunkerSupplyModal, setShowBunkerSupplyModal] = useState(false);
  const [containerHeight, setContainerHeight] = useState("h-[76vh]");
  const [fontTitleClass, setFontTitleClass] = useState("text-sm");
  const [fontSubtitleClass, setFontSubtitleClass] = useState("text-xs");
  const [fontConsPerformanceClass, setFontConsPerformanceClass] = useState("text-[0.563rem]");
  const [fontLeaderboardClass, setFontLeaderboardClass] = useState("text-[0.438rem]");
  const [paddingBottomClass, setPaddingBottomClass] = useState("pb-0");
  const [customSpaceYClass, setCustomSpaceYClass] = useState("space-y-0");
  const [customPaddingYClass, setCustomPaddingYClass] = useState("py-0"); 
  const [defaultDateChanged, setDefaultDateChanged] = useState(false);
  const [bunkerSupplyPerformanceData, setBunkerSupplyPerformanceData] = useState<BarDataType[]>([]);
  const [sidebarKpiDataEmpty, setSidebarKpiDataEmpty] = useState(false);

  const [legends, setLegend] = useState<BarLegendType>({
    align: LegendAlignType.BOTTOM,
    items: []
  });

  const fetchSegment = useCallback(() => {
    if (vesselSegmentOptions.length === 0) {
      fetchVesselSegmentQry.refetch().then(it => {
        if (it.data) {
          setVesselSegmentOptions(it.data.data.map(each => ({
            key: each.segment_id,
            value: each.segment_name
          })))
        }
      })
    }
    if (fetchVesselSegmentQry.isSuccess) {
      setVesselSegmentOptions(fetchVesselSegmentQry.data.data.map(each => ({
        key: each.segment_id,
        value: each.segment_name
      })))
    }
  }, [vesselSegmentOptions]);

  const fetchType = useCallback(() => {
    if (vesselTypeOptions.length === 0) {
      fetchVesselTypeQry.refetch().then(it => {
        if (it.data) {
          setVesselTypeOptions(it.data.data.map(each => ({
            key: each.vessel_type_id,
            value: each.vessel_type_name
          })))
        }
      })
    } else {
      if (fetchVesselTypeQry.isSuccess) {
        setVesselTypeOptions(fetchVesselTypeQry.data.data.map(each => ({
          key: each.vessel_type_id,
          value: each.vessel_type_name
        })))
      }
    }
  }, [vesselTypeOptions]);

  const fetchVesselPerformance = useCallback(() => {
    fetchVesselPerformanceKpiQry.mutateAsync()
      .then(setVesselPerformanceKpi)
      .catch(error => {
        addToastAlert("An unexpected issue occurred while retrieving vessel performance KPI data.")
        setVesselPerformanceKpi(null);
      });
  }, [vesselPerformanceKpi]);

  const fetchVesselConsPerformance = useCallback(() => {
    fetchVesselConsPerformanceKpiQry.mutateAsync()
      .then(setVesselConsPerformanceKpi)
      .catch(error => {
        addToastAlert("An unexpected issue occurred while retrieving vessel consumption KPI data.")
        setVesselConsPerformanceKpi(null);
      });
  }, [vesselConsPerformanceKpi]);

  const fetchVesselLeaderboard = useCallback(() => {
    fetchVesselLeaderboardKpiQry.mutateAsync()
      .then((res) => {
        if (res.data !== null) {
          setVesselLeaderboardKpi({
            data: res.data,
            success: res.success,
            errors: res.errors
          })
          setPagination((prev) => ({
            ...prev,
            totalPages: res.total_page
          }))
          setSidebarKpiDataEmpty(false);
        } else {
          setSidebarKpiDataEmpty(true);
        }
      })
      .catch(error => {
        addToastAlert("An unexpected issue occurred while retrieving vessel leaderboard data.")
        setVesselLeaderboardKpi(null);
      });
  }, [vesselLeaderboardKpi]);

  const fetchPortLeaderboard = useCallback(() => {
    fetchPortLeaderboardKpiQry.mutateAsync()
      .then((res) => {
        setPortLeaderboardKpi({
          data: res.data,
          success: res.success,
          errors: res.errors
        })
        setPagination((prev) => ({
          ...prev,
          totalPages: res.total_page
        }))
      })
      .catch(error => {
        addToastAlert("An unexpected issue occurred while retrieving port leaderboard data.")
        setPortLeaderboardKpi(null);
      });
  }, [portLeaderboardKpi]);

  const fetchBunkeringPerformance = useCallback(() => {
    fetchBunkeringPerformanceQry.mutateAsync()
      .then(setBunkeringPerformanceKpi)
      .catch(error => {
        addToastAlert("An unexpected issue occurred while retrieving bunkering performance data.")
        setBunkeringPerformanceKpi(null);
      });
  }, [bunkeringPerformanceKpi]);

  const fetchBunkerSupplyPerformance = () => {
    let bunkerSupplyData: BarDataType[] = [];
    fetchBunkerSupplyPerformanceQry.mutateAsync()
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
        setBunkerSupplyPerformanceData(bunkerSupplyData);
        setLegend({
          align: LegendAlignType.BOTTOM,
          items: [
            each.fuel_type.mfo && { key: LegendType.A, label: "MFO" },
            each.fuel_type.lfo && { key: LegendType.B, label: "LFO" },
            each.fuel_type.hfo && { key: LegendType.C, label: "HFO" },
            each.fuel_type.mdf && { key: LegendType.D, label: "MDF" },
            each.fuel_type.mgo && { key: LegendType.E, label: "MGO" },
            each.fuel_type.hsd && { key: LegendType.F, label: "HSD" },
          ]
        })
      }))
      .catch(error => {
        setBunkerSupplyPerformanceData([]);
        setLegend({
          align: LegendAlignType.BOTTOM,
          items: []
        })
        addToastAlert("An unexpected issue occurred while retrieving bunker supply performance data.")
      });
  };

  const goPreviousPage = () => {
    setPagination((prev) => ({ ...prev, currentPage: prev.currentPage > 1 ? prev.currentPage - 1 : prev.currentPage }))
  }

  const jumpPageIndex = (index: number) => {
    setPagination((prev) => ({ ...prev, currentPage: index }))
  }

  const goNextPage = () => {
    setPagination((prev) => ({ ...prev, currentPage: prev.currentPage < prev.totalPages ? prev.currentPage + 1 : prev.totalPages }))
  }

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (selectPageRef.current && !selectPageRef.current.contains(e.target as Node)) {
        setPagination((prev) => ({ ...prev, isOpen: false }))
      }
    };

    window.addEventListener("mousedown", handleOutsideClick);
    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
    }
  }, []);

  const updateZoom = () => {
    const zoomLevel = window.devicePixelRatio;

    if (getOS().toLowerCase().startsWith("windows")) {
      if (zoomLevel >= 1.5) {
        if (zoomLevel === 1.5) {
          setPaddingBottomClass("pb-[3vh]");
        }
        setCustomPaddingYClass("py-2");
        setCustomSpaceYClass("space-y-0");
        setFontTitleClass("text-sm");
        setFontSubtitleClass("text-xs");
        setFontConsPerformanceClass("text-[0.563rem]");
        setFontLeaderboardClass("text-[0.5rem]");
      } else if (zoomLevel >= 1) {
        setContainerHeight("h-[80vh]");
        if (zoomLevel === 1) {
          setPaddingBottomClass("pb-[84vh]");
        }
        setCustomPaddingYClass("py-4");
        setCustomSpaceYClass("space-y-2");
        setFontTitleClass(`text-base`);
        setFontSubtitleClass("text-sm");
        setFontConsPerformanceClass("text-xs");
        setFontLeaderboardClass("text-[0.625rem]");
      } else if (zoomLevel >= 0.7) {
        setCustomPaddingYClass("py-6");
        setCustomSpaceYClass("space-y-4");
        setContainerHeight("h-[85vh]");
        setFontTitleClass("text-lg");
        setFontSubtitleClass("text-base");
        setFontConsPerformanceClass("text-sm");
        setFontLeaderboardClass("text-xs");
      } else {
        setCustomPaddingYClass("py-6");
        setCustomSpaceYClass("space-y-4");
        setContainerHeight("h-[100vh]");
        setFontTitleClass("text-xl");
        setFontSubtitleClass("text-lg");
        setFontConsPerformanceClass("text-base");
        setFontLeaderboardClass("text-sm");
      }
    }
    if (getOS().toLowerCase().startsWith("mac")) {
      if (zoomLevel >= 2.5) {
        setCustomPaddingYClass("py-2");
        setCustomSpaceYClass("space-y-0");
        setContainerHeight("h-[76vh]");
        setFontTitleClass("text-sm");
        setFontSubtitleClass("text-xs");
        setFontConsPerformanceClass("text-[0.563rem]");
        setFontLeaderboardClass("text-[0.5rem]");
      } else if (zoomLevel >= 2) {
        setCustomPaddingYClass("py-4");
        setCustomSpaceYClass("space-y-2");
        setContainerHeight("h-[81vh]");
        setFontTitleClass(`text-base`);
        setFontSubtitleClass("text-sm");
        setFontConsPerformanceClass("text-xs");
        setFontLeaderboardClass("text-[0.625rem]");
      } else if (zoomLevel >= 1.5) {
        setCustomPaddingYClass("py-6");
        setCustomSpaceYClass("space-y-4");
        setContainerHeight("h-[82vh]");
        setFontTitleClass("text-lg");
        setFontSubtitleClass("text-base");
        setFontConsPerformanceClass("text-sm");
        setFontLeaderboardClass("text-xs");
      } else {
        setCustomPaddingYClass("py-6");
        setCustomSpaceYClass("space-y-4");
        setContainerHeight("h-[100vh]");
        setFontTitleClass("text-xl");
        setFontSubtitleClass("text-lg");
        setFontConsPerformanceClass("text-base");
        setFontLeaderboardClass("text-sm");
      }
    }
  };

  useEffect(() => {
    const currentTab = Number(sessionStorage.getItem('currentTab'));
    updateZoom();

    window.addEventListener("resize", updateZoom);
    if (currentTab === 0) {
      fetchVesselPerformance();
      fetchVesselConsPerformance();
      fetchVesselLeaderboard();
      fetchBunkerSupplyPerformance();
      if (fetchVesselSegmentQry.isError) {
        // console.log("Error retrieve Vessel Segment API", fetchVesselSegmentQry.error);
      } else {
        fetchSegment();
      }

      if (fetchVesselTypeQry.isError) {
        // console.log("Error retrieve Vessel Type API", fetchVesselTypeQry.error);
      } else {
        fetchType();
      }
    } else {
      fetchPortLeaderboard();
      fetchBunkeringPerformance();
      setPortView(true);
    }

    return () => {
      window.removeEventListener("resize", updateZoom);
    }

  }, [
    isPortView,
    dateRange,
    segmentId,
    vesselTypeId,
    sortBestFirst,
    fetchVesselSegmentQry.isError,
    fetchVesselTypeQry.isError,
    pagination.currentPage
  ]);

  return (
    <>
      {/* <div className="h-[80vh] max-w-[370px] w-[300px] space-y-2 bg-white border border-gray-200 rounded-[20px] overflow-y-auto no-scrollbar overflow-x-hidden shadow-sm 2xl:col-span-2 dark:border-gray-700 dark:bg-gray-800"> */}
      <BunkerSupplyModal visible={showBunkerSupplyModal} onClose={() => setShowBunkerSupplyModal(false)} bunkerData={bunkerSupplyPerformanceData} legends={legends} />
      <div className={`${containerHeight} ${paddingBottomClass} bg-white border border-gray-200 rounded-[20px] shadow-sm dark:border-gray-700 dark:bg-gray-800`}>
        <div className={`pt-2 ps-3 pe-3`}>
          {/* Title SidebarKPI */}
          <div className="flex">
            <h3 className={`${fontTitleClass} font-bold font-[nunito]`}>{isPortView ? "Bunker Supply Performance" : "Bunker Performance"}</h3>
          </div>
          {/* Filter */}
          <div className={`${isPortView ? 'flex' : 'flex-col'} ${customPaddingYClass} justify-start items-center gap-2`}>
            {isPortView ?
              (
                <>
                  <span className="min-w-11 text-[0.563rem] text-gray-700 font-normal font-[nunito] line-clamp-1">Filter By :</span>
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
                        if (pagination.currentPage > 1) {
                          setPagination((prev) => ({
                            ...prev,
                            currentPage: 1
                          }))
                        }
                      }
                    }}
                    placeholder="YTD"
                    maxDate={new Date()}
                    isClearable={defaultDateChanged}
                  />
                </>
              ) :
              (
                <>
                  <div className="flex justify-start items-center gap-2">
                    <span className="min-w-11 text-[0.563rem] text-gray-700 font-normal font-[nunito] line-clamp-1">Filter By :</span>
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
                          if (pagination.currentPage > 1) {
                            setPagination((prev) => ({
                              ...prev,
                              currentPage: 1
                            }))
                          }
                        }
                      }}
                      placeholder="YTD"
                      maxDate={new Date()}
                      isClearable={defaultDateChanged}
                    />
                  </div>
                  <div className="flex justify-start gap-2 pt-2">
                    <DropdownSelect
                      type={SelectType.SINGLE}
                      name="segment"
                      placeholder="Segment"
                      value={segmentOption}
                      options={vesselSegmentOptions}
                      onChange={(value) => {
                        if (value) {
                          setSegmentOption(value);
                          setSegmentId(String(value.key))
                        } else {
                          setSegmentId("");
                          setSegmentOption(null);
                        }
                        if (pagination.currentPage > 1) {
                          setPagination((prev) => ({
                            ...prev,
                            currentPage: 1
                          }))
                        }
                      }}
                    />
                    <DropdownSelect
                      type={SelectType.SINGLE}
                      name="type"
                      placeholder="Type"
                      value={typeOption}
                      options={vesselTypeOptions}
                      onChange={(value) => {
                        if (value) {
                          setTypeOption(value);
                          setVesselTypeid(String(value.key));
                        } else {
                          setVesselTypeid("");
                          setTypeOption(null)
                        }
                        if (pagination.currentPage > 1) {
                          setPagination((prev) => ({
                            ...prev,
                            currentPage: 1
                          }))
                        }
                      }}
                    />
                  </div>
                </>
              )}
          </div>

          {/* Boxes */}
          <div className={`mt-0 space-y-0 ${customSpaceYClass}`}>
            {sidebarKpiDataEmpty ?
              (<div className="grid grid-cols-1 min-w-[180vh] w-full italic bg-none">
                No data matches the selected filter.<br />Please adjust the filter and try again.
              </div>)
              :
              (
                <>
                  <h3 className={`${fontSubtitleClass} text-left font-bold font-[nunito]`}>{isPortView ? "Bunkering Performance" : "Vessel Performance"}</h3>
                  <div className="flex pt-0.5 justify-between items-center space-x-2">
                    <GradientCard
                      title={isPortView ? "Bunker Inventory" : "Shipping | Bunker Cost / Vol. Cargo"}
                      value={isPortView ? (bunkeringPerformanceKpi && bunkeringPerformanceKpi.data.bunker_inventory != null ? formatCurrency(+bunkeringPerformanceKpi.data.bunker_inventory.toFixed(1)) : '-')
                        : (vesselPerformanceKpi && vesselPerformanceKpi.data.shipping_cost_per_vol_kargo != null ? vesselPerformanceKpi.data.shipping_cost_per_vol_kargo.toFixed(1) : '-')}
                      value2={isPortView ? null : vesselPerformanceKpi && vesselPerformanceKpi.data.bunker_cost_per_vol_kargo != null ? vesselPerformanceKpi.data.bunker_cost_per_vol_kargo.toFixed(1) : '-'}
                      notation={isPortView ? "MT" : "USD/KL"}
                      bgCol="bg-card-accent-img bg-cover bg-center" />
                    <GradientCard
                      title={isPortView ? "Bunker Supplied" : "Bunker Supply / Vol. Cargo"}
                      value={isPortView ? (bunkeringPerformanceKpi && bunkeringPerformanceKpi.data.bunker_supplied != null ? formatCurrency(+bunkeringPerformanceKpi.data.bunker_supplied.toFixed(1)) : '-')
                        : (vesselPerformanceKpi && vesselPerformanceKpi.data.bunker_supply_per_vol_kargo != null ? vesselPerformanceKpi.data.bunker_supply_per_vol_kargo.toFixed(3) : '-')}
                      notation={isPortView ? "MT" : "MT/KL"}
                      bgCol="bg-card-accent-img bg-cover bg-center"
                      showViewDetail={isPortView ? false : true}
                      onViewDetail={() => setShowBunkerSupplyModal(true)} />
                  </div>

                  {isPortView && (
                    <div className="flex pt-2 justify-between items-center space-x-2">
                      <GradientCard
                        title="Discrepancy"
                        value={bunkeringPerformanceKpi && bunkeringPerformanceKpi.data.discrepancy != null ? formatCurrency(+bunkeringPerformanceKpi.data.discrepancy.toFixed(1)) : '-'}
                        notation="%"
                        discrepancy={(bunkeringPerformanceKpi && bunkeringPerformanceKpi.data.discrepancy_diff != null ? bunkeringPerformanceKpi.data.discrepancy_diff.toFixed(1) : "-")
                          .concat(" MT / ")
                          .concat(bunkeringPerformanceKpi && bunkeringPerformanceKpi.data.total_request != null ? bunkeringPerformanceKpi.data.total_request.toFixed(1) : "-")
                          .concat(" MT")}
                        bgCol="bg-card-accent-img-red bg-cover bg-right-bottom" />
                    </div>
                  )}

                  <div className={`pt-2 ${customSpaceYClass}`}>
                    {!isPortView && (
                      <div className="flex items-center space-x-2">
                        <h3 className={`${fontSubtitleClass} text-left font-bold font-[nunito] text-gray-700`}>Bunker Cons Performance</h3>
                        <Tooltip
                          title="Bunker Cons. Performance"
                          type={ButtonType.QUESTION_MARK}
                        >
                          <span className="text-xs font-normal font-[nunito]">
                            Shows the number of vessels with bunker<br />consumption performance categorized as<br />low, moderate, or high.
                          </span>
                          <p className="mt-1 text-xs font-normal font-[nunito]">
                            <span className="text-[#EA3A3D]">Low:&nbsp;</span>
                            <span className="text-[#969696]">&lt;&nbsp;75&#37;</span>
                            <span className="text-[#FF6B00]">&nbsp;&nbsp;Mod:&nbsp;</span>
                            <span className="text-[#969696]">75-85&#37;</span>
                            <span className="text-[#00802F]">&nbsp;&nbsp;High:&nbsp;</span>
                            <span className="text-[#969696]">&gt;&nbsp;85&#37;</span>
                          </p>
                          <span className="mt-1 text-xs font-normal font-[nunito] italic">
                            Remarks:
                          </span>
                          <span className="-mt-1 text-xs text-[#969696] font-normal font-[nunito]">
                            &#37;&nbsp;represents the average of total main engine<br />bunker consumption compared to its baseline from<br />five most recent voyages.
                          </span>
                        </Tooltip>
                      </div>
                    )}
                    {isPortView ?
                      (
                        <table className="mt-0 table-fixed w-full">
                          <thead></thead>
                          <tbody className="text-sm text-center"></tbody>
                        </table>
                      )
                      :
                      (
                        <table className="mt-0 table-fixed text-center w-full overflow-scroll">
                          <thead>
                            <tr className={`${fontConsPerformanceClass} text-center font-bold font-[nunito]`}>
                              <th className="py-0.5 text-white bg-red-500 rounded-s-2xl">{vesselConsPerformanceKpi === null ? '0' : String(vesselConsPerformanceKpi.data.low.count)}</th>
                              <th className="py-0.5 text-red-500 bg-red-100">{vesselConsPerformanceKpi === null ? '0' : String(vesselConsPerformanceKpi.data.moderate.count)}</th>
                              <th className="py-0.5 text-green-500 bg-green-100 rounded-e-2xl">{vesselConsPerformanceKpi === null ? '0' : String(vesselConsPerformanceKpi.data.high.count)}</th>
                            </tr>
                          </thead>
                          <tbody className={`${fontConsPerformanceClass} text-center font-normal font-[nunito]`}>
                            <tr>
                              <td className="py-0">Low</td>
                              <td className="py-0">Moderate</td>
                              <td className="py-0">High</td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                  </div>

                  <div className={`${isPortView ? 'pt-0' : 'pt-1'} ${customSpaceYClass}`}>
                    <div className="flex items-center space-x-2">
                      <h3 className={`${fontSubtitleClass} font-bold font-[nunito]`}>{isPortView ? "Port" : "Vessel"} Leaderboard</h3>
                      {!isPortView ? (
                        <Tooltip
                          title="Vessel Leaderboard"
                          type={ButtonType.QUESTION_MARK}
                        >
                          <span className="text-xs font-normal font-[nunito]">
                            &#37;&nbsp;represents the average of total main engine<br />bunker consumption compared to its baseline from<br />five most recent voyages.
                          </span>
                          <span className="mt-1 text-xs font-normal font-[nunito]">
                            Icons of bunker performance provides remarks<br />for each recent voyage, as detailed below.
                          </span>
                          <div className="flex mt-1 gap-2 text-xs font-normal font-[nunito]">
                            <img src="/assets/badge-danger-leaderboard-item.svg" className="w-auto" />
                            <span className="text-[#969696]">Voyage performs at &lt;&nbsp;75&#37; bunker cons.</span>
                          </div>
                          <div className="flex mt-1 gap-2 text-xs font-normal font-[nunito]">
                            <img src="/assets/badge-none-leaderboard-item.svg" className="w-auto" />
                            <span className="text-[#969696]">Voyage performs at 75-85&#37; bunker cons.</span>
                          </div>
                          <div className="flex mt-1 gap-2 text-xs font-normal font-[nunito]">
                            <img src="/assets/badge-done-leaderboard-item.svg" className="w-auto" />
                            <span className="text-[#969696]">Voyage performs at &gt;&nbsp;85&#37; bunker cons.</span>
                          </div>
                        </Tooltip>
                      ) 
                      : 
                      (
                        <Tooltip
                          title="Port Leaderboard"
                          type={ButtonType.QUESTION_MARK}
                        >
                          <span className="text-xs font-normal font-[nunito]">
                            Rank the ports based on the &#37; amount of<br />discrepancy during bunker supply operations.
                          </span>
                          <span className="mt-1 text-xs font-normal font-[nunito] italic">
                            Remarks:
                          </span>
                          <span className="-mt-1 text-xs text-[#969696] font-normal font-[nunito]">
                            A higher discrepancy &#37; score indicates lower <br />performance.
                          </span>
                        </Tooltip>
                      )}
                    </div>
                    {/* <div className="h-52 overflow-y-auto no-scrollbar border border-white rounded"> */}
                    <div className="mt-0 space-y-1">
                      <table className="table-auto min-w-52 w-full border-collapse text-left">
                        <thead className="sticky bg-blue-100 top-0">
                          <tr className={`${fontLeaderboardClass} font-bold font-[nunito]`}>
                            <th className="px-2 py-1 rounded-s-2xl">
                              <div className="flex w-8 items-center">Rank
                                <button onClick={() => setSortBestFirst(!sortBestFirst)}>
                                  <img src="/assets/sorting-icon.svg" className="w-2" />
                                </button>
                              </div>
                            </th>
                            <th className="w-2/5">{isPortView ? 'Port Name' : 'Vessel Name'}</th>
                            {!isPortView && <th className="px-0 w-1/11">&#37;</th>}
                            <th className="w-2/5 px-2 rounded-e-2xl">{isPortView ? 'Discrepancy' : 'Last 5 Bunker Performances'}</th>
                          </tr>
                        </thead>
                        <tbody className={`pl-0 ${fontLeaderboardClass}`}>
                          {!isPortView ? !fetchVesselLeaderboardKpiQry.isPending ? vesselLeaderboardKpi && vesselLeaderboardKpi.data.map((it, index) => {
                            return (
                              <tr key={index}>
                                <td className={it.rank > 3 ? 'px-5' : 'px-3'}>{
                                  it.rank === 1 ?
                                    <img src="/assets/gold-medal.svg" className="w-4" />
                                    : (it.rank === 2 ? <img src="/assets/silver-medal.svg" className="w-4" />
                                      : (it.rank === 3 ? <img src="/assets/bronze-medal.svg" className="w-4" />
                                        : it.rank))
                                }</td>
                                <td className="-translate-y-[0.2rem] line-clamp-1">{it.vessel_name}</td>
                                <td className="px-0">{it.performance}&#37;</td>
                                <td className="flex w-10 translate-y-0.5 px-2 items-center gap-1">
                                  {it.last_bunker_performance.map((each, idx) => (
                                    <>
                                      {each.bunker_performance == null && (<img src="/assets/badge-null-leaderboard-item.svg" className="h-[15px]" />)}
                                      {each.bunker_performance >= 0 && each.bunker_performance < 75 && (<img src="/assets/badge-danger-leaderboard-item.svg" className="h-[15px]" />)}
                                      {each.bunker_performance >= 75 && each.bunker_performance < 86 && (<img src="/assets/badge-none-leaderboard-item.svg" className="h-[15px]" />)}
                                      {each.bunker_performance >= 86 && (<img src="/assets/badge-done-leaderboard-item.svg" className="h-[15px]" />)}
                                    </>
                                  ))}
                                </td>
                              </tr>
                            )
                          }) : (
                            <tr>
                              <td colSpan={4} className="">Loading....</td>
                            </tr>
                          ) : null}
                          {isPortView ? !fetchPortLeaderboardKpiQry.isPending ? portLeaderboardKpi && portLeaderboardKpi.data.map((it, index) => {
                            return (
                              <tr key={index}>
                                <td className="px-4">{it.rank}</td>
                                <td className="px-0.5 translate-y-[0.2rem] line-clamp-1">{it.port_name}</td>
                                <td className="px-2.5">{it.discrepancy.toFixed(1)}&#37;</td>
                              </tr>
                            )
                          }) : (
                            <tr>
                              <td colSpan={4} className="">Loading....</td>
                            </tr>
                          ) : null}
                        </tbody>
                      </table>

                      {/* Page Numbers */}
                      <div className="flex items-center justify-end text-[0.5rem] gap-1 text-gray-700">
                        <button
                          onClick={goPreviousPage}
                          disabled={fetchVesselLeaderboardKpiQry.isPending || pagination.currentPage === 1}
                          className={`p-1 pr-1.5 group border-white rounded-full disabled:opacity-50${fetchVesselLeaderboardKpiQry.isPending || pagination.currentPage !== 1 && ' hover:bg-gray-300'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="currentColor" className={`text-gray-300 ${fetchVesselLeaderboardKpiQry.isPending || pagination.currentPage !== 1 && "group-hover:text-white"}`}>
                            <path d="M14.9995 6.70656C14.6095 6.31656 13.9795 6.31656 13.5895 6.70656L8.99953 11.2966C8.60953 11.6866 8.60953 12.3166 8.99953 12.7066L13.5895 17.2966C13.9795 17.6866 14.6095 17.6866 14.9995 17.2966C15.3895 16.9066 15.3895 16.2766 14.9995 15.8866L11.1195 11.9966L14.9995 8.11656C15.3895 7.72656 15.3795 7.08656 14.9995 6.70656Z" fill="currentColor" />
                          </svg>
                        </button>
                        <button
                          disabled={fetchVesselLeaderboardKpiQry.isPending || pagination.currentPage === 1}
                          onClick={() => jumpPageIndex(1)}
                          className={`px-2 py-1 ${pagination.currentPage === 1
                            ? "bg-gray-300 text-white"
                            : !fetchVesselLeaderboardKpiQry.isPending && "border border-white hover:bg-gray-300 hover:border-gray-300 hover:text-white"
                            } rounded-full`}
                        >
                          1
                        </button>
                        {pagination.totalPages > 1 && (
                          <button
                            disabled={fetchVesselLeaderboardKpiQry.isPending || pagination.currentPage === 2}
                            onClick={() => jumpPageIndex(2)}
                            className={`px-2 py-1 ${pagination.currentPage === 2
                              ? "bg-gray-300 text-white"
                              : !fetchVesselLeaderboardKpiQry.isPending && "border border-white hover:bg-gray-300 hover:border-gray-300 hover:text-white"
                              } rounded-full`}
                          >
                            2
                          </button>
                        )}
                        {pagination.totalPages > 4 ? (
                          <div
                            ref={selectPageRef}
                            onClick={
                              fetchVesselLeaderboardKpiQry.isPending ?
                                () => { } :
                                () => setPagination((prev) => ({ ...prev, isOpen: !prev.isOpen }))
                            }
                            className={`relative ${fetchVesselLeaderboardKpiQry.isPending && 'cursor-none'}`}
                          >
                            <button
                              disabled={fetchVesselLeaderboardKpiQry.isPending}
                              className="flex justify-between text-start p-1 bg-white border border-gray-300 rounded-2xl"
                            >
                              <span className="min-w-5 px-2">
                                {pagination.currentPage > 2 && pagination.currentPage < pagination.totalPages ? pagination.currentPage : "..."}
                              </span>
                              <Image
                                className={`w-auto${!fetchVesselLeaderboardKpiQry.isPending && ' cursor-pinter'}${pagination.isOpen ? " rotate-180" : ""
                                  }`}
                                alt={'arrow down icon'}
                                src={'assets/arrow-down.svg'}
                                width={0} height={0} style={{ width: '0.5rem' }}
                              />
                            </button>

                            {pagination.isOpen && (
                              <div className="absolute left-0 w-full border bg-white rounded-md shadow-lg max-h-[100px] scrollbar-hidden overflow-auto z-20 bottom-full mb-1">
                                {Array.from({ length: Math.max(0, pagination.totalPages - 3) }, (_, i) => i + 3).map((page) => (
                                  <option key={page} value={page} onClick={() => jumpPageIndex(page)} className="px-3 py-1 hover:bg-gray-100 cursor-pointer">
                                    {page}
                                  </option>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : pagination.totalPages > 3 ? (
                          <button
                            disabled={fetchVesselLeaderboardKpiQry.isPending || pagination.currentPage === 3}
                            onClick={() => jumpPageIndex(3)}
                            className={`px-2 py-1 ${pagination.currentPage === 3
                              ? "bg-gray-300 text-white"
                              : !fetchVesselLeaderboardKpiQry.isPending && "border border-white hover:bg-gray-300 hover:border-gray-300 hover:text-white"
                              } rounded-full`}
                          >
                            3
                          </button>
                        ) : null}
                        {pagination.totalPages > 2 && (
                          <button
                            disabled={fetchVesselLeaderboardKpiQry.isPending || pagination.totalPages === pagination.currentPage}
                            onClick={() => jumpPageIndex(pagination.totalPages)}
                            className={`px-2 py-1 ${pagination.totalPages === pagination.currentPage
                              ? "bg-gray-300 text-white"
                              : !fetchVesselLeaderboardKpiQry.isPending && "border border-white hover:bg-gray-300 hover:border-gray-300 hover:text-white"
                              } rounded-full`}
                          >
                            {pagination.totalPages}
                          </button>
                        )}
                        <button
                          onClick={goNextPage}
                          disabled={fetchVesselLeaderboardKpiQry.isPending || pagination.currentPage === pagination.totalPages}
                          className={`p-1 pr-1.5 group border-white rounded-full disabled:opacity-50${fetchVesselLeaderboardKpiQry.isPending || pagination.currentPage !== pagination.totalPages && ' hover:bg-gray-300'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="currentColor" className={`text-gray-300 ${fetchVesselLeaderboardKpiQry.isPending || pagination.currentPage !== pagination.totalPages && "group-hover:text-white"}`}>
                            <path d="M8.99953 6.71173C8.60953 7.10173 8.60953 7.73173 8.99953 8.12173L12.8795 12.0017L8.99953 15.8817C8.60953 16.2717 8.60953 16.9017 8.99953 17.2917C9.38953 17.6817 10.0195 17.6817 10.4095 17.2917L14.9995 12.7017C15.3895 12.3117 15.3895 11.6817 14.9995 11.2917L10.4095 6.70173C10.0295 6.32173 9.38953 6.32173 8.99953 6.71173Z" fill="currentColor" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
          </div>
        </div>
        {/* <div className="flex -mt-2 h-px bg-slate-300 border-t-smpt-1" />
        <div className="flex pt-1 pb-4 justify-start items-center text-[#90A2A2] text-[10px]">
          <img src="/assets/clock-icon.svg" alt="Clock Icon" className="ml-4 w-3" />
          <p className="ml-1">Last Updated 25-01-2025 10:10</p>
        </div> */}
      </div>
    </>
  );
};

export default SidebarKpi;
