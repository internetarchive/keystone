import{i as e,_ as t,e as a,s,y as l,a as c}from"./chunk-query-assigned-elements.js";import{E as i}from"./chunk-index.js";import{r as d}from"./chunk-helpers.js";let r=class extends s{constructor(){super(...arguments),this.facetField="",this.facetFieldResults=[],this.selectedfacetFieldResults=[]}readableFacetFieldName(e){return e.split("_")[1].split(/(?=[A-Z])/).map((e=>e.charAt(0).toUpperCase()+e.slice(1))).join(" ")}handleSelectFacet(e){this.selectedfacetFieldResults.includes(e)||this.emitEvent("facet-selected",{facetFieldName:this.facetField,facetName:e})}handleDeselectFacet(e){this.emitEvent("facet-deselected",{facetFieldName:this.facetField,facetName:e})}emitEvent(e,t={}){this.dispatchEvent(i.createEvent(e,t?{detail:t}:{}))}render(){return l`
      <div class="facet">
        <h3>${this.readableFacetFieldName(this.facetField)}</h3>
        <hr />
        <div class="facetResults">
          <ul>
            ${this.facetFieldResults.map((e=>l`
                ${e.count>0?l`
                      <li
                        class=${this.selectedfacetFieldResults.includes(e.name)?"selected":"notSelected"}
                      >
                        <span
                          class="facet-data"
                          @click=${()=>{this.handleSelectFacet(e.name)}}
                          @keydown=${()=>{}}
                        >
                          ${d(e.name,this.facetField)}
                          (${e.count})
                        </span>
                        ${this.selectedfacetFieldResults.includes(e.name)?l`
                              <button
                                @click=${()=>this.handleDeselectFacet(e.name)}
                              >
                                remove
                              </button>
                            `:""}
                      </li>
                    `:l``}
              `))}
          </ul>
        </div>
      </div>
    `}};r.styles=e`
    .facet {
      border-radius: 6px;
      background-color: rgb(255, 255, 255);
      box-shadow: rgb(136, 136, 136) 1px 1px 6px;
      padding: 10px;
      margin-bottom: 15px;
    }

    .facetResults {
      max-height: 300px;
      overflow-y: auto;
    }

    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }

    li {
      margin: 0.2em 0 0.2em 0;
    }

    .notSelected .facet-data:hover {
      text-decoration: underline;
      cursor: pointer;
    }

    button {
      background: none;
      border: none;
      cursor: pointer;
      color: red;
    }
  `,t([a({type:String})],r.prototype,"facetField",void 0),t([a({type:Array})],r.prototype,"facetFieldResults",void 0),t([a({type:Array})],r.prototype,"selectedfacetFieldResults",void 0),r=t([c("collection-surveyor-facet")],r);export{r as CollectionSurveyorFacet};
//# sourceMappingURL=collection-surveyor-facet.js.map
