import{i as t,_ as e,a}from"./chunk-lit-element.js";import{A as s}from"./chunk-arch-data-table.js";import{C as l,P as i,a as o,i as n,c as r}from"./chunk-helpers.js";import{T as c}from"./chunk-pubsub.js";import{c as h}from"./chunk-domLib.js";import{i as d,h as m}from"./chunk-helpers2.js";import"./chunk-state.js";import"./chunk-styles.js";import"./arch-loading-indicator.js";import"./arch-hover-tooltip.js";import"./chunk-scale-large.js";import"./chunk-sp-overlay.js";var p,u=[t`
    data-table > table {
      table-layout: fixed;
    }

    data-table > table > thead > tr > th.type {
      width: 5em;
    }

    data-table > table > thead > tr > th.public {
      width: 5em;
    }

    data-table > table > thead > tr > th.dataset-date {
      width: 7em;
    }

    data-table > table > thead > tr > th.size {
      width: 7em;
    }

    data-table > table > thead > tr > th {
      max-width: none;
    }
  `];let b=p=class extends s{static renderNameCell(t,e){const a=h("span",{className:"highlightable",textContent:e.name});if(e.collection_type===l.CUSTOM&&e.metadata.state!==i.FINISHED){a.title="This Custom collection is in the process of being created";const t=e.metadata.state,s=t===i.RUNNING?"CREATING":t;return a.appendChild(h("i",{textContent:` (${s})`})),a}return h("a",{href:`/collections/${e.id}`,title:e.name,children:[a]})}static renderLatestDatasetCell(t,e){return null===t?"":h("a",{href:o.dataset(e.latest_dataset.id),title:t.toString(),textContent:t.toString()})}willUpdate(t){super.willUpdate(t),this.actionButtonLabels=["Generate Dataset","Create Custom Collection"],this.actionButtonSignals=[c.GENERATE_DATASET,c.CREATE_SUB_COLLECTION],this.apiCollectionEndpoint="/collections",this.apiItemResponseIsArray=!0,this.apiItemTemplate="/collections?id=:id",this.itemPollPredicate=t=>t.collection_type===l.CUSTOM&&n(t.metadata.state),this.itemPollPeriodSeconds=3,this.cellRenderers=[p.renderNameCell,t=>r[t],t=>""+(t?"Yes":"No"),p.renderLatestDatasetCell,t=>t?d(t):"",(t,e)=>e.collection_type===l.CUSTOM&&e.metadata.state!==i.FINISHED?"":m(e.size_bytes,1)],this.columnFilterDisplayMaps=[void 0,void 0,{true:"Yes",false:"No"}],this.columns=["name","collection_type","metadata.is_public","latest_dataset.name","latest_dataset.start_time","size_bytes"],this.columnHeaders=["Name","Type","Public","Latest Dataset","Dataset Date","Size"],this.rowSelectDisabledCallback=t=>{const e=t.metadata;return(null==e?void 0:e.state)&&n(e.state)},this.selectable=!0,this.sort="-id",this.sortableColumns=[!0,!0,!1,!1,!1,!0],this.filterableColumns=[!1,!0,!0],this.searchColumns=["name"],this.searchColumnLabels=["Name"],this.singleName="Collection",this.persistSearchStateInUrl=!0,this.pluralName="Collections"}postSelectionChangeHandler(t){const{dataTable:e}=this,{props:a}=e,s=t.length,l=1===s;a.actionButtonDisabled=[!l,!1],e.setSelectionActionButtonDisabledState(0===s)}selectionActionHandler(t,e){switch(t){case c.GENERATE_DATASET:window.location.href=o.generateCollectionDataset(e[0].id);break;case c.CREATE_SUB_COLLECTION:window.location.href=o.buildSubCollection(e.map((t=>t.id)))}}};b.styles=[...s.styles,...u],b=p=e([a("arch-collections-table")],b);export{b as ArchCollectionsTable};
//# sourceMappingURL=arch-collections-table.js.map
