import { LitElement } from "lit";
import { AvailableJob, JobIdStatesMap, JobParameters, SomeJSONSchema } from "../../lib/types";
import "../../lib/webservices/src/aitLoadingSpinner/index";
export declare class ArchJobCard extends LitElement {
    collectionId: string;
    job: AvailableJob;
    jobIdStatesMap: JobIdStatesMap;
    collectionDetailPageUrlTemplate: string;
    button: HTMLButtonElement;
    jobParameters: object | JobParameters;
    static styles: import("lit").CSSResult[];
    private startTimeStatePairsToButtonProps;
    static DefaultParametersSchema: SomeJSONSchema;
    private extendParamsSchemaWithDefaultOptions;
    get historicalDatasetsUrl(): string;
    renderHistory(): import("lit-html").TemplateResult<1>;
    renderConfigureJob(): import("lit-html").TemplateResult<1>;
    emitGenerateDataset(e: Event): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "arch-job-card": ArchJobCard;
    }
}
