import { LitElement } from "lit";
import "../../CollectionsExplorerFacet/index";
import "../../CollectionsExplorerPagination/index";
import "../../CollectionsExplorerCart/index";
import { CollectionSearchResult, Facets } from "../../lib/types";
export declare class CollectionSurveyorSearchResults extends LitElement {
    collections?: CollectionSearchResult[];
    facets?: Facets;
    totalCollectionSize: string;
    collectionsSelected: Map<any, any>;
    currentPage: number;
    itemsPerPage: number;
    get collectionsLength(): number;
    render(): import("lit-html").TemplateResult<1>;
    handleUpdateTotalCollectionSize(event: CustomEvent): void;
    handlePageChange(event: CustomEvent): void;
}
export declare class CollectionSurveyorSearchResult extends LitElement {
    collection: CollectionSearchResult;
    isChecked: boolean;
    checkboxValue: string;
    render(): import("lit-html").TemplateResult<1>;
    handleCheckboxChange(event: Event): void;
    static styles: import("lit").CSSResult;
}
