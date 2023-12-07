import { LitElement } from "lit";
import "../../collectionSurveyorFacet/index";
import "../../collectionSurveyorPagination/index";
import "../../collectionSurveyorCart/index";
import { CollectionSearchResult, Facets, CollectionSelectedDetail } from "../../lib/types";
export declare class CollectionSurveyorSearchResults extends LitElement {
    collections?: CollectionSearchResult[];
    facets?: Facets;
    collectionsSelected: {
        [collectionName: string]: CollectionSelectedDetail;
    };
    currentPage: number;
    itemsPerPage: number;
    private get collectionsLength();
    private get startIndex();
    private get endIndex();
    private get paginatedResults();
    handleUpdateCollectionsSelected(event: CustomEvent): void;
    handlePageChange(event: CustomEvent): void;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
export declare class CollectionSurveyorSearchResult extends LitElement {
    collection: CollectionSearchResult;
    isChecked: boolean;
    handleCheckboxChange(event: Event): void;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
