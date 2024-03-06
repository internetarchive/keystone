import{i as t,_ as a,a as e}from"./chunk-query-assigned-elements.js";import{t as s}from"./chunk-state.js";import{A as i}from"./chunk-arch-data-table.js";import{B as l,E as o}from"./chunk-arch-sub-collection-builder.js";import{i as r,P as h,a as n}from"./chunk-helpers2.js";import{i as m}from"./chunk-helpers.js";import"./chunk-styles.js";import"./chunk-arch-loading-indicator.js";import"./arch-hover-tooltip.js";import"./chunk-sp-overlay.js";import"./chunk-define-element.js";import"./chunk-scale-large.js";import"./chunk-directive.js";import"./chunk-arch-json-schema-form.js";var c=[t`
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
  `];let d=class extends i{constructor(){super(...arguments),this.columnNameHeaderTooltipMap={category:"Dataset categories are Collection, Network, Text, and File Format",sample:"Sample datasets contain only the first 100 available records from a collection"}}willUpdate(t){super.willUpdate(t),this.apiCollectionEndpoint="/datasets",this.apiItemResponseIsArray=!0,this.apiItemTemplate="/datasets?id=:id",this.itemPollPredicate=t=>r(t.state),this.itemPollPeriodSeconds=3,this.apiStaticParamPairs=[],this.cellRenderers=[(t,a)=>a.state!==h.FINISHED?`${a.name}`:`<a href="${n.dataset(a.id)}">\n               <span class="highlightable">${a.name}</span>\n            </a>`,t=>t,(t,a)=>`<a href="${n.collection(a.collection_id)}">\n           <span class="highlightable">${t}</span>\n        </a>`,t=>l[t.toString()],t=>o[t],t=>m(t),t=>null===t?"":m(t)],this.columnFilterDisplayMaps=[void 0,void 0,void 0,l],this.columns=["name","category_name","collection_name","is_sample","state","start_time","finished_time"],this.columnHeaders=["Dataset","Category","Collection","Sample","State","Started","Finished"],this.filterableColumns=[!0,!0,!0,!0,!0,!1,!1],this.searchColumns=["name","category_name","collection_name","state"],this.searchColumnLabels=["Name","Category","Collection","State"],this.singleName="Dataset",this.sort="-start_time",this.sortableColumns=[!0,!0,!0,!0,!0,!0,!0],this.persistSearchStateInUrl=!0,this.pluralName="Datasets"}};d.styles=[...i.styles,...c],a([s()],d.prototype,"columnNameHeaderTooltipMap",void 0),d=a([e("arch-dataset-explorer-table")],d);export{d as ArchDatasetExplorerTable};
//# sourceMappingURL=arch-dataset-explorer-table.js.map
