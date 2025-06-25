import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { vesselService } from "./vesselService"
import { VesselQueryKey } from "@/utils/enums/VesselEnum";

const useVesselBoundaryQuery = () =>
    useMutation({
        mutationKey: [VesselQueryKey.QUERY_SEARCH_BOUNDARY],
        mutationFn: () => vesselService.postBoundary(),
        // onSettled: () => console.log("post vesselBoundary success"),
    });

const useVesselPerformKpiQry = (startDate: number, endDate: number, segmentId?: string, vesselTypeId?: string) =>
    useMutation({
        mutationKey: [VesselQueryKey.QUERY_PERFORMANCE_KPI, segmentId, vesselTypeId, startDate, endDate],
        mutationFn: () => vesselService.postVesselPerformanceKpi(segmentId ?? "", vesselTypeId ?? "", startDate, endDate),
        // onSettled: () => console.log("post vesselPerformanceKpi success"),
    });

const useVesselConsPerformKpiQry = (startDate: number, endDate: number, segmentId?: string, vesselTypeId?: string) =>
    useMutation({
        mutationKey: [VesselQueryKey.QUERY_CONS_PERFORMANCE_KPI, segmentId, vesselTypeId, startDate, endDate],
        mutationFn: () => vesselService.postVesselConsPerformanceKpi(segmentId ?? "", vesselTypeId ?? "", startDate, endDate),
        // onSettled: () => console.log("post vesselConsPerformanceKpi success"),
    });

const useVesselLeaderboardQuery = (startDate: number, endDate: number, segmentId?: string, vesselTypeId?: string, pageNumber?: number, pageSize?: number, isBestFirst?: boolean) =>
    useMutation({
        mutationKey: [VesselQueryKey.QUERY_LEADERBOARD_KPI, segmentId, vesselTypeId, pageNumber, pageSize, isBestFirst, startDate, endDate],
        mutationFn: () => vesselService.postVesselLeaderboardKpi(segmentId ?? "", vesselTypeId ?? "", pageNumber ?? 1, pageSize ?? 5, isBestFirst ?? true, startDate, endDate),
        // onSettled: () => console.log("post vesselLeaderboardKpi success"),
    });

const useVesselSegmentQuery = () =>
    useQuery({
        queryKey: [VesselQueryKey.QUERY_SEGMENT],
        queryFn: () => vesselService.getVesselSegmentList(),
        refetchOnWindowFocus: false,
    });

const useVesselTypeQuery = () =>
    useQuery({
        queryKey: [VesselQueryKey.QUERY_TYPE],
        queryFn: () => vesselService.getVesselTypeList(),
        refetchOnWindowFocus: false,
    });

const useVoyageListQuery = (page?: number, size?: number, vesselCode?: string, voyageNo?: string) =>
    useMutation({
        mutationKey: [VesselQueryKey.QUERY_SEARCH_VOYAGE, vesselCode, voyageNo, page, size],
        mutationFn: () => vesselService.getVoyageList(page ?? 1, size ?? 100, vesselCode),
        // onSettled: () => console.log("get voyageList success"),
    });

const useVoyageAllListQuery = (vesselCode: string, startDate: number, endDate: number, voyageNo?: string) =>
    useMutation({
        mutationKey: [VesselQueryKey.QUERY_SEARCH_ALL_VOYAGE, vesselCode, startDate, endDate, voyageNo],
        mutationFn: () => vesselService.getVoyageAllList(vesselCode, startDate, endDate, voyageNo ?? ""),
        // onSettled: () => console.log("get voyageListAll success"),
    });

const useVesselDetailPerformanceQuery = (vesselCode?: string) =>
    useMutation({
        mutationKey: [VesselQueryKey.QUERY_DETAIL_PERFORMANCE, vesselCode],
        mutationFn: () => vesselService.getVesselDetailPerformance(vesselCode),
        // onSettled: () => console.log("get vesselDetailPerformance success"),
    });

const useVesselLogQuery = (vesselCode: string, startDate: number, endDate: number) =>
    useMutation({
        mutationKey: [VesselQueryKey.QUERY_LOG, vesselCode, startDate, endDate],
        mutationFn: () => vesselService.postVesselLog(vesselCode, startDate, endDate),
        // onSettled: () => console.log("post vesselLog success"),
    });

const useVesselPerformanceMetricAllQuery = (vesselCode: string, startDate: number, endDate: number) =>
    useMutation({
        mutationKey: [VesselQueryKey.QUERY_PERFORMANCE_METRIC, vesselCode, startDate, endDate],
        mutationFn: () => vesselService.postVesselPerformanceMetricAll(vesselCode, startDate, endDate),
        // onSettled: () => console.log("post vesselPerformanceMetric success"),
    });

const useLatestVoyagesQuery = (vesselCode: string, startDate: number, endDate: number) =>
    useMutation({
        mutationKey: [VesselQueryKey.QUERY_LATEST_VOYAGES, vesselCode, startDate, endDate],
        mutationFn: () => vesselService.postLatestVoyages(vesselCode, startDate, endDate),
        // onSettled: () => console.log("post latestVoyages success"),
    });

const useVoyageDetailQuery = (voyageId: string) =>
    useMutation({
        mutationKey: [VesselQueryKey.QUERY_VOYAGE_DETAIL, voyageId],
        mutationFn: () => vesselService.getVoyageDetail(voyageId),
        // onSettled: () => console.log("get VoyageDetail success"),
    });

const useVoyageDetailActivityQuery = (voyageId: string) =>
    useMutation({
        mutationKey: [VesselQueryKey.QUERY_VOYAGE_DETAIL_ACTIVITY, voyageId],
        mutationFn: () => vesselService.getVoyageDetailActivity(voyageId),
        // onSettled: () => console.log("get VoyageDetailAcvitivy success"),
    });

const useVoyageDetailOperationalQuery = (voyageId: string) =>
    useMutation({
        mutationKey: [VesselQueryKey.QUERY_VOYAGE_DETAIL_OPERATIONAL, voyageId],
        mutationFn: () => vesselService.getVoyageDetailOperational(voyageId),
        // onSettled: () => console.log("get VoyageDetailOperational success"),
    });

const useVoyageDetailBunkerConsQuery = (voyageId: string) =>
    useMutation({
        mutationKey: [VesselQueryKey.QUERY_VOYAGE_DETAIL_BUNKER_CONS, voyageId],
        mutationFn: () => vesselService.getVoyageDetailBunkerCons(voyageId),
        // onSettled: () => console.log("get VoyageDetailBunkerConsumption success"),
    });

const useFuelConsDeviationQuery = (vesselCode: string, startDate: number, endDate: number) =>
    useMutation({
        mutationKey: [VesselQueryKey.QUERY_FUEL_CONSUMPTION_DEVIATION, vesselCode, startDate, endDate],
        mutationFn: () => vesselService.postVesselFuelConsDeviation(vesselCode, startDate, endDate),
        // onSettled: () => console.log("post fuelConsumptionDeviation success"),
    });

const useVesselToBunkerReportQuery = (status: string, vesselCode?: string, sortCoverageDay?: string, pageNumber?: number, pageSize?: number) =>
    useMutation({
        mutationKey: [VesselQueryKey.QUERY_VESSEL_TO_BUNKER_REPORT, status, vesselCode, sortCoverageDay, pageNumber, pageSize],
        mutationFn: () => vesselService.postVesselToBunkerReport(status, vesselCode ?? "", sortCoverageDay ?? "", pageNumber ?? 1, pageSize ?? 10000),
        // onSettled: () => console.log("post vesselToBunkerReport success"),
    });

const useVesselToBunkerDetailQuery = (vesselCode: string) =>
    useMutation({
        mutationKey: [VesselQueryKey.QUERY_VESSEL_TO_BUNKER_DETAIL, vesselCode],
        mutationFn: () => vesselService.getVesselToBunkerDetail(vesselCode),
        // onSettled: () => console.log("get vesselToBunkerDetail success"),
    });

const useVesselSummaryKpiQuery = (vesselCode: string | string[], startDate: number, endDate: number) => {
    const vesselCodes = Array.isArray(vesselCode) ? vesselCode : [vesselCode]
    return useMutation({
        mutationKey: [VesselQueryKey.QUERY_SUMMARY_KPI, vesselCodes, startDate, endDate],
        mutationFn: async () => {
            if (vesselCodes.length < 1 || !startDate || !endDate) return null
            if (vesselCodes.length === 1) {
                return vesselService.postVesselSummaryKpi(vesselCodes[0], startDate, endDate)
            }
            const results = [];
            for (const vessel of vesselCodes) {
                const result = await vesselService.postVesselSummaryKpi(vessel, startDate, endDate)
                results.push(result);
            }
            return results;
            // return Promise.all(vesselCodes.map((vessel) => vesselService.postVesselSummaryKpi(vessel, startDate, endDate)))
        },
        // onSettled: () => console.log("post vesselSummaryKpi success")
    });
}

const useVesselToBunkerRunSimulationQuery = (vesselCode: string, vesselType: string, vesselName: string, desiredDays: number, desiredDate: number, desiredPort: string) => 
    useMutation({
        mutationKey: [VesselQueryKey.QUERY_VESSEL_TO_BUNKER_RUN_SIMULATION, vesselCode, vesselType, vesselName, desiredDays, desiredDate, desiredPort],
        mutationFn: async () => {
            if ((!vesselCode || vesselCode.length === 0) || (!vesselName || vesselName.length === 0) || (!desiredDays || desiredDays === 0) || (!desiredDate || desiredDate === 0) || (!desiredPort || desiredPort.length === 0)) return null;
            else return vesselService.postVesselToBunkerTriggerSimulation(vesselCode, vesselType ?? "", vesselName, desiredDays, desiredDate, desiredPort);
        },
        // onSettled: () => console.log("post vesselToBunker Run Simulation success")
    });

const useVesselToBunkerSimulationStatusQuery = (runId: number) => 
    useMutation({
        mutationKey: [VesselQueryKey.QUERY_VESSEL_TO_BUNKER_SIMULATION_STATUS, runId],
        mutationFn: async () => vesselService.getVesselToBunkerSimulationCheckStatus(runId),
        // onSettled: () => console.log("post vesselToBunker Check Simulation Status success")
    });

const useVesselToBunkerSimulationResultQuery = (simulationId: string) => 
    useMutation({
        mutationKey: [VesselQueryKey.QUERY_VESSEL_TO_BUNKER_SIMULATION_RESULT, simulationId],
        mutationFn: async () => vesselService.getVesselToBunkerSimulationResult(simulationId),
        // onSettled: () => console.log("post vesselToBunker Get Simulation Result success")
    });

const useVesselToBunkerSimulationSaveQuery = (
    simulationId: string, 
    vesselCode: string, 
    bunkerPortId: string, 
    bunkerDate: number, 
    hfo?: number, 
    mdf?: number, 
    mgo?: number, 
    mfo?: number, 
    lfo?: number, 
    hsd?: number, 
    coverageDay?: number, 
    seaState?: string
) => 
    useMutation({
        mutationKey: [VesselQueryKey.QUERY_VESSEL_TO_BUNKER_SIMULATION_RESULT_SAVE, simulationId, vesselCode, bunkerPortId, bunkerDate, hfo, mdf, mgo, mfo, lfo, hsd, coverageDay, seaState],
        mutationFn: async () => vesselService.putVesselToBunkerSaveSimulation(simulationId, vesselCode, bunkerPortId, bunkerDate, hfo, mdf, mgo, mfo, lfo, hsd, coverageDay, seaState),
        // onSettled: () => console.log("post vesselToBunker Get Simulation Result success")
    });

const useVesselListQuery = (page?: number, size?: number, vesselCode?: string, vesselName?: string) =>
    useQuery({
        queryKey: [VesselQueryKey.QUERY_SEARCH, vesselCode, vesselName, page, size],
        queryFn: () => vesselService.getVesselList(vesselCode, vesselName, page ?? 1, size ?? 100),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: 1
    });

const useVesselAllListQuery = (vesselCode?: string, vesselName?: string) =>
    useQuery({
        queryKey: [VesselQueryKey.QUERY_SEARCH_ALL, vesselCode, vesselName],
        queryFn: () => vesselService.getVesselAllList(vesselCode, vesselName),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: 1
    });

const useVesselDetailQuery = (vesselCode?: string | string[]) => {
    const vesselCodes = Array.isArray(vesselCode) ? vesselCode : [vesselCode]
    return useQuery({
        queryKey: [VesselQueryKey.QUERY_DETAIL, vesselCodes],
        queryFn: async () => {
            if (vesselCodes.length === 1) {
                return vesselService.getVesselDetail(vesselCodes[0])
            }
            const results = [];
            for (const vessel of vesselCodes) {
                const result = await vesselService.getVesselDetail(vessel)
                results.push(result);
            }
            return results;
        },
        staleTime: 2 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: vesselCodes.length > 0
    });
}

const useVesselToBunkerStatusQuery = () =>
    useQuery({
        queryKey: [VesselQueryKey.QUERY_VESSEL_TO_BUNKER_STATUS],
        queryFn: () => vesselService.getVesselToBunkerStatus(),
        refetchOnWindowFocus: false,
    });

const useVesselToBunkerExportQuery = (vesselCode?: string, status?: string) =>
    useMutation({
        mutationKey: [VesselQueryKey.QUERY_VESSEL_TO_BUNKER_DOWNLOAD_REPORT, vesselCode, status],
        mutationFn: () => vesselService.getVesselToBunkerReportDownload(vesselCode, status),
        // onSettled: () => console.log("post BunkerSupply Barge Performance API success")
    });

export const useVessel = () => {
    // const client = useQueryClient();

    // const invalidateQuery = (qryKey: VesselQueryKey) =>
    //     client.invalidateQueries({
    //         queryKey: (qryKey as unknown) as readonly unknown[],
    //     })

    return {
        // invalidateQuery,
        useVesselBoundaryQuery,
        useVesselListQuery,
        useVesselSegmentQuery,
        useVesselTypeQuery,
        useVesselPerformKpiQry,
        useVesselConsPerformKpiQry,
        useVesselLeaderboardQuery,
        useVesselDetailPerformanceQuery,
        useVesselSummaryKpiQuery,
        useVesselPerformanceMetricAllQuery,
        useLatestVoyagesQuery,
        useFuelConsDeviationQuery,
        useVoyageAllListQuery,
        useVoyageListQuery,
        useVesselLogQuery,
        useVoyageDetailQuery,
        useVoyageDetailActivityQuery,
        useVoyageDetailOperationalQuery,
        useVoyageDetailBunkerConsQuery,
        useVesselAllListQuery,
        useVesselDetailQuery,
        useVesselToBunkerReportQuery,
        useVesselToBunkerStatusQuery,
        useVesselToBunkerRunSimulationQuery,
        useVesselToBunkerSimulationStatusQuery,
        useVesselToBunkerSimulationResultQuery,
        useVesselToBunkerSimulationSaveQuery,
        useVesselToBunkerDetailQuery,
        useVesselToBunkerExportQuery
    }
}