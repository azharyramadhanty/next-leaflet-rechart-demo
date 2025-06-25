import { instance } from "@/services/instance"
import { bargeListScheme } from "./schema";

export const bargeService = {
    fetchBargeAll: async () => {
        const response = await instance.get(`barge/search/all`).json();
        return bargeListScheme.parse(response);
    }
}