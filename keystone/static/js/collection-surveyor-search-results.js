import{i as e,_ as t,e as o,s as i,y as c,a as l,b as a}from"./chunk-lit-element.js";import{t as s}from"./chunk-state.js";import{e as n}from"./chunk-event-options.js";import"./collection-surveyor-facet.js";import"./collection-surveyor-pagination.js";import"./collection-surveyor-cart.js";import"./collection-surveyor-search-bar.js";import"./collection-surveyor-active-filters.js";import{t as r}from"./chunk-helpers.js";import{h as d}from"./chunk-helpers2.js";import"./chunk-index.js";const h=/csrftoken=([^;$]+)/,p=()=>{const e=h.exec(decodeURIComponent(document.cookie));return e?{"X-CSRFToken":e[1]}:{}};function u(e,t){return function(e){const t={method:e.method,headers:{...p(),Accept:"application/json","Content-Type":"application/json"}};return e.body&&(t.body=JSON.stringify(e.body)),fetch(e.url,t).then((t=>{if(t.ok)return t.json().then((e=>e));throw new Error(e.errorMessage)})).catch((t=>(console.error(t),Promise.reject(e.errorMessage))))}({url:`/collection_surveyor/search/?q=${encodeURIComponent(e)}&r=${encodeURIComponent(t)}`,method:"GET",errorMessage:"error in collection surveyor search"})}var g;let m=g=class extends i{constructor(){super(...arguments),this.collections=void 0,this.cachedCollections=void 0,this.facets={},this.cachedFacets={},this.isLoading=!1,this.backgroundCollectionsLoaded=!1,this.collectionsSelected={},this.selectedFacets={f_organizationName:[],f_organizationType:[]},this.searchTerm="",this.currentPage=1,this.itemsPerPage=100}connectedCallback(){super.connectedCallback(),this.loadSearchFirstPage().then((()=>this.loadRemainingSearchResultsInBackgroundAndCacheData())).catch((e=>{throw e}))}get collectionsLength(){return this.collections?this.collections.length:0}get startIndex(){return(this.currentPage-1)*this.itemsPerPage}get endIndex(){return this.startIndex+this.itemsPerPage}get paginatedResults(){var e;return null===(e=this.collections)||void 0===e?void 0:e.slice(this.startIndex,this.endIndex)}handleUpdateCollectionsSelected(e){const{collectionSize:t,collectionName:o,collectionId:i,organizationName:c,createdDt:l}=e.detail;if(o in this.collectionsSelected)this.removeCollectionFromCollectionsSelected(o);else{const e={collectionSize:t,collectionId:i,organizationName:c,createdDt:l};this.collectionsSelected={...this.collectionsSelected,[o]:e}}}handleRemoveCollectionFromCart(e){const{collectionName:t}=e.detail;this.removeCollectionFromCollectionsSelected(t)}removeCollectionFromCollectionsSelected(e){const{[e]:t,...o}=this.collectionsSelected;this.collectionsSelected={...o}}handlePageChange(e){this.currentPage=Number(e.detail)}handleFacetSelected(e){const t=e.detail.facetName,o=e.detail.facetFieldName;this.selectedFacets={...this.selectedFacets,[o]:[...this.selectedFacets[o],t]},this.loadSearchResults()}handleFacetDeselected(e){const t=e.detail.facetName,o=e.detail.facetFieldName;this.selectedFacets={...this.selectedFacets,[o]:this.selectedFacets[o].filter((e=>e!==t))},this.loadSearchResults()}get filterQuery(){return Object.entries(this.selectedFacets).flatMap((([e,t])=>{const o=e.slice(2);return t.map((e=>`${o}:"${e}"`))}))}handleSearchClicked(e){const t=e.detail.searchText;this.searchTerm=t,this.loadSearchResults()}get finalSearchTerm(){return e=this.searchTerm,0===(t=this.filterQuery).length?e:""===e?t.join(" AND "):[...t,e].join(" AND ");var e,t}loadSearchFirstPage(){return this.performSearch(this.finalSearchTerm,this.itemsPerPage).then((()=>{this.currentPage=1}))}loadRemainingSearchResultsInBackground(){return this.backgroundCollectionsLoaded=!1,this.performSearch(this.finalSearchTerm,g.MAX_COLLECTION_COUNT).then((()=>{this.backgroundCollectionsLoaded=!0}))}loadRemainingSearchResultsInBackgroundAndCacheData(){this.performSearch("",g.MAX_COLLECTION_COUNT).then((e=>{this.cachedCollections=e.collections,this.cachedFacets=e.facets,this.backgroundCollectionsLoaded=!0})).catch((e=>{throw e}))}loadSearchResults(){""===this.finalSearchTerm&&void 0!==this.cachedCollections&&void 0!==this.cachedFacets?(this.collections=this.cachedCollections,this.facets=this.cachedFacets,this.currentPage=1):this.loadSearchFirstPage().then((()=>this.loadRemainingSearchResultsInBackground())).catch((e=>{throw e}))}performSearch(e,t){return this.isLoading=!0,u(e,t).then((e=>(this.collections=e.collections,this.facets=e.facets,this.isLoading=!1,e))).catch((e=>{throw this.isLoading=!1,e}))}render(){var e;return c`
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
                      .backgroundCollectionsLoaded="${this.backgroundCollectionsLoaded}"
                      @page-changed="${this.handlePageChange}"
                    ></collection-surveyor-pagination>

                    <!-- Collections -->
                    ${null===(e=this.paginatedResults)||void 0===e?void 0:e.map((e=>c`
                        <collection-surveyor-search-result
                          .collection=${e}
                          .isSelected=${e.collectionName in this.collectionsSelected}
                          @update-collections-selected="${this.handleUpdateCollectionsSelected}"
                        ></collection-surveyor-search-result>
                      `))}

                    <!-- Pagination bottom of page -->
                    <collection-surveyor-pagination
                      .currentPage="${this.currentPage}"
                      .totalResults="${this.collectionsLength}"
                      .itemsPerPage="${this.itemsPerPage}"
                      .backgroundCollectionsLoaded="${this.backgroundCollectionsLoaded}"
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
      </div>
    `}};m.MAX_COLLECTION_COUNT=14e3,m.styles=e`
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
  `,t([s()],m.prototype,"collections",void 0),t([s()],m.prototype,"cachedCollections",void 0),t([s()],m.prototype,"facets",void 0),t([s()],m.prototype,"cachedFacets",void 0),t([s()],m.prototype,"isLoading",void 0),t([s()],m.prototype,"backgroundCollectionsLoaded",void 0),t([s()],m.prototype,"collectionsSelected",void 0),t([s()],m.prototype,"selectedFacets",void 0),t([s()],m.prototype,"searchTerm",void 0),t([s()],m.prototype,"currentPage",void 0),t([o({type:Number})],m.prototype,"itemsPerPage",void 0),m=g=t([l("collection-surveyor-search-results")],m);let v=class extends i{constructor(){super(...arguments),this.isSelected=!1}handleAddToCartChange(e){const t=e.target,{collectionId:o,collectionName:i,collectionSize:c,organizationName:l,createdDt:a}=t.dataset,s=new CustomEvent("update-collections-selected",{detail:{collectionSize:c,collectionName:i,collectionId:o,organizationName:l,createdDt:a},bubbles:!0,composed:!0});this.dispatchEvent(s)}render(){return c`
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
                <span class="item-detail-label"> Organization: </span>
                ${this.collection.organizationName}
              </li>
              ${this.collection.meta_Description?c` <li>
                    <span class="item-detail-label"> Description: </span>
                    ${this.collection.meta_Description[0]}
                  </li>`:a}
              <li>
                <span class="item-detail-label"> Archived since: </span>
                ${r(this.collection.created_dt)}
              </li>
              <li>
                <span class="item-detail-label"> Collection Size: </span>
                ${d(this.collection.totalWarcBytes)}
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
            ${this.isSelected?"Remove from cart":"Add to cart"}
          </button>
        </div>
      </div>
    `}};v.styles=e`
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
  `,t([o({type:Object})],v.prototype,"collection",void 0),t([o({type:Boolean})],v.prototype,"isSelected",void 0),t([n({capture:!0})],v.prototype,"handleAddToCartChange",null),v=t([l("collection-surveyor-search-result")],v);export{v as CollectionSurveyorSearchResult,m as CollectionSurveyorSearchResults};
//# sourceMappingURL=collection-surveyor-search-results.js.map
