export * from "./webservices/src/lib/pubsub";
import { Topics } from "./webservices/src/lib/pubsub";

// Extend the pubsub.Topics enum with ARCH-specific values.
declare module "./webservices/src/lib/pubsub" {
  enum Topics {
    CREATE_SUB_COLLECTION = "CREATE_SUB_COLLECTION",
    GENERATE_DATASET = "GENERATE_DATASET",
    DISPLAY_CREATE_USER_MODAL = "DISPLAY_CREATE_USER_MODAL",
    DISPLAY_EDIT_USER_MODAL = "DISPLAY_EDIT_USER_MODAL",
    DISPLAY_CREATE_TEAM_MODAL = "DISPLAY_CREATE_TEAM_MODAL",
    DISPLAY_EDIT_TEAM_MODAL = "DISPLAY_EDIT_TEAM_MODAL",
  }
}

// Note that the above "declare module ..." only updates the type but does
// not actually initialize the object with the extended values,
// which we have to do manually??
// https://stackoverflow.com/a/46760115/2327940
Object.assign(Topics as Record<string, string>, {
  CREATE_SUB_COLLECTION: "CREATE_SUB_COLLECTION",
  GENERATE_DATASET: "GENERATE_DATASET",
  DISPLAY_CREATE_USER_MODAL: "DISPLAY_CREATE_USER_MODAL",
  DISPLAY_EDIT_USER_MODAL: "DISPLAY_EDIT_USER_MODAL",
  DISPLAY_CREATE_TEAM_MODAL: "DISPLAY_CREATE_TEAM_MODAL",
  DISPLAY_EDIT_TEAM_MODAL: "DISPLAY_EDIT_TEAM_MODAL",
});
