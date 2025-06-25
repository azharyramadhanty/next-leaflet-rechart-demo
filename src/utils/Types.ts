import { BunkerType } from "./enums/ScheduleAdjustVerifyEnum";
import { ScheduleBunkerPlanType } from "./enums/StatusEnum";

// --- General --- // 
export type DataType = {
    key: string | number;
    value: string | number;
}

export type BarDataType = {
    name: string,
    hfo?: number,
    mdf?: number,
    mgo?: number,
    lfo?: number,
    hsd?: number,
    mfo?: number,
    base?: number,
    baselineHfo?: number,
    baselineMdf?: number,
    baselineMgo?: number
    baselineLfo?: number
    baselineHsd?: number
    baselineMfo?: number
}

type errorsType = {
    errors?: {
        error_code?: string | number,
        field_name?: string,
        description?: string,
    }[],
}

export type FilterSelectType = {
    id: number,
    name: string,
    options: DataType | null
}

export type FilterDateType = {
    id: number,
    name: string,
    dates: Date | [Date | null, Date | null] | null;
}

// --- End General --- // 


// --- Vessel --- // 
type VesselBoundaryLocationType = {
    type?: string,
    coordinates?: number[]
}

type VesselBoundaryVoyageLocationType = {
    type?: string,
    coordinates?: number[][]
}

type VesselBoundaryDataType = {
    vessel_code?: string,
    vessel_name?: string,
    source_port?: string,
    destination_port?: string,
    source_location?: VesselBoundaryLocationType,
    location?: VesselBoundaryLocationType,
    course?: number,
    destination?: VesselBoundaryLocationType,
    voyage_no?: string,
    voyage_route?: VesselBoundaryVoyageLocationType,
    updated_time?: Date,
    avg_performance?: {
        score?: number,
        category?: string,
        color?: string
    }
}

export type VesselsBoundaryType = {
    data?: VesselBoundaryDataType[],
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

type VesselPerformanceKpiDataType = {
    bunker_cost_per_vol_kargo?: number,
    shipping_cost_per_vol_kargo?: number,
    bunker_supply_per_vol_kargo?: number,
}

export type VesselPerformanceKpiType = {
    data?: VesselPerformanceKpiDataType,
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

type VesselConsPerformanceKpiDataType = {
    low?: {
        count?: number,
        color?: string,
    },
    moderate?: {
        count?: number,
        color?: string,
    },
    high?: {
        count?: number,
        color?: string,
    },
}

export type VesselConsPerformanceKpiType = {
    data?: VesselConsPerformanceKpiDataType,
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

type LastBunkerPerformanceDataType = {
    voyage_id?: string,
    bunker_performance?: number,
    voyage_complete_date?: Date,
}

type VesselLeaderboardKpiDataType = {
    rank?: number,
    vessel_code?: string,
    vessel_name?: string,
    performance?: number,
    last_bunker_performance?: LastBunkerPerformanceDataType[]
}

export type VesselLeaderboardKpiType = {
    data?: VesselLeaderboardKpiDataType[],
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

type VesselDetailPerformanceLastVoyageType = {
    voyage_id?: string,
    voyage_no?: string,
    performance?: number,
    commence_date?: Date,
    commplete_date?: Date,
}

type VesselDetailPerformanceVoyageTrackType = {
    sequence?: number,
    port_name?: string,
    port_function?: string,
    arrival_time?: string,
    sch_arrival_time?: string,
    departure_time?: string,
    sch_departure_time?: string,
}

type VesselDetailPerformanceKpiType = {
    profit_loss?: number,
    shipping_cost_vol_cargo?: number,
    bunker_supply_vol_cargo?: number,
}

type VesselDetailPerformancePortType = {
    port_name?: string,
    un_code?: string,
    country_code?: string,
}

type VesselDetailPerformanceTypeofVesselType = {
    vessel_type_id?: string,
    vessel_type_name?: string,
    created_time?: Date,
    updated_time?: Date
}

type VesselDetailPerformanceDataType = {
    vessel_name?: string,
    img_url?: string,
    voyage_no?: string,
    updated_time?: Date,
    fuel_type?: string[],
    cargo_capacity?: number,
    vessel_type?: VesselDetailPerformanceTypeofVesselType,
    start_port?: VesselDetailPerformancePortType,
    end_port?: VesselDetailPerformancePortType,
    distance?: number,
    milleage?: number,
    last_voyages?: VesselDetailPerformanceLastVoyageType[],
    cargo_shipped?: number,
    voyage_track?: VesselDetailPerformanceVoyageTrackType[],
    kpi?: VesselDetailPerformanceKpiType,
    total_bunker_supplied?: number,
    fuel_rob?: number
}

export type VesselDetailPerformanceType = {
    data?: VesselDetailPerformanceDataType,
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

type VesselListDataType = {
    vessel_code?: string,
    vessel_name?: string,
}

export type PageSchema = {
    page?: number,
    limit?: number,
    total_page?: number,
    total?: number,
};

export type VesselListScheme = PageSchema & {
    data?: VesselListDataType[],
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[]
}

type VesselLogDataType = {
    vessel_name?: string,
    vessel_type?: string,
    fuel_types?: string[],
    year_built?: number,
    dwt?: number,
    milleage?: number,
    cargo_shipped?: number,
    bunker_supplied?: number,
    total_voyage?: number,
}

export type VesselLogType = {
    data?: VesselLogDataType,
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

type VesselPerformanceMetricAdditionalDetailType = {
    fuel?: string,
    value?: number
}

type VesselPerformanceMetricDataType = {
    net_profit_margin?: number,
    bunker_supply_per_cargo?: number,
    shipping_cost_per_cargo?: number,
    specific_fuel_consumption?: number,
    daily_fuel_consumption?: number,
    daily_fuel_consumption_detail?: VesselPerformanceMetricAdditionalDetailType[],
    specific_fuel_consumption_detail?: VesselPerformanceMetricAdditionalDetailType[]
}

export type VesselPerformanceMetricType = {
    data?: VesselPerformanceMetricDataType,
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

type VesselLatestVoyagePortDataType = {
    port_id?: string,
    un_code?: string,
    port_name?: string
}

type VesselLatestVoyagesDataType = {
    voyage_no?: string,
    performance?: number,
    commence_date?: Date,
    complete_date?: Date,
    start_port?: VesselLatestVoyagePortDataType,
    end_port?: VesselLatestVoyagePortDataType,
    is_bunkering?: boolean,
    cargo_lift?: number,
    mileage?: number,
    sea_days?: number,
    port_bunkering?: {
        port_id: string,
        port_name: string
    }[]
}

export type VesselLatestVoyagesType = {
    data?: VesselLatestVoyagesDataType[],
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

export type VesselFuelConsumptionDeviationItemType = {
    deviation?: number,
    deviation_ammount?: number,
    baseline?: number,
    fuels?: {
        fuel?: string,
        value?: number
    }[]
}

type VesselFuelConsumptionDeviationDataType = {
    sea?: VesselFuelConsumptionDeviationItemType,
    port?: VesselFuelConsumptionDeviationItemType
}

export type VesselFuelConsumptionDeviationType = {
    data?: VesselFuelConsumptionDeviationDataType,
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

type VoyageListDataType = {
    voyage_id?: string,
    voyage_no?: string,
    start_port?: {
        name?: string,
        port_code?: string
    },
    end_port?: {
        name?: string,
        port_code?: string
    },
    commence_date?: Date,
    complete_date?: Date,
    status?: string
}

export type VoyageListType = PageSchema & {
    data?: VoyageListDataType[],
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

type VoyageActivityType = {
    sequence?: number,
    port_name?: string,
    port_code?: string,
    port_function?: string
}

type VoyageDetailDataType = {
    voyage_id?: string,
    voyage_no?: string,
    voyage_status?: string,
    commence_date?: Date,
    complete_date?: Date,
    commence_date_gmt?: string,
    complete_date_gmt?: string,
    insight?: string,
    vessel_code?: string,
    weather?: string,
    distance?: number,
    sea_days?: number,
    port_days?: number,
    wind_speed?: number,
    wind_direction?: number,
    wave?: number,
    wave_description?: string,
    cargo_load?: number,
    bunker_consumption?: {
        hsd?: {
            actual_consumption?: number,
            baseline?: number
        },
        mdf?: {
            actual_consumption?: number,
            baseline?: number
        },
        lfo?: {
            actual_consumption?: number,
            baseline?: number
        }
    },
    average_speed?: number,
    baseline_speed?: number,
    is_bunkering?: boolean,
    voyage_activity?: VoyageActivityType[],
}

export type VoyageDetailType = {
    data?: VoyageDetailDataType,
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

type VoyageDetailActivityVoyageItemType = {
    sequence?: number,
    port_name?: string,
    port_code?: string,
    port_function?: string
}

type VoyageDetailActivityDataType = {
    commence_date?: Date,
    complete_date?: Date,
    commence_date_gmt?: Date,
    complete_date_gmt?: Date,
    is_bunkering?: boolean,
    voyage_activity?: VoyageDetailActivityVoyageItemType[],
    status?: string
}

export type VoyageDetailActivityType = {
    data?: VoyageDetailActivityDataType,
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
};

type VoyageDetailOperationalDataType = {
    weather?: string,
    distance?: number,
    wind_speed?: number,
    wind_direction?: string,
    wave?: number,
    wave_description?: string,
    cargo_load_per_cot?: number,
    average_speed?: number,
    speed_laden?: number,
    speed_ballast?: number,
}

export type VoyageDetailOperationalType = {
    data?: VoyageDetailOperationalDataType,
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
};

type VoyageDetailConsumptionItemDataType = {
    deviation?: number,
    actual?: number,
    baseline?: number,
    fuels?: {
        fuel?: string,
        value?: number,
    }[],
    status?: string,
    warning?: boolean
}

type VoyageDetailBunkerConsDataType = {
    fuel_eficiency_percentage?: number,
    avg_deviation_percentage?: number,
    cargo_load_per_cot?: number,
    speed_performance_percentage?: number,
    sea_consumption?: VoyageDetailConsumptionItemDataType,
    port_consumption?: VoyageDetailConsumptionItemDataType,
    sea_days?: number,
    port_days?: number,
    insight?: string
}

export type VoyageDetailBunkerConsType = {
    data?: VoyageDetailBunkerConsDataType,
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
};

type VesselDetailDto = {
    vessel_name?: string,
    vessel_type?: string,
    fuel_types?: string[],
    year_built?: number,
    dwt?: number,
    cargo_capacity?: number,
    fuel_type?: string[]
}

export type VesselDetailType = errorsType & {
    data?: VesselDetailDto,
    success?: boolean,
}

type VesselSummaryKpiDto = {
    profit_loss?: number,
    cargo_shipped_per_bunker_supplied?: number,
    actual_speed_per_contract_speed?: number,
    cargo_shipped_per_shipping_cost?: number,
    bunker_consumption_per_day_port?: number,
    bunker_consumption_per_day_sea?: number
}

export type VesselSummaryKpiType = errorsType & {
    data?: VesselSummaryKpiDto,
    success?: boolean,
}

export type VesselSummaryDataKpiType = {
    vesselCode: string,
    data: VesselSummaryKpiDto
}

type VesselBunkerReportingDataType = {
    vessel_code?: string,
    vessel_name?: string,
    vessel_type?: string,
    status?: string,
    report_time?: Date,
    coverage_days?: number,
    hsd?: number,
    hfo?: number,
    mgo?: number,
    mdo?: number,
    lfo?: number,
    mfo?: number,
    mdf?: number,
    has_plan?: boolean
}

export type VesselBunkerReportingType = PageSchema & {
    data?: VesselBunkerReportingDataType,
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

export type VesselToBunkerDataModel = {
    id: number,
    vesselCode: string,
    vesselName: string,
    vesselType: string,
    lfoRob: string,
    hfoRob: string,
    mgoRob: string,
    hsdRob: string,
    mdoRob: string,
    mfoRob: string,
    mdfRob: string,
    hasPlan: boolean,
    coverageDays: number,
    // vesselRequestDate: number,
    latestUpdated: number,
    status: string
};

export type VesselToBunkerSimulationResultDataModel = {
    id: number,
    vesselCode: string,
    vesselName: string,
    hfo: string,
    mdf: string,
    mgo: string,
    mfo: string,
    lfo: string,
    hsd: string,
    coverageDays: number,
    bunkerPort: string,
    bunkerDate: Date,
    seaState: string,
    expandItems: {
        label: string,
        items: DataType[]
    },
    savedStatus: string
};

type VesselToBunkerDetailFuelDataType = {
    fuel_type?: string,
    bunker_cons_per_tcp?: number,
    bunker_cons_per_day?: number,
    coverage_days?: number,
    fuel_rob?: number
    fuel_rob_percentage?: number,
    tank_capacity?: number
}

type VesselToBunkerDetailDataType = {
    vessel_name?: string,
    vessel_type?: string,
    vessel_code?: string,
    total_coverage_days?: number,
    status?: string,
    fuel_details?: VesselToBunkerDetailFuelDataType[],
    has_plan?: boolean
}

export type VesselToBunkerDetailType = {
    data?: VesselToBunkerDetailDataType,
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}


// --- End Vessel --- // 

// --- Port --- // 
type PortBoundaryLocationType = {
    type?: string,
    coordinates?: number[]
}

type PortBoundaryDataType = {
    port_id?: string,
    port_name?: string,
    location?: PortBoundaryLocationType,
    is_bunkering?: boolean,
}

export type PortBoundaryType = {
    data?: PortBoundaryDataType[],
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

type PortLeaderboardKpiDataType = {
    rank?: number,
    port_id?: string,
    port_name?: string,
    discrepancy?: number,
}

export type PortLeaderboardKpiType = {
    data?: PortLeaderboardKpiDataType[],
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

type PortDetailPerformanceDataType = {
    port_id?: string,
    port_name?: string,
    img_url?: string,
    un_code?: string,
    updated_time?: Date,
    port_type?: string,
    on_going_vessel?: number,
    mileage_percentage?: number,
    distance_percentage?: number
    bunker_supplied?: number,
    bunker_inventory?: number,
    weekly_demand?: number,
    discrepancy?: number,
}

export type PortDetailPerformanceType = {
    data?: PortDetailPerformanceDataType,
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

type PortIncomingVesselsDataType = {
    vessel_code?: string,
    vessel_name?: string,
    voyage_id?: string,
    location?: {
        type?: string,
        coordinates?: number[]
    },
    course?: number
}

export type PortIncomingVesselsType = {
    data?: PortIncomingVesselsDataType[],
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

type PortListDataType = {
    port_id?: string,
    port_name?: string,
}

export type PortListType = {
    data?: PortListDataType[],
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

// --- Bunker / Barge --- // 
type BunkerSupplyPerformanceKpiDataType = {
    bunker_inventory?: number,
    bunker_supplied?: number,
    discrepancy?: number,
    discrepancy_diff?: number,
    total_request?: number,
    pit_bunker?: {
        bunker_supplied?: number,
        discrepancy_percentage?: number,
        discrepancy_volume?: number
    },
    sts_bunker?: {
        bunker_supplied?: number,
        discrepancy_percentage?: number,
        discrepancy_volume?: number
    },
    barge_bunker?: {
        bunker_supplied?: number,
        discrepancy_percentage?: number,
        discrepancy_volume?: number
    },
}

export type BunkerSupplyPerformanceKpiType = {
    data?: BunkerSupplyPerformanceKpiDataType,
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

type BunkerSupplyDataType = {
    month_year?: string,
    fuel_type?: string,
    bunker_supplied?: number,
}

export type BunkerSupplyType = {
    data?: BunkerSupplyDataType[],
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

type BunkerHandlingTransporterRankDataType = {
    rank?: number,
    transporter?: string,
    port?: string,
    total_loss?: number
}

export type BunkerHandlingTransporterRankType = {
    data?: BunkerHandlingTransporterRankDataType[],
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

type BunkerHandlingVesselRankDataType = {
    rank?: number,
    transporter?: string,
    vessel?: string,
    total_loss?: number
}

export type BunkerHandlingVesselRankType = {
    data?: BunkerHandlingVesselRankDataType[],
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

type BunkerHandlingLossHistoryDataType = {
    transporter: string,
    vessel: string,
    call: number,
    total_loss: number,
}

export type BunkerHandlingLossHistoryType = PageSchema & {
    data?: BunkerHandlingLossHistoryDataType[],
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

type BunkerHandlingBargePerformanceDataType = {
    no_losses?: number,
    vol_no_losses?: number,
    losses?: number,
    vol_losses?: number
}

export type BunkerHandlingBargePerformanceType = {
    data?: BunkerHandlingBargePerformanceDataType,
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

// --- End Bunker / Barge --- // 
export type NotificationItem = {
    id?: string,
    category?: string,
    message?: string,
    mark_as_read?: boolean,
    title?: string,
    created_time?: Date,
    updated_time?: Date
}

type NotificationDataType = {
    total?: number,
    unread?: number,
    notifications?: {
        date?: Date,
        notifications?: NotificationItem[]
    }[],
}

export type NotificationType = {
    data?: NotificationDataType
    success?: boolean,
    errors?: {
        error_code?: number,
        field_name?: string,
        description?: string,
    }[],
}

export type BunkerPlanScheduledType = {
    id: number,
    simulationId: string,
    vesselName: string,
    mfoVol: string,
    hfoVol: string,
    lfoVol: string,
    mdfVol: string,
    mgoVol: string,
    hsdVol: string,
    bunkerPort: string,
    bunkerDate: Date,
    status: ScheduleBunkerPlanType
};

export type BunkerPlanVerifiedType = {
    id: number,
    simulationId: string,
    vesselName: string,
    supplyDate: Date,
    supplyPort: string,
    bunkerMedia: string,
    fuelType: string,
    plannedVol: string,
    actualReceipt: string,
    billOfLading: string,
    discrepancyVal: string,
    discrepancyPercent?: string
};

export type DocumentUpladType = {
    id: number,
    name: string,
    excelFile: string,
    lastUpdated: number
};

export type FileUploadsType = {
    id: number;
    name: string;
    path: string;
    extension: string;
    originalFile: File;
}

export type BunkerMediaType = 'Bunker PIT' | 'Bunker Barge' | 'Bunker STS';

export type BunkerValueType = {
    id: string | null;
    type: BunkerType;
    value: string;
}

export type BunkerPlanListDataType = {
    idx: number | null;
    id?: string | null;
    simulationId: string | null;
    bunkerDate: number | null;
    bunkerSchema: string | null;
    status: ScheduleBunkerPlanType | null;
    mfo?: number | null;
    hfo?: number | null;
    mdf?: number | null;
    mgo?: number | null;
    lfo?: number | null;
    hsd?: number | null;
}

export type EvidenceType = {
    evidenceId: string;
    fileName: string;
    fileUrl: string;
}

export type BunkerPlanDetailDataType = {
    id: number | null;
    simulationId: string | null;
    bunkerDate?: Date | null;
    receivedDate?: Date | null;
    bunkerPort?: string | null;
    vesselName: string | null;
    dataBunker?: BunkerValueType[];
    dataEvidence?: EvidenceType[];
}

export type UploadEvidencesDataType = {
    simulationId: string;
    fileName: string;
    isUpdated: boolean;
    isDeleted: boolean;
    files: File
}

export type BunkerPlanListVerifyDataType = BunkerPlanListDataType & {
    sfblTransporter?: number | null,
    sfblL15?: number | null,
    sfalTransporter?: number | null,
    sfalL15?: number | null,
    sfbdTransporter?: number | null,
    sfbdL15?: number | null,
    sfadTransporter?: number | null,
    sfadL15?: number | null,
    billOfLading?: number | null,
    bolL15?: number | null,
    actualReceipt?: number | null
    actRecL15?: number | null,
    receivedDate?: number | null,
    bargeCode?: string | null,
    remarks?: string | null
}