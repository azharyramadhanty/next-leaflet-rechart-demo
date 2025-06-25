import { z } from "zod";

export const bargeListScheme = z.object({
    data: z.array(z.object({
        barge_code: z.string(),
        barge_name: z.string(),
    })),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})