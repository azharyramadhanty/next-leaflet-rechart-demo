import { Geist, Geist_Mono } from "next/font/google";
import ActivityCard, { ActivityDataType } from "@/components/ActivityCard";
import { useTitle } from "@/context/TitleContext";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import BannerCard from "@/components/BannerCard";
import { BannerType } from "@/utils/enums/BannerEnum";
import InfoListCard from "@/components/InfoListCard";
import {
  BarDataType,
  DataType,
  VesselFuelConsumptionDeviationItemType,
  VesselFuelConsumptionDeviationType,
  VesselLeaderboardKpiType,
  VesselLogType,
  VesselPerformanceMetricType,
  VoyageDetailActivityType,
  VoyageDetailBunkerConsType,
  VoyageDetailOperationalType,
} from "@/utils/Types";
import VoyageCard, { VoyageDataType } from "@/components/VoyageCard";
import GradientCard from "@/components/GradientCard";
import BaseCard from "@/components/BaseCard";
import AiInsight from "@/components/AiInsight";
import PerformanceCard from "@/components/PerformanceCard";
import { BaseCardType, PerformanceCardType } from "@/utils/enums/CardEnum";
import Tooltip from "@/components/Tooltip";
import { ButtonType } from "@/utils/enums/TooltipEnum";
import DropdownSelect, { SelectOptionsType } from "@/components/DropdownSelect";
import ReactMarkdown from "react-markdown";
import Datepicker from "@/components/Datepicker";
import { SelectType } from "@/utils/enums/SelectEnum";
import { BarChartType, LegendAlignType, LegendType, RadialBarChartType } from "@/utils/enums/ChartEnum";
import { BarLegendType } from "@/components/MainBarChart";
import { DatepickerType } from "@/utils/enums/DatepickerEnum";
import { checkedDataEmpty, formatCurrency, getOS, toCamelCase, toEpochSeconds } from "@/utils/Utils";
import { useVessel } from "@/hooks/vessels/useVessel";
import { useBunker } from "@/hooks/bunker/useBunker";
import { useToastAlert } from "@/context/ToastAlertContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const MainBarChart = dynamic(() => import("@/components/MainBarChart"), { ssr: false })

// const MainRadialBarChart = dynamic(() => import("@/components/MainRadialBarChart"), { ssr: false })

const VesselPerformance = () => {
  const { setTitle } = useTitle();
  const { addToastAlert } = useToastAlert();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(new Date().getFullYear(), 0, 1), new Date()]);
  const [selectedVesselOption, setSelectedVessel] = useState<SelectOptionsType | null>(null);
  const [selectedVoyageOption, setSelectedVoyage] = useState<SelectOptionsType | null>(null);
  const {
    useVesselAllListQuery,
    useVesselLogQuery,
    useVesselPerformanceMetricAllQuery,
    useLatestVoyagesQuery,
    useFuelConsDeviationQuery,
    useVoyageAllListQuery,
    useVoyageDetailActivityQuery,
    useVoyageDetailOperationalQuery,
    useVoyageDetailBunkerConsQuery,
    useVesselLeaderboardQuery
  } = useVessel();
  const { useBunkerSupplyQuery, useBunkerSupplyDailyQuery, useBunkerSupplyForecastQuery } = useBunker();
  const {
    data: fetchVesselListData,
    error: fetchVesselListErrorData,
    isError: fetchVesselListError,
    isSuccess: fetchVesselListSuccess
  } = useVesselAllListQuery();
  const voyageAllListQuery = useVoyageAllListQuery(selectedVesselOption ? String(selectedVesselOption.key) : "", toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()), toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date()));
  const voyageDetailActivityQuery = useVoyageDetailActivityQuery(selectedVoyageOption ? String(selectedVoyageOption.key) : "");
  const voyageDetailOperationalQuery = useVoyageDetailOperationalQuery(selectedVoyageOption ? String(selectedVoyageOption.key) : "");
  const voyageDetailBunkerConsQuery = useVoyageDetailBunkerConsQuery(selectedVoyageOption ? String(selectedVoyageOption.key) : "");
  const vesselLogQuery = useVesselLogQuery(selectedVesselOption ? String(selectedVesselOption.key) : "", toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()), toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date()));
  const vesselPerformanceMetricQuery = useVesselPerformanceMetricAllQuery(selectedVesselOption ? String(selectedVesselOption.key) : "", toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()), toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date()));
  const vesselLatestVoyageQuery = useLatestVoyagesQuery(selectedVesselOption ? String(selectedVesselOption.key) : "", toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()), toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date()));
  const vesselFuelConsDeviationQuery = useFuelConsDeviationQuery(selectedVesselOption ? String(selectedVesselOption.key) : "", toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()), toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date()));
  const bunkerSupplyQuery = useBunkerSupplyQuery(selectedVesselOption ? String(selectedVesselOption.key) : "", toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()), toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date()));
  const bunkerSupplyForecastQuery = useBunkerSupplyForecastQuery(selectedVesselOption ? String(selectedVesselOption.key) : "", toEpochSeconds(new Date(new Date().getFullYear(), new Date().getMonth(), 2)), toEpochSeconds(new Date(new Date().setMonth(new Date().getMonth() + 4, 0))));
  const bunkerSupplyDailyQuery = useBunkerSupplyDailyQuery(selectedVesselOption ? String(selectedVesselOption.key) : "", toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()), toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date()));
  const bunkerSupplyDailyForecastQuery = useBunkerSupplyDailyQuery(selectedVesselOption ? String(selectedVesselOption.key) : "", toEpochSeconds(new Date(new Date().getFullYear(), new Date().getMonth(), 2)), toEpochSeconds(new Date(new Date().setMonth(new Date().getMonth() + 4, 0))), true);
  const vesselLeaderboardKpiQuery = useVesselLeaderboardQuery(toEpochSeconds(dateRange.length > 0 ? dateRange[0] : new Date()), toEpochSeconds(dateRange.length > 0 ? dateRange[1] : new Date()));
  const [vesselListOptions, setVesselListOptions] = useState<SelectOptionsType[]>([]);
  const [voyageListOptions, setVoyageListOptions] = useState<SelectOptionsType[]>([]);
  const [vesselLog, setVesselLog] = useState<VesselLogType>(null);
  const [vesselPerformanceMetric, setVesselPerformanceMetric] = useState<VesselPerformanceMetricType>(null);
  const [vesselFuelConsDeviation, setVesselFuelConsDeviation] = useState<VesselFuelConsumptionDeviationType>(null);
  const [voyageDetailActivity, setVoyageDetailActivity] = useState<VoyageDetailActivityType>(null);
  const [voyageOperationalActivity, setVoyageDetailOperationalActivity] = useState<VoyageDetailOperationalType>(null);
  const [voyageBunkerConsActivity, setVoyageDetailBunkerConsActivity] = useState<VoyageDetailBunkerConsType>(null);
  const [vesselLeaderboardKpi, setVesselLeaderboardKpi] = useState<VesselLeaderboardKpiType>(null);
  const [defaultDateChanged, setDefaultDateChanged] = useState(false);
  const [lastVoyageStatus, setLastVoyageStatus] = useState("-");
  const [generalVesselData, setGeneralVessel] = useState<DataType[]>([
    {
      key: "Manufacture Year",
      value: "-"
    },
    {
      key: "Vessel Type",
      value: "-"
    },
    {
      key: "Fuel Type",
      value: "-"
    },
    {
      key: "DWT",
      value: "- MT"
    }
  ]);
  const [latestVoyage, setLatestVoyages] = useState<VoyageDataType[]>([]);
  const [portData, setPortData] = useState<ActivityDataType[]>([
    {
      port: 'No Port',
      status: '--',
    },
  ])
  const [legendsDaily, setLegendDaily] = useState<BarLegendType>({
    align: LegendAlignType.BOTTOM,
    items: []
  });
  const [legendsMonthly, setLegendMonthly] = useState<BarLegendType>({
    align: LegendAlignType.BOTTOM,
    items: []
  });

  const [bunkerDailyPerformanceData, setBunkerDailyPerformanceData] = useState<BarDataType[]>([]);
  const [bunkerDailyPerformanceForecastData, setBunkerDailyPerformanceForecastData] = useState<BarDataType[]>([]);
  const [bunkerSupplyTrendsData, setBunkerSupplyTrendsData] = useState<BarDataType[]>([]);
  const [bunkerSupplyTrendsForecastData, setBunkerSupplyTrendsForecastData] = useState<BarDataType[]>([]);
  const [isVesselUnderperform, setIsVesselUnderperform] = useState(false);
  const [isVesselPerformanceMetricEmpty, setIsVesselPerformanceMetricEmpty] = useState<boolean>(false);
  const [legendDailyItems, setLegendDailyItems] = useState<String[]>([]);
  const [legendMonthlyItems, setLegendMonthlyItems] = useState<String[]>([]);

  const updateVessels = useCallback(() => {
    if (fetchVesselListSuccess) {
      setVesselListOptions(fetchVesselListData.data.map(it => ({
        key: it.vessel_code,
        value: it.vessel_name
      })));
    }
  }, [fetchVesselListData]);

  const updateVoyageList = () => {
    voyageAllListQuery.mutateAsync()
      .then(it => {
        setVoyageListOptions(it.data.map(each => ({
          key: each.voyage_id,
          value: `${each.complete_date.toLocaleString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })} - ${each.start_port.port_code.length > 0 ? each.start_port.port_code : '-'} to ${each.end_port.port_code.length > 0 ? each.end_port.port_code : '-'} (${each.voyage_no})`
        })));

        setSelectedVoyage({
          key: it.data[0].voyage_id,
          value: `${it.data[0].complete_date.toLocaleString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })} - ${it.data[0].start_port.port_code.length > 0 ? it.data[0].start_port.port_code : '-'} to ${it.data[0].end_port.port_code.length > 0 ? it.data[0].end_port.port_code : '-'} (${it.data[0].voyage_no})`
        });
      })
      .catch(error => {
        setVoyageListOptions([]);
        setSelectedVoyage(null);
        // console.log("Error retrieve Voyage List data: ", error);
      });
  };

  const updateVoyageDetailActivity = () => {
    voyageDetailActivityQuery.mutateAsync()
      .then(it => {
        setVoyageDetailActivity(it);
        setPortData(it.data.voyage_activity.map(each => ({
          port: each.port_name,
          status: each.port_function
        })));
      })
      .catch(error => {
        // addToastAlert("An unexpected issue occurred while retrieving voyage detail activity data.")
        setVoyageDetailActivity(null);
        setPortData([
          {
            port: 'No Port',
            status: '--',
          },
        ]);
      });
  };

  const updateVoyageDetailOperational = () => {
    voyageDetailOperationalQuery.mutateAsync()
      .then(it => {
        setVoyageDetailOperationalActivity(it);
      })
      .catch(error => {
        // addToastAlert("An unexpected issue occurred while retrieving voyage detail operational data.")
        setVoyageDetailOperationalActivity(null);
      });
  };

  const updateVoyageDetailBunkerCons = () => {
    voyageDetailBunkerConsQuery.mutateAsync()
      .then(it => {
        setVoyageDetailBunkerConsActivity(it);
      })
      .catch(error => {
        // addToastAlert("An unexpected issue occurred while retrieving voyage detail bunker consumption data.")
        setVoyageDetailBunkerConsActivity(null);
      });
  };

  const updateVesselLog = () => {
    vesselLogQuery.mutateAsync()
      .then(it => {
        if (it.data) {
          setGeneralVessel([
            {
              key: "Manufacture Year",
              value: it.data.year_built ?? "-"
            },
            {
              key: "Vessel Type",
              value: toCamelCase(it.data.vessel_type) ?? "-"
            },
            {
              key: "Fuel Type",
              value: it.data.fuel_types != null ? it.data.fuel_types.toString() : "-"
            },
            {
              key: "DWT",
              value: it.data.dwt.toFixed(1).concat(" MT") ?? "- MT"
            }
          ])
          setVesselLog(it);
        }
      })
      .catch(err => {
        // addToastAlert("An unexpected issue occurred while retrieving vessel log data.")
        setGeneralVessel([
          {
            key: "Manufacture Year",
            value: "-"
          },
          {
            key: "Vessel Type",
            value: "-"
          },
          {
            key: "Fuel Type",
            value: "-"
          },
          {
            key: "DWT",
            value: "- MT"
          }
        ]);
        setVesselLog(null);
      });
  };

  const updateVesselPerformanceMetricData = () => {
    vesselPerformanceMetricQuery.mutateAsync()
      .then(it => {
        setIsVesselPerformanceMetricEmpty(checkedDataEmpty(it.data))
        setVesselPerformanceMetric(it)
      })
      .catch(error => {
        // addToastAlert("An unexpected issue occurred while retrieving vessel performance metric data.")
        setVesselPerformanceMetric(null);
      });
  }

  const updateVesselLatestVoyages = () => {
    let voyages: VoyageDataType[] = [];
    let performance = 0;
    vesselLatestVoyageQuery.mutateAsync()
      .then((it) => {
        it.data.voyages.map((each, idx) => {
          voyages = [...voyages, {
            id: idx,
            fuel: each.performance,
            voyageNo: +each.voyage_no,
            date: each.complete_date.toLocaleString("id-ID", { month: 'short', year: '2-digit' }),
            discharge: each.start_port.port_name,
            bunker: each.end_port.port_name,
            isBunker: each.is_bunkering,
            isPortBunkering: false,
            remark: 'There is a bunkering activity for this voyage'
          }];
          performance = performance + each.performance;
        });
        setLatestVoyages(voyages);
        setLastVoyageStatus(it.data.status ?? "-");
        setIsVesselUnderperform(performance / 5 < 75);
      })
      .catch(error => {
        // addToastAlert("An unexpected issue occurred while retrieving vessel latest voyages data.")
        setLatestVoyages([]);
        setLastVoyageStatus("-");
      });
  }

  const updateVesselFuelConsDeviationData = () => {
    vesselFuelConsDeviationQuery.mutateAsync()
      .then(it => {
        setVesselFuelConsDeviation(it);
      })
      .catch(error => {
        // addToastAlert("An unexpected issue occurred while retrieving vessel fuel consumption deviation data.")
        setVesselFuelConsDeviation(null);
      });
  }

  const updateBunkerSupplyData = () => {
    let bunkerSupplyData: BarDataType[] = [];    
    let bunkerSupplyForecastData: BarDataType[] = [];
    let bunkerSupplyDailyData: BarDataType[] = [];
    let bunkerSupplyDailyForecastData: BarDataType[] = [];
    bunkerSupplyQuery.mutateAsync()
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
        setBunkerSupplyTrendsData(bunkerSupplyData);
      }))
      .catch(error => {
        // addToastAlert("An unexpected issue occurred while retrieving bunker supply data.")
        setBunkerSupplyTrendsData([]);
      });

    bunkerSupplyForecastQuery.mutateAsync()
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
        setBunkerSupplyTrendsForecastData(bunkerSupplyForecastData);
      }))
      .catch(error => {
        // addToastAlert("An unexpected issue occurred while retrieving bunker supply forecast data.")
        setBunkerSupplyTrendsForecastData([]);
        // console.log("Error retrieve Bunker Supply Daily data: ", error);
      });

    bunkerSupplyDailyQuery.mutateAsync()
      .then(it => {
        it.data.bunker_monthly.map(each => {
          bunkerSupplyDailyData = [...bunkerSupplyDailyData, {
            name: each.month_year,
            mfo: each.fuel_type.mfo ?? null,
            lfo: each.fuel_type.lfo ?? null,
            hfo: each.fuel_type.hfo ?? null,
            mdf: each.fuel_type.mdf ?? null,
            mgo: each.fuel_type.mgo ?? null,
            hsd: each.fuel_type.hsd ?? null,
            baselineMfo: it.data.baseline.find(that => that.key.includes("MFO")) ? it.data.baseline.find(that => that.key.includes("MFO")).value : null,
            baselineLfo: it.data.baseline.find(that => that.key.includes("LFO")) ? it.data.baseline.find(that => that.key.includes("LFO")).value : null,
            baselineHfo: it.data.baseline.find(that => that.key.includes("HFO")) ? it.data.baseline.find(that => that.key.includes("HFO")).value : null,
            baselineMdf: it.data.baseline.find(that => that.key.includes("MDF")) ? it.data.baseline.find(that => that.key.includes("MDF")).value : null,
            baselineMgo: it.data.baseline.find(that => that.key.includes("MGO")) ? it.data.baseline.find(that => that.key.includes("MGO")).value : null,
            baselineHsd: it.data.baseline.find(that => that.key.includes("HSD")) ? it.data.baseline.find(that => that.key.includes("HSD")).value : null,
          }];
          setBunkerDailyPerformanceData(bunkerSupplyDailyData);
        });
      })
      .catch(error => {
        // addToastAlert("An unexpected issue occurred while retrieving bunker supply daily data.")
        setBunkerDailyPerformanceData([]);
        // console.log("Error retrieve Bunker Supply Daily data: ", error);
      });

    bunkerSupplyDailyForecastQuery.mutateAsync()
      .then(it => it.data.bunker_monthly.map(each => {
        bunkerSupplyDailyForecastData = [...bunkerSupplyDailyForecastData, {
          name: each.month_year,
          mfo: each.fuel_type.mfo ?? null,
          lfo: each.fuel_type.lfo ?? null,
          hfo: each.fuel_type.hfo ?? null,
          mdf: each.fuel_type.mdf ?? null,
          mgo: each.fuel_type.mgo ?? null,
          hsd: each.fuel_type.hsd ?? null,
          baselineMfo: it.data.baseline.find(that => that.key.includes("MFO")) ? it.data.baseline.find(that => that.key.includes("MFO")).value : null,
          baselineLfo: it.data.baseline.find(that => that.key.includes("LFO")) ? it.data.baseline.find(that => that.key.includes("LFO")).value : null,
          baselineHfo: it.data.baseline.find(that => that.key.includes("HFO")) ? it.data.baseline.find(that => that.key.includes("HFO")).value : null,
          baselineMdf: it.data.baseline.find(that => that.key.includes("MDF")) ? it.data.baseline.find(that => that.key.includes("MDF")).value : null,
          baselineMgo: it.data.baseline.find(that => that.key.includes("MGO")) ? it.data.baseline.find(that => that.key.includes("MGO")).value : null,
          baselineHsd: it.data.baseline.find(that => that.key.includes("HSD")) ? it.data.baseline.find(that => that.key.includes("HSD")).value : null,
        }];
        setBunkerDailyPerformanceForecastData(bunkerSupplyDailyForecastData);
      }))
      .catch(error => {
        // addToastAlert("An unexpected issue occurred while retrieving bunker supply daily forecast data.")
        setBunkerDailyPerformanceForecastData([]);
        // console.log("Error retrieve Bunker Supply Daily data: ", error);
      });
    
  }

  const updateVesselLeaderboardKpi = () => {
    vesselLeaderboardKpiQuery.mutateAsync().then(setVesselLeaderboardKpi).catch(error => { });
  }

  const goToNextVoyage = () => {
    // console.log('nextVoyage');
    if (selectedVoyageOption && voyageListOptions.length > 0) {
      if (voyageListOptions.findIndex(it => it.key === selectedVoyageOption.key) > 0) {
        setSelectedVoyage(voyageListOptions[voyageListOptions.findIndex(it => it.key === selectedVoyageOption.key) - 1]);
      }
    }
  }

  const goToPreviousVoyage = () => {
    // console.log('previousVoyage');
    if (selectedVoyageOption && voyageListOptions.length > 0) {
      if (voyageListOptions.findIndex(it => it.key === selectedVoyageOption.key) < voyageListOptions.length - 1) {
        setSelectedVoyage(voyageListOptions[voyageListOptions.findIndex(it => it.key === selectedVoyageOption.key) + 1]);
      }
    }
  }

  const updateZoom = () => {
    const zoomLevel = window.devicePixelRatio;

    if (getOS().toLowerCase().startsWith("windows")) {
      if (zoomLevel >= 1.5) {
        // setContainerHeight("h-[75vh]");
        // if (zoomLevel === 1.5) setPaddingBottomClass("pb-[3vh]");
        // setFontTitleClass("text-[14px]");
        // setFontSubtitleClass("text-[12px]");
        // setFontConsPerformanceClass("text-xxs");
        // setFontLeaderboardClass("text-[7px]");
      } else if (zoomLevel >= 1) {
        // setContainerHeight("h-[80vh]");
        // if (zoomLevel === 1) setPaddingBottomClass("pb-[84vh]");
        // setFontTitleClass(`text-[17px]`);
        // setFontSubtitleClass("text-[15px]");
        // setFontConsPerformanceClass("text-[11px]");
        // setFontLeaderboardClass("text-[10px]");
      } else if (zoomLevel >= 0.7) {
        // setContainerHeight("h-[85vh]");
        // setFontTitleClass("text-[20px]");
        // setFontSubtitleClass("text-[18px]");
        // setFontConsPerformanceClass("text-[13px]");
        // setFontLeaderboardClass("text-[12px]");
      } else {
        // setContainerHeight("h-[100vh]");
        // setFontTitleClass("text-[25px]");
        // setFontSubtitleClass("text-[23px]");
        // setFontConsPerformanceClass("text-[17px]");
        // setFontLeaderboardClass("text-[14px]");
      }
    }
    if (getOS().toLowerCase().startsWith("mac")) {
      if (zoomLevel >= 2.5) {
        // setContainerHeight("h-[76vh]");
        // // if (zoomLevel === 2.5) setPaddingBottomClass("pb-[1vh]");
        // setFontTitleClass("text-[14px]");
        // setFontSubtitleClass("text-[12px]");
        // setFontConsPerformanceClass("text-xxs");
        // setFontLeaderboardClass("text-[7px]");
      } else if (zoomLevel >= 2) {
        // setContainerHeight("h-[81vh]");
        // // if (zoomLevel === 2) setPaddingBottomClass("pb-[84vh]");
        // setFontTitleClass(`text-[17px]`);
        // setFontSubtitleClass("text-[15px]");
        // setFontConsPerformanceClass("text-[11px]");
        // setFontLeaderboardClass("text-[10px]");
      } else if (zoomLevel >= 1.7) {
        // setContainerHeight("h-[82vh]");
        // setFontTitleClass("text-[20px]");
        // setFontSubtitleClass("text-[18px]");
        // setFontConsPerformanceClass("text-[13px]");
        // setFontLeaderboardClass("text-[12px]");
      } else {
        // setContainerHeight("h-[100vh]");
        // setFontTitleClass("text-[25px]");
        // setFontSubtitleClass("text-[23px]");
        // setFontConsPerformanceClass("text-[17px]");
        // setFontLeaderboardClass("text-[14px]");
      }
    }
  }

  useEffect(() => {
    setTitle('Vessel Performance');
    window.addEventListener("resize", updateZoom);

    if (fetchVesselListError) {
      // console.log("Error retrieve Vessel List data ", fetchVesselListErrorData);
    } else {
      if (vesselListOptions.length === 0) updateVessels();
    }

    updateVesselLog();
    updateVesselPerformanceMetricData();
    updateVesselLatestVoyages();
    updateVesselFuelConsDeviationData();
    updateBunkerSupplyData();
    updateVoyageList();
    updateVesselLeaderboardKpi();

    return () => {
      window.removeEventListener("resize", updateZoom);
    }

  }, [
    fetchVesselListSuccess,
    fetchVesselListError,
    selectedVesselOption,
    dateRange,
  ]);

  useEffect(() => {
    if (vesselLeaderboardKpi?.data) {
      const firstRankVessel = vesselListOptions.find(it => it.key === vesselLeaderboardKpi.data[0].vessel_code);
      if (!selectedVesselOption) {
        setSelectedVessel(firstRankVessel);
      }
    }
  }, [vesselLeaderboardKpi]);

  useEffect(() => {
    updateVoyageDetailActivity();
    updateVoyageDetailOperational();
    updateVoyageDetailBunkerCons();
  }, [selectedVoyageOption]);

  useEffect(() => {
    if (bunkerDailyPerformanceData.length === 0 && bunkerDailyPerformanceForecastData.length === 0) {
      setLegendDaily({ align: LegendAlignType.BOTTOM, items: [] });
      return;
    }
    if (bunkerSupplyTrendsData.length === 0 && bunkerSupplyTrendsForecastData.length === 0) {
      setLegendMonthly({ align: LegendAlignType.BOTTOM, items: [] });
      return;
    }
    
    const filteredBunkerDaily = bunkerDailyPerformanceData.map(it => {
      const result: Record<string, string | number> = {};
      for (const [key, value] of Object.entries(it)) {
        if (!!value) {
          result[key] = value;
        }
      }
      return result;
    });
    const filteredBunkerDailyForecast = bunkerDailyPerformanceForecastData.map(it => {
      const result: Record<string, string | number> = {};
      for (const [key, value] of Object.entries(it)) {
        if (!!value) {
          result[key] = value;
        }
      }
      return result;
    });
    const filteredBunkerMonthly = bunkerSupplyTrendsData.map(it => {
      const result: Record<string, string | number> = {};
      for (const [key, value] of Object.entries(it)) {
        if (!!value) {
          result[key] = value;
        }
      }
      return result;
    });
    const filteredBunkerMonthlyForecast = bunkerSupplyTrendsForecastData.map(it => {
      const result: Record<string, string | number> = {};
      for (const [key, value] of Object.entries(it)) {
        if (!!value) {
          result[key] = value;
        }
      }
      return result;
    });

    setLegendDaily({
      align: LegendAlignType.BOTTOM,
      items: [
        (filteredBunkerDaily.find(it => Object.keys(it).some(key => key.toLowerCase().includes("mfo"))) || filteredBunkerDailyForecast.find(it => Object.keys(it).some(key => key.toLowerCase().includes("mfo")))) && { key: LegendType.AA, label: "MFO base" },
        (filteredBunkerDaily.find(it => Object.keys(it).some(key => key.toLowerCase().includes("lfo"))) || filteredBunkerDailyForecast.find(it => Object.keys(it).some(key => key.toLowerCase().includes("lfo")))) && { key: LegendType.BB, label: "LFO base" },
        (filteredBunkerDaily.find(it => Object.keys(it).some(key => key.toLowerCase().includes("hfo"))) || filteredBunkerDailyForecast.find(it => Object.keys(it).some(key => key.toLowerCase().includes("hfo")))) && { key: LegendType.CC, label: "HFO base" },
        (filteredBunkerDaily.find(it => Object.keys(it).some(key => key.toLowerCase().includes("mdf"))) || filteredBunkerDailyForecast.find(it => Object.keys(it).some(key => key.toLowerCase().includes("mdf")))) && { key: LegendType.DD, label: "MDF base" },
        (filteredBunkerDaily.find(it => Object.keys(it).some(key => key.toLowerCase().includes("mgo"))) || filteredBunkerDailyForecast.find(it => Object.keys(it).some(key => key.toLowerCase().includes("mgo")))) && { key: LegendType.EE, label: "MGO base" },
        (filteredBunkerDaily.find(it => Object.keys(it).some(key => key.toLowerCase().includes("hsd"))) || filteredBunkerDailyForecast.find(it => Object.keys(it).some(key => key.toLowerCase().includes("hsd")))) && { key: LegendType.FF, label: "HSD base" },
        (filteredBunkerDaily.find(it => Object.keys(it).some(key => key.toLowerCase().includes("mfo"))) || filteredBunkerDailyForecast.find(it => Object.keys(it).some(key => key.toLowerCase().includes("mfo")))) && { key: LegendType.A, label: "MFO" },
        (filteredBunkerDaily.find(it => Object.keys(it).some(key => key.toLowerCase().includes("lfo"))) || filteredBunkerDailyForecast.find(it => Object.keys(it).some(key => key.toLowerCase().includes("lfo")))) && { key: LegendType.B, label: "LFO" },
        (filteredBunkerDaily.find(it => Object.keys(it).some(key => key.toLowerCase().includes("hfo"))) || filteredBunkerDailyForecast.find(it => Object.keys(it).some(key => key.toLowerCase().includes("hfo")))) && { key: LegendType.C, label: "HFO" },
        (filteredBunkerDaily.find(it => Object.keys(it).some(key => key.toLowerCase().includes("mdf"))) || filteredBunkerDailyForecast.find(it => Object.keys(it).some(key => key.toLowerCase().includes("mdf")))) && { key: LegendType.D, label: "MDF" },
        (filteredBunkerDaily.find(it => Object.keys(it).some(key => key.toLowerCase().includes("mgo"))) || filteredBunkerDailyForecast.find(it => Object.keys(it).some(key => key.toLowerCase().includes("mgo")))) && { key: LegendType.E, label: "MGO" },
        (filteredBunkerDaily.find(it => Object.keys(it).some(key => key.toLowerCase().includes("hsd"))) || filteredBunkerDailyForecast.find(it => Object.keys(it).some(key => key.toLowerCase().includes("hsd")))) && { key: LegendType.F, label: "HSD" },
      ]
    });
    setLegendMonthly({
      align: LegendAlignType.BOTTOM,
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
    bunkerDailyPerformanceData,
    bunkerDailyPerformanceForecastData,
    bunkerSupplyTrendsData,
    bunkerSupplyTrendsForecastData
  ]);


  return (

    <div className="flex-1 flex flex-col overflow-auto text-[#030C13]">
      <div className="pr-4 pb-5 flex justify-end items-center space-x-1">
        <img src="/assets/clock-icon.svg" alt="Clock Icon" className="w-3" />
        <p className="text-[#90A2A2] text-[12px] font-normal font-[nunito]">Last Updated 25-01-2025 10:10</p>
      </div>
      {/* Vessel Performance */}
      <div className="flex flex-col justify-between items-start -mt-5 pr-4 pb-4 pl-4 transition">
        <h2 className="text-xl font-semibold font-[nunito]">General Performance</h2>
        {/* Filter section */}
        <div className="flex justify-start items-center mt-4 gap-4">
          <div className="flex flex-col items-start">
            <h2 className="text-[11px] font-normal font-[nunito] text-black">Select Vessel</h2>
            <DropdownSelect
              type={SelectType.SINGLE}
              name="vessel"
              placeholder="Select Vessel"
              value={selectedVesselOption}
              options={vesselListOptions}
              onChange={setSelectedVessel}
            />
          </div>
          <div className="flex flex-col items-start">
            <h2 className="text-[11px] font-normal font-[nunito] text-black">Period</h2>
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
        {/* End Filter Section */}
      </div>
      { isVesselPerformanceMetricEmpty ? (
        <div className="grid grid-cols-1 p-4 w-full bg-none italic">
          No voyage data matches the selected filter. Please adjust the filter and try again.
        </div>
      ) : (
        <>
          <div className="flex justify-start items-center mt-5 pl-4 gap-3">
            <h2 className="text-lg font-semibold font-[nunito]">{vesselLog ? (vesselLog.data.vessel_name != null ? vesselLog.data.vessel_name : "-") : "Loading Vessel Name..."}</h2>
            <img src="/assets/smartship-badge.svg" alt="Poweredby Icon" className="w-[7rem] mt-0.5" />
          </div>
          <div className="grid grid-cols-10 p-4 gap-4">
            <div className="p-0 col-span-3">
              <InfoListCard title={'General Information'} data={generalVesselData} />
              <div className="bg-white shadow-md mt-4 p-4 rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overscroll-auto overflow-hidden">
                <h3 className="text-[15px] text-start font-bold font-[nunito]">Vessel Logs</h3>
                <div className="flex justify-between items-center pt-3 gap-2">
                  <BaseCard title="Bunker Supplied" value={vesselLog ? formatCurrency(+vesselLog.data.bunker_supplied.toFixed(1)) : "-"} notation="MT" />
                  <BaseCard title="Cargo Shipped" value={vesselLog ? formatCurrency(+vesselLog.data.cargo_shipped.toFixed(1)) : "-"} notation="KL" />
                </div>
                <div className="flex justify-between items-center pt-2 pb-1 gap-2">
                  <BaseCard title="Number of Voyage" value={vesselLog ? formatCurrency(+vesselLog.data.total_voyage.toFixed(1)) : "-"} notation="" />
                  <BaseCard title="Mileage" value={vesselLog ? formatCurrency(+vesselLog.data.milleage.toFixed(1)) : "-"} notation="NM" />
                </div>
              </div>
              <div className="bg-white shadow-md mt-4 pl-3 pr-5 pt-4 pb-4 rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overscroll-auto overflow-hidden">
                <h3 className="text-[15px] text-start font-bold font-[nunito]">Deviation from TCP</h3>
                <div className="flex justify-start gap-2 pt-2">
                  <PerformanceCard
                    mainTitle="At Sea"
                    type={vesselFuelConsDeviation && vesselFuelConsDeviation.data && vesselFuelConsDeviation.data.sea.deviation > 5 ? PerformanceCardType.LOW_SCORE : PerformanceCardType.HIGH_SCORE}
                    value={vesselFuelConsDeviation && vesselFuelConsDeviation.data ? vesselFuelConsDeviation.data.sea.deviation.toFixed(1) : "-"}
                    valueDeviation={vesselFuelConsDeviation && vesselFuelConsDeviation.data ? (Math.sign(vesselFuelConsDeviation.data.sea.deviation_ammount) === 1 ? '+'.concat(vesselFuelConsDeviation.data.sea.deviation_ammount.toFixed(1)) : vesselFuelConsDeviation.data.sea.deviation_ammount.toFixed(1)).concat(" MT") : "-"}
                    valueFuelBaseline={
                      <p className={`${vesselFuelConsDeviation && vesselFuelConsDeviation.data && vesselFuelConsDeviation.data.sea.deviation > 5 ? 'text-white' : 'text-[#00B843]'} text-[0.623rem] font-light font-[nunito]`}>
                        <span className="text-[0.655rem] underline">Consumption Rate (MT/day):</span><br />
                        {vesselFuelConsDeviation && vesselFuelConsDeviation.data && vesselFuelConsDeviation.data.sea.fuels.map((it, idx) => (
                          <>
                            <span>{it.value}&nbsp;</span>
                            <span className="font-bold">{it.fuel}{idx < vesselFuelConsDeviation.data.sea.fuels.length - 1 && ' +'}</span>
                            {idx < vesselFuelConsDeviation.data.sea.fuels.length - 1 && <br />}
                          </>
                        ))}
                        <br />
                        per<span>&nbsp;{vesselFuelConsDeviation && vesselFuelConsDeviation.data ? vesselFuelConsDeviation.data.sea.baseline.toFixed(1) : "-"} MT/day <u>baseline</u></span>
                      </p>
                    }
                    notation="%"
                  />
                  <PerformanceCard
                    mainTitle="At Port"
                    type={vesselFuelConsDeviation && vesselFuelConsDeviation.data && vesselFuelConsDeviation.data.port.deviation > 5 ? PerformanceCardType.LOW_SCORE : PerformanceCardType.HIGH_SCORE}
                    value={vesselFuelConsDeviation && vesselFuelConsDeviation.data ? vesselFuelConsDeviation.data.port.deviation.toFixed(1) : "-"}
                    valueDeviation={vesselFuelConsDeviation && vesselFuelConsDeviation.data ? (Math.sign(vesselFuelConsDeviation.data.port.deviation_ammount) === 1 ? '+'.concat(vesselFuelConsDeviation.data.port.deviation_ammount.toFixed(1)) : vesselFuelConsDeviation.data.port.deviation_ammount.toFixed(1)).concat(" MT") : "-"}
                    valueFuelBaseline={
                      <p className={`${vesselFuelConsDeviation && vesselFuelConsDeviation.data && vesselFuelConsDeviation.data.port.deviation > 5 ? 'text-white' : 'text-[#00B843]'} text-[0.623rem] font-light font-[nunito]`}>
                        <span className="text-[0.655rem] underline">Consumption Rate (MT/day):</span><br />
                        {vesselFuelConsDeviation && vesselFuelConsDeviation.data && vesselFuelConsDeviation.data.port.fuels.map((it, idx) => (
                          <>
                            <span>{it.value}&nbsp;</span>
                            <span className="font-bold">{it.fuel}{idx < vesselFuelConsDeviation.data.port.fuels.length - 1 && ' +'}</span>
                            {idx < vesselFuelConsDeviation.data.port.fuels.length - 1 && <br />}
                          </>
                        ))}
                        <br />
                        per<span>&nbsp;{vesselFuelConsDeviation && vesselFuelConsDeviation.data ? vesselFuelConsDeviation.data.port.baseline.toFixed(1) : "-"} MT/day <u>baseline</u></span>
                      </p>
                    }
                    notation="%"
                  />
                </div>
              </div>
            </div>

            <div className="p-0 col-span-7">
              <div className="grid p-0 gap-4">
                <div className="bg-white shadow-md p-4 rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="text-[15px] text-start font-bold font-[nunito]">Performance Metrics</h3>
                  <div className="flex justify-between items-center mt-3 space-x-2">
                    <GradientCard
                      title="Profit / Loss"
                      value={vesselPerformanceMetric && vesselPerformanceMetric.data && vesselPerformanceMetric.data.net_profit_margin != null ? formatCurrency(+vesselPerformanceMetric.data.net_profit_margin.toFixed(2)) : "-"}
                      notation="USD"
                      bgCol="bg-card-accent-img bg-cover bg-center" />
                    <GradientCard
                      title="Bunker Supply / Vol.Cargo"
                      value={vesselPerformanceMetric && vesselPerformanceMetric.data && vesselPerformanceMetric.data.bunker_supply_per_cargo != null ? formatCurrency(+vesselPerformanceMetric.data.bunker_supply_per_cargo.toFixed(2)) : "-"}
                      notation="MT/KL"
                      bgCol="bg-card-accent-img bg-cover bg-center" />
                    <GradientCard
                      title="Shipping Cost / Vol.Cargo"
                      value={vesselPerformanceMetric && vesselPerformanceMetric.data && vesselPerformanceMetric.data.shipping_cost_per_cargo != null ? formatCurrency(+vesselPerformanceMetric.data.shipping_cost_per_cargo.toFixed(2)) : "-"}
                      notation="USD/KL"
                      bgCol="bg-card-accent-img bg-cover bg-center" />
                    <GradientCard
                      title="Specific Fuel Consumption"
                      value={vesselPerformanceMetric && vesselPerformanceMetric.data && vesselPerformanceMetric.data.specific_fuel_consumption != null ? formatCurrency(+vesselPerformanceMetric.data.specific_fuel_consumption.toFixed(2)) : "-"}
                      notation="MT/NM"
                      bgCol="bg-card-accent-img bg-cover bg-center"
                      showTooltip={true}
                      tooltip={
                        <Tooltip
                          title="Remarks"
                          type={ButtonType.QUESTION_MARK_WHITE}
                        >
                          <span className="mb-2 text-[0.625rem] font-normal font-[nunito]">
                            Specific Fuel Consumption is calculated from<br />the average of each fuel type bunker<br />consumption per mile of all voyages.
                          </span>
                          {vesselPerformanceMetric && vesselPerformanceMetric.data && vesselPerformanceMetric.data.specific_fuel_consumption_detail.map(it => (
                            <div className="flex mt-0 gap-1 text-[0.625rem] text-black font-normal font-[nunito]">
                              <span className="font-bold">{it.fuel}</span>
                              <span className="">{it.value} MT/NM</span>
                            </div>
                          ))}
                        </Tooltip>
                      } />
                    <GradientCard
                      title="Daily Fuel Consumption"
                      value={vesselPerformanceMetric && vesselPerformanceMetric.data && vesselPerformanceMetric.data.daily_fuel_consumption !== null ? formatCurrency(+vesselPerformanceMetric.data.daily_fuel_consumption.toFixed(2)) : "-"}
                      notation="MT/day"
                      bgCol="bg-card-accent-img bg-cover bg-center"
                      showTooltip={true}
                      tooltip={
                        <Tooltip
                          title="Remarks"
                          type={ButtonType.QUESTION_MARK_WHITE}
                        >
                          <span className="text-[0.625rem] font-normal font-[nunito]">
                            Daily Fuel Consumption is calculated from<br />the average of each fuel type bunker<br />consumption per day of all voyages.
                          </span>
                          {vesselPerformanceMetric && vesselPerformanceMetric.data.daily_fuel_consumption_detail && vesselPerformanceMetric.data.daily_fuel_consumption_detail.map(it => (
                            <div className="flex mt-0 gap-1 text-[0.625rem] text-black font-normal font-[nunito]">
                              <span className="font-bold">{it.fuel}</span>
                              <span className="">{it.value} MT/day</span>
                            </div>
                          ))}
                        </Tooltip>
                      } />
                  </div>
                </div>
                <VoyageCard title={'Latest Voyage Information'} status={lastVoyageStatus} data={latestVoyage} />
                { lastVoyageStatus !== null && lastVoyageStatus !== "-" && (
                  <BannerCard
                    title={`${isVesselUnderperform ? 'Warning: Vessel is Currently Underperforming' : 'Status: Vessel Operating Within Acceptable Performance'}`}
                    type={isVesselUnderperform ? BannerType.DANGER : BannerType.SUCCESS}
                    body={`${isVesselUnderperform ? 'Latest voyages show significant deviations from the expected baseline, with a performance score failing below 75%'
                      : 'Latest voyages show consistent alignment with the baseline, maintaining a performance score above 75%. Performance is stable and no action is required.'}`
                    }
                  />
                )}
                <div className="flex flex-row justify-between items-start gap-2">
                  <div className="min-w-[20rem] w-full bg-white shadow-md rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="font-bold font-[nunito] text-[15px] pl-4 pt-4 pb-3 text-start">Bunker Daily Rate Performance (MT/day)</h3>
                    <MainBarChart width={220} height={200} type={BarChartType.GROUPED} legends={legendsDaily} data={bunkerDailyPerformanceData} dataForecast={bunkerDailyPerformanceForecastData} showLabel={true} />
                  </div>
                  <div className="min-w-[20rem] w-full pb-9 bg-white shadow-md rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="font-bold font-[nunito] text-[15px] pl-4 pt-4 pb-3 text-start">Bunker Supply Trends (MT)</h3>
                    <MainBarChart width={220} height={200} type={BarChartType.STACKED} legends={legendsMonthly} data={bunkerSupplyTrendsData} dataForecast={bunkerSupplyTrendsForecastData} showLabel={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <img src="/assets/divider-e6e6e6.svg" alt="divider" className="w-auto mt-8" />

          {/* Voyage Performance */}
          <div className="flex flex-col justify-between items-start pt-5 pr-4 pb-4 pl-4">
            <h2 className="text-xl font-semibold font-[nunito]">Voyage Performance</h2>
            <div className="flex justify-start items-center mt-4 gap-4">
              <div className="flex flex-col items-start">
                <h2 className="text-[11px] font-normal font-[nunito] text-black">Date and Voyage Order</h2>
                <DropdownSelect
                  type={SelectType.SINGLE}
                  name="Date and Voyage Order"
                  placeholder="-"
                  value={selectedVoyageOption}
                  options={voyageListOptions}
                  onChange={(selected) => setSelectedVoyage(selected ? selected : { key: "", value: "" })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-3 pl-4 pr-24">
            <div className="flex justify-start gap-2">
              <h2 className="text-lg font-semibold font-[nunito]">{selectedVoyageOption && selectedVoyageOption.key.toString().length > 0 ? "Voyage ".concat(selectedVoyageOption.key.toString().split('-')[1]) : "No Voyage Selected"}</h2>
              {voyageDetailActivity && voyageDetailActivity.data.status && voyageDetailActivity.data.status.toLowerCase().includes("completed") && (
                <>
                  <img src="/assets/verified-badge.svg" alt="Verified Icon" className="w-[3.2rem] mt-0" />
                  <Tooltip
                    title="Verified"
                    type={ButtonType.QUESTION_MARK}
                  >
                    <span className="text-[0.625rem] font-normal font-[nunito]">
                      The log of this voyage has been verified &#40;Coklit&#41;.
                    </span>
                  </Tooltip>
                </>
              )}
            </div>
            <div className="flex w-2 gap-2">
              <button
                disabled={voyageListOptions.findIndex(it => it.key === selectedVoyageOption.key) === voyageListOptions.length - 1}
                onClick={goToPreviousVoyage}
                className={`p-2 ${voyageListOptions.findIndex(it => it.key === selectedVoyageOption.key) < voyageListOptions.length - 1 ? 'bg-white border border-[#C7D1D1] hover:bg-gray-200 hover:border-[#C7D1D1]' : 'bg-gray-300 border border-gray-300'} cursor-default rounded-full`}
              >
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5005 10.2586C17.5005 10.4244 17.4346 10.5834 17.3174 10.7006C17.2002 10.8178 17.0413 10.8836 16.8755 10.8836H4.63409L9.19268 15.4415C9.25075 15.4995 9.29681 15.5685 9.32824 15.6443C9.35966 15.7202 9.37584 15.8015 9.37584 15.8836C9.37584 15.9658 9.35966 16.0471 9.32824 16.123C9.29681 16.1988 9.25075 16.2678 9.19268 16.3258C9.13461 16.3839 9.06567 16.43 8.9898 16.4614C8.91393 16.4928 8.83261 16.509 8.75049 16.509C8.66837 16.509 8.58705 16.4928 8.51118 16.4614C8.43531 16.43 8.36637 16.3839 8.3083 16.3258L2.6833 10.7008C2.62519 10.6428 2.57909 10.5739 2.54764 10.498C2.51619 10.4221 2.5 10.3408 2.5 10.2586C2.5 10.1765 2.51619 10.0952 2.54764 10.0193C2.57909 9.94344 2.62519 9.87451 2.6833 9.81646L8.3083 4.19146C8.42558 4.07419 8.58464 4.0083 8.75049 4.0083C8.91634 4.0083 9.0754 4.07419 9.19268 4.19146C9.30995 4.30874 9.37584 4.4678 9.37584 4.63365C9.37584 4.7995 9.30995 4.95856 9.19268 5.07584L4.63409 9.63365H16.8755C17.0413 9.63365 17.2002 9.6995 17.3174 9.81671C17.4346 9.93392 17.5005 10.0929 17.5005 10.2586Z" fill="#030C13" />
                </svg>
              </button>
              <button
                disabled={voyageListOptions.findIndex(it => it.key === selectedVoyageOption.key) <= 0}
                onClick={goToNextVoyage}
                className={`p-2 ${voyageListOptions.findIndex(it => it.key === selectedVoyageOption.key) > 0 ? 'bg-white border border-[#C7D1D1] hover:bg-gray-200 hover:border-[#C7D1D1]' : 'bg-gray-300 border border-gray-300'} cursor-default rounded-full`}
              >
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.3172 10.7005L11.6922 16.3255C11.5749 16.4427 11.4159 16.5086 11.25 16.5086C11.0841 16.5086 10.9251 16.4427 10.8078 16.3255C10.6905 16.2082 10.6247 16.0491 10.6247 15.8833C10.6247 15.7174 10.6905 15.5584 10.8078 15.4411L15.3664 10.8833H3.125C2.95924 10.8833 2.80027 10.8174 2.68306 10.7002C2.56585 10.583 2.5 10.424 2.5 10.2583C2.5 10.0925 2.56585 9.93355 2.68306 9.81634C2.80027 9.69913 2.95924 9.63328 3.125 9.63328H15.3664L10.8078 5.07547C10.6905 4.95819 10.6247 4.79913 10.6247 4.63328C10.6247 4.46743 10.6905 4.30837 10.8078 4.19109C10.9251 4.07382 11.0841 4.00793 11.25 4.00793C11.4159 4.00793 11.5749 4.07382 11.6922 4.19109L17.3172 9.81609C17.3753 9.87414 17.4214 9.94307 17.4529 10.0189C17.4843 10.0948 17.5005 10.1761 17.5005 10.2583C17.5005 10.3404 17.4843 10.4217 17.4529 10.4976C17.4214 10.5735 17.3753 10.6424 17.3172 10.7005Z" fill="#030C13" />
                </svg>
              </button>
            </div>
          </div>

          <div className="pt-2 pl-4 pr-4">
            <ActivityCard isBunkering={voyageDetailActivity && voyageDetailActivity.data && voyageDetailActivity.data.is_bunkering} data={portData} departureTime={voyageDetailActivity && voyageDetailActivity.data ? voyageDetailActivity.data.commence_date.toLocaleString("id-ID") : "-"} arrivalTime={voyageDetailActivity && voyageDetailActivity.data ? voyageDetailActivity.data.complete_date.toLocaleString("id-ID") : "-"} />
          </div>

          <div className="grid grid-cols-2 pl-4 pr-4 gap-3">
            <div className="bg-white shadow-md mt-4 p-4 rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overscroll-auto overflow-hidden">
              <h3 className="text-[15px] text-start font-bold font-[nunito]">Bunker Consumption</h3>
              <div className="flex pt-2 space-x-2">
                <PerformanceCard
                  mainTitle="At Sea"
                  secondaryTitle="Consumption"
                  thirdTitle="Actual / Baseline"
                  type={voyageBunkerConsActivity && voyageBunkerConsActivity.data && voyageBunkerConsActivity.data.sea_consumption.warning ? PerformanceCardType.LOW_SCORE : PerformanceCardType.HIGH_SCORE}
                  value={voyageBunkerConsActivity && voyageBunkerConsActivity.data && voyageBunkerConsActivity.data.sea_consumption.actual ? voyageBunkerConsActivity && voyageBunkerConsActivity.data && voyageBunkerConsActivity.data.sea_consumption.actual.toFixed(1) : "-"}
                  notation={`MT / ${voyageBunkerConsActivity && voyageBunkerConsActivity.data && voyageBunkerConsActivity.data.sea_consumption.baseline ? voyageBunkerConsActivity.data.sea_consumption.baseline.toFixed(1) : "-"} MT`}
                  deviationDescription={voyageBunkerConsActivity && voyageBunkerConsActivity.data && voyageBunkerConsActivity.data.sea_consumption.deviation.toFixed(1).concat("% ").concat(voyageBunkerConsActivity.data.sea_consumption.status.replaceAll("_", " "))}
                  valueFuelBaseline={
                    <p className={`${voyageBunkerConsActivity && voyageBunkerConsActivity.data && voyageBunkerConsActivity.data.sea_consumption.warning ? 'text-white' : 'text-[#00B843]'} text-[0.623rem] font-light font-[nunito]`}>
                      Detail(MT):&nbsp;
                      {voyageBunkerConsActivity && voyageBunkerConsActivity.data && voyageBunkerConsActivity.data.sea_consumption.fuels.map((it, idx) => (
                        <>
                          <span>{it.value}&nbsp;</span>
                          <span className="font-bold">{it.fuel}{idx < voyageBunkerConsActivity.data.sea_consumption.fuels.length - 1 && ', '}</span>
                        </>
                      ))}
                    </p>
                  }
                />
                <PerformanceCard
                  mainTitle="At Port"
                  secondaryTitle="Consumption"
                  thirdTitle="Actual / Baseline"
                  type={voyageBunkerConsActivity && voyageBunkerConsActivity.data && voyageBunkerConsActivity.data.port_consumption.warning ? PerformanceCardType.LOW_SCORE : PerformanceCardType.HIGH_SCORE}
                  value={voyageBunkerConsActivity && voyageBunkerConsActivity.data && voyageBunkerConsActivity.data.port_consumption.actual ? voyageBunkerConsActivity && voyageBunkerConsActivity.data && voyageBunkerConsActivity.data.port_consumption.actual.toFixed(1) : "-"}
                  notation={`MT / ${voyageBunkerConsActivity && voyageBunkerConsActivity.data && voyageBunkerConsActivity.data.port_consumption.baseline ? voyageBunkerConsActivity.data.port_consumption.baseline.toFixed(1) : "-"} MT`}
                  deviationDescription={voyageBunkerConsActivity && voyageBunkerConsActivity.data && voyageBunkerConsActivity.data.port_consumption.deviation.toFixed(1).concat("% ").concat(voyageBunkerConsActivity.data.port_consumption.status.replaceAll("_", " "))}
                  valueFuelBaseline={
                    <p className={`${voyageBunkerConsActivity && voyageBunkerConsActivity.data && voyageBunkerConsActivity.data.port_consumption.warning ? 'text-white' : 'text-[#00B843]'} text-[0.623rem] font-light font-[nunito]`}>
                      Detail(MT):&nbsp;
                      {voyageBunkerConsActivity && voyageBunkerConsActivity.data && voyageBunkerConsActivity.data.port_consumption.fuels.map((it, idx) => (
                        <>
                          <span>{it.value}&nbsp;</span>
                          <span className="font-bold">{it.fuel}{idx < voyageBunkerConsActivity.data.port_consumption.fuels.length - 1 && ', '}</span>
                        </>
                      ))}
                    </p>
                  }
                />
                <div className="flex flex-col justify-center gap-1">
                  <BaseCard title="Sea Days" type={BaseCardType.COMPACT} value={voyageBunkerConsActivity && voyageBunkerConsActivity.data ? (voyageBunkerConsActivity.data.sea_days !== null ? voyageBunkerConsActivity.data.sea_days.toFixed(2) : "-") : "-"} notation="days" />
                  <BaseCard title="Port Days" type={BaseCardType.COMPACT} value={voyageBunkerConsActivity && voyageBunkerConsActivity.data ? (voyageBunkerConsActivity.data.port_days !== null ? voyageBunkerConsActivity.data.port_days.toFixed(2) : "-") : "-"} notation="days" />
                </div>
              </div>
            </div>
            <div className="bg-white shadow-md mt-4 p-4 rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overscroll-auto overflow-hidden">
              <div className="flex gap-2">
                <h3 className="text-[15px] text-start font-bold font-[nunito]">Operational</h3>
                <img src="/assets/tower-satellite-icon.svg" alt="Tower Icon" className="w-3" />
                <Tooltip
                  type={ButtonType.QUESTION_MARK}
                  title="Remarks"
                >
                  <span className="text-[0.625rem] font-normal">
                    Satellite data powered by EDTP, validated by Noon Report for accuracy and reliability
                  </span>
                </Tooltip>
              </div>
              <div className="flex pt-2 space-x-4">
                <PerformanceCard
                  mainTitle="Speed"
                  thirdTitle="Actual / Baseline"
                  type={voyageOperationalActivity && voyageOperationalActivity.data != null ?
                    (voyageOperationalActivity.data.average_speed ? 
                      (voyageOperationalActivity.data.average_speed < voyageOperationalActivity.data.speed_laden
                        ? PerformanceCardType.LOW_SCORE
                        : (voyageOperationalActivity.data.average_speed > voyageOperationalActivity.data.speed_laden
                          ? PerformanceCardType.HIGH_SCORE : PerformanceCardType.HIGH_SCORE)
                      ) : PerformanceCardType.HIGH_SCORE)
                    : PerformanceCardType.HIGH_SCORE
                  }
                  value={voyageOperationalActivity && voyageOperationalActivity.data ? (voyageOperationalActivity.data.average_speed ? voyageOperationalActivity.data.average_speed.toFixed(0) : "-") : "-"}
                  notation={`KN / ${voyageOperationalActivity && voyageOperationalActivity.data ? (voyageOperationalActivity.data.speed_laden ? voyageOperationalActivity.data.speed_laden.toFixed(0) : "-") : "-"}KN`}
                  description={voyageOperationalActivity && voyageOperationalActivity.data ?
                    (voyageOperationalActivity.data.average_speed < voyageOperationalActivity.data.speed_laden
                      ? "Far below contracted speed"
                      : (voyageOperationalActivity.data.average_speed > voyageOperationalActivity.data.speed_laden
                        ? "Far above contracted speed" : "Normal")
                    )
                    : "--"
                  }
                />
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between gap-2">
                    <BaseCard title="Distance" type={BaseCardType.COMPACT} value={voyageOperationalActivity && voyageOperationalActivity.data ? (voyageOperationalActivity.data.distance !== null ? voyageOperationalActivity.data.distance.toFixed(0) : "-") : "-"} notation="KM" />
                    <BaseCard title="Cargo Load / COT" type={BaseCardType.COMPACT} value={voyageOperationalActivity && voyageOperationalActivity.data ? (voyageOperationalActivity.data.cargo_load_per_cot !== null ? voyageOperationalActivity.data.cargo_load_per_cot.toFixed(0) : "-") : "-"} notation="%" />
                  </div>
                  <div className="flex justify-between gap-2">
                    <BaseCard title="Weather" type={BaseCardType.COMPACT} value="" iconUrl="/assets/weather-icon.svg" notation={voyageOperationalActivity && voyageOperationalActivity.data ? (voyageOperationalActivity.data.weather ? toCamelCase(voyageOperationalActivity.data.weather) : "-") : "-"} />
                    <BaseCard title="Wind" type={BaseCardType.COMPACT} value={voyageOperationalActivity && voyageOperationalActivity.data ? (voyageOperationalActivity.data.wind_speed !== null ? voyageOperationalActivity.data.wind_speed.toFixed(0) : "-") : "-"} iconUrl="/assets/wind-icon.svg" notation="kn to N" />
                    <BaseCard title="Wave Height" type={BaseCardType.COMPACT} value={voyageOperationalActivity && voyageOperationalActivity.data ? (voyageOperationalActivity.data.wave !== null ? voyageOperationalActivity.data.wave.toFixed(0) : "-") : "-"} iconUrl="/assets/stack-icon.svg" notation="m" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 pb-5 pl-4 pr-4">
            <AiInsight>
              <div className="flex flex-row justify-between items-start mt-2 gap-5">
                <div className="w-60 h-60 bg-white rounded-2xl p-4 pl-10 pr-10 font-[nunito]">
              <p className="text-3xl text-black font-bold">{voyageBunkerConsActivity && voyageBunkerConsActivity.data && voyageBunkerConsActivity.data.fuel_eficiency_percentage ? Number(voyageBunkerConsActivity.data.fuel_eficiency_percentage.toFixed(0)) + '%' : '-'}</p>
              <p className="text-sm text-black/75">Efficiency</p>
              <div className="mt-4 flex justify-start items-center gap-3">
                <div className="flex w-9 h-9 p-4 items-center justify-center bg-gradient-blue-1 rounded-full">
                  <span className="text-xs text-white font-semibold">{voyageBunkerConsActivity && voyageBunkerConsActivity.data && voyageBunkerConsActivity.data.avg_deviation_percentage ? Number(voyageBunkerConsActivity.data.avg_deviation_percentage.toFixed(0)) + '%' : '-'}</span>
                </div>
                <span className="w-full text-xs text-black font-normal">Deviation From TCP</span>
              </div>
              <div className="mt-1 flex justify-start items-center gap-3">
                <div className="flex w-9 h-9 p-1 items-center justify-center bg-gradient-blue-2 rounded-full">
                  <span className="text-xs text-white font-semibold">{voyageBunkerConsActivity && voyageBunkerConsActivity.data && voyageBunkerConsActivity.data.speed_performance_percentage ? Number(voyageBunkerConsActivity.data.speed_performance_percentage.toFixed(0)) + '%' : '-'}</span>
                </div>
                <span className="text-xs text-black font-normal">AVG Speed</span>
              </div>
              <div className="mt-1 flex justify-start items-center gap-3">
                <div className="flex w-9 h-9 p-1 items-center justify-center bg-gradient-blue-3 rounded-full">
                  <span className="text-xs text-white font-semibold">{voyageBunkerConsActivity && voyageBunkerConsActivity.data && voyageBunkerConsActivity.data.cargo_load_per_cot ? Number(voyageBunkerConsActivity.data.cargo_load_per_cot.toFixed(0)) + '%' : '-'}</span>
                </div>
                <span className="text-xs text-black font-normal">Cargo Load</span>
              </div>
            </div>
            {/* <MainRadialBarChart
                  type={RadialBarChartType.INSIGHT} 
                  val={voyageBunkerConsActivity && voyageBunkerConsActivity.data && voyageBunkerConsActivity.data.fuel_eficiency_percentage && Number(voyageBunkerConsActivity.data.fuel_eficiency_percentage.toFixed(0))}
                  valInsight1={voyageBunkerConsActivity && voyageBunkerConsActivity.data && voyageBunkerConsActivity.data.avg_deviation_percentage && Number(voyageBunkerConsActivity.data.avg_deviation_percentage.toFixed(0))}
                  valInsight2={voyageBunkerConsActivity && voyageBunkerConsActivity.data && voyageBunkerConsActivity.data.speed_performance_percentage && Number(voyageBunkerConsActivity.data.speed_performance_percentage.toFixed(0))}
                  valInsight3={voyageBunkerConsActivity && voyageBunkerConsActivity.data && voyageBunkerConsActivity.data.cargo_load_per_cot && Number(voyageBunkerConsActivity.data.cargo_load_per_cot.toFixed(0))}
                  bgInsight1="#0868B9"
                  bgInsight2="#2395F5"
                  bgInsight3="#7BBDF5"
                  bgTrack="#E5F4FF" /> */}
                <div className="prose prose-sm max-w-[60rem] [&_*]:marker:text-gray-800 prose-li:text-gray-800">
                  <ReactMarkdown>{voyageBunkerConsActivity && voyageBunkerConsActivity.data ? voyageBunkerConsActivity.data.insight : "Currently, there is no insight data."}</ReactMarkdown>
                </div>
              </div>
            </AiInsight>
          </div>
        </>
      )}
    </div >
  );
}

export default VesselPerformance;
