import { instance } from "@/services/instance";
import { bunkerHandlingBargePerformanceScheme, bunkerHandlingLossHistoryScheme, bunkerHandlingTransporterRankScheme, bunkerHandlingVesselRankScheme, bunkerPlanListScheme, bunkerSupplyBunkeringPerformanceKpiScheme, bunkerSupplyScheme, bunkerSupplyMonthlyScheme, putBunkerPlanUpdateScheme, putUploadEvidencesScheme, putBunkerPlanUpdateStatusScheme, getBunkerPlanDetailScheme, bunkerPlanListVerifiedScheme, getBunkerPlanTelexInfoScheme } from "./schema";
import { UploadEvidencesDataType } from "@/utils/Types";
export const bunkerService = {

    postBunkerPerformanceKpi: async (startDate: number, endDate: number, portId?: string) => {
        const response = await instance.post(
            'bunker-supply/bunkering-performance',
            {
                method: "POST",
                body: JSON.stringify({
                    port_id: portId ?? "",
                    start_date: startDate,
                    end_date: endDate
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return bunkerSupplyBunkeringPerformanceKpiScheme.parse(response);
    },

    postBunkerSupply: async (vesselCode: string, startDate: number, endDate: number) => {
        const response = await instance.post(
            'bunker-supply',
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
        return bunkerSupplyScheme.parse(response);
    },

    postBunkerSupplyPerformance: async (segmentId: string, vesselTypeId: string, startDate: number, endDate: number) => {
        const response = await instance.post(
            'bunker-supply/performance',
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
        return bunkerSupplyScheme.parse(response);
    },

    postBunkerSupplyDaily: async (vesselCode: string, startDate: number, endDate: number, isForecast?: boolean) => {
        const response = await instance.post(
            'bunker-supply/daily',
            {
                method: "POST",
                body: JSON.stringify({
                    vessel_code: vesselCode,
                    is_forecast: isForecast ?? false,
                    start_date: startDate,
                    end_date: endDate
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return bunkerSupplyMonthlyScheme.parse(response);
    },

    postBunkerSupplyForecast: async (vesselCode: string, startDate: number, endDate: number) => {
        const response = await instance.post(
            'bunker-supply/vessel/forecast',
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
        return bunkerSupplyScheme.parse(response);
    },

    postBunkerSupplyPort: async (portId: string, startDate: number, endDate: number) => {
        const response = await instance.post(
            'bunker-supply/port',
            {
                method: "POST",
                body: JSON.stringify({
                    port_id: portId,
                    start_date: startDate,
                    end_date: endDate
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return bunkerSupplyScheme.parse(response);
    },

    postBunkerSupplyPortForecast: async (portId: string, startDate: number, endDate: number) => {
        const response = await instance.post(
            'bunker-supply/port/forecast',
            {
                method: "POST",
                body: JSON.stringify({
                    vessel_code: portId,
                    start_date: startDate,
                    end_date: endDate
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return bunkerSupplyScheme.parse(response);
    },

    postBunkerHandlingTransporterRank: async (portId: string, startDate: number, endDate: number) => {
        const response = await instance.post(
            'bunker-handling/transporter-rank',
            {
                method: "POST",
                body: JSON.stringify({
                    port_id: portId,
                    start_date: startDate,
                    end_date: endDate
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return bunkerHandlingTransporterRankScheme.parse(response);
    },

    postBunkerHandlingVesselRank: async (portId: string, startDate: number, endDate: number) => {
        const response = await instance.post(
            'bunker-handling/vessel-rank',
            {
                method: "POST",
                body: JSON.stringify({
                    port_id: portId,
                    start_date: startDate,
                    end_date: endDate
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return bunkerHandlingVesselRankScheme.parse(response);
    },

    postBunkerHandlingLossHistory: async (portId: string, bargeCode: string, vesselCode: string, startDate: number, endDate: number, pageNumber: number, pageSize: number) => {
        const response = await instance.post(
            'bunker-handling/loss-history',
            {
                method: "POST",
                body: JSON.stringify({
                    port_id: portId,
                    barge_code: bargeCode,
                    vessel_code: vesselCode,
                    start_date: startDate,
                    end_date: endDate,
                    page_number: pageNumber,
                    page_size: pageSize
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return bunkerHandlingLossHistoryScheme.parse(response);
    },

    postBunkerHandlingBargePerformance: async (portId: string, startDate: number, endDate: number) => {
        const response = await instance.post(
            'bunker-handling/barge-performance',
            {
                method: "POST",
                body: JSON.stringify({
                    port_id: portId,
                    start_date: startDate,
                    end_date: endDate
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return bunkerHandlingBargePerformanceScheme.parse(response);
    },

    postBunkerPlanList: async (portId: string, status: string, startDate: number, endDate: number, pageNumber: number, pageSize: number) => {
        const response = await instance.post(
            'bunker-plan/list',
            {
                method: "POST",
                body: JSON.stringify({
                    port_id: portId,
                    status: status,
                    start_date: startDate,
                    end_date: endDate,
                    page_number: pageNumber,
                    page_size: pageSize
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return bunkerPlanListScheme.parse(response);
    },

    postBunkerPlanVerifiedList: async (portId: string, vesselCode: string, startDate: number, endDate: number, pageNumber: number, pageSize: number) => {
        const response = await instance.post(
            'bunker-plan/verified/list',
            {
                method: "POST",
                body: JSON.stringify({
                    port_id: portId,
                    vessel_code: vesselCode,
                    start_date: startDate,
                    end_date: endDate,
                    page_number: pageNumber,
                    page_size: pageSize
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return bunkerPlanListVerifiedScheme.parse(response);
    },

    getBunkerPlanReportDownload: async (portId?: string, status?: string, startDate?: number, endDate?: number) => {
        const response = await instance.get(`bunker-plan/report/download?${portId ? 'PortId='.concat(portId).concat('&') : ""}${status ? 'Status='.concat(status).concat('&') : ""}${startDate ? 'StartDate='.concat(String(startDate)).concat('&') : ""}${endDate ? 'EndDate='.concat(String(endDate)).concat('&') : ""}`).blob();
        return URL.createObjectURL(response);
    },

    getBunkerPlanVerifiedReportDownload: async (portId?: string, vesselCode?: string, startDate?: number, endDate?: number) => {
        const response = await instance.get(`bunker-plan/report/download-verified?${portId ? 'PortId='.concat(portId).concat('&') : ""}${vesselCode ? 'VesselCode='.concat(vesselCode).concat('&') : ""}${startDate ? 'StartDate='.concat(String(startDate)).concat('&') : ""}${endDate ? 'EndDate='.concat(String(endDate)).concat('&') : ""}`).blob();
        return URL.createObjectURL(response);
    },

    putBunkerPlanUpdate: async (simulationId: string, bunkerSchema: string, status: string, bunkerDate: number, mfo?: number, hfo?: number, lfo?: number, mdf?: number, mgo?: number, hsd?: number, bl_obs?: number, bl_15?: number, ar_obs?: number, ar_15?: number, sfbl_obs?: number, sfbl_15?: number, sfal_obs?: number, sfal_15?: number, sfbd_obs?: number, sfbd_15?: number, sfad_obs?: number,sfad_15?: number, remark?: string, received_date?: number, id?: string, barge_code?: string) => {
        const response = await instance.put(
            'bunker-plan/update',
            {
                body: JSON.stringify({
                    value: {
                        id: id,
                        simulation_id: simulationId,
                        bunker_schema: bunkerSchema,
                        status: status,
                        bunker_date: bunkerDate,
                        mfo: mfo,
                        hfo: hfo,
                        lfo: lfo,
                        mdf: mdf,
                        mgo: mgo,
                        hsd: hsd,
                        bl_obs: bl_obs,
                        bl_15: bl_15,
                        ar_obs: ar_obs,
                        ar_15: ar_15,
                        sfbl_obs: sfbl_obs,
                        sfbl_15: sfbl_15,
                        sfal_obs: sfal_obs,
                        sfal_15: sfal_15,
                        sfbd_obs: sfbd_obs,
                        sfbd_15: sfbd_15,
                        sfad_obs: sfad_obs,
                        sfad_15: sfad_15,
                        barge_code: barge_code,
                        received_date: received_date,
                        remark: remark
                    }
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return putBunkerPlanUpdateScheme.parse(response);
    },

    putUploadEvidences: async (files: UploadEvidencesDataType[]) => {
        const evidenceParams = files.map(file => {
            const jsonString = JSON.stringify({
                simulation_id: file.simulationId,
                file_name: file.fileName,
                is_updated: file.isUpdated,
                is_deleted: file.isDeleted,
            });
            const encodedData = encodeURIComponent(jsonString);
            return `evidences=${encodedData}`;
        });
        const queryString = evidenceParams.join('&');
        const formData = new FormData();
        files.forEach(item => {
            formData.append('files', item.files, item.files.name);
        });
        const response = await instance.put(
            `bunker-plan/evidence/upload?${queryString}`,
            {
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }
        ).json();
        return putUploadEvidencesScheme.parse(response);
    },

    putBunkerPlanUpdateStatus: async (simulationId: string, status: string) => {
        const response = await instance.put(
            'bunker-plan/update-status',
            {
                body: JSON.stringify({
                    simulation_id: simulationId,
                    status: status
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return putBunkerPlanUpdateStatusScheme.parse(response);
    },

    getBunkerPlanDetail: async (simulationId: string) => {
        const response = await instance.get(`bunker-plan/detail?SimulationId=${simulationId}`).json();
        return getBunkerPlanDetailScheme.parse(response);
    },

    getBunkerPlanTelex: async (simulationId: string) => {
        const response = await instance.get(`bunker-plan/telex?SimulationId=${simulationId}`).blob();
        return URL.createObjectURL(response);
    },
}