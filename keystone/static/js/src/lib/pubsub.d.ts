export * from "./webservices/src/lib/pubsub";
declare module "./webservices/src/lib/pubsub" {
    enum Topics {
        CREATE_SUB_COLLECTION = "CREATE_SUB_COLLECTION",
        GENERATE_DATASET = "GENERATE_DATASET",
        DISPLAY_CREATE_USER_MODAL = "DISPLAY_CREATE_USER_MODAL",
        DISPLAY_EDIT_USER_MODAL = "DISPLAY_EDIT_USER_MODAL",
        DISPLAY_CREATE_TEAM_MODAL = "DISPLAY_CREATE_TEAM_MODAL",
        DISPLAY_EDIT_TEAM_MODAL = "DISPLAY_EDIT_TEAM_MODAL"
    }
}
