import{i as e,_ as t,e as i,s as r,y as a,a as s}from"./chunk-query-assigned-elements.js";import{E as l}from"./chunk-eventHelpers.js";let o=class extends r{constructor(){super(...arguments),this.activeFilters={f_collectionName:[],f_organizationName:[],f_organizationType:[]}}handleRemoveActiveFilter(e,t){this.emitEvent("facet-deselected",{facetFieldName:e,facetName:t})}emitEvent(e,t={}){this.dispatchEvent(l.createEvent(e,t?{detail:t}:{}))}readableFacetFieldName(e){return e.split("_")[1].split(/(?=[A-Z])/).map((e=>e.charAt(0).toUpperCase()+e.slice(1))).join(" ")}render(){return a`
      <div class="active-filters">
        <h4>Active Filters:</h4>
        <ul>
          ${Object.entries(this.activeFilters).map((([e,t])=>a` ${t.length>0?a`
                    ${t.map((t=>a`
                        <li>
                          <strong
                            >${this.readableFacetFieldName(e)}:</strong
                          >
                          ${t}
                          <button
                            @click=${()=>this.handleRemoveActiveFilter(e,t)}
                          >
                            remove
                          </button>
                        </li>
                      `))}
                  `:""}`))}
        </ul>
      </div>
    `}};o.styles=e`
    button {
      background: none;
      border: none;
      cursor: pointer;
      color: red;
    }
  `,t([i({type:Object})],o.prototype,"activeFilters",void 0),o=t([s("collection-surveyor-active-filters")],o);export{o as CollectionSurveyorActiveFilters};
//# sourceMappingURL=collection-surveyor-active-filters.js.map
