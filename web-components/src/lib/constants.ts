import { CollectionType, ProcessingState } from "./types";

export const HtmlStatusCodeRegex = /^[1-5]\d\d$/;

// SurtRegex: domain labels separated by commas optionally followed by ")" or ")/.*"
const ValidLabelChars = "[a-zA-Z0-9\\-]";
export const SurtPrefixRegex = new RegExp(
  `^${ValidLabelChars}+,${ValidLabelChars}+(${ValidLabelChars}+,?)*((\\))|(\\)/.*))?$`
);

export const BoolDisplayMap: Record<string, string> = {
  true: "Yes",
  false: "No",
};

export const EventTypeDisplayMap: Record<ProcessingState, string> = {
  SUBMITTED: "Submitted",
  QUEUED: "Queued",
  RUNNING: "Running",
  FINISHED: "Finished",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

export const CollectionTypeDisplayMap: Record<CollectionType, string> = {
  AIT: "Archive-It",
  CUSTOM: "Custom",
  SPECIAL: "Special",
};
