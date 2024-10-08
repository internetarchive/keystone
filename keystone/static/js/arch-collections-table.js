import{i as t,_ as e,a}from"./chunk-lit-element.js";import{A as s}from"./chunk-arch-data-table.js";import{C as i,i as l,P as o,c as n,a as c}from"./chunk-helpers.js";import{T as r}from"./chunk-pubsub.js";import{h,i as d,a as m}from"./chunk-helpers2.js";import"./chunk-state.js";import"./chunk-styles.js";import"./arch-loading-indicator.js";import"./arch-hover-tooltip.js";import"./chunk-scale-large.js";import"./chunk-sp-overlay.js";var p=[t`
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
  `];let u=class extends s{willUpdate(t){super.willUpdate(t),this.actionButtonLabels=["Generate Dataset","Create Custom Collection"],this.actionButtonSignals=[r.GENERATE_DATASET,r.CREATE_SUB_COLLECTION],this.apiCollectionEndpoint="/collections",this.apiItemResponseIsArray=!0,this.apiItemTemplate="/collections?id=:id",this.itemPollPredicate=t=>t.collection_type===i.CUSTOM&&l(t.metadata.state),this.itemPollPeriodSeconds=3,this.cellRenderers=[(t,e)=>{const a=`\n            <a href="/collections/${h(e.id.toString())}" title="${h(t)}">\n              <span class="highlightable">${t}</span>\n            </a>\n        `;if(e.collection_type!==i.CUSTOM)return a;const{state:s}=e.metadata;return s===o.FINISHED?a:`\n            <span title="This Custom collection is in the process of being created">${t} <i>(${s===o.RUNNING?"CREATING":s})</i></span>\n        `},t=>n[t],t=>""+(t?"Yes":"No"),(t,e)=>null===t?"":`\n          <a href="${c.dataset(e.latest_dataset.id)}"\n             title="${h(t)}">\n            ${t}\n          </a>\n        `,t=>t?d(t):"",(t,e)=>e.collection_type===i.CUSTOM&&e.metadata.state!==o.FINISHED?"":m(e.size_bytes,1)],this.columnFilterDisplayMaps=[void 0,void 0,{true:"Yes",false:"No"}],this.columns=["name","collection_type","metadata.is_public","latest_dataset.name","latest_dataset.start_time","size_bytes"],this.columnHeaders=["Name","Type","Public","Latest Dataset","Dataset Date","Size"],this.rowSelectDisabledCallback=t=>{const e=t.metadata;return(null==e?void 0:e.state)&&l(e.state)},this.selectable=!0,this.sort="-id",this.sortableColumns=[!0,!0,!1,!1,!1,!0],this.filterableColumns=[!1,!0,!0],this.searchColumns=["name"],this.searchColumnLabels=["Name"],this.singleName="Collection",this.persistSearchStateInUrl=!0,this.pluralName="Collections"}postSelectionChangeHandler(t){const{dataTable:e}=this,{props:a}=e,s=t.length,i=1===s;a.actionButtonDisabled=[!i,!1],e.setSelectionActionButtonDisabledState(0===s)}selectionActionHandler(t,e){switch(t){case r.GENERATE_DATASET:window.location.href=c.generateCollectionDataset(e[0].id);break;case r.CREATE_SUB_COLLECTION:window.location.href=c.buildSubCollection(e.map((t=>t.id)))}}};u.styles=[...s.styles,...p],u=e([a("arch-collections-table")],u);export{u as ArchCollectionsTable};
//# sourceMappingURL=arch-collections-table.js.map
