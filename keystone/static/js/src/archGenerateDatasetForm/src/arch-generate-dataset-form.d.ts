import { LitElement } from "lit";
import "@spectrum-web-components/icon/sp-icon.js";
import "@spectrum-web-components/tabs/sp-tabs.js";
import "@spectrum-web-components/tabs/sp-tab.js";
import "@spectrum-web-components/tabs/sp-tab-panel.js";
import "@spectrum-web-components/theme/sp-theme.js";
import "@spectrum-web-components/theme/src/themes.js";
import { AvailableJobs, Collection, JobIdStatesMap } from "../../lib/types";
import "./arch-job-category-section";
import { ArchJobCategorySection } from "./arch-job-category-section";
export declare class ArchGenerateDatasetForm extends LitElement {
    csrfToken: string;
    collections: null | Array<Collection>;
    collectionIdNameMap: Map<Collection["id"], Collection["name"]>;
    availableJobs: AvailableJobs;
    sourceCollectionId: Collection["id"] | null;
    collectionJobIdStatesMapMap: Record<Collection["id"], JobIdStatesMap>;
    activePollCollectionId: Collection["id"] | null;
    collectionSelector: HTMLSelectElement;
    categorySections: Array<ArchJobCategorySection>;
    static styles: import("lit").CSSResult[];
    connectedCallback(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
    private setCollectionIdUrlParam;
    private sourceCollectionChangeHandler;
    private setSourceCollectionId;
    private initCollections;
    private initAvailableJobs;
    private fetchJobIdStatesMap;
    pollDatasetStates(): Promise<void>;
    private startPolling;
    private generateDatasetHandler;
}
declare global {
    interface HTMLElementTagNameMap {
        "arch-generate-dataset-form": ArchGenerateDatasetForm;
    }
}
