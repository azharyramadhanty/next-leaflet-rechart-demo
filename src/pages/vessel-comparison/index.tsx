import { RadarDataType, RadarLegendType } from "@/components/ComparisonRadarChart";
import Datepicker from "@/components/Datepicker";
import { useTitle } from "@/context/TitleContext";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import CheckBox, { CheckboxDataType } from "@/components/CheckBox";
import DropdownSelect, { SelectOptionsType } from "@/components/DropdownSelect";
import TableStrippedCustom, { TableDetailType } from "@/components/TableStripped";
import { LegendType } from "@/utils/enums/RadarEnum";
import BannerCard from "@/components/BannerCard";
import { BannerType } from "@/utils/enums/BannerEnum";
import { SelectType } from "@/utils/enums/SelectEnum";
import { DatepickerType } from "@/utils/enums/DatepickerEnum";
import { useVessel } from "@/hooks/vessels/useVessel";
import { roundUpTo2Decimals, toEpochSeconds } from "@/utils/Utils";
import { VesselSummaryDataKpiType, VesselSummaryKpiType } from "@/utils/Types";
import { formatSeparatorNumber } from "@/utils/Utils";
import { useToastAlert } from "@/context/ToastAlertContext";

const ComparisonRadarChart = dynamic(() => import("@/components/ComparisonRadarChart"), { ssr: false })

const VesselPerformance = () => {
  const { setTitle } = useTitle()
  const { addToastAlert } = useToastAlert();
  const { useVesselAllListQuery, useVesselSummaryKpiQuery, useVesselDetailQuery } = useVessel();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(new Date().getFullYear(), 0, 1), new Date()]);
  const [selectedVesselOption, setSelectedVessel] = useState<SelectOptionsType[]>([]);
  const fetchVesselDetail = useVesselDetailQuery(selectedVesselOption.map(i => i.key as string))
  const fetchVesselAllList = useVesselAllListQuery();
  const fetchVesselSummaryKpiQuery = useVesselSummaryKpiQuery(
    selectedVesselOption.map(i => i.key as string),
    toEpochSeconds(dateRange[0]),
    toEpochSeconds(dateRange[1])
  );
  const [defaultDateChanged, setDefaultDateChanged] = useState(false);
  const [vesselListOptions, setVesselListOptions] = useState<SelectOptionsType[]>([])
  const [dataVesselSummaryKpi, setDataVesselSummaryKpi] = useState<VesselSummaryDataKpiType[]>([])
  const [vesselDetails, setVesselDetails] = useState<TableDetailType[]>([
    {
      id: "fuel_types",
      label: "Fuel Type",
      items: [
        { id: 'A', value: '' },
        { id: 'B', value: '' },
        { id: 'C', value: '' }
      ]
    },
    {
      id: "vessel_type",
      label: "Vessel Type",
      items: [
        { id: 'A', value: '' },
        { id: 'B', value: '' },
        { id: 'C', value: '' }
      ]
    },
    {
      id: "year_built",
      label: "Manufacture Year",
      items: [
        { id: 'A', value: '' },
        { id: 'B', value: '' },
        { id: 'C', value: '' }
      ]
    },
    {
      id: "dwt",
      label: "DWT",
      items: [
        { id: 'A', value: '' },
        { id: 'B', value: '' },
        { id: 'C', value: '' }
      ]
    },
    {
      id: "cargo_capacity",
      label: "Cargo Capacity",
      items: [
        { id: 'A', value: '' },
        { id: 'B', value: '' },
        { id: 'C', value: '' }
      ]
    },
  ])
  const [metrics, setMetrics] = useState<CheckboxDataType[]>([
    { value: "profit_loss", label: "Vessel Profit & Loss", checked: true },
    { value: "cargo_shipped_per_bunker_supplied", label: "Cargo Shipped/Bunker Supplied (KL/MT)", checked: true },
    { value: "actual_speed_per_contract_speed", label: "Actual Speed/Contracted Speed (%)", checked: true },
    { value: "cargo_shipped_per_shipping_cost", label: "Cargo Shipped/Shipping Cost (KL/USD)", checked: true },
    { value: "bunker_consumption_per_day_port", label: "Bunker Consumption/Day at Port (MT/day)", checked: true },
    { value: "bunker_consumption_per_day_sea", label: "Bunker Consumption/Day at Sea (MT/day)", checked: true }
  ]);
  const [dataChart, setDataChart] = useState<RadarDataType[]>([
    { subject: "Vessel Profit & Loss", A: 0, B: 0, C: 0, fullMark: 100, unit: 'USD', real_A: 0, real_B: 0,real_C: 0},
    { subject: "Cargo Shipped/Bunker Supplied (KL/MT)", A: 0, B: 0, C: 0, fullMark: 100, unit: 'KL/MT', real_A: 0, real_B: 0,real_C: 0 },
    { subject: "Actual Speed/Contracted Speed (%)", A: 0, B: 0, C: 0, fullMark: 100, unit: '%', real_A: 0, real_B: 0,real_C: 0 },
    { subject: "Cargo Shipped/Shipping Cost (KL/USD)", A: 0, B: 0, C: 0, fullMark: 100, unit: 'KL/USD', real_A: 0, real_B: 0,real_C: 0 },
    { subject: "Bunker Consumption/Day at Port (MT/day)", A: 0, B: 0, C: 0, fullMark: 100, unit: '(MT/day)', real_A: 0, real_B: 0,real_C: 0 },
    { subject: "Bunker Consumption/Day at Sea (MT/day)", A: 0, B: 0, C: 0, fullMark: 100, unit: '(MT/day)', real_A: 0, real_B: 0,real_C: 0 },
  ]);
  const [alertMessage, setAlertMessage] = useState({
    title: 'Warning',
    body: 'Please select vessels first, at maximum 3 vessels to be compared.'
  });
  const [legends, setLegends] = useState<RadarLegendType[]>([
    { key: LegendType.A, value: "", label: "" },
    { key: LegendType.B, value: "", label: "" },
    { key: LegendType.C, value: "", label: "" },
  ]);

  useEffect(() => {
    setTitle('Vessel Performance Comparison');
  }, []);

  const updateVesselList = useCallback(() => {
    setVesselListOptions(fetchVesselAllList.data.data.map(v => ({
      key: v.vessel_code,
      value: v.vessel_name
    })));
  }, [fetchVesselAllList.data]);

  const updateVesselDetail = useCallback(() => {
    const updateSpec = vesselDetails.map((item) => {
      const specs = Array.isArray(fetchVesselDetail.data) ? fetchVesselDetail.data : [fetchVesselDetail.data]
      const vessels = legends.map((i, index) => {
        const checArr = specs[index] ? 
          Array.isArray(specs[index]?.data[item.id]) ? 
            specs[index]?.data[item.id].join(", ") 
            : specs[index]?.data[item.id] 
          : i.value;
        return { id: i.key, value: i.value ? item.id === "year_built" ? checArr : formatSeparatorNumber(checArr) : '-' }
      })
      
      return vessels ? {
        ...item,
        items: vessels
      } : item
    })
    setVesselDetails(updateSpec)
  }, [fetchVesselDetail.data]);

  const updateVesselSummaryKpi = () => {
    fetchVesselSummaryKpiQuery.mutateAsync()
      .then((res) => {
        const response = res as VesselSummaryKpiType
        const vesselCodes = Array.isArray(response) ? response : [response]
        const newRes = vesselCodes.map((i, index) => {
          return { vesselCode: selectedVesselOption[index].key, data: i.data }
        }) as VesselSummaryDataKpiType[]
        updateLegends(selectedVesselOption)
        setDataVesselSummaryKpi(newRes)
      })
      .catch(err => {
        addToastAlert("An unexpected issue occurred while retrieving vessel summary kpi data.")
      });
  }

  useEffect(() => {
    if (selectedVesselOption.length > 0) {
      if (fetchVesselDetail.isSuccess) updateVesselDetail()
      if (fetchVesselDetail.isError) addToastAlert("An unexpected issue occurred while retrieving vessel detail data.")
    }
  }, [
    fetchVesselDetail.isSuccess, 
    fetchVesselDetail.isError,
    selectedVesselOption
  ])

  useEffect(() => {
    const changeRadar = () => {
      const checkBoxedChart = metrics
        .filter((item) => item.checked)
        .map((item) => {
          const met = {
            subject: item.label,
            fullMark: 150,
            vessel_A: '',
            A: 0,
            real_A: 0,
            vessel_B: '',
            B: 0,
            real_B: 0,
            vessel_C: '',
            C: 0,
            real_C: 0
          }
          legends.map(i => {
            const newob = Object(dataVesselSummaryKpi.find(v => v.vesselCode === i.value)).data
            met[i.key] = newob && newob[item.value] || 0
            met["real_" + i.key] = newob ? newob[item.value] !== null ? newob[item.value] : '-' : 0
            met["vessel_" + i.key] = i.value as string
          })

          const unit = dataChart.find(j => j.subject === item.label).unit
          const filtered = Object.entries(met).filter(([key, value]) => key !== "subject" && key !== "fullMark" && !key.includes("real") && !key.includes("vessel"))
          const val = filtered.map(([_, value]) => value as number)
          const min = Math.min(...val)
          const max = Math.max(...val)
          
          filtered.map(([key, value]) => {
            const typeVal = value as number
            met[key] = typeVal !== null && (met["vessel_" + key] || typeVal > 0) ? roundUpTo2Decimals(min - max === 0 ? typeVal > 0 ? 100 : 20 : ((typeVal - min)/(max-min)*(100-20))+20) : (met[key] || 0)
            met["real_" + key] = unit === '%' ? typeVal * 100 : met["real_" + key]
          })
          
          return met
        })
      
      const updatedChart = dataChart.map((item) => {
        const updated = checkBoxedChart.find(i => i.subject === item.subject)
        return updated ? { ...item, A: updated.A, B: updated.B, C: updated.C, real_A: updated.real_A, real_B: updated.real_B, real_C: updated.real_C } :
          { ...item, A: 0, B: 0, C: 0, real_A: 0, real_B: 0,real_C: 0 }
      })

      setDataChart(updatedChart)
    }

    changeRadar()
  }, [
    dataVesselSummaryKpi,
    metrics,
    selectedVesselOption
  ])

  useEffect(() => {
    if (selectedVesselOption.length > 0) {
      setAlertMessage(null)
    } else {
      setAlertMessage({
        title: 'Warning',
        body: 'Please select vessels first, at maximum 3 vessels to be compared.'
      })
      setVesselDetails((prev) =>
        prev.map(i => {
          const newItem = i.items.map(v => ({ ...v, value: '' }))
          return { ...i, items: newItem }
        })
      )
    }
  }, [
    selectedVesselOption
  ])

  useEffect(() => {
    if (fetchVesselAllList.isSuccess && fetchVesselAllList.data && vesselListOptions.length === 0) updateVesselList()
    if (fetchVesselAllList.isError) addToastAlert("An unexpected issue occurred while retrieving vessel list data.")
  }, [
    fetchVesselAllList.isSuccess,
    fetchVesselAllList.isError,
    fetchVesselAllList.data
  ]);

  useEffect(() => {
    if (selectedVesselOption.length > 0 && dateRange.filter(i => i === null).length === 0) {
      updateVesselSummaryKpi()
    } else {
      setDataVesselSummaryKpi((prev) => {
        return prev.filter(i => selectedVesselOption.find(v => v.key === i.vesselCode))
      })
    }
  }, [
    selectedVesselOption,
    dateRange
  ]);

  const updateLegends = (value: any) => {
    const updated = legends.map((i, index) => {
      return { ...i, value: value && value[index] ? value[index].key : '', label: value && value[index] ? value[index].value : '' }
    })
    setLegends(updated)
  }

  const handleCheckboxChange = (value) => {
    setMetrics((prev) => {
      const updatedCheckboxed = prev.map((item) =>
        item.value === value ? { ...item, checked: !item.checked } : item
      )
      return updatedCheckboxed
    });
  };

  const handleSelectChange = (value) => {
    setSelectedVessel(value)
    updateLegends(value)
  }

  return (
    <div className="flex-1 flex flex-col gap-5 overscroll-auto overflow-auto font-[nunito]">
      <div className="pr-4 pl-4">
        <div className="flex flex-col transition">
          <h2 className="text-lg font-bold">Comparison Parameter</h2>
          <span className="text-xs font-light">
            Please choose at maximum 3 vessels to be compared and select the period (a month minimum range of time).
          </span>
        </div>
        <div className="flex justify-start items-center mt-4 gap-4">
          <div className="flex flex-col items-start">
            <h2 className="text-[11px] font-normal text-black">Vessel(s)</h2>
            <DropdownSelect
              type={SelectType.MULTIPLE}
              max={3}
              name="vessel"
              isLoading={fetchVesselAllList.isLoading}
              placeholder="Select Vessels"
              options={vesselListOptions}
              value={selectedVesselOption}
              onChange={(value) => handleSelectChange(value)}
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
              maxRangeMonth={36}
              maxDate={new Date()}
              isClearable={defaultDateChanged}
            />
          </div>
        </div>
      </div>

      <div className="px-4 flex justify-between">
        <div className="flex justify-between items-center transition">
          <h2 className="text-lg font-bold">Performance Comparison</h2>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4 px-4">
        <div className="p-0 col-span-6">
          <div className="bg-white shadow-md rounded-2xl p-0 border text-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="grid grid-cols-6 p-1">
              <div className="col-span-4 flex flex-col p-2">
                <ComparisonRadarChart data={dataChart} legends={legends} />
              </div>
              <div className="flex flex-col col-span-2 gap-2 p-5 text-xs">
                {alertMessage && (
                  <div className="pb-2">
                    <BannerCard
                      title={alertMessage.title}
                      type={BannerType.DANGER}
                      body={alertMessage.body}
                    />
                  </div>
                )}
                <h3 className="text-black">Performance Metrics</h3>
                <ul role="list">
                  {metrics.map((metric, index) => (
                    <li key={index} className="p-2 bg-white0">
                      <div className="flex items-center space-x-2">
                        <CheckBox
                          disabled={!legends.some(v => v.value !== "")}
                          value={metric.value}
                          label={metric.label}
                          checked={metric.checked}
                          onHandleChange={handleCheckboxChange}
                          labelClass="text-xs"
                          checkboxClass="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 flex justify-between">
        <div className="flex justify-between items-center transition">
          <h2 className="text-lg font-bold">Other Comparison</h2>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4 px-4">
        <div className="p-0 col-span-6">
          <div className="bg-white shadow-md rounded-2xl p-0 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col gap-2 p-4">
              <h3 className="p-1 font-bold">Vessel Specification Comparison</h3>
              <div className="text-slate-100 justify-normal text-sm">
                <TableStrippedCustom headers={legends} details={vesselDetails} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default VesselPerformance