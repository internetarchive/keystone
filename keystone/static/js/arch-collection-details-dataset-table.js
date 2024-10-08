import{i as t,_ as e,e as a,a as s}from"./chunk-lit-element.js";import{t as i}from"./chunk-state.js";import{A as l}from"./chunk-arch-data-table.js";import{i as o,P as r,a as n,B as h,E as d}from"./chunk-helpers.js";import{T as c}from"./chunk-pubsub.js";import{i as m}from"./chunk-helpers2.js";import"./chunk-styles.js";import"./arch-loading-indicator.js";import"./arch-hover-tooltip.js";import"./chunk-scale-large.js";import"./chunk-sp-overlay.js";var p=[t`
    data-table > table {
      table-layout: fixed;
    }

    data-table > table > thead > tr > th.category {
      width: 7em;
    }

    data-table > table > thead > tr > th.sample {
      width: 6em;
    }

    data-table > table > thead > tr > th.state {
      width: 7em;
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
  `];let b=class extends l{constructor(){super(...arguments),this.columnNameHeaderTooltipMap={category:"Dataset categories are Collection, Network, Text, and File Format",sample:"Sample datasets contain only the first 100 available records from a collection"}}willUpdate(t){super.willUpdate(t),this.apiCollectionEndpoint="/datasets",this.apiItemResponseIsArray=!0,this.apiItemTemplate="/datasets?id=:id",this.itemPollPredicate=t=>o(t.state),this.itemPollPeriodSeconds=3,this.apiStaticParamPairs=[["collection_id",`${this.collectionId}`]],this.cellRenderers=[(t,e)=>e.state!==r.FINISHED?`${e.name}`:`<a href="${n.dataset(e.id)}">\n               <span class="highlightable">${e.name}</span>\n            </a>`,t=>t,t=>h[t.toString()],t=>d[t],t=>m(t),t=>null===t?"":m(t)],this.columnFilterDisplayMaps=[void 0,void 0,h],this.columns=["name","category_name","is_sample","state","start_time","finished_time"],this.columnHeaders=["Dataset","Category","Sample","State","Started","Finished"],this.filterableColumns=[!0,!0,!0,!0,!1,!1],this.nonSelectionActionLabels=["Generate a New Dataset"],this.nonSelectionActions=[c.GENERATE_DATASET],this.singleName="Dataset",this.sort="-start_time",this.sortableColumns=[!0,!0,!0,!0,!0,!0],this.persistSearchStateInUrl=!0,this.pluralName="Datasets"}nonSelectionActionHandler(t){if(t===c.GENERATE_DATASET)window.location.href=n.generateCollectionDataset(this.collectionId)}};b.styles=[...l.styles,...p],e([a({type:Number})],b.prototype,"collectionId",void 0),e([i()],b.prototype,"columnNameHeaderTooltipMap",void 0),b=e([s("arch-collection-details-dataset-table")],b);export{b as ArchCollectionDetailsDatasetTable};
//# sourceMappingURL=arch-collection-details-dataset-table.js.map
