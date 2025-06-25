import { instance } from "@/services/instance"
import { portBoundaryScheme, portDetailScheme, portIncomingVesselsScheme, portLeaderboardKpiScheme, portListScheme, portSearchScheme } from "./schema";

export const portService = {
    fetchBoundary: async () => {
        const response = await instance.post(
            'port/search-in-boundary',
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
        return portBoundaryScheme.parse(response);
    },

    postPortLeaderboardKpi: async (isBestFirst: boolean, pageNumber: number, pageSize: number, startDate: number, endDate: number) => {
        const response = await instance.post(
            'port/leaderboard',
            {
                method: "POST",
                body: JSON.stringify({
                    is_best_first: isBestFirst,
                    page_number: pageNumber,
                    page_size: pageSize,
                    start_date: startDate,
                    end_date: endDate
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return portLeaderboardKpiScheme.parse(response);
    },

    postPortDetailPerformance: async (portId: string) => {
        const response = await instance.post(
            'port/detail',
            {
                method: "POST",
                body: JSON.stringify({
                    port_id: portId,
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return portDetailScheme.parse(response);
    },

    postPortIncomingVessels: async (portId: string, status?: string) => {
        const response = await instance.post(
            'port/incoming-vessel',
            {
                method: "POST",
                body: JSON.stringify({
                    port_id: portId,
                    status: status ?? []
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).json();
        return portIncomingVesselsScheme.parse(response);
    },

    fetchPortSearch: async (keyword: string, page: number, size: number) => {
        const response = await instance.get(`port/search?Q=${keyword}&PageNumber=${page}&PageSize=${size}`).json();
        return portSearchScheme.parse(response);
    },

    fetchPortAll: async (isBunkeringOnly?: boolean) => {
        const response = await instance.get(`port/search/all${isBunkeringOnly ? '?isBunkeringOnly='.concat(String(isBunkeringOnly)) : ''}`).json();
        return portListScheme.parse(response);
    }
}