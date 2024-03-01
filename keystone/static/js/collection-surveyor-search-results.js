import{e,i as t,_ as i,s as o,y as c,a as l,b as s}from"./chunk-query-assigned-elements.js";import"./collection-surveyor-facet.js";import"./collection-surveyor-pagination.js";import{h as n}from"./chunk-collection-surveyor-cart.js";import"./collection-surveyor-search-bar.js";import"./collection-surveyor-active-filters.js";import"./chunk-eventHelpers.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function a(t){return e({...t,state:!0})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const r=({finisher:e,descriptor:t})=>(i,o)=>{var c;if(void 0===o){const o=null!==(c=i.originalKey)&&void 0!==c?c:i.key,l=null!=t?{kind:"method",placement:"prototype",key:o,descriptor:t(i.key)}:{...i,key:o};return null!=e&&(l.finisher=function(t){e(t,o)}),l}{const c=i.constructor;void 0!==t&&Object.defineProperty(i,o,t(o)),null==e||e(c,o)}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;const d=/csrftoken=([^;$]+)/,h=()=>{const e=d.exec(decodeURIComponent(document.cookie));return e?{"X-CSRFToken":e[1]}:{}};function p(e,t){const i=function(e,t){return 0===t.length?e:""===e?t.join(" AND "):[...t,e].join(" AND ")}(e,t);return function(e){const t={method:e.method,headers:{...h(),Accept:"application/json","Content-Type":"application/json"}};return e.body&&(t.body=JSON.stringify(e.body)),fetch(e.url,t).then((t=>{if(t.ok)return t.json().then((e=>e));throw new Error(e.errorMessage)})).catch((t=>(console.error(t),Promise.reject(e.errorMessage))))}({url:`/collection_surveyor/search/?q=${encodeURIComponent(i)}`,method:"GET",errorMessage:"error in collection surveyor search"})}let u=class extends o{constructor(){super(...arguments),this.collections=void 0,this.facets={},this.isLoading=!0,this.collectionsSelected={},this.selectedFacets={f_collectionName:[],f_organizationName:[],f_organizationType:[]},this.searchTerm="",this.currentPage=1,this.itemsPerPage=10}connectedCallback(){super.connectedCallback(),this.search()}get collectionsLength(){return this.collections?this.collections.length:0}get startIndex(){return(this.currentPage-1)*this.itemsPerPage}get endIndex(){return this.startIndex+this.itemsPerPage}get paginatedResults(){var e;return null===(e=this.collections)||void 0===e?void 0:e.slice(this.startIndex,this.endIndex)}handleUpdateCollectionsSelected(e){const{collectionSize:t,isChecked:i,collectionName:o,collectionId:c}=e.detail;if(i){const e={collectionSize:t,collectionId:c};this.collectionsSelected={...this.collectionsSelected,[o]:e}}else this.removeCollectionFromCollectionsSelected(o)}handleRemoveCollectionFromCart(e){const{collectionName:t}=e.detail;this.removeCollectionFromCollectionsSelected(t)}removeCollectionFromCollectionsSelected(e){const{[e]:t,...i}=this.collectionsSelected;this.collectionsSelected={...i}}handlePageChange(e){this.currentPage=Number(e.detail)}handleFacetSelected(e){const t=e.detail.facetName,i=e.detail.facetFieldName;this.selectedFacets={...this.selectedFacets,[i]:[...this.selectedFacets[i],t]},this.search()}handleFacetDeselected(e){const t=e.detail.facetName,i=e.detail.facetFieldName;this.selectedFacets={...this.selectedFacets,[i]:this.selectedFacets[i].filter((e=>e!==t))},this.search()}get filterQuery(){return Object.entries(this.selectedFacets).flatMap((([e,t])=>{const i=e.slice(2);return t.map((e=>`${i}:"${e}"`))}))}handleSearchClicked(e){const t=e.detail.searchText;this.searchTerm=t,this.search()}search(){this.isLoading=!0,p(this.searchTerm,this.filterQuery).then((e=>{this.collections=e.collections,this.facets=e.facets,this.isLoading=!1})).catch((e=>{this.isLoading=!1}))}render(){var e;return c`
      <!-- Collections Cart -->
      <collection-surveyor-cart
        .collectionsInCart=${this.collectionsSelected}
        @collection-removed-from-cart=${this.handleRemoveCollectionFromCart}
      ></collection-surveyor-cart>

      <!-- Search Bar -->
      <collection-surveyor-search-bar
        .searchText=${this.searchTerm}
        @search-clicked="${this.handleSearchClicked}"
      ></collection-surveyor-search-bar>

      <!-- Facets and Collections-->
      <div class="facets-and-collections-container">
        <!-- Loading icon -->
          <div class="loading">
            ${this.isLoading?c`<div class="spinner"></div>`:c``}
          </div>

        ${0!==this.collectionsLength?c`
                <!-- Facets  -->
                <div class="facets-container">
                  <div>
                    <h4>Narrow Your Results</h4>
                    ${this.facets?c` ${Object.entries(this.facets).map((([e,t])=>c`
                            <collection-surveyor-facet
                              .facetField=${e}
                              .facetFieldResults=${t}
                              .selectedfacetFieldResults=${this.selectedFacets[e]}
                              @facet-selected=${this.handleFacetSelected}
                              @facet-deselected=${this.handleFacetDeselected}
                            ></collection-surveyor-facet>
                          `))}`:c`<p>No facets available</p>`}
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
                    @page-changed="${this.handlePageChange}"
                  ></collection-surveyor-pagination>

                  <!-- Collections -->
                  ${null===(e=this.paginatedResults)||void 0===e?void 0:e.map((e=>c`
                      <collection-surveyor-search-result
                        .collection=${e}
                        .isChecked=${e.collectionName in this.collectionsSelected}
                        @update-collections-selected="${this.handleUpdateCollectionsSelected}"
                      ></collection-surveyor-search-result>
                    `))}

                  <!-- Pagination bottom of page -->
                  <collection-surveyor-pagination
                    .currentPage="${this.currentPage}"
                    .totalResults="${this.collectionsLength}"
                    .itemsPerPage="${this.itemsPerPage}"
                    @page-changed="${this.handlePageChange}"
                  ></collection-surveyor-pagination>
                </div>
              `:c``}

        ${0!==this.collectionsLength||this.isLoading?c``:c`
                <div class="no-results-message">
                  <h2>No Results Found For Your Search</h2>
                  <p>Try a new search or clear your previous search</p>
                  <p></p>
                </div>
              `}
        </div>
      </div>
    `}};u.styles=t`
    .facets-and-collections-container {
      display: flex;
      background-color: rgb(248, 248, 248);
      position: relative;
    }

    .facets-container {
      display: flex;
      padding: 10px 30px 10px 50px;
      width: 40%;
    }

    .collections-container {
      display: flex;
      flex-direction: column;
      padding: 10px;
      padding-right: 50px;
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
  `,i([e({type:Array})],u.prototype,"collections",void 0),i([e({type:Object})],u.prototype,"facets",void 0),i([e({type:Boolean})],u.prototype,"isLoading",void 0),i([a()],u.prototype,"collectionsSelected",void 0),i([a()],u.prototype,"selectedFacets",void 0),i([a()],u.prototype,"searchTerm",void 0),i([a()],u.prototype,"currentPage",void 0),i([e({type:Number})],u.prototype,"itemsPerPage",void 0),u=i([l("collection-surveyor-search-results")],u);let g=class extends o{constructor(){super(...arguments),this.isChecked=!1}handleCheckboxChange(e){const t=e.target,{collectionId:i,collectionName:o,collectionSize:c}=t.dataset,l=new CustomEvent("update-collections-selected",{detail:{collectionSize:c,isChecked:t.checked,collectionName:o,collectionId:i},bubbles:!0,composed:!0});this.dispatchEvent(l)}render(){return c`
      <div class="result-item">
        <div class="item-detail">
          <div class="item-detail-text">
            <h3>
              <a
                href="https://archive-it.org/collections/${this.collection.collectionId}"
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

              ${this.collection.meta_Description?c` <li>
                    <span class="item-detail-label"> Description: </span>
                    ${this.collection.meta_Description[0]}
                  </li>`:s}
              <li>
                <span class="item-detail-label"> Collection Size: </span>
                ${n(this.collection.totalWarcBytes)}
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
    `}};g.styles=t`
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
  `,i([e({type:Object})],g.prototype,"collection",void 0),i([e({type:Boolean})],g.prototype,"isChecked",void 0),i([function(e){return r({finisher:(t,i)=>{Object.assign(t.prototype[i],e)}})}({capture:!0})],g.prototype,"handleCheckboxChange",null),g=i([l("collection-surveyor-search-result")],g);export{g as CollectionSurveyorSearchResult,u as CollectionSurveyorSearchResults};
//# sourceMappingURL=collection-surveyor-search-results.js.map
