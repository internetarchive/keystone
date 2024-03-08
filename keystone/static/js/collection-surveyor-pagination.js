import{i as t,_ as e,e as s,s as a,y as o,a as i}from"./chunk-query-assigned-elements.js";let r=class extends a{constructor(){super(...arguments),this.currentPage=1,this.itemsPerPage=1,this.totalResults=0,this.backgroundCollectionsLoaded=!1}get totalPages(){return Math.ceil(this.totalResults/this.itemsPerPage)}jumpToPage(t){this.currentPage=t,this.dispatchEvent(new CustomEvent("page-changed",{detail:this.currentPage})),window.scrollTo({top:300,behavior:"smooth"})}nextPage(){this.currentPage<this.totalPages&&this.jumpToPage(this.currentPage+1)}prevPage(){this.currentPage<=this.totalPages&&this.jumpToPage(this.currentPage-1)}render(){return o`
      <div class="pagination">
        <button @click="${this.prevPage}" ?disabled="${1===this.currentPage}">
          Previous
        </button>
        ${this.backgroundCollectionsLoaded?o` <span
              >Page ${this.currentPage} of ${this.totalPages}
              (${this.totalResults} Total Results)</span
            >`:o`<span>Page ${this.currentPage} </span>`}
        <button
          @click="${this.nextPage}"
          ?disabled="${this.currentPage===this.totalPages}"
        >
          Next
        </button>
      </div>
    `}};r.styles=t`
    .pagination {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
  `,e([s({type:Number})],r.prototype,"currentPage",void 0),e([s({type:Number})],r.prototype,"itemsPerPage",void 0),e([s({type:Number})],r.prototype,"totalResults",void 0),e([s({type:Boolean})],r.prototype,"backgroundCollectionsLoaded",void 0),r=e([i("collection-surveyor-pagination")],r);export{r as CollectionSurveyorPagination};
//# sourceMappingURL=collection-surveyor-pagination.js.map
