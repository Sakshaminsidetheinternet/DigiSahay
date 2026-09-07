package in.abnv.civic_platform_backend.civicproblems.entity;

public enum ProblemCategory {

    ROAD_DAMAGE,
    WATER_MANAGEMENT,
    SANITATION,
    GARBAGE,
    STREETLIGHT,
    HEALTHCARE,
    EDUCATION,
    AGRICULTURE,
    ENVIRONMENT,
    ENERGY,
    URBAN_DEVELOPMENT,
    ACCESSIBILITY,
    PUBLIC_ADMINISTRATION,
    OTHER,
    // Legacy aliases
    WATER_LEAKAGE,
    ELECTRICITY_SHORTAGE;

    public static ProblemCategory fromString(String val) {
        if (val == null || val.isBlank()) {
            return OTHER;
        }
        String clean = val.trim().toUpperCase().replace(" ", "_").replace("&", "_").replace("-", "_");
        for (ProblemCategory cat : values()) {
            if (cat.name().equalsIgnoreCase(clean)) {
                return cat;
            }
        }
        // Friendly mappings
        if (clean.contains("ROAD") || clean.contains("TRANSIT") || clean.contains("POTHOLE") || clean.contains("GADDA") || clean.contains("GADDHA")) return ROAD_DAMAGE;
        if (clean.contains("WATER") && (clean.contains("DRAIN") || clean.contains("LEAK") || clean.contains("SUPPLY") || clean.contains("MANAGEMENT"))) return WATER_MANAGEMENT;
        if (clean.contains("SANIT") || clean.contains("SEWAGE") || clean.contains("SEWER") || clean.contains("TOILET")) return SANITATION;
        if (clean.contains("GARBAGE") || clean.contains("WASTE") || clean.contains("DUMP") || clean.contains("TRASH") || clean.contains("KACHRA")) return GARBAGE;
        if (clean.contains("LIGHT") || clean.contains("STREETLIGHT")) return STREETLIGHT;
        if (clean.contains("HEALTH") || clean.contains("HOSPITAL") || clean.contains("CLINIC") || clean.contains("MEDICAL")) return HEALTHCARE;
        if (clean.contains("EDU") || clean.contains("SCHOOL") || clean.contains("COLLEGE")) return EDUCATION;
        if (clean.contains("AGRI") || clean.contains("FARM") || clean.contains("CROP")) return AGRICULTURE;
        if (clean.contains("ENV") || clean.contains("POLLUTION") || clean.contains("TREE") || clean.contains("PARK") || clean.contains("GREEN")) return ENVIRONMENT;
        if (clean.contains("ENERGY") || clean.contains("POWER") || clean.contains("ELECTRIC")) return ENERGY;
        if (clean.contains("URBAN") || clean.contains("INFRA")) return URBAN_DEVELOPMENT;
        if (clean.contains("ACCESS") || clean.contains("RAMP") || clean.contains("DISAB")) return ACCESSIBILITY;
        if (clean.contains("ADMIN") || clean.contains("GOV") || clean.contains("OFFICE")) return PUBLIC_ADMINISTRATION;

        return OTHER;
    }
}
