import{i as e,_ as t,e as r,s as a,y as s,a as h}from"./chunk-query-assigned-elements.js";import{E as n}from"./chunk-eventHelpers.js";let c=class extends a{constructor(){super(...arguments),this.searchText=""}render(){return s`
      <div class="search-bar-container">
        <div class="search-bar-contents">
          <h3>Explore All Collections</h3>
          <p>
            Collections in the archive are listed below. Narrow your results
            below at left, or enter a search query.
          </p>
          <div class="search-bar">
            <input
              type="text"
              placeholder="Search..."
              .value="${this.searchText}"
              @input="${this.handleInputChange}"
              @keydown="${this.handleEnter}"
            />
            <button @click="${this.handleSearch}">Search</button>
            <button @click="${this.handleClear}">Clear</button>
          </div>
        </div>
      </div>
    `}handleInputChange(e){const t=e.target;this.searchText=t.value}handleSearch(){this.emitEvent("search-clicked",{searchText:this.searchText})}handleClear(){this.searchText="",this.handleSearch()}handleEnter(e){"Enter"===e.key&&this.handleSearch()}emitEvent(e,t={}){this.dispatchEvent(n.createEvent(e,t?{detail:t}:{}))}};c.styles=e`
    .search-bar-container {
      padding: 0px 0px 6px 0px;
    }

    .search-bar-contents {
      padding: 20px;
      background-color: rgb(255, 255, 255);
      box-shadow: rgb(136, 136, 136) 1px 1px 6px;
      border-radius: 6px;
    }

    .search-bar {
      display: flex;
    }

    input {
      flex-grow: 1;
      height: 30px;
    }

    button {
      margin: 2px;
    }
  `,t([r({type:String})],c.prototype,"searchText",void 0),c=t([h("collection-surveyor-search-bar")],c);export{c as CollectionSurveyorSearchBar};
//# sourceMappingURL=collection-surveyor-search-bar.js.map
