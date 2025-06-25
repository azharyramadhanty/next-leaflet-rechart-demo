import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { portService } from "./portService"
import { PortQueryKey } from "@/utils/enums/PortEnum"

const usePortBoundaryQuery = () =>
    useMutation({
        mutationKey: [PortQueryKey.QUERY_SEARCH_BOUNDARY],
        mutationFn: () => portService.fetchBoundary(),
        // onSettled: () => console.log("success post boundary"),
    });

const usePortLeaderboardQuery = (startDate: number, endDate: number, pageNumber?: number, pageSize?: number, isBestFirst?: boolean) =>
    useMutation({
        mutationKey: [PortQueryKey.QUERY_LEADERBOARD_KPI, isBestFirst, pageNumber, pageSize, startDate, endDate],
        mutationFn: () => portService.postPortLeaderboardKpi(isBestFirst ?? true, pageNumber ?? 1, pageSize ?? 5, startDate, endDate),
        // onSettled: () => console.log("post portLeaderboardKpi success"),
    });

const usePortDetailPerformanceQuery = (portId: string) =>
    useMutation({
        mutationKey: [PortQueryKey.QUERY_DETAIL_PERFORMANCE, portId],
        mutationFn: () => portService.postPortDetailPerformance(portId),
        // onSettled: () => console.log("post portDetailPerformance success"),
    });

const usePortIncomingVessels = (portId: string) =>
    useMutation({
        mutationKey: [PortQueryKey.QUERY_INCOMING_VESSEL_TO_PORT, portId],
        mutationFn: () => portService.postPortIncomingVessels(portId),
        // onSettled: () => console.log("post portIncomingVessels success"),
    });

const usePortSearchQuery = () =>
    useQuery({
        queryKey: [PortQueryKey.QUERY_PORT_SEARCH_KEYWORD],
        queryFn: () => portService.fetchPortSearch('A', 1, 100)
    });

const usePortSearchAllQuery = (isBunkeringOnly?: boolean) =>
    useQuery({
        queryKey: [PortQueryKey.QUERY_PORT_SEARCH_ALL, isBunkeringOnly],
        queryFn: () => portService.fetchPortAll(isBunkeringOnly),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: 1
    });

export const usePort = () => {
    // const client = useQueryClient();

    // const invalidateQuery = (portQueryKey: PortQueryKey) =>
    //     client.invalidateQueries({
    //         queryKey: (portQueryKey as unknown) as readonly unknown[],
    //     })

    return {
        // invalidateQuery,
        usePortBoundaryQuery,
        usePortSearchQuery,
        usePortLeaderboardQuery,
        usePortDetailPerformanceQuery,
        usePortIncomingVessels,
        usePortSearchAllQuery
    }
}
