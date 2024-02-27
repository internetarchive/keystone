import { LitElement } from "lit";
import "../../lib/webservices/src/aitLoadingSpinner/index";
import { AvailableJob, JobState } from "../../lib/types";
export declare enum JobButtonType {
    Generate = "generate",
    View = "view",
    Status = "status"
}
export declare class ArchJobCard extends LitElement {
    collectionId: string;
    job: AvailableJob;
    jobIdStatesMap: Record<string, JobState>;
    createRenderRoot(): this;
    private jobStateToButtonProps;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "arch-job-card": ArchJobCard;
    }
}
