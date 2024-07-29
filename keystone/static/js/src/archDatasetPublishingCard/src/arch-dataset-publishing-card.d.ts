import { LitElement } from "lit";
import { Dataset, PublishedDatasetInfo, PublishedDatasetMetadataApiResponse } from "../../lib/types";
import "../../archLoadingIndicator/index";
import "../../archDatasetMetadataForm/index";
import { ArchDatasetMetadataForm } from "../../archDatasetMetadataForm/index";
declare enum PublishState {
    Loading = 0,
    Unpublished = 1,
    PrePublish = 2,
    Publishing = 3,
    Published = 4,
    Unpublishing = 5
}
declare enum MetadataState {
    Displaying = 0,
    Editing = 1,
    Saving = 2
}
export declare class ArchDatasetPublishingCard extends LitElement {
    datasetId: Dataset["id"];
    csrfToken: string;
    readOnly: boolean;
    pubState: PublishState;
    pubInfo: undefined | PublishedDatasetInfo;
    metadataState: MetadataState;
    metadata: undefined | PublishedDatasetMetadataApiResponse;
    metadataForm: ArchDatasetMetadataForm;
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    private get _metadataFormData();
    render(): import("lit-html").TemplateResult<1>;
    private _fetchInitialData;
    private _pollItemMetadata;
    private _fetchPubInfo;
    private _fetchItemMetadata;
    private _publishButtonClickHandler;
    private _publish;
    private _unpublish;
    private _saveMetadata;
}
declare global {
    interface HTMLElementTagNameMap {
        "arch-dataset-publishing-card": ArchDatasetPublishingCard;
    }
}
export {};
