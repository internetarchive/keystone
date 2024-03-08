import{i as e,_ as t,e as i,s as r,y as s,a}from"./chunk-query-assigned-elements.js";import{E as l}from"./chunk-eventHelpers.js";import{r as n}from"./chunk-helpers.js";let o=class extends r{constructor(){super(...arguments),this.activeFilters={f_organizationName:[],f_organizationType:[]}}handleRemoveActiveFilter(e,t){this.emitEvent("facet-deselected",{facetFieldName:e,facetName:t})}emitEvent(e,t={}){this.dispatchEvent(l.createEvent(e,t?{detail:t}:{}))}readableFacetFieldName(e){return e.split("_")[1].split(/(?=[A-Z])/).map((e=>e.charAt(0).toUpperCase()+e.slice(1))).join(" ")}render(){return s`
      <div class="active-filters">
        <h4>Active Filters:</h4>
        <ul>
          ${Object.entries(this.activeFilters).map((([e,t])=>s` ${t.length>0?s`
                    ${t.map((t=>s`
                        <li>
                          <strong
                            >${this.readableFacetFieldName(e)}:</strong
                          >
                          ${n(t,e)}
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
    .active-filters {
      padding: 0px 0px 30px 0px;
    }

    button {
      background: none;
      border: none;
      cursor: pointer;
      color: red;
    }
  `,t([i({type:Object})],o.prototype,"activeFilters",void 0),o=t([a("collection-surveyor-active-filters")],o);export{o as CollectionSurveyorActiveFilters};
//# sourceMappingURL=collection-surveyor-active-filters.js.map
