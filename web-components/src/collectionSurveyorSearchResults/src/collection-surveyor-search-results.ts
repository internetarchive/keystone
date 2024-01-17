import { html, css, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { eventOptions } from "lit/decorators/event-options.js";

import "../../collectionSurveyorFacet/index";
import "../../collectionSurveyorPagination/index";
import "../../collectionSurveyorCart/index";

import {
  CollectionSearchResult,
  Facets,
  CollectionCheckboxEventDetail,
  CollectionSelectedDetail,
  CollectionRemovedFromCartDetail,
} from "../../lib/types";

import { humanBytes } from "../../lib/webservices/src/lib/helpers";

@customElement("collection-surveyor-search-results")
export class CollectionSurveyorSearchResults extends LitElement {
  @property({ type: Array }) collections?: CollectionSearchResult[] = undefined;

  @property({ type: Object }) facets?: Facets = {};

  @state() collectionsSelected: {
    [collectionName: string]: CollectionSelectedDetail;
  } = {};

  @state() currentPage = 1;

  @property({ type: Number }) itemsPerPage = 10;

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
      isChecked,
      collectionName,
      collectionId,
    }: CollectionCheckboxEventDetail =
      event.detail as CollectionCheckboxEventDetail;

    if (isChecked) {
      const sizeIdMap: CollectionSelectedDetail = {
        collectionSize: collectionSize,
        collectionId: collectionId,
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

  render() {
    return html`
      <!-- Collections Cart -->
      <collection-surveyor-cart
        .collectionsInCart=${this.collectionsSelected}
        @collection-removed-from-cart=${this.handleRemoveCollectionFromCart}
      ></collection-surveyor-cart>

      <!-- Facets and Collections-->
      <div class="facets-and-collections-container">
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
                    ></collection-surveyor-facet>
                  `
                )}`
              : html`<p>No facets available</p>`}
          </div>
        </div>

        <!-- Collections -->
        <div class="collections-container">
          <!-- Pagination top of page -->
          <collection-surveyor-pagination
            .currentPage="${this.currentPage}"
            .totalResults="${this.collectionsLength}"
            .itemsPerPage="${this.itemsPerPage}"
            @page-changed="${this.handlePageChange}"
          ></collection-surveyor-pagination>

          <!-- Collections -->
          ${this.paginatedResults?.map(
            (collection) => html`
              <collection-surveyor-search-result
                .collection=${collection}
                .isChecked=${collection.collectionName in
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
            @page-changed="${this.handlePageChange}"
          ></collection-surveyor-pagination>
        </div>
      </div>
    `;
  }

  static styles = css`
    .facets-and-collections-container {
      display: flex;
      background-color: rgb(248, 248, 248);
    }

    .facets-container {
      display: flex;
      padding: 10px;
      padding-left: 50px;
      max-width: 400px;
    }

    .collections-container {
      display: flex;
      flex-direction: column;
      padding: 10px;
      padding-right: 50px;
      width: -webkit-fill-available;
    }
  `;
}

@customElement("collection-surveyor-search-result")
export class CollectionSurveyorSearchResult extends LitElement {
  @property({ type: Object }) collection!: CollectionSearchResult;

  @property({ type: Boolean }) isChecked = false;

  @eventOptions({ capture: true })
  handleCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const { collectionId, collectionName, collectionSize } = checkbox.dataset;

    const customEvent = new CustomEvent("update-collections-selected", {
      detail: {
        collectionSize,
        isChecked: checkbox.checked,
        collectionName,
        collectionId,
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
                <span class="item-detail-label"> Organization ID: </span>
                ${this.collection.organizationId}
              </li>
              <li>
                <span class="item-detail-label"> Organization: </span>
                ${this.collection.organizationName}
              </li>
              <li>
                <span class="item-detail-label"> Collection ID: </span>
                ${this.collection.collectionId}
              </li>

              ${this.collection.meta_Description
                ? html` <li>
                    <span class="item-detail-label"> Description: </span>
                    ${this.collection.meta_Description[0]}
                  </li>`
                : nothing}
              <li>
                <span class="item-detail-label"> Collection Size: </span>
                ${humanBytes(this.collection.totalWarcBytes)}
              </li>
              <li>
                <input
                  type="checkbox"
                  data-collection-id=${this.collection.collectionId}
                  data-collection-name=${this.collection.collectionName}
                  data-collection-size=${this.collection.totalWarcBytes}
                  @change=${this.handleCheckboxChange}
                  .checked=${this.isChecked}
                />
                add collection to list
              </li>
            </ul>
          </div>
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
    }

    .item-detail {
      padding: 1em;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 2em;
    }

    .item-detail-text {
      max-width: 600px;
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
      margin: 0.6em 0 0.6em 0;
    }

    .item-detail-text .item-detail-label {
      font-weight: bold;
    }
  `;
}
