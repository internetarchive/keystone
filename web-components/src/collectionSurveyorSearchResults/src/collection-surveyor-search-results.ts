import { html, css, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { eventOptions } from "lit/decorators/event-options.js";

import "../../collectionSurveyorFacet/index";
import "../../collectionSurveyorPagination/index";
import "../../collectionSurveyorCart/index";
import "../../collectionSurveyorSearchBar/index";
import "../../collectionSurveyorActiveFilters/index";

import {
  CollectionSearchResult,
  Facets,
  CollectionAddToCartEventDetail,
  CollectionSelectedDetail,
  SelectedFacets,
  SolrData,
  CollectionRemovedFromCartDetail,
} from "../../lib/types";

import {
  humanBytes,
  timestampStringToYearMonthString,
} from "../../lib/helpers";
import {
  callSearchApi,
  constructFinalSearchTerm,
  MAX_SOLR_ROWS,
} from "../../lib/api/search";

@customElement("collection-surveyor-search-results")
export class CollectionSurveyorSearchResults extends LitElement {
  @state() collections?: CollectionSearchResult[] = undefined;

  @state() cachedCollections?: CollectionSearchResult[] = undefined;

  @state() facets?: Facets = {};

  @state() cachedFacets?: Facets = {};

  // controls loading icon
  // site is loading if we are getting the first itemsPerPage number of search results or loading remaining results in the background
  @state() isLoading = false;

  // controls when we display Total Results value for pagination, ie when we display'Page 1' or 'Page x of y (z Total Results)'
  @state() backgroundCollectionsLoaded = false;

  @state() collectionsSelected: {
    [collectionName: string]: CollectionSelectedDetail;
  } = {};

  @state()
  selectedFacets: SelectedFacets = {
    f_organizationName: [],
    f_organizationType: [],
  };

  @state() searchTerm = "";

  @state() currentPage = 1;

  @property({ type: Number }) itemsPerPage = 100;

  connectedCallback() {
    super.connectedCallback();
    // load first itemsPerPage number of search results, then load remaining items and cache
    this.loadSearchFirstPage()
      .then(() => this.loadRemainingSearchResultsInBackgroundAndCacheData())
      .catch((error) => {
        throw error;
      });
  }

  private get collectionsLength() {
    return this.collections ? this.collections.length : 0;
  }

  private get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  private get endIndex(): number {
    return this.startIndex + this.itemsPerPage;
  }

  private get paginatedResults() {
    return this.collections?.slice(this.startIndex, this.endIndex);
  }

  // event handler for selecting/deselecting a collection
  handleUpdateCollectionsSelected(event: CustomEvent) {
    const {
      collectionSize,
      collectionName,
      collectionId,
      organizationName,
      createdDt,
    }: CollectionAddToCartEventDetail =
      event.detail as CollectionAddToCartEventDetail;

    if (!(collectionName in this.collectionsSelected)) {
      const sizeIdMap: CollectionSelectedDetail = {
        collectionSize: collectionSize,
        collectionId: collectionId,
        organizationName: organizationName,
        createdDt: createdDt,
      };

      // create a new collectionsSelected object with the existing selected collections plus the latest selected collection
      this.collectionsSelected = {
        ...this.collectionsSelected,
        [collectionName]: sizeIdMap,
      };
    } else {
      this.removeCollectionFromCollectionsSelected(collectionName);
    }
  }

  // event handler for removing collection from cart
  handleRemoveCollectionFromCart(event: CustomEvent) {
    const { collectionName }: CollectionRemovedFromCartDetail =
      event.detail as CollectionRemovedFromCartDetail;
    this.removeCollectionFromCollectionsSelected(collectionName);
  }

  removeCollectionFromCollectionsSelected(collectionName: string) {
    // create new collectionsSelected object excluding the deselected collection
    const { [collectionName]: _, ...rest } = this.collectionsSelected;
    this.collectionsSelected = { ...rest };
  }

  // event handler for pagination
  handlePageChange(event: CustomEvent) {
    this.currentPage = Number(event.detail);
  }

  // event handler for selecting facets
  handleFacetSelected(event: CustomEvent) {
    const facetName = (event.detail as { facetName: string }).facetName;
    const facetFieldName = (
      event.detail as { facetFieldName: keyof SelectedFacets }
    ).facetFieldName;

    this.selectedFacets = {
      ...this.selectedFacets,
      [facetFieldName]: [...this.selectedFacets[facetFieldName], facetName],
    };

    this.loadSearchResults();
  }

  // event handler for deselecting facets
  handleFacetDeselected(event: CustomEvent) {
    const facetName = (event.detail as { facetName: string }).facetName;
    const facetFieldName = (
      event.detail as { facetFieldName: keyof SelectedFacets }
    ).facetFieldName;

    // create new selectedFacets object, which is needed to update state and re-render
    this.selectedFacets = {
      ...this.selectedFacets,
      [facetFieldName]: this.selectedFacets[facetFieldName].filter(
        (value) => value !== facetName
      ),
    };

    this.loadSearchResults();
  }

  private get filterQuery(): string[] {
    return Object.entries(this.selectedFacets).flatMap(
      ([facetFieldName, facetValues]: [string, string[]]) => {
        // remove f_ prefix, eg. f_collectionName => collectionName
        const searchableFieldName = facetFieldName.slice(2);

        return facetValues.map(
          (facetValue: string) => `${searchableFieldName}:"${facetValue}"`
        );
      }
    );
  }

  // event handler for search term
  private handleSearchClicked(event: CustomEvent) {
    const searchText = (event.detail as { searchText: string }).searchText;
    this.searchTerm = searchText;

    this.loadSearchResults();
  }

  private get finalSearchTerm(): string {
    return constructFinalSearchTerm(this.searchTerm, this.filterQuery);
  }

  private loadSearchFirstPage(): Promise<void> {
    return this.performSearch(this.finalSearchTerm, this.itemsPerPage).then(
      () => {
        this.currentPage = 1;
      }
    );
  }

  private loadRemainingSearchResultsInBackground(): Promise<void> {
    this.backgroundCollectionsLoaded = false;
    return this.performSearch(
      this.finalSearchTerm,
      CollectionSurveyorSearchResults.MAX_COLLECTION_COUNT
    ).then(() => {
      this.backgroundCollectionsLoaded = true;
    });
  }

  private static MAX_COLLECTION_COUNT = MAX_SOLR_ROWS;

  private loadRemainingSearchResultsInBackgroundAndCacheData() {
    this.performSearch("", CollectionSurveyorSearchResults.MAX_COLLECTION_COUNT)
      .then((allData: SolrData) => {
        this.cachedCollections = allData.collections;
        this.cachedFacets = allData.facets;
        this.backgroundCollectionsLoaded = true;
      })
      .catch((error) => {
        throw error;
      });
  }

  private loadSearchResults() {
    if (
      // if empty search, use cached collections and facets for faster loading
      this.finalSearchTerm === "" &&
      this.cachedCollections !== undefined &&
      this.cachedFacets !== undefined
    ) {
      this.collections = this.cachedCollections;
      this.facets = this.cachedFacets;
      this.currentPage = 1;
    } else {
      this.loadSearchFirstPage()
        .then(() => this.loadRemainingSearchResultsInBackground())
        .catch((error) => {
          throw error;
        });
    }
  }

  private performSearch(
    searchTerm: string,
    rowCount: number
  ): Promise<SolrData> {
    this.isLoading = true;
    return callSearchApi(searchTerm, rowCount)
      .then((data: SolrData) => {
        this.collections = data.collections;
        this.facets = data.facets;
        this.isLoading = false;
        return data;
      })
      .catch((error) => {
        this.isLoading = false;
        throw error;
      });
  }

  render() {
    return html`
      <!-- Collections Cart -->
      <collection-surveyor-cart
        .collectionsInCart=${this.collectionsSelected}
        @collection-removed-from-cart=${this.handleRemoveCollectionFromCart}
      ></collection-surveyor-cart>

      <div class="search-facets-and-collections-container">
        <!-- Search Bar -->
        <collection-surveyor-search-bar
          .searchText=${this.searchTerm}
          @search-clicked="${this.handleSearchClicked}"
        ></collection-surveyor-search-bar>

        <!-- Facets and Collections-->
        <div class="facets-and-collections-container">
          <!-- Loading icon -->
            <div class="loading">
              ${this.isLoading ? html`<div class="spinner"></div>` : html``}
            </div>

          ${
            this.collectionsLength !== 0
              ? html`
                  <!-- Facets  -->
                  <div class="facets-container">
                    <div>
                      <h4>Narrow Your Results</h4>
                      ${this.facets
                        ? html` ${Object.entries(this.facets).map(
                            ([key, value]) => html`
                              <collection-surveyor-facet
                                .facetField=${key}
                                .facetFieldResults=${value}
                                .selectedfacetFieldResults=${this
                                  .selectedFacets[key as keyof SelectedFacets]}
                                @facet-selected=${this.handleFacetSelected}
                                @facet-deselected=${this.handleFacetDeselected}
                              ></collection-surveyor-facet>
                            `
                          )}`
                        : html`<p>No facets available</p>`}
                    </div>
                  </div>

                  <!-- Collections -->
                  <div class="collections-container">
                    <!-- Active Filters -->
                    <collection-surveyor-active-filters
                      .activeFilters=${this.selectedFacets}
                      @facet-deselected=${this.handleFacetDeselected}
                    ></collection-surveyor-active-filters>

                    <!-- Pagination top of page -->
                    <collection-surveyor-pagination
                      .currentPage="${this.currentPage}"
                      .totalResults="${this.collectionsLength}"
                      .itemsPerPage="${this.itemsPerPage}"
                      .backgroundCollectionsLoaded="${this
                        .backgroundCollectionsLoaded}"
                      @page-changed="${this.handlePageChange}"
                    ></collection-surveyor-pagination>

                    <!-- Collections -->
                    ${this.paginatedResults?.map(
                      (collection) => html`
                        <collection-surveyor-search-result
                          .collection=${collection}
                          .isSelected=${collection.collectionName in
                          this.collectionsSelected}
                          @update-collections-selected="${this
                            .handleUpdateCollectionsSelected}"
                        ></collection-surveyor-search-result>
                      `
                    )}

                    <!-- Pagination bottom of page -->
                    <collection-surveyor-pagination
                      .currentPage="${this.currentPage}"
                      .totalResults="${this.collectionsLength}"
                      .itemsPerPage="${this.itemsPerPage}"
                      .backgroundCollectionsLoaded="${this
                        .backgroundCollectionsLoaded}"
                      @page-changed="${this.handlePageChange}"
                    ></collection-surveyor-pagination>
                  </div>
                `
              : html``
          }

          ${
            this.collectionsLength === 0 && !this.isLoading
              ? html`
                  <div class="no-results-message">
                    <h2>No Results Found For Your Search</h2>
                    <p>Try a new search or clear your previous search</p>
                    <p></p>
                  </div>
                `
              : html``
          }
          </div>
        </div>
      </div>
    `;
  }

  static styles = css`
    .search-facets-and-collections-container {
      box-shadow: rgb(136, 136, 136) 1px 1px 6px;
      border-radius: 6px;
      margin: 20px 50px;
    }

    .facets-and-collections-container {
      display: flex;
      background-color: rgb(248, 248, 248);
      position: relative;
    }

    .facets-container {
      display: flex;
      padding: 10px 20px;
      width: 40%;
    }

    .collections-container {
      display: flex;
      flex-direction: column;
      padding: 10px 20px;
      width: -webkit-fill-available;
    }

    .no-results-message {
      margin: auto;
      text-align: center;
    }

    .loading {
      height: 100px;
      padding-left: 50%;
      position: absolute;
    }

    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-left-color: #333;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;
}

@customElement("collection-surveyor-search-result")
export class CollectionSurveyorSearchResult extends LitElement {
  @property({ type: Object }) collection!: CollectionSearchResult;

  @property({ type: Boolean }) isSelected = false;

  @eventOptions({ capture: true })
  handleAddToCartChange(event: Event) {
    const button = event.target as HTMLInputElement;
    const {
      collectionId,
      collectionName,
      collectionSize,
      organizationName,
      createdDt,
    } = button.dataset;

    const customEvent = new CustomEvent("update-collections-selected", {
      detail: {
        collectionSize,
        collectionName,
        collectionId,
        organizationName,
        createdDt,
      },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(customEvent);
  }

  render() {
    return html`
      <div class="result-item">
        <div class="item-detail">
          <div class="item-detail-text">
            <h3>
              <a
                href="https://archive-it.org/collections/${this.collection
                  .collectionId}"
                target="_blank"
                >${this.collection.collectionName}</a
              >
            </h3>
            <ul>
              <li>
                <span class="item-detail-label"> Organization: </span>
                ${this.collection.organizationName}
              </li>
              ${this.collection.meta_Description
                ? html` <li>
                    <span class="item-detail-label"> Description: </span>
                    ${this.collection.meta_Description[0]}
                  </li>`
                : nothing}
              <li>
                <span class="item-detail-label"> Archived since: </span>
                ${timestampStringToYearMonthString(this.collection.created_dt)}
              </li>
              <li>
                <span class="item-detail-label"> Collection Size: </span>
                ${humanBytes(this.collection.totalWarcBytes)}
              </li>
            </ul>
          </div>
        </div>
        <div class="collection-button">
          <button
            type="button"
            data-collection-id=${this.collection.collectionId}
            data-collection-name=${this.collection.collectionName}
            data-collection-size=${this.collection.totalWarcBytes}
            data-organization-name=${this.collection.organizationName}
            data-created-dt=${this.collection.created_dt}
            @click=${this.handleAddToCartChange}
          >
            ${this.isSelected ? "Remove from cart" : "Add to cart"}
          </button>
        </div>
      </div>
    `;
  }

  static styles = css`
    .result-item {
      background-color: rgb(255, 255, 255);
      border-radius: 6px;
      box-shadow: rgb(136, 136, 136) 1px 1px 6px;
      margin-bottom: 15px;
      display: flex;
      justify-content: space-around;
    }

    .item-detail {
      padding: 1em 0 1em 1em;
      display: inline-block;
      width: 75%;
    }

    .item-detail-text h2,
    .item-detail-text h3 {
      padding: 0;
      margin: 0;
    }

    .item-detail-text ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }

    .item-detail-text ul li {
      margin: 0.6em 0;
      line-height: 1.25;
    }

    .item-detail-text .item-detail-label {
      font-weight: bold;
    }

    .collection-button {
      display: inline-block;
      vertical-align: top;
      padding: 1em;
    }

    button {
      width: 130px;
    }

    a {
      color: #c9540a;
    }
  `;
}
