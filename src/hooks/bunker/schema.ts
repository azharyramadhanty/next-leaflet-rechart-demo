import { z } from "zod";

export const bunkerSupplyBunkeringPerformanceKpiScheme = z.object({
    data: z.object({
        bunker_inventory: z.number().nullable(),
        bunker_supplied: z.number().nullable(),
        discrepancy: z.number().nullable(),
        discrepancy_diff: z.number().nullable(),
        total_request: z.number().nullable(),
        pit_bunker: z.object({
            bunker_supplied: z.number().nullable(),
            discrepancy_percentage: z.number().nullable(),
            discrepancy_volume: z.number().nullable()
        }),
        sts_bunker: z.object({
            bunker_supplied: z.number().nullable(),
            discrepancy_percentage: z.number().nullable(),
            discrepancy_volume: z.number().nullable()
        }),
        barge_bunker: z.object({
            bunker_supplied: z.number().nullable(),
            discrepancy_percentage: z.number().nullable(),
            discrepancy_volume: z.number().nullable()
        }),
    }),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const bunkerSupplyMonthlyScheme = z.object({
    data: z.object({
        bunker_monthly: z.array(z.object({
            month_year: z.string(),
            fuel_type: z.object({
                hfo: z.number().optional(),
                hsd: z.number().optional(),
                lfo: z.number().optional(),
                mdf: z.number().optional(),
                mgo: z.number().optional(),
                mfo: z.number().optional(),
            }),
        })),
        baseline: z.array(z.object({
            key: z.string(),
            value: z.number()
        }))
    }),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const bunkerSupplyScheme = z.object({
    data: z.array(z.object({
        month_year: z.string(),
        fuel_type: z.object({
            hfo: z.number().optional(),
            hsd: z.number().optional(),
            lfo: z.number().optional(),
            mdf: z.number().optional(),
            mgo: z.number().optional(),
            mfo: z.number().optional(),
        }),
    })),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const bunkerHandlingTransporterRankScheme = z.object({
    data: z.array(z.object({
        rank: z.number(),
        transporter: z.string(),
        port: z.string(),
        total_loss: z.number()
    })),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const bunkerHandlingVesselRankScheme = z.object({
    data: z.array(z.object({
        rank: z.number(),
        transporter: z.string(),
        vessel: z.string(),
        total_loss: z.number()
    })),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const bunkerHandlingLossHistoryScheme = z.object({
    page: z.number(),
    limit: z.number(),
    total_page: z.number(),
    total: z.number(),
    data: z.array(z.object({
        transporter: z.string(),
        vessel: z.string(),
        call: z.number(),
        total_loss: z.number(),
    })),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const bunkerHandlingBargePerformanceScheme = z.object({
    data: z.object({
        no_losses: z.number().nullable(),
        vol_no_losses: z.number().nullable(),
        losses: z.number().nullable(),
        vol_losses: z.number().nullable()
    }),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const bunkerPlanListScheme = z.object({
    page: z.number(),
    limit: z.number(),
    total_page: z.number(),
    total: z.number(),
    data: z.array(z.object({
        simulation_id: z.string(),
        vessel_code: z.string(),
        vessel_name: z.string(),
        bunker_port_name: z.string(),
        bunker_date: z.string(),
        status: z.string(),
        mfo: z.number().nullable().optional(),
        hfo: z.number().nullable().optional(),
        lfo: z.number().nullable().optional(),
        mdf: z.number().nullable().optional(),
        mgo: z.number().nullable().optional(),
        hsd: z.number().nullable().optional(),
        mdo: z.number().nullable().optional(),
    })).nullable(),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const bunkerPlanListVerifiedScheme = z.object({
    page: z.number(),
    limit: z.number(),
    total_page: z.number(),
    total: z.number(),
    data: z.array(z.object({
        simulation_id: z.string(),
        vessel_code: z.string(),
        vessel_name: z.string(),
        port_name: z.string(),
        fuel_type: z.string(),
        bunker_schema: z.string(),
        bunker_date: z.string(),
        quantity: z.number().nullable(),
        ar15: z.number().nullable(),
        bl15: z.number().nullable(),
        discrepancy: z.number().nullable(),
        discrepancy_percentage: z.number().nullable()
    })).nullable(),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const putBunkerPlanUpdateScheme = z.object({
    data: z.string(),
    success: z.boolean(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const putUploadEvidencesScheme = z.object({
    data: z.string(),
    success: z.boolean(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const putBunkerPlanUpdateStatusScheme = z.object({
    data: z.string().nullable(),
    success: z.boolean(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const getBunkerPlanDetailScheme = z.object({
    data: z.object({
        bunker_plans: z.array(z.object({
            id: z.string(),
            simulation_id: z.string(),
            fuel_type: z.string(),
            bunker_port_id: z.string(),
            bunker_date: z.string(),
            status: z.string(),
            bunker_schema: z.string(),
            quantity: z.number(),
            bl_obs: z.number().nullable().optional(),
            bl15: z.number().nullable().optional(),
            ar_obs: z.number().nullable().optional(),
            ar15: z.number().nullable().optional(),
            sfbl_obs: z.number().nullable().optional(),
            sfbl15: z.number().nullable().optional(),
            sfal_obs: z.number().nullable().optional(),
            sfal15: z.number().nullable().optional(),
            sfbd_obs: z.number().nullable().optional(),
            sfbd15: z.number().nullable().optional(),
            sfad_obs: z.number().nullable().optional(),
            sfad15: z.number().nullable().optional(),
            barge_code: z.string().nullable(),
            recieved_date: z.string().nullable(),
            remark: z.string().nullable(),
        })).nullable(),
        remarks: z.string().nullable(),
        evidences: z.array(z.object({
            evidence_id: z.string(),
            simulation_id: z.string(),
            file_name: z.string(),
            file_url: z.string()
        })).nullable()
    }).nullable(),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable()
    })).nullable(),
})

export const getBunkerPlanTelexInfoScheme = z.object({
    data: z.object({
        vessel_code: z.string(),
        vessel_name: z.string(),
        trade_area: z.string(),
        fuel_request: z.array(z.object({
            fuel_type: z.string(),
            quantity: z.number().nullable()
        })),
        fuel_rob: z.array(z.object({
            fuel_type: z.string(),
            quantity: z.number().nullable()
        })),
    }),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable()
    })).nullable(),
})