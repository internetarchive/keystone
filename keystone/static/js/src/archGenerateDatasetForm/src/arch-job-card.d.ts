import { LitElement } from "lit";
import { AvailableJob, JobIdStatesMap, JobParameters, SomeJSONSchema } from "../../lib/types";
import { ArchJobButton } from "./arch-job-button";
import "./arch-job-button";
export declare class ArchJobCard extends LitElement {
    collectionId: number;
    collectionName: string;
    job: AvailableJob;
    jobIdStatesMap: JobIdStatesMap;
    jobParameters: object | JobParameters;
    jobButton: ArchJobButton;
    static styles: import("lit").CSSResult[];
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
