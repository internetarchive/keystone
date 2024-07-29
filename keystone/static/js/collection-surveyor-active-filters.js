import{i as e,_ as t,e as i,s as r,y as a,a as s}from"./chunk-lit-element.js";import{E as l}from"./chunk-index.js";import{r as o}from"./chunk-helpers.js";let n=class extends r{constructor(){super(...arguments),this.activeFilters={f_organizationName:[],f_organizationType:[]}}handleRemoveActiveFilter(e,t){this.emitEvent("facet-deselected",{facetFieldName:e,facetName:t})}emitEvent(e,t={}){this.dispatchEvent(l.createEvent(e,t?{detail:t}:{}))}readableFacetFieldName(e){return e.split("_")[1].split(/(?=[A-Z])/).map((e=>e.charAt(0).toUpperCase()+e.slice(1))).join(" ")}render(){return a`
      <div class="active-filters">
        <h4>Active Filters:</h4>
        <ul>
          ${Object.entries(this.activeFilters).map((([e,t])=>a` ${t.length>0?a`
                    ${t.map((t=>a`
                        <li>
                          <strong
                            >${this.readableFacetFieldName(e)}:</strong
                          >
                          ${o(t,e)}
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
    `}};n.styles=e`
    .active-filters {
      padding: 0px 0px 30px 0px;
    }

    button {
      background: none;
      border: none;
      cursor: pointer;
      color: red;
    }
  `,t([i({type:Object})],n.prototype,"activeFilters",void 0),n=t([s("collection-surveyor-active-filters")],n);export{n as CollectionSurveyorActiveFilters};
//# sourceMappingURL=collection-surveyor-active-filters.js.map
