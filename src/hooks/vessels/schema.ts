import { z } from 'zod';

export const vesselsBoundaryScheme = z.object({
    data: z.array(z.object({
        vessel_code: z.string().nullable(),
        vessel_name: z.string().nullable(),
        source_port: z.string().nullable(),
        destination_port: z.string().nullable(),
        source_location: z.object({
            type: z.string().nullable(),
            coordinates: z.array(z.number())
        }).nullable(),
        location: z.object({
            type: z.string(),
            coordinates: z.array(z.number())
        }).nullable(),
        course: z.number().nullable(),
        destination: z.object({
            type: z.string(),
            coordinates: z.array(z.number())
        }).nullable(),
        voyage_no: z.string().nullable(),
        voyage_route: z.object({
            type: z.string(),
            coordinates: z.array(z.array(z.number()))
        }).nullable(),
        updated_time: z.coerce.date().nullable(),
        avg_performance: z.object({
            score: z.number(),
            category: z.string(),
            color: z.string()
        }).nullable(),
    })),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const vesselSegmentListScheme = z.object({
    data: z.array(z.object({
        segment_id: z.string(),
        segment_name: z.string().nullable(),
    })),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const vesselTypeListScheme = z.object({
    data: z.array(z.object({
        vessel_type_id: z.string(),
        vessel_type_name: z.string(),
        created_time: z.coerce.date(),
        updated_time: z.coerce.date()
    })),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const vesselPerformanceKpiScheme = z.object({
    data: z.object({
        bunker_cost_per_vol_kargo: z.number().nullable(),
        shipping_cost_per_vol_kargo: z.number().nullable(),
        bunker_supply_per_vol_kargo: z.number().nullable(),
    }),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const vesselConsPerformanceKpiScheme = z.object({
    data: z.object({
        low: z.object({
            count: z.number(),
            color: z.string()
        }),
        moderate: z.object({
            count: z.number(),
            color: z.string()
        }),
        high: z.object({
            count: z.number(),
            color: z.string()
        }),
    }),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const vesselLeaderboardKpiScheme = z.object({
    page: z.number(),
    limit: z.number(),
    total_page: z.number(),
    data: z.array(z.object({
        rank: z.number(),
        vessel_code: z.string(),
        vessel_name: z.string(),
        performance: z.number().nullable(),
        last_bunker_performance: z.array(z.object({
            voyage_id: z.string(),
            bunker_performance: z.number(),
            voyage_complete_date: z.coerce.date().nullable(),
        }))
    })).nullable(),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const vesselDetailPerformanceScheme = z.object({
    data: z.object({
        vessel_name: z.string(),
        img_url: z.string().nullable(),
        voyage_no: z.string(),
        updated_time: z.coerce.date().nullable(),
        fuel_type: z.array(z.string()).nullable(),
        cargo_capacity: z.number().nullable(),
        vessel_type: z.object({
            vessel_type_id: z.string(),
            vessel_type_name: z.string(),
            created_time: z.coerce.date(),
            updated_time: z.coerce.date()
        }).nullable(),
        start_port: z.object({
            port_name: z.string(),
            un_code: z.string().nullable(),
            country_code: z.string().nullable(),
        }),
        end_port: z.object({
            port_name: z.string(),
            un_code: z.string().nullable(),
            country_code: z.string().nullable(),
        }),
        distance: z.number().nullable(),
        milleage: z.number().nullable(),
        last_voyages: z.array(z.object({
            voyage_id: z.string(),
            voyage_no: z.string(),
            performance: z.number().nullable(),
            commence_date: z.coerce.date().nullable(),
            commplete_date: z.coerce.date().nullable(),
            cargo_shipped: z.number().nullable()
        })),
        cargo_shipped: z.number().nullable(),
        voyage_track: z.array(z.object({
            sequence: z.number().nullable(),
            port_name: z.string().nullable(),
            port_function: z.string().nullable(),
            arrival_time: z.string().nullable(),
            sch_arrival_time: z.string().nullable(),
            departure_time: z.string().nullable(),
            sch_departure_time: z.string().nullable(),
        })).nullable(),
        kpi: z.object({
            profit_loss: z.number().nullable(),
            shipping_cost_vol_cargo: z.number().nullable(),
            bunker_supply_vol_cargo: z.number().nullable(),
        }).nullable(),
        total_bunker_supplied: z.number().nullable(),
        fuel_rob: z.number().nullable()
    }),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const vesselLogScheme = z.object({
    data: z.object({
        vessel_name: z.string().nullable(),
        vessel_type: z.string().nullable(),
        fuel_types: z.array(z.string()).nullable(),
        year_built: z.number().nullable(),
        dwt: z.number().nullable(),
        milleage: z.number().nullable(),
        cargo_shipped: z.number().nullable(),
        bunker_supplied: z.number().nullable(),
        total_voyage: z.number().nullable(),
    }).nullable(),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const vesselPerformanceMetricAllScheme = z.object({
    data: z.object({
        net_profit_margin: z.number().nullable(),
        bunker_supply_per_cargo: z.number().nullable(),
        shipping_cost_per_cargo: z.number().nullable(),
        specific_fuel_consumption: z.number().nullable(),
        daily_fuel_consumption: z.number().nullable(),
        daily_fuel_consumption_detail: z.array(z.object({
            fuel: z.string(),
            value: z.number()
        })),
        specific_fuel_consumption_detail: z.array(z.object({
            fuel: z.string(),
            value: z.number()
        }))
    }).nullable(),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const latestVoyagesScheme = z.object({
    data: z.object({
        status: z.string().nullable(),
        voyages: z.array(z.object({
            voyage_no: z.string(),
            performance: z.number().nullable(),
            commence_date: z.coerce.date(),
            complete_date: z.coerce.date(),
            start_port: z.object({
                port_id: z.string().nullable(),
                un_code: z.string().nullable(),
                port_name: z.string().nullable()
            }),
            end_port: z.object({
                port_id: z.string().nullable(),
                un_code: z.string().nullable(),
                port_name: z.string().nullable()
            }),
            is_bunkering: z.boolean().nullable(),
            cargo_lift: z.number().nullable(),
            mileage: z.number().nullable(),
            sea_days: z.number().nullable(),
            port_bunkering: z.array(z.object({
                port_id: z.string(),
                port_name: z.string()
            }))
        })).nullable()
    }).nullable(),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const voyageListScheme = z.object({
    data: z.array(z.object({
        voyage_id: z.string(),
        voyage_no: z.string(),
        start_port: z.object({
            name: z.string(),
            port_code: z.string()
        }),
        end_port: z.object({
            name: z.string(),
            port_code: z.string()
        }),
        commence_date: z.coerce.date(),
        complete_date: z.coerce.date(),
        status: z.string().nullable()
    })),
    page: z.number(),
    limit: z.number(),
    total_page: z.number(),
    total: z.number(),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const voyageAllListScheme = z.object({
    data: z.array(z.object({
        voyage_id: z.string(),
        voyage_no: z.string(),
        start_port: z.object({
            name: z.string(),
            port_code: z.string()
        }),
        end_port: z.object({
            name: z.string(),
            port_code: z.string()
        }),
        commence_date: z.coerce.date(),
        complete_date: z.coerce.date(),
        status: z.string().nullable()
    })),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const voyageDetailScheme = z.object({
    data: z.object({
        voyage_id: z.string(),
        voyage_no: z.string(),
        voyage_status: z.string().nullable(),
        commence_date: z.coerce.date(),
        complete_date: z.coerce.date(),
        commence_date_gmt: z.string(),
        complete_date_gmt: z.string(),
        insight: z.string().nullable(),
        vessel_code: z.string(),
        weather: z.string().nullable(),
        distance: z.number().nullable(),
        sea_days: z.number().nullable(),
        port_days: z.number().nullable(),
        wind_speed: z.number().nullable(),
        wind_direction: z.number().nullable(),
        wave: z.number().nullable(),
        wave_description: z.string().nullable(),
        cargo_load: z.number().nullable(),
        bunker_consumption: z.object({
            hsd: z.object({
                actual_consumption: z.number(),
                baseline: z.number()
            }).optional(),
            mdf: z.object({
                actual_consumption: z.number(),
                baseline: z.number()
            }).optional(),
            lfo: z.object({
                actual_consumption: z.number(),
                baseline: z.number()
            }).optional()
        }).nullable(),
        average_speed: z.number().nullable(),
        baseline_speed: z.number().nullable(),
        is_bunkering: z.boolean().nullable(),
        voyage_activity: z.array(z.object({
            sequence: z.number(),
            port_name: z.string(),
            port_code: z.string(),
            port_function: z.string()
        })).nullable(),
    }).nullable(),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
});

export const voyageDetailActivityScheme = z.object({
    data: z.object({
        commence_date: z.coerce.date(),
        complete_date: z.coerce.date(),
        commence_date_gmt: z.coerce.date(),
        complete_date_gmt: z.coerce.date(),
        is_bunkering: z.boolean().nullable(),
        voyage_activity: z.array(z.object({
            sequence: z.number(),
            port_name: z.string(),
            port_code: z.string(),
            port_function: z.string()
        })).nullable(),
        status: z.string().nullable()
    }).nullable(),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
});

export const voyageDetailOperationalScheme = z.object({
    data: z.object({
        weather: z.string().nullable(),
        distance: z.number().nullable(),
        wind_speed: z.number().nullable(),
        wind_direction: z.string().nullable(),
        wave: z.number().nullable(),
        wave_description: z.string().nullable(),
        cargo_load_per_cot: z.number().nullable(),
        average_speed: z.number().nullable(),
        speed_laden: z.number().nullable(),
        speed_ballast: z.number().nullable(),
    }).nullable(),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
});

export const voyageDetailBunkerConsScheme = z.object({
    data: z.object({
        fuel_eficiency_percentage: z.number().nullable(),
        avg_deviation_percentage: z.number().nullable(),
        cargo_load_per_cot: z.number().nullable(),
        speed_performance_percentage: z.number().nullable(),
        sea_consumption: z.object({
            deviation: z.number(),
            actual: z.number(),
            baseline: z.number(),
            fuels: z.array(z.object({
                fuel: z.string(),
                value: z.number(),
            })),
            status: z.string(),
            warning: z.boolean()
        }),
        port_consumption: z.object({
            deviation: z.number(),
            actual: z.number(),
            baseline: z.number(),
            fuels: z.array(z.object({
                fuel: z.string(),
                value: z.number(),
            })),
            status: z.string(),
            warning: z.boolean()
        }),
        sea_days: z.number().nullable(),
        port_days: z.number().nullable(),
        insight: z.string().nullable()
    }).nullable(),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
});

export const vesselFuelConsumptionDeviationScheme = z.object({
    data: z.object({
        sea: z.object({
            deviation: z.number(),
            deviation_ammount: z.number(),
            baseline: z.number(),
            fuels: z.array(z.object({
                fuel: z.string(),
                value: z.number()
            }))
        }),
        port: z.object({
            deviation: z.number(),
            deviation_ammount: z.number(),
            baseline: z.number(),
            fuels: z.array(z.object({
                fuel: z.string(),
                value: z.number()
            }))
        })
    }).nullable(),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const vesselListScheme = z.object({
    data: z.array(z.object({
        vessel_code: z.string(),
        vessel_name: z.string(),
    })),
    page: z.number(),
    limit: z.number(),
    total_page: z.number(),
    total: z.number(),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const vesselAllListScheme = z.object({
    data: z.array(z.object({
        vessel_code: z.string(),
        vessel_name: z.string(),
    })),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const vesselSummaryKpiScheme = z.object({
    data: z.object({
        profit_loss: z.number().nullable(),
        cargo_shipped_per_bunker_supplied: z.number().nullable(),
        actual_speed_per_contract_speed: z.number().nullable(),
        cargo_shipped_per_shipping_cost: z.number().nullable(),
        bunker_consumption_per_day_port: z.number().nullable(),
        bunker_consumption_per_day_sea: z.number().nullable()
    }).nullable(),
    success: z.boolean(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const vesselDetailScheme = z.object({
    data: z.object({
        vessel_name: z.string().nullable(),
        vessel_type: z.string().nullable(),
        fuel_types: z.array(z.string()).nullable(),
        year_built: z.number(),
        dwt: z.number().nullable(),
        cargo_capacity: z.number(),
    }).nullable(),
    success: z.boolean(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const vesselBunkerReportingScheme = z.object({
    page: z.number(),
    limit: z.number(),
    total_page: z.number(),
    total: z.number(),
    data: z.array(z.object({
        vessel_code: z.string().nullable(),
        vessel_name: z.string(),
        vessel_type: z.string(),
        status: z.string().nullable(),
        report_time: z.coerce.date().nullable(),
        coverage_days: z.number().nullable(),
        hsd: z.number().nullable().optional(),
        hfo: z.number().nullable().optional(),
        mgo: z.number().nullable().optional(),
        mdo: z.number().nullable().optional(),
        lfo: z.number().nullable().optional(),
        mfo: z.number().nullable().optional(),
        mdf: z.number().nullable().optional(),
        has_plan: z.boolean()
    })),
    success: z.boolean().nullable(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const vesselToBunkerStatusScheme = z.object({
    data: z.array(z.string()),
    success: z.boolean(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const vesselToBunkerTriggerSimulationScheme = z.object({
    data: z.object({
        run_id: z.number(),
        number_in_job: z.number()
    }),
    success: z.boolean(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const vesselToBunkerSimulationCheckStatusScheme = z.object({
    data: z.object({
        job_id: z.number(),
        status: z.string(),
        simulation_id: z.string().nullable()
    }),
    success: z.boolean(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const vesselToBunkerSimulationGetResultScheme = z.object({
    data: z.object({
        vessel_code: z.string(),
        vessel_name: z.string(),
        hfo: z.number().nullable(),
        mdf: z.number().nullable(),
        mgo: z.number().nullable(),
        mfo: z.number().nullable(),
        lfo: z.number().nullable(),
        hsd: z.number().nullable(),
        coverage_days: z.number().nullable(),
        bunker_port: z.string(),
        bunker_date: z.coerce.date(),
        sea_state: z.string().nullable(),
        insight: z.string().nullable()
    }),
    success: z.boolean(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const vesselToBunkerSimulationSaveScheme = z.object({
    data: z.string(),
    success: z.boolean(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})

export const vesselToBunkerDetailScheme = z.object({
    data: z.object({
        vessel_code: z.string(),
        vessel_name: z.string(),
        vessel_type: z.string(),
        total_coverage_days: z.number().nullable(),
        status: z.string(),
        fuel_details: z.array(z.object({
            fuel_type: z.string(),
            bunker_cons_per_tcp: z.number().nullable(),
            bunker_cons_per_day: z.number().nullable(),
            coverage_days: z.number().nullable(),
            fuel_rob: z.number().nullable(),
            fuel_rob_percentage: z.number().nullable(),
            tank_capacity: z.number().nullable()
        })),
        has_plan: z.boolean()
    }).nullable(),
    success: z.boolean(),
    errors: z.array(z.object({
        error_code: z.number(),
        field_name: z.string().nullable(),
        description: z.string().nullable(),
    })).nullable(),
})
