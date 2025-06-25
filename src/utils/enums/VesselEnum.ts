export enum VesselQueryKey {
    QUERY_SEARCH_BOUNDARY = "vessel_search_boundary",
    QUERY_SEARCH = "vessel_search",
    QUERY_SEARCH_ALL = "vessel_search_all",
    QUERY_SEGMENT = "vessel_segment_list",
    QUERY_TYPE = "vessel_type_list",
    QUERY_DETAIL_PERFORMANCE = "vessel_detail_performance",
    QUERY_PERFORMANCE_KPI = "vessel_performance_kpi",
    QUERY_CONS_PERFORMANCE_KPI = "vessel_cons_performance_kpi",
    QUERY_LEADERBOARD_KPI = "vessel_leaderboard_kpi",
    QUERY_LOG = "vessel_log",
    QUERY_PERFORMANCE_METRIC = "vessel_performance_metrics",
    QUERY_LATEST_VOYAGES = "vessel_latest_voyages",
    QUERY_FUEL_CONSUMPTION_DEVIATION = "vessel_fuel_cons_deviation",
    QUERY_SEARCH_ALL_VOYAGE = "voyage_all",
    QUERY_SEARCH_VOYAGE = "voyage_search",
    QUERY_VOYAGE_DETAIL = "voyage_detail",
    QUERY_VOYAGE_DETAIL_ACTIVITY = "voyage_detail_activity",
    QUERY_VOYAGE_DETAIL_OPERATIONAL = "voyage_detail_operational",
    QUERY_VOYAGE_DETAIL_BUNKER_CONS = "voyage_detail_bunker_cons",
    QUERY_SUMMARY_KPI = "vessel_summary_kpi",
    QUERY_DETAIL = "vessel_detail",
    QUERY_VESSEL_TO_BUNKER_REPORT = "vessel_to_bunker_report",
    QUERY_VESSEL_TO_BUNKER_STATUS = "vessel_to_bunker_status",
    QUERY_VESSEL_TO_BUNKER_RUN_SIMULATION = "vessel_to_bunker_run_simulation",
    QUERY_VESSEL_TO_BUNKER_SIMULATION_STATUS = "vessel_to_bunker_simulation_check_status",
    QUERY_VESSEL_TO_BUNKER_SIMULATION_RESULT = "vessel_to_bunker_simulation_get_result",
    QUERY_VESSEL_TO_BUNKER_SIMULATION_RESULT_SAVE = "vessel_to_bunker_simulation_put_save_result",
    QUERY_VESSEL_TO_BUNKER_DETAIL = "vessel_to_bunker_detail",
    QUERY_VESSEL_TO_BUNKER_DOWNLOAD_REPORT = "vessel_to_bunker_download_report"
}

export enum VesselToBunkerFuelIndicatorType {
    FUEL_LOW = "fuel_low",
    FUEL_LOW_TO_MIDDLE = "fuel_low_to_middle",
    FUEL_MIDDLE = "fuel_middle",
    FUEL_MIDDLE_TO_FULL = "fuel_middle_to_full"
}

export enum VesselToBunkerSimulationStatus {
    SIMULATION_SUCCESS = "SUCCESS",
    SIMULATION_FAILED = "FAILED"
}

export enum VesselToBunkerSimulationSaveStatus {
    SIMULATION_SUCCESS = "Success",
    SIMULATION_FAILED = "Failed",
    SIMULATION_NOT_SAVED = "Not Saved"
}