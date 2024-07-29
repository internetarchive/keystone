import{i as t,_ as a,a as e}from"./chunk-lit-element.js";import{t as s}from"./chunk-state.js";import{A as l}from"./chunk-arch-data-table.js";import{i,P as o,a as r,B as n,E as h}from"./chunk-helpers.js";import{i as c}from"./chunk-helpers2.js";import"./chunk-styles.js";import"./arch-loading-indicator.js";import"./arch-hover-tooltip.js";import"./chunk-scale-large.js";import"./chunk-sp-overlay.js";var m=[t`
    data-table {
      min-width: 60rem;
    }

    data-table > table {
      table-layout: fixed;
    }

    data-table > table > thead > tr > th.category {
      width: 8em;
    }

    data-table > table > thead > tr > th.sample {
      width: 7em;
    }

    data-table > table > thead > tr > th.state {
      width: 6em;
    }

    data-table > table > thead > tr > th.started {
      width: 9em;
    }

    data-table > table > thead > tr > th.finished {
      width: 9em;
    }

    data-table > table > thead > tr > th {
      max-width: none;
    }

    span.no-collection-access {
      cursor: not-allowed;
      text-decoration: underline;
    }
  `];let d=class extends l{constructor(){super(...arguments),this.columnNameHeaderTooltipMap={category:"Dataset categories are Collection, Network, Text, and File Format",sample:"Sample datasets contain only the first 100 available records from a collection"}}willUpdate(t){super.willUpdate(t),this.apiCollectionEndpoint="/datasets",this.apiItemResponseIsArray=!0,this.apiItemTemplate="/datasets?id=:id",this.itemPollPredicate=t=>i(t.state),this.itemPollPeriodSeconds=3,this.apiStaticParamPairs=[],this.cellRenderers=[(t,a)=>a.state!==o.FINISHED?`${a.name}`:`<a href="${r.dataset(a.id)}">\n               <span class="highlightable">${a.name}</span>\n            </a>`,t=>t,(t,a)=>a.collection_access?`<a href="${r.collection(a.collection_id)}">\n            <span class="highlightable">${t}</span>\n          </a>`:`<span class="highlightable no-collection-access"\n                   title="You are not authorized to access this collection">\n            ${t}\n          </span>`,t=>n[t.toString()],t=>h[t],t=>c(t),t=>null===t?"":c(t)],this.columnFilterDisplayMaps=[void 0,void 0,void 0,n],this.columns=["name","category_name","collection_name","is_sample","state","start_time","finished_time"],this.columnHeaders=["Dataset","Category","Collection","Sample","State","Started","Finished"],this.filterableColumns=[!0,!0,!0,!0,!0,!1,!1],this.searchColumns=["name","category_name","collection_name","state"],this.searchColumnLabels=["Name","Category","Collection","State"],this.singleName="Dataset",this.sort="-start_time",this.sortableColumns=[!0,!0,!0,!0,!0,!0,!0],this.persistSearchStateInUrl=!0,this.pluralName="Datasets"}};d.styles=[...l.styles,...m],a([s()],d.prototype,"columnNameHeaderTooltipMap",void 0),d=a([e("arch-dataset-explorer-table")],d);export{d as ArchDatasetExplorerTable};
//# sourceMappingURL=arch-dataset-explorer-table.js.map
