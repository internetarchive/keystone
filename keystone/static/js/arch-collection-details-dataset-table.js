import{i as t,_ as e,e as a,a as s}from"./chunk-query-assigned-elements.js";import{t as i}from"./chunk-state.js";import{A as o}from"./chunk-arch-data-table.js";import{B as l,E as r}from"./chunk-arch-sub-collection-builder.js";import{T as n}from"./chunk-pubsub.js";import{i as h,P as c}from"./chunk-helpers2.js";import{P as d}from"./chunk-arch-generate-dataset-form.js";import{i as m}from"./chunk-helpers.js";import"./chunk-styles.js";import"./chunk-arch-loading-indicator.js";import"./arch-hover-tooltip.js";import"./chunk-scale-large.js";import"./chunk-arch-alert.js";import"./chunk-query-all.js";var p=[t`
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
  `];let u=class extends o{constructor(){super(...arguments),this.columnNameHeaderTooltipMap={category:"Dataset categories are Collection, Network, Text, and File Format",sample:"Sample datasets contain only the first 100 available records from a collection"}}willUpdate(t){super.willUpdate(t),this.apiCollectionEndpoint="/datasets",this.apiItemResponseIsArray=!0,this.apiItemTemplate="/datasets?id=:id",this.itemPollPredicate=t=>h(t.state),this.itemPollPeriodSeconds=3,this.apiStaticParamPairs=[["collection_id",`${this.collectionId}`]],this.cellRenderers=[(t,e)=>e.state!==d.FINISHED?`${e.name}`:`<a href="${c.dataset(e.id)}">\n               <span class="highlightable">${e.name}</span>\n            </a>`,t=>t,t=>l[t.toString()],t=>r[t],t=>m(t),t=>null===t?"":m(t)],this.columnFilterDisplayMaps=[void 0,void 0,l],this.columns=["name","category_name","is_sample","state","start_time","finished_time"],this.columnHeaders=["Dataset","Category","Sample","State","Started","Finished"],this.filterableColumns=[!0,!0,!0,!0,!1,!1],this.nonSelectionActionLabels=["Generate a New Dataset"],this.nonSelectionActions=[n.GENERATE_DATASET],this.singleName="Dataset",this.sort="-start_time",this.sortableColumns=[!0,!0,!0,!0,!0,!0],this.pluralName="Datasets"}nonSelectionActionHandler(t){if(t===n.GENERATE_DATASET)window.location.href=c.generateCollectionDataset(this.collectionId)}};u.styles=[...o.styles,...p],e([a({type:Number})],u.prototype,"collectionId",void 0),e([i()],u.prototype,"columnNameHeaderTooltipMap",void 0),u=e([s("arch-collection-details-dataset-table")],u);export{u as ArchCollectionDetailsDatasetTable};
//# sourceMappingURL=arch-collection-details-dataset-table.js.map
