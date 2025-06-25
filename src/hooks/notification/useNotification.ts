import { NotificationQueryKey } from "@/utils/enums/NotificationEnum";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { notificationService } from "./notificationService";

const useAllNotification = (category?: string) =>
    useQuery({
        queryKey: [NotificationQueryKey.QUERY_ALL_NOTIFICATION, category],
        queryFn: () => notificationService.getAllNotification(category),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: 1
    });

export const useNotification = () => {
    // const client = useQueryClient();

    // const invalidateQuery = (bunkerQueryKey: BunkerQueryKey) =>
    //     client.invalidateQueries({
    //         queryKey: (bunkerQueryKey as unknown) as readonly unknown[],
    //     });

    return {
        // invalidateQuery,
        useAllNotification
    }
}