import { LitElement } from "lit";
import "../../collectionSurveyorFacet/index";
import "../../collectionSurveyorPagination/index";
import "../../collectionSurveyorCart/index";
import "../../collectionSurveyorSearchBar/index";
import "../../collectionSurveyorActiveFilters/index";
import { CollectionSearchResult, Facets, CollectionSelectedDetail, SelectedFacets } from "../../lib/types";
export declare class CollectionSurveyorSearchResults extends LitElement {
    collections?: CollectionSearchResult[];
    cachedCollections?: CollectionSearchResult[];
    facets?: Facets;
    cachedFacets?: Facets;
    isLoading: boolean;
    backgroundCollectionsLoaded: boolean;
    collectionsSelected: {
        [collectionName: string]: CollectionSelectedDetail;
    };
    selectedFacets: SelectedFacets;
    searchTerm: string;
    currentPage: number;
    itemsPerPage: number;
    connectedCallback(): void;
    private get collectionsLength();
    private get startIndex();
    private get endIndex();
    private get paginatedResults();
    handleUpdateCollectionsSelected(event: CustomEvent): void;
    handleRemoveCollectionFromCart(event: CustomEvent): void;
    removeCollectionFromCollectionsSelected(collectionName: string): void;
    handlePageChange(event: CustomEvent): void;
    handleFacetSelected(event: CustomEvent): void;
    handleFacetDeselected(event: CustomEvent): void;
    private get filterQuery();
    private handleSearchClicked;
    private get finalSearchTerm();
    private loadSearchFirstPage;
    private loadRemainingSearchResultsInBackground;
    private static MAX_COLLECTION_COUNT;
    private loadRemainingSearchResultsInBackgroundAndCacheData;
    private loadSearchResults;
    private performSearch;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
export declare class CollectionSurveyorSearchResult extends LitElement {
    collection: CollectionSearchResult;
    isSelected: boolean;
    handleAddToCartChange(event: Event): void;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
