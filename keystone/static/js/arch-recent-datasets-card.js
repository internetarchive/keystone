import{i as t,_ as a,s as e,y as s,a as i}from"./chunk-lit-element.js";import{t as r}from"./chunk-state.js";import{A as o}from"./chunk-ArchAPI.js";import{a as l}from"./chunk-helpers.js";import{i as d}from"./chunk-helpers2.js";import"./chunk-arch-card.js";import"./chunk-arch-loading-indicator.js";import{g as n,c}from"./chunk-styles.js";import"./chunk-scale-large.js";import"./chunk-sp-overlay.js";var h,m=[n,c,t`
    thead > tr.hidden-header {
      color: transparent;
    }

    th.date {
      width: 8rem;
      text-align: right;
    }

    td.name,
    td.collection {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow-x: hidden;
    }

    td.date {
      text-align: right;
    }
  `];let p=h=class extends e{constructor(){super(),this.numTotalDatasets=0,this.datasets=void 0,this.initDatasets()}render(){var t,a;const{numTotalDatasets:e}=this,i=void 0===this.datasets,r=(null!==(t=this.datasets)&&void 0!==t?t:[]).length>0,o=null!==(a=this.datasets)&&void 0!==a?a:[];return s`
      <arch-card
        title="Recent Datasets"
        ctatext="Generate New Dataset"
        ctahref="/datasets/generate"
      >
        <div slot="content">
          <table>
            <thead>
              <tr class="${i||!r?"hidden-header":""}">
                <th class="name">Dataset</th>
                <th class="collection">Collection Name</th>
                <th class="date">Date Generated</th>
              </tr>
            </thead>
            <tbody>
              ${i?[s`<tr>
              <td colspan="3">
                <arch-loading-indicator></arch-loading-indicator>
              </td>
            </tr>`]:r?o.map((t=>{const a=`${t.name}${t.is_sample?" (Sample)":""}`;return s`
              <tr>
                <td class="name">
                  <a href="${l.dataset(t.id)}" title="${a}">
                    ${a}
                  </a>
                </td>
                <td class="collection" title="${t.collection_name}">
                  ${t.collection_name}
                </td>
                <td class="date">
                  ${d(t.finished_time)}
                </td>
              </tr>
            `})):[s`<tr>
              <td colspan="3"><i>New datasets will be listed here.</i></td>
            </tr>`]}
            </tbody>
          </table>
        </div>
        <div slot="footer">
          ${i||!r?s``:s`
                <a href="/datasets/explore" class="view-all">
                  View
                  ${o.length<e?s`All ${e}`:s``}
                  Datasets
                </a>
              `}
        </div>
      </arch-card>
    `}async initDatasets(){const t=await o.datasets.get([["state","=","FINISHED"],["sort","=","-start_time"],["limit","=",h.maxDisplayedDatasets]]);this.numTotalDatasets=t.count,this.datasets=t.items}};p.maxDisplayedDatasets=10,p.styles=m,a([r()],p.prototype,"numTotalDatasets",void 0),a([r()],p.prototype,"datasets",void 0),p=h=a([i("arch-recent-datasets-card")],p);export{p as ArchRecentDatasetsCard};
//# sourceMappingURL=arch-recent-datasets-card.js.map
