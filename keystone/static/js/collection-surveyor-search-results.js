import{e,i as t,_ as i,s as l,y as o,a as c,b as n}from"./chunk-query-assigned-elements.js";import"./collection-surveyor-facet.js";import"./collection-surveyor-pagination.js";import{h as s}from"./chunk-collection-surveyor-cart.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function a(t){return e({...t,state:!0})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const r=({finisher:e,descriptor:t})=>(i,l)=>{var o;if(void 0===l){const l=null!==(o=i.originalKey)&&void 0!==o?o:i.key,c=null!=t?{kind:"method",placement:"prototype",key:l,descriptor:t(i.key)}:{...i,key:l};return null!=e&&(c.finisher=function(t){e(t,l)}),c}{const o=i.constructor;void 0!==t&&Object.defineProperty(i,l,t(l)),null==e||e(o,l)}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;let d=class extends l{constructor(){super(...arguments),this.collections=void 0,this.facets={},this.collectionsSelected={},this.currentPage=1,this.itemsPerPage=10}get collectionsLength(){return this.collections?this.collections.length:0}get startIndex(){return(this.currentPage-1)*this.itemsPerPage}get endIndex(){return this.startIndex+this.itemsPerPage}get paginatedResults(){var e;return null===(e=this.collections)||void 0===e?void 0:e.slice(this.startIndex,this.endIndex)}handleUpdateCollectionsSelected(e){const{collectionSize:t,isChecked:i,collectionName:l,collectionId:o}=e.detail;if(i){const e={collectionSize:t,collectionId:o};this.collectionsSelected={...this.collectionsSelected,[l]:e}}else{const{[l]:e,...t}=this.collectionsSelected;this.collectionsSelected={...t}}}handlePageChange(e){this.currentPage=Number(e.detail)}render(){var e;return o`
      <!-- Collections Cart -->
      <collection-surveyor-cart
        .collectionsInCart=${this.collectionsSelected}
      ></collection-surveyor-cart>

      <!-- Facets and Collections-->
      <div class="facets-and-collections-container">
        <!-- Facets  -->
        <div class="facets-container">
          <div>
            <h4>Narrow Your Results</h4>
            ${this.facets?o` ${Object.entries(this.facets).map((([e,t])=>o`
                    <collection-surveyor-facet
                      .facetField=${e}
                      .facetFieldResults=${t}
                    ></collection-surveyor-facet>
                  `))}`:o`<p>No facets available</p>`}
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
          ${null===(e=this.paginatedResults)||void 0===e?void 0:e.map((e=>o`
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
      </div>
    `}};d.styles=t`
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
  `,i([e({type:Array})],d.prototype,"collections",void 0),i([e({type:Object})],d.prototype,"facets",void 0),i([a()],d.prototype,"collectionsSelected",void 0),i([a()],d.prototype,"currentPage",void 0),i([e({type:Number})],d.prototype,"itemsPerPage",void 0),d=i([c("collection-surveyor-search-results")],d);let h=class extends l{constructor(){super(...arguments),this.isChecked=!1}handleCheckboxChange(e){const t=e.target,{collectionId:i,collectionName:l,collectionSize:o}=t.dataset,c=new CustomEvent("update-collections-selected",{detail:{collectionSize:o,isChecked:t.checked,collectionName:l,collectionId:i},bubbles:!0,composed:!0});this.dispatchEvent(c)}render(){return o`
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

              ${this.collection.meta_Description?o` <li>
                    <span class="item-detail-label"> Description: </span>
                    ${this.collection.meta_Description[0]}
                  </li>`:n}
              <li>
                <span class="item-detail-label"> Collection Size: </span>
                ${s(this.collection.totalWarcBytes)}
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
    `}};h.styles=t`
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
  `,i([e({type:Object})],h.prototype,"collection",void 0),i([e({type:Boolean})],h.prototype,"isChecked",void 0),i([function(e){return r({finisher:(t,i)=>{Object.assign(t.prototype[i],e)}})}({capture:!0})],h.prototype,"handleCheckboxChange",null),h=i([c("collection-surveyor-search-result")],h);export{h as CollectionSurveyorSearchResult,d as CollectionSurveyorSearchResults};
//# sourceMappingURL=collection-surveyor-search-results.js.map
