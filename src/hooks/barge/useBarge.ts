import { BargeQueryKey } from "@/utils/enums/BargeEnum";
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { bargeService } from "./bargeService";

const useBargeSearchAllQuery = () =>
    useQuery({
        queryKey: [BargeQueryKey.QUERY_BARGE_SEARCH_ALL],
        queryFn: () => bargeService.fetchBargeAll(),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: 1
    });


export const useBarge = () => {
    // const client = useQueryClient();

    // const invalidateQuery = (bunkerQueryKey: BunkerQueryKey) =>
    //     client.invalidateQueries({
    //         queryKey: (bunkerQueryKey as unknown) as readonly unknown[],
    //     });

    return {
        // invalidateQuery,
        useBargeSearchAllQuery
    }
}