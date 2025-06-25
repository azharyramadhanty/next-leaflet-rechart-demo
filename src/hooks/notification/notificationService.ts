import { instance } from "@/services/instance";
import { generalNotificationScheme } from "./schema";

export const notificationService = {
    getAllNotification: async (category?: string) => {
        const response = await instance.get(`notification/all-notification${category ? '?Category='.concat(category) : ""}`).json();
        return generalNotificationScheme.parse(response);
    },
}