import { instance } from "@/services/instance"
import { 
    latestVoyagesScheme,
    vesselConsPerformanceKpiScheme,
    vesselDetailPerformanceScheme,
    vesselFuelConsumptionDeviationScheme,
    vesselListScheme, vesselLogScheme,
    vesselLeaderboardKpiScheme,
    vesselPerformanceKpiScheme,
    vesselsBoundaryScheme,
    vesselSegmentListScheme,
    vesselTypeListScheme,
    vesselPerformanceMetricAllScheme,
    vesselSummaryKpiScheme,
    vesselDetailScheme,
    voyageDetailScheme,
    voyageListScheme,
    vesselAllListScheme,
    voyageDetailActivityScheme,
    voyageDetailOperationalScheme,
    voyageDetailBunkerConsScheme,
    voyageAllListScheme,
    vesselBunkerReportingScheme,
    vesselToBunkerStatusScheme,
    vesselToBunkerTriggerSimulationScheme,
    vesselToBunkerDetailScheme,
    vesselToBunkerSimulationCheckStatusScheme,
    vesselToBunkerSimulationGetResultScheme,
    vesselToBunkerSimulationSaveScheme
} from "./schema";

export const vesselService = {
    postBoundary: async () => {
        const response = await instance.post(
            'vessel/search-in-boundary',
            {
                method: "POST",
                body: JSON.stringify({
                    boundary: {
                        type: "Polygon",
                        coordinates: [
                            [
                                [
                                    95.00370182267727,
                                    5.9074004939534746
                                ],
                                [
                                    95.00370182267727,
                                    -11.03391895915371
                                ],
                                [
                                    140.90602309421882,
                                    -11.03391895915371
                                ],
                                [
                                    140.90602309421882,
                                    5.9074004939534746
                                ],
                                [
                                    95.00370182267727,
                                    5.9074004939534746
                                ]
                            ]
                        ]
                    }
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return vesselsBoundaryScheme.parse(response);
    },

    postVesselPerformanceKpi: async (segmentId: string, vesselTypeId: string, startDate: number, endDate: number) => {
        const response = await instance.post(
            'kpi/vessel-performance',
            {
                method: "POST",
                body: JSON.stringify({
                    segment_id: segmentId,
                    vessel_type_id: vesselTypeId,
                    start_date: startDate,
                    end_date: endDate
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return vesselPerformanceKpiScheme.parse(response);
    },

    postVesselConsPerformanceKpi: async (segmentId: string, vesselTypeId: string, startDate: number, endDate: number) => {
        const response = await instance.post(
            'vessel/cons-performance',
            {
                method: "POST",
                body: JSON.stringify({
                    segment_id: segmentId,
                    vessel_type_id: vesselTypeId,
                    start_date: startDate,
                    end_date: endDate
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return vesselConsPerformanceKpiScheme.parse(response);
    },

    postVesselLeaderboardKpi: async (segmentId: string, vesselTypeId: string, pageNumber: number, pageSize: number, isBestFirst: boolean, startDate: number, endDate: number) => {
        const response = await instance.post(
            'vessel/leaderboard',
            {
                method: "POST",
                body: JSON.stringify({
                    segment_id: segmentId,
                    vessel_type_id: vesselTypeId,
                    page_number: pageNumber,
                    page_size: pageSize,
                    is_best_first: isBestFirst,
                    start_date: startDate,
                    end_date: endDate
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return vesselLeaderboardKpiScheme.parse(response);
    },

    postVesselLog: async (vesselCode: string, startDate: number, endDate: number, status?: string[]) => {
        const response = await instance.post(
            'vessel/log',
            {
                method: "POST",
                body: JSON.stringify({
                    vessel_code: vesselCode,
                    status: status ?? [],
                    start_date: startDate,
                    end_date: endDate
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return vesselLogScheme.parse(response);
    },

    postVesselPerformanceMetricAll: async (vesselCode: string, startDate: number, endDate: number) => {
        const response = await instance.post(
            'kpi/performance-metric',
            {
                method: "POST",
                body: JSON.stringify({
                    vessel_code: vesselCode,
                    start_date: startDate,
                    end_date: endDate
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return vesselPerformanceMetricAllScheme.parse(response);
    },

    postLatestVoyages: async (vesselCode: string, startDate: number, endDate: number, limit?: number, status?: string[]) => {
        const response = await instance.post(
            'voyage/latest-voyages',
            {
                method: "POST",
                body: JSON.stringify({
                    vessel_code: vesselCode,
                    limit: limit ?? 5,
                    status: status ?? [],
                    start_date: startDate,
                    end_date: endDate
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return latestVoyagesScheme.parse(response);
    },

    postVesselFuelConsDeviation: async (vesselCode: string, startDate: number, endDate: number) => {
        const response = await instance.post(
            'kpi/deviation',
            {
                method: "POST",
                body: JSON.stringify({
                    vessel_code: vesselCode,
                    start_date: startDate,
                    end_date: endDate
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return vesselFuelConsumptionDeviationScheme.parse(response);
    },

    postVesselSummaryKpi: async (vesselCode: string, startDate: number, endDate: number) => {
        const response = await instance.post(
            'kpi/summary',
            {
                method: "POST",
                body: JSON.stringify({
                    vessel_code: vesselCode,
                    start_date: startDate,
                    end_date: endDate
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return vesselSummaryKpiScheme.parse(response);
    },

    postVesselToBunkerReport: async (status: string, vesselCode: string, sortCoverageDays: string, pageNumber: number, pageSize: number) => {
        const response = await instance.post(
            'vessel-to-bunker/report',
            {
                method: "POST",
                body: JSON.stringify({
                    status: status ?? "",
                    vessel_code: vesselCode,
                    sort_coverage_days: sortCoverageDays,
                    page_number: pageNumber,
                    page_size: pageSize,
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return vesselBunkerReportingScheme.parse(response);
    },

    postVesselToBunkerTriggerSimulation: async (vesselCode: string, vesselType: string, vesselName: string, desiredDays: number, desiredDate: number, desiredPort: string) => {
        const response = await instance.post(
            'vessel-to-bunker/simulation/run',
            {
                method: "POST",
                body: JSON.stringify({
                    vessel_code: vesselCode,
                    vessel_type: vesselType,
                    vessel_name: vesselName,
                    simulated_sea_coverage_days: desiredDays,
                    simulated_bunker_date: desiredDate,
                    simulated_bunker_port: desiredPort
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return vesselToBunkerTriggerSimulationScheme.parse(response);
    },

    putVesselToBunkerSaveSimulation: async (simulationId: string, vesselCode: string, bunkerPortId: string, bunkerDate: number, hfo?: number, mdf?: number, mgo?: number, mfo?: number, lfo?: number, hsd?: number, coverageDay?: number, seaState?: string) => {
        const response = await instance.put(
            'vessel-to-bunker/simulation/save',
            {
                body: JSON.stringify({
                    simulation_id: simulationId,
                    vessel_code: vesselCode,
                    bunker_port_id: bunkerPortId,
                    bunker_date: bunkerDate,
                    hfo: hfo ?? 0,
                    mdf: mdf ?? 0,
                    mgo: mgo ?? 0,
                    mfo: mfo ?? 0,
                    lfo: lfo ?? 0,
                    hsd: hsd ?? 0,
                    sea_state: seaState ?? "",
                    coverage_days: coverageDay ?? 0
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return vesselToBunkerSimulationSaveScheme.parse(response);
    },

    getVesselSegmentList: async () => {
        const response = await instance.get(`segment/search/all`, { headers: {'X-MENU': 'menu-uuid'} }).json();
        return vesselSegmentListScheme.parse(response);
    },

    getVesselTypeList: async () => {
        const response = await instance.get(`vessel-type/search/all`).json();
        return vesselTypeListScheme.parse(response);
    },

    getVesselDetailPerformance: async (vesselCode: string) => {
        const response = await instance.get(`kpi/performance/${vesselCode}`).json();
        return vesselDetailPerformanceScheme.parse(response);
    },

    getVoyageList: async (page: number, size: number, vesselCode?: string, voyageNo?: string) => {
        const response = await instance.get(`voyage/search?${vesselCode ? 'VesselCode='.concat(vesselCode).concat('&') : ""}PageNumber=${page}&PageSize=${size}`).json();
        return voyageListScheme.parse(response);
    },

    getVoyageAllList: async (vesselCode: string, startDate: number, endDate: number, voyageNo?: string) => {
        const response = await instance.get(`voyage/search/all?VesselCode=${vesselCode}&StartDate=${startDate}&EndDate=${endDate}${voyageNo ? '&VoyageNo='.concat(voyageNo) : ""}`).json();
        return voyageAllListScheme.parse(response);
    },

    getVoyageDetail: async (voyageId: string) => {
        const response = await instance.get(`voyage/${voyageId}`).json();
        return voyageDetailScheme.parse(response);
    },

    getVoyageDetailActivity: async (voyageId: string) => {
        const response = await instance.get(`voyage/${voyageId}/activity`).json();
        return voyageDetailActivityScheme.parse(response);
    },
    getVoyageDetailOperational: async (voyageId: string) => {
        const response = await instance.get(`voyage/${voyageId}/operational`).json();
        return voyageDetailOperationalScheme.parse(response);
    },
    getVoyageDetailBunkerCons: async (voyageId: string) => {
        const response = await instance.get(`voyage/${voyageId}/bunker-consumption`).json();
        return voyageDetailBunkerConsScheme.parse(response);
    },

    getVesselList: async (vesselCode: string, vesselName: string, page: number, size: number) => {
        const response = await instance.get(`vessel/search?${vesselCode ? 'VesselCode='.concat(vesselCode) : ""}${vesselName ? '&VesselName='.concat(vesselName).concat('&') : ""}PageNumber=${page}&PageSize=${size}`).json();
        return vesselListScheme.parse(response);
    },

    getVesselAllList: async (vesselCode: string, vesselName: string) => {
        const response = await instance.get(`vessel/search/all?${vesselCode ? 'VesselCode='.concat(vesselCode).concat('&') : ""}${vesselName ? 'VesselName='.concat(vesselName) : ""}`).json();
        return vesselAllListScheme.parse(response);
    },

    getVesselDetail: async (vesselCode: string) => {
        const response = await instance.get(`vessel/detail/${vesselCode}`).json();
        return vesselDetailScheme.parse(response);
    },

    getVesselToBunkerStatus: async () => {
        const response = await instance.get(`vessel-to-bunker/status/all`).json();
        return vesselToBunkerStatusScheme.parse(response);
    },

    getVesselToBunkerDetail: async (vesselCode: string) => {
        const response = await instance.get(`vessel-to-bunker/detail?VesselCode=${vesselCode}`).json();
        return vesselToBunkerDetailScheme.parse(response);
    },

    getVesselToBunkerSimulationCheckStatus: async (runId: number) => {
        const response = await instance.get(`vessel-to-bunker/simulation/check-status?RunId=${runId}`).json();
        return vesselToBunkerSimulationCheckStatusScheme.parse(response);
    },

    getVesselToBunkerSimulationResult: async (simulationId: string) => {
        const response = await instance.get(`vessel-to-bunker/simulation/get-result?SimulationId=${simulationId}`).json();
        return vesselToBunkerSimulationGetResultScheme.parse(response);
    },

    getVesselToBunkerReportDownload: async (vesselCode?: string, status?: string) => {
        const response = await instance.get(`vessel-to-bunker/report/download?${vesselCode ? 'VesselCode='.concat(vesselCode) : ""}${status ? '&Status='.concat(status) : ""}`).blob();
        return URL.createObjectURL(response);
    },
}