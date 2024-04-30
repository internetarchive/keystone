import{i as t,_ as o,s as e,y as s,a as l}from"./chunk-lit-element.js";import{t as a}from"./chunk-state.js";import{A as i}from"./chunk-ArchAPI.js";import{a as c}from"./chunk-helpers.js";import"./chunk-arch-card.js";import"./chunk-arch-loading-indicator.js";import{g as n,c as r}from"./chunk-styles.js";import{a as d}from"./chunk-helpers2.js";import"./chunk-scale-large.js";import"./chunk-sp-overlay.js";var h,m=[n,r,t`
    thead > tr.hidden-header {
      color: transparent;
    }

    th.size,
    th.num-datasets {
      text-align: right;
    }

    th.size {
      width: 7rem;
    }

    th.num-datasets {
      width: 10rem;
    }

    td.name {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow-x: hidden;
    }

    td.size,
    td.num-datasets {
      text-align: right;
    }
  `];let u=h=class extends e{constructor(){super(),this.numTotalCollections=0,this.collections=void 0,this.initCollections()}render(){const{maxDisplayedCollections:t}=h,o=void 0===this.collections,e=this.numTotalCollections>0;return s`
      <arch-card
        title="Collections"
        ctatext=${!o&&e?"Create Custom Collection":""}
        ctahref="${c.buildSubCollection()}"
        ctaTooltipHeader="Custom Collection"
        ctaTooltipText="Combine and filter your collections into a Custom Collection of only the data you need."
        ctaTooltipLearnMoreUrl="https://arch-webservices.zendesk.com/hc/en-us/articles/16107865758228-How-to-create-a-custom-ARCH-collection"
      >
        <div slot="content">
          <table>
            <thead>
              <tr
                class="${o||!e?"hidden-header":""}"
              >
                <th class="name">Collection Name</th>
                <th class="size">Collection Size</th>
                <th class="num-datasets">Generated Datasets</th>
              </tr>
            </thead>
            <tbody>
              ${(()=>{var l;return o?[s`
              <tr>
                <td colspan="3">
                  <arch-loading-indicator></arch-loading-indicator>
                </td>
              </tr>
            `]:e?(null!==(l=this.collections)&&void 0!==l?l:[]).slice(0,t).map((t=>s`
              <tr>
                <td class="name">
                  <a
                    href="/collections/${t.id}"
                    title="${t.name}"
                  >
                    ${t.name}
                  </a>
                </td>
                <td class="size">${d(t.size_bytes,1)}</td>
                <td class="num-datasets">
                  ${t.dataset_count} Datasets
                </td>
              </tr>
            `)):[s`
              <tr>
                <td colspan="3">
                  <i
                    >No collections found.
                    <a
                      href="https://arch-webservices.zendesk.com/hc/en-us/articles/14795196010772"
                      >Contact us</a
                    >
                    to access collections or report an error.</i
                  >
                </td>
              </tr>
            `]})()}
            </tbody>
          </table>
        </div>
        <div slot="footer">
          ${o||!e?s``:s`
                <a href="/collections" class="view-all">
                  View
                  ${this.numTotalCollections>t?s`All ${this.numTotalCollections}`:s``}
                  Collections
                </a>
              `}
        </div>
      </arch-card>
    `}async initCollections(){const t=await i.collections.get([["limit","=",h.maxDisplayedCollections]]);this.numTotalCollections=t.count,this.collections=t.items}};u.maxDisplayedCollections=10,u.styles=m,o([a()],u.prototype,"numTotalCollections",void 0),o([a()],u.prototype,"collections",void 0),u=h=o([l("arch-collections-card")],u);export{u as ArchCollectionsCard};
//# sourceMappingURL=arch-collections-card.js.map
