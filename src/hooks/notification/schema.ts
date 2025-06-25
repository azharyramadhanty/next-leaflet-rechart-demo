import { z } from "zod";

export const generalNotificationScheme = z.object({
    data: z.object({
        total: z.number(),
        unread: z.number(),
        notifications: z.array(z.object({
            date: z.coerce.date(),
            notifications: z.array(z.object({
                id: z.string(),
                category: z.string(),
                message: z.string(),
                mark_as_read: z.boolean(),
                title: z.string(),
                created_time: z.coerce.date(),
                updated_time: z.coerce.date()
            }))}))
    }),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})