import { BunkerQueryKey } from "@/utils/enums/BunkerEnum";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { bunkerService } from "./bunkerService";
import { BunkerPlanListVerifyDataType, UploadEvidencesDataType } from "@/utils/Types";

const useBunkeringPerformanceQuery = (startDate: number, endDate: number, portId?: string) =>
    useMutation({
        mutationKey: [BunkerQueryKey.BUNKERING_PERFORMANCE, startDate, endDate, portId],
        mutationFn: () => bunkerService.postBunkerPerformanceKpi(startDate, endDate, portId),
        // onSettled: () => console.log("post BunkerPerformance API success")
    });

const useBunkerSupplyQuery = (vesselCode: string, startDate: number, endDate: number) =>
    useMutation({
        mutationKey: [BunkerQueryKey.BUNKER_SUPPLY, vesselCode, startDate, endDate],
        mutationFn: () => bunkerService.postBunkerSupply(vesselCode, startDate, endDate),
        // onSettled: () => console.log("post BunkerSupply API success")
    });
const useBunkerSupplyDailyQuery = (vesselCode: string, startDate: number, endDate: number, isForecast?: boolean) =>
    useMutation({
        mutationKey: [BunkerQueryKey.BUNKER_SUPPLY_DAILY, vesselCode, startDate, endDate],
        mutationFn: () => bunkerService.postBunkerSupplyDaily(vesselCode, startDate, endDate, isForecast),
        // onSettled: () => console.log("post BunkerSupplyDaily API success")
    });
const useBunkerSupplyForecastQuery = (vesselCode: string, startDate: number, endDate: number) =>
    useMutation({
        mutationKey: [BunkerQueryKey.BUNKER_SUPPLY_FORECAST, vesselCode, startDate, endDate],
        mutationFn: () => bunkerService.postBunkerSupplyForecast(vesselCode, startDate, endDate),
        // onSettled: () => console.log("post BunkerSupplyDailyForecast API success")
    });
const useBunkerSupplyPortQuery = (portId: string, startDate: number, endDate: number) =>
    useMutation({
        mutationKey: [BunkerQueryKey.BUNKER_SUPPLY_PORT, portId, startDate, endDate],
        mutationFn: () => bunkerService.postBunkerSupplyPort(portId, startDate, endDate),
        // onSettled: () => console.log("post BunkerSupply Port API success")
    });
const useBunkerSupplyPortForecastQuery = (portId: string, startDate: number, endDate: number) =>
    useMutation({
        mutationKey: [BunkerQueryKey.BUNKER_SUPPLY_PORT_FORECAST, portId, startDate, endDate],
        mutationFn: () => bunkerService.postBunkerSupplyPortForecast(portId, startDate, endDate),
        // onSettled: () => console.log("post BunkerSupply Port Forecast API success")
    });
const useBunkerSupplyPerformanceQuery = (startDate: number, endDate: number, segmentId?: string, vesselTypeId?: string) =>
    useMutation({
        mutationKey: [BunkerQueryKey.BUNKER_SUPPLY_PERFORMANCE, segmentId, vesselTypeId, startDate, endDate],
        mutationFn: () => bunkerService.postBunkerSupplyPerformance(segmentId ?? "", vesselTypeId ?? "", startDate, endDate),
        // onSettled: () => console.log("post BunkerSupplyPerformance API success")
    });
const useBunkerHandlingTransporterRankQuery = (portId: string, startDate: number, endDate: number) =>
    useMutation({
        mutationKey: [BunkerQueryKey.BUNKER_HANDLING_TRANSPORTER_RANK, portId, startDate, endDate],
        mutationFn: () => bunkerService.postBunkerHandlingTransporterRank(portId, startDate, endDate),
        // onSettled: () => console.log("post BunkerHandling Transporter Rank API success")
    });
const useBunkerHandlingVesselRankQuery = (portId: string, startDate: number, endDate: number) =>
    useMutation({
        mutationKey: [BunkerQueryKey.BUNKER_HANDLING_VESSEL_RANK, portId, startDate, endDate],
        mutationFn: () => bunkerService.postBunkerHandlingVesselRank(portId, startDate, endDate),
        // onSettled: () => console.log("post BunkerHandling Vessel Rank API success")
    });
const useBunkerHandlingLossHistoryQuery = (portId: string, bargeCode: string, vesselCode: string, startDate: number, endDate: number, pageNumber?: number, pageSize?: number) =>
    useMutation({
        mutationKey: [BunkerQueryKey.BUNKER_HANDLING_LOSS_HISTORY, portId, bargeCode, vesselCode, startDate, endDate, pageNumber, pageSize],
        mutationFn: () => bunkerService.postBunkerHandlingLossHistory(portId, bargeCode, vesselCode, startDate, endDate, pageNumber ?? 1, pageSize ?? 5),
        // onSettled: () => console.log("post BunkerHandling Loss History API success")
    });
const useBunkerHandlingBargePerformanceQuery = (portId: string, startDate: number, endDate: number) =>
    useMutation({
        mutationKey: [BunkerQueryKey.BUNKER_HANDLING_BARGE_PERFORMANCE, portId, startDate, endDate],
        mutationFn: () => bunkerService.postBunkerHandlingBargePerformance(portId, startDate, endDate),
        // onSettled: () => console.log("post BunkerSupply Barge Performance API success")
    });
const useBunkerPlanListQuery = ( startDate: number, endDate: number, portId?: string, status?: string, pageNumber?: number, pageSize?: number) =>
    useMutation({
        mutationKey: [BunkerQueryKey.BUNKER_PLAN_LIST, portId, status, startDate, endDate, pageNumber, pageSize],
        mutationFn: () => bunkerService.postBunkerPlanList(portId ?? "", status ?? "", startDate, endDate, pageNumber ?? 1, pageSize ?? 5),
        // onSettled: () => console.log("post BunkerSupply Barge Performance API success")
    });
const useBunkerPlanListVerifiedQuery = ( startDate: number, endDate: number, portId?: string, vesselCode?: string, pageNumber?: number, pageSize?: number) =>
    useMutation({
        mutationKey: [BunkerQueryKey.BUNKER_PLAN_VERIFIED_LIST, portId, vesselCode, startDate, endDate, pageNumber, pageSize],
        mutationFn: () => bunkerService.postBunkerPlanVerifiedList(portId ?? "", vesselCode ?? "", startDate, endDate, pageNumber ?? 1, pageSize ?? 5),
        // onSettled: () => console.log("post BunkerSupply Barge Performance API success")
    });
const useBunkerPlanExportQuery = (portId?: string, status?: string, startDate?: number, endDate?: number) =>
    useMutation({
        mutationKey: [BunkerQueryKey.BUNKER_PLAN_LIST_EXPORT, portId, status, startDate, endDate],
        mutationFn: () => bunkerService.getBunkerPlanReportDownload(portId, status, startDate, endDate),
        // onSettled: () => console.log("post BunkerSupply Barge Performance API success")
    });
const useBunkerPlanUpdateQuery = (
        simulationId?: string,
        bunkerSchema?: string,
        status?: string,
        bunkerDate?: number,
        mfo?: number, 
        hfo?: number,
        lfo?: number,
        mdf?: number, 
        mgo?: number, 
        hsd?: number,
        bl_obs?: number,
        bl_15?: number,
        ar_obs?: number,
        ar_15?: number, 
        sfbl_obs?: number,
        sfbl_15?: number, 
        sfal_obs?: number,
        sfal_15?: number, 
        sfbd_obs?: number,
        sfbd_15?: number, 
        sfad_obs?: number,
        sfad_15?: number,
        received_date?: number, 
        remark?: string,
        id?: string,
        barge_code?: string
    ) => {
        return useMutation({
            mutationKey: [BunkerQueryKey.BUNKER_PLAN_SCHEDULE_EDIT, simulationId, bunkerSchema, status, bunkerDate, mfo, hfo, lfo, mdf, mgo, hsd, bl_obs, bl_15, ar_obs, ar_15, sfbl_obs, sfbl_15, sfal_obs, sfal_15, sfbd_obs,sfbd_15, sfad_obs, sfad_15, received_date, remark, id, barge_code],
            mutationFn: async () => bunkerService.putBunkerPlanUpdate(simulationId, bunkerSchema, status, bunkerDate, mfo, hfo, lfo, mdf, mgo, hsd, bl_obs, bl_15, ar_obs, ar_15, sfbl_obs, sfbl_15, sfal_obs, sfal_15, sfbd_obs,sfbd_15, sfad_obs, sfad_15, remark, received_date, id, barge_code),
            // onSettled: () => console.log("post vesselToBunker Get Simulation Result success")
        });
    }
    
const useBunkerPlanUpdateBatchQuery = (data: BunkerPlanListVerifyDataType[]) => {
    return useMutation({
        mutationKey: [BunkerQueryKey.BUNKER_PLAN_SCHEDULE_BATCH_EDIT, data],
        mutationFn: async () => {
            const results = [];
            for (const i of data) {
                const result = await bunkerService.putBunkerPlanUpdate(i.simulationId, i.bunkerSchema, i.status, i.bunkerDate, i.mfo, i.hfo, i.lfo, i.mdf, i.mgo, i.hsd, i.billOfLading, i.bolL15, i.actualReceipt, i.actRecL15, i.sfblTransporter, i.sfblL15, i.sfalTransporter, i.sfalL15, i.sfbdTransporter, i.sfbdL15, i.sfadTransporter, i.sfadL15, i.remarks, i.receivedDate, i.id, i.bargeCode);
                results.push(result);
            }
            return results;
            // return Promise.all(data.map(i => bunkerService.putBunkerPlanUpdate(i.simulationId, i.bunkerSchema, i.status, i.bunkerDate, i.mfo, i.hfo, i.lfo, i.mdf, i.mgo, i.hsd, i.billOfLading, i.bolL15, i.actualReceipt, i.actRecL15, i.sfblTransporter, i.sfblL15, i.sfalTransporter, i.sfalL15, i.sfbdTransporter, i.sfbdL15, i.sfadTransporter, i.sfadL15, i.remarks, i.receivedDate, i.id, i.bargeCode))) 
        },
        // onSettled: () => console.log("post vesselToBunker Get Simulation Result success")
    });
}

const useUploadEvidencesQuery = (data: UploadEvidencesDataType[]) => {
    return useMutation({
        mutationKey: [BunkerQueryKey.UPLOAD_EVIDENCES_BATCH, data],
        // mutationFn: async () => {
        //     return Promise.all(data.map(i => bunkerService.putUploadEvidences(i.simulationId, i.fileName, i.isUpdated, i.isDeleted, i.files)))
        // },
        mutationFn: async () => bunkerService.putUploadEvidences(data),
        // onSettled: () => console.log("post vesselToBunker Get Simulation Result success")
    });
}

const useBunkerPlanUpdateStatusQuery = (simulationId?: string, status?: string) => {
    return useMutation({
        mutationKey: [BunkerQueryKey.BUNKER_PLAN_STATUS_EDIT, simulationId, status],
        mutationFn: async () => bunkerService.putBunkerPlanUpdateStatus(simulationId, status),
        // onSettled: () => console.log("post vesselToBunker Get Simulation Result success")
    });
}

const useBunkerPlanDetailQuery = (simulationId?: string) => {
    return useMutation({
        mutationKey: [BunkerQueryKey.BUNKER_PLAN_DETAIL, simulationId],
        mutationFn: async () => bunkerService.getBunkerPlanDetail(simulationId),
        // onSettled: () => console.log("post vesselToBunker Get Simulation Result success")
    });
}

const useBunkerPlanTelexQuery = (simulationId?: string) => {
    return useMutation({
        mutationKey: [BunkerQueryKey.BUNKER_PLAN_TELEX_INFO, simulationId],
        mutationFn: async () => bunkerService.getBunkerPlanTelex(simulationId),
        // onSettled: () => console.log("post vesselToBunker Get Simulation Result success")
    });
}

const useBunkerPlanVerifiedExportQuery = (portId?: string, vesselCode?: string, startDate?: number, endDate?: number) =>
    useMutation({
        mutationKey: [BunkerQueryKey.BUNKER_PLAN_LIST_VERIFIED_EXPORT, portId, vesselCode, startDate, endDate],
        mutationFn: () => bunkerService.getBunkerPlanVerifiedReportDownload(portId, vesselCode, startDate, endDate),
        // onSettled: () => console.log("post BunkerSupply Barge Performance API success")
    });

export const useBunker = () => {
    // const client = useQueryClient();

    // const invalidateQuery = (bunkerQueryKey: BunkerQueryKey) =>
    //     client.invalidateQueries({
    //         queryKey: (bunkerQueryKey as unknown) as readonly unknown[],
    //     });

    return {
        // invalidateQuery,
        useBunkeringPerformanceQuery,
        useBunkerSupplyPerformanceQuery,
        useBunkerSupplyQuery,
        useBunkerSupplyDailyQuery,
        useBunkerSupplyForecastQuery,
        useBunkerSupplyPortQuery,
        useBunkerSupplyPortForecastQuery,
        useBunkerHandlingTransporterRankQuery,
        useBunkerHandlingVesselRankQuery,
        useBunkerHandlingLossHistoryQuery,
        useBunkerHandlingBargePerformanceQuery,
        useBunkerPlanListQuery,
        useBunkerPlanListVerifiedQuery,
        useBunkerPlanExportQuery,
        useBunkerPlanUpdateQuery,
        useBunkerPlanUpdateBatchQuery,
        useUploadEvidencesQuery,
        useBunkerPlanUpdateStatusQuery,
        useBunkerPlanDetailQuery,
        useBunkerPlanVerifiedExportQuery,
        useBunkerPlanTelexQuery
    }
}