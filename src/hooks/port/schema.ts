import { z } from 'zod';

export const portBoundaryScheme = z.object({
    data: z.array(z.object({
        port_id: z.string(),
        port_name: z.string(),
        location: z.object({
            type: z.string(),
            coordinates: z.array(z.number())
        }),
        is_bunkering: z.boolean(),
    })),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const portSearchScheme = z.object({
    page: z.number(),
    limit: z.number(),
    total_page: z.number(),
    total: z.number(),
    data: z.array(z.object({
        port_id: z.string(),
        port_name: z.string(),
    })),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const portListScheme = z.object({
    data: z.array(z.object({
        port_id: z.string(),
        port_name: z.string(),
    })),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const portLeaderboardKpiScheme = z.object({
    page: z.number(),
    limit: z.number(),
    total_page: z.number(),
    data: z.array(z.object({
        rank: z.number(),
        port_id: z.string(),
        port_name: z.string(),
        discrepancy: z.number(),
    })),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const portDetailScheme = z.object({
    data: z.object({
        port_id: z.string(),
        port_name: z.string(),
        img_url: z.string(),
        un_code: z.string(),
        updated_time: z.coerce.date(),
        port_type: z.string().nullable(),
        on_going_vessel: z.number().nullable(),
        mileage_percentage: z.number().nullable(),
        distance_percentage: z.number().nullable(),
        bunker_supplied: z.number().nullable(),
        bunker_inventory: z.number().nullable(),
        weekly_demand: z.number().nullable(),
        discrepancy: z.number().nullable(),
    }),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const portIncomingVesselsScheme = z.object({
    data: z.array(z.object({
        vessel_code: z.string(),
        vessel_name: z.string(),
        voyage_id: z.string(),
        location: z.object({
            type: z.string(),
            coordinates: z.array(z.number())
        }).nullable(),
        course: z.number().nullable()
    })).nullable(),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})