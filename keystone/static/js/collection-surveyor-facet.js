import{i as e,_ as t,e as a,s as i,y as s,a as l}from"./chunk-lit-element.js";let r=class extends i{constructor(){super(...arguments),this.facetField="",this.facetFieldResults=[]}readableFacetFieldName(e){return e.split("_")[1].split(/(?=[A-Z])/).map((e=>e.charAt(0).toUpperCase()+e.slice(1))).join(" ")}render(){return s`
      <div class="facet">
        <h3>${this.readableFacetFieldName(this.facetField)}</h3>
        <hr />
        <div class="facetResults">
          <ul>
            ${this.facetFieldResults.map((e=>s`
                <li>${e.name} (${e.count})</li>
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
  `,t([a({type:String})],r.prototype,"facetField",void 0),t([a({type:Array})],r.prototype,"facetFieldResults",void 0),r=t([l("collection-surveyor-facet")],r);export{r as CollectionSurveyorFacet};
//# sourceMappingURL=collection-surveyor-facet.js.map
