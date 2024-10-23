import{i as t,_ as e,a}from"./chunk-lit-element.js";import{t as s}from"./chunk-state.js";import{A as l}from"./chunk-arch-data-table.js";import{P as i,a as o,i as r,B as n,E as c}from"./chunk-helpers.js";import{c as h}from"./chunk-domLib.js";import{i as d}from"./chunk-helpers2.js";import"./chunk-styles.js";import"./arch-loading-indicator.js";import"./arch-hover-tooltip.js";import"./chunk-scale-large.js";import"./chunk-sp-overlay.js";var m,p=[t`
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
  `];let u=m=class extends l{constructor(){super(...arguments),this.columnNameHeaderTooltipMap={category:"Dataset categories are Collection, Network, Text, and File Format",sample:"Sample datasets contain only the first 100 available records from a collection"}}static renderNameCell(t,e){return e.state!==i.FINISHED?e.name:h("a",{href:o.dataset(e.id),children:[h("span",{className:"highlightable",textContent:e.name})]})}static renderCollectionCell(t,e){const a=h("span",{className:"highlightable",textContent:t.toString()});return e.collection_access?h("a",{href:o.collection(e.collection_id),children:[a]}):(a.classList.add("no-collection-access"),a.title="You are not authorized to access this collection",a)}willUpdate(t){super.willUpdate(t),this.apiCollectionEndpoint="/datasets",this.apiItemResponseIsArray=!0,this.apiItemTemplate="/datasets?id=:id",this.itemPollPredicate=t=>r(t.state),this.itemPollPeriodSeconds=3,this.apiStaticParamPairs=[],this.cellRenderers=[m.renderNameCell,t=>t,m.renderCollectionCell,t=>n[t.toString()],t=>c[t],t=>d(t),t=>null===t?"":d(t)],this.columnFilterDisplayMaps=[void 0,void 0,void 0,n],this.columns=["name","category_name","collection_name","is_sample","state","start_time","finished_time"],this.columnHeaders=["Dataset","Category","Collection","Sample","State","Started","Finished"],this.filterableColumns=[!0,!0,!0,!0,!0,!1,!1],this.searchColumns=["name","category_name","collection_name","state"],this.searchColumnLabels=["Name","Category","Collection","State"],this.singleName="Dataset",this.sort="-start_time",this.sortableColumns=[!0,!0,!0,!0,!0,!0,!0],this.persistSearchStateInUrl=!0,this.pluralName="Datasets"}};u.styles=[...l.styles,...p],e([s()],u.prototype,"columnNameHeaderTooltipMap",void 0),u=m=e([a("arch-dataset-explorer-table")],u);export{u as ArchDatasetExplorerTable};
//# sourceMappingURL=arch-dataset-explorer-table.js.map
