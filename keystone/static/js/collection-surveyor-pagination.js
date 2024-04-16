import{i as t,_ as e,e as s,s as a,y as i,a as r}from"./chunk-lit-element.js";let o=class extends a{constructor(){super(...arguments),this.currentPage=1,this.itemsPerPage=1,this.totalResults=0}get totalPages(){return Math.ceil(this.totalResults/this.itemsPerPage)}jumpToPage(t){this.currentPage=t,this.dispatchEvent(new CustomEvent("page-changed",{detail:this.currentPage})),window.scrollTo({top:0,behavior:"smooth"})}nextPage(){this.currentPage<this.totalPages&&this.jumpToPage(this.currentPage+1)}prevPage(){this.currentPage<this.totalPages&&this.jumpToPage(this.currentPage-1)}render(){return i`
      <div class="pagination">
        <button @click="${this.prevPage}" ?disabled="${1===this.currentPage}">
          Previous
        </button>
        <span
          >Page ${this.currentPage} of ${this.totalPages} (${this.totalResults}
          Total Results)</span
        >
        <button
          @click="${this.nextPage}"
          ?disabled="${this.currentPage===this.totalPages}"
        >
          Next
        </button>
      </div>
    `}};o.styles=t`
    .pagination {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
  `,e([s({type:Number})],o.prototype,"currentPage",void 0),e([s({type:Number})],o.prototype,"itemsPerPage",void 0),e([s({type:Number})],o.prototype,"totalResults",void 0),o=e([r("collection-surveyor-pagination")],o);export{o as CollectionSurveyorPagination};
//# sourceMappingURL=collection-surveyor-pagination.js.map
