import{_ as t,e,a as o,s as a,y as i,i as s}from"./chunk-query-assigned-elements.js";import{t as n}from"./chunk-state.js";import{i as r}from"./chunk-styles.js";import{e as l}from"./chunk-query-all.js";import{A as c,a as d}from"./chunk-arch-alert.js";var h,p,u,b;!function(t){t.SUBMITTED="SUBMITTED",t.QUEUED="QUEUED",t.RUNNING="RUNNING",t.FINISHED="FINISHED",t.FAILED="FAILED",t.CANCELLED="CANCELLED"}(h||(h={})),function(t){t.AIT="AIT",t.SPECIAL="SPECIAL",t.CUSTOM="CUSTOM"}(p||(p={})),function(t){t.ArsLgaGeneration="ArsLgaGeneration",t.ArsWaneGeneration="ArsWaneGeneration",t.ArsWatGeneration="ArsWatGeneration",t.AudioInformationExtraction="AudioInformationExtraction",t.DomainFrequencyExtraction="DomainFrequencyExtraction",t.DomainGraphExtraction="DomainGraphExtraction",t.ImageGraphExtraction="ImageGraphExtraction",t.ImageInformationExtraction="ImageInformationExtraction",t.PdfInformationExtraction="PdfInformationExtraction",t.PresentationProgramInformationExtraction="PresentationProgramInformationExtraction",t.SpreadsheetInformationExtraction="SpreadsheetInformationExtraction",t.TextFilesInformationExtraction="TextFilesInformationExtraction",t.VideoInformationExtraction="VideoInformationExtraction",t.WebGraphExtraction="WebGraphExtraction",t.WebPagesExtraction="WebPagesExtraction",t.WordProcessorInformationExtraction="WordProcessorInformationExtraction"}(u||(u={})),function(t){t.Generate="generate",t.View="view",t.Status="status"}(b||(b={}));let m=class extends a{createRenderRoot(){return this}jobStateToButtonProps(t,e){if(void 0===t)return[this.collectionId?"Loading...":"n/a",b.Status,"job-statebutton"];const o=e?"Sample ":"";return null===t?[`Generate ${o}Dataset`,b.Generate,"job-runbutton"]:t.state===h.FINISHED?[`View ${o}Dataset`,b.View,"job-resultsbutton"]:[t.state,b.Status,"job-statebutton"]}render(){var t,e;const{collectionId:o,job:a}=this,{id:s}=a,[n,r]=this.jobIdStatesMap?[null!==(t=this.jobIdStatesMap[`${s}-SAMPLE`])&&void 0!==t?t:null,null!==(e=this.jobIdStatesMap[s])&&void 0!==e?e:null]:[void 0,void 0],[l,c,d]=this.jobStateToButtonProps(n,!0),[h,p,u]=this.jobStateToButtonProps(r,!1),m=o?"":"Select a source collection to enable this button";return i` <div class="card">
      <div class="card-body">
        <h2 class="card-title">${a.name}</h2>
        <p class="card-text">${a.description}</p>
        <div class="job-card-flex">
          <div class="job-card-sample">
            ${c===b.View?i`
                  <a
                    href="/datasets/${n.id}"
                    class="button ${d}"
                  >
                    ${l}
                  </a>
                `:i`
                  <button
                    class="job-button ${d}"
                    style="display: block"
                    data-job-id="${s}"
                    data-button-type="${c}"
                    data-sample=""
                    title="${m}"
                  >
                    ${l}
                  </button>
                `}
          </div>
          <div class="job-card-full">
            ${p===b.View?i`
                  <a
                    href="/datasets/${r.id}"
                    class="button ${u}"
                  >
                    ${h}
                  </a>
                `:i`
                  <button
                    class="job-button ${u}"
                    style="display: block"
                    data-job-id="${s}"
                    data-button-type="${p}"
                    title="${m}"
                  >
                    ${h}
                  </button>
                `}
          </div>
        </div>
      </div>
    </div>`}};t([e()],m.prototype,"collectionId",void 0),t([e()],m.prototype,"job",void 0),t([e()],m.prototype,"jobIdStatesMap",void 0),m=t([o("arch-job-card")],m);let y=class extends a{constructor(){super(...arguments),this.collapsed=!1}createRenderRoot(){return this}expand(){this.collapsed=!1}collapse(){this.collapsed=!0}render(){return i`
      <div class="job-category ${this.collapsed?"collapsed":"expanded"}">
        <button
          class="category-accordian-button"
          aria-controls=${this.jobsCat.categoryName}
          aria-expanded="${this.collapsed?"false":"true"}"
        >
          <img
            class="category-image"
            src="${this.jobsCat.categoryImage}"
            alt="Icon for ${this.jobsCat.categoryName}"
          />
          <span id="${this.jobsCat.categoryId}" class="category-title">
            ${this.jobsCat.categoryName}
          </span>
          <br />
          <span class="category-description">
            ${this.jobsCat.categoryDescription}
          </span>
        </button>
        <div id=${this.jobsCat.categoryName} class="collapsible-content">
          ${this.jobsCat.jobs.map((t=>i`
              <arch-job-card
                .collectionId=${this.collectionId}
                .job=${t}
                .jobIdStatesMap=${this.jobIdStatesMap}
              >
              </arch-job-card>
            `))}
        </div>
      </div>
    `}};t([e({type:Boolean})],y.prototype,"collapsed",void 0),t([e({type:String})],y.prototype,"collectionId",void 0),t([e({type:Object})],y.prototype,"jobsCat",void 0),t([e({type:Object})],y.prototype,"jobIdStatesMap",void 0),y=t([o("arch-job-category-section")],y);var f,I=s``;const g=["Collection","Network","Text","File Formats"],v={Collection:["Domain frequency","Web archive transformation (WAT)"],Network:["Domain graph","Image graph","Longitudinal graph","Web graph"],Text:["Named entities","Plain text of webpages","Text file information"],"File Formats":["Audio file information","Image file information","PDF file information","Presentation file information","Spreadsheet file information","Video file information","Word processing file information"]};let C=f=class extends a{constructor(){super(...arguments),this.collections=null,this.availableJobs=[],this.sourceCollectionId=null,this.collectionJobStates={},this.activePollCollectionId=null,this.anyErrors=!1}async connectedCallback(){await this.initAvailableJobs(),this.initCollections(),super.connectedCallback(),this.addEventListener("click",(t=>{this.clickHandler(t)}))}createRenderRoot(){return this}render(){var t;const e=this.sourceCollectionId&&this.collectionJobStates[this.sourceCollectionId];return i`
      <label for="source-collection">Select Source Collection</label>
      <select
        name="source-collection"
        @change=${this.sourceCollectionChangeHandler}
        ?disabled=${null===this.collections}
      >
        ${null===this.collections?i`<option>Loading...</option>`:i`<option value="">~ Choose Source Collection ~</option>`}
        ${(null!==(t=this.collections)&&void 0!==t?t:[]).map((t=>i`
            <option
              value="${t.id}"
              ?selected=${t.id===this.sourceCollectionId}
            >
              ${t.name}
            </option>
          `))}
      </select>

      <arch-alert
        class="sample"
        alertClass=${c.Secondary}
        message="Sample datasets can be quickly generated in order to ensure that the analysis will produce datasets that meet your needs. These datasets use the first 100 relative records from the collection if they are available. We strongly recommend generating samples for any collections over 100GB."
      ></arch-alert>

      <arch-alert
        class="email"
        alertClass=${c.Primary}
        message="ARCH is creating your dataset. You will receive an email notification when the dataset is complete."
        hidden
      ></arch-alert>

      <arch-alert
        class="error"
        alertClass=${c.Danger}
        message="A dataset generation job has failed, and we are currently investigating it."
        ?hidden=${!this.anyErrors}
      ></arch-alert>

      ${this.availableJobs.map(((t,o)=>i`
          <arch-job-category-section
            .collectionId=${this.sourceCollectionId}
            .jobsCat=${t}
            .jobIdStatesMap=${e}
            ?collapsed=${o>0}
          >
          </arch-job-category-section>
        `))}
    `}setCollectionIdUrlParam(t){const{urlCollectionParamName:e}=f,o=new URL(window.location.href);t?o.searchParams.set(e,t.toString()):o.searchParams.delete(e),history.replaceState(null,"",o.toString())}async sourceCollectionChangeHandler(t){const e=parseInt(t.target.value);this.setCollectionIdUrlParam(e),await this.setSourceCollectionId(e),this.requestUpdate()}updateAnyErrors(){const{sourceCollectionId:t}=this;if(t)for(const e of Object.values(this.collectionJobStates[t]))if(e.state===h.FAILED)return void(this.anyErrors=!0);this.anyErrors=!1}async setSourceCollectionId(t){this.sourceCollectionId=t,t&&(this.collectionJobStates[t]=await this.fetchCollectionJobStates(t)),this.updateAnyErrors()}async initCollections(){var t;const e=await d.collections.get();this.collections=e.items;const o=parseInt(null!==(t=new URLSearchParams(window.location.search).get(f.urlCollectionParamName))&&void 0!==t?t:"");Number.isNaN(o)||(await this.setSourceCollectionId(o),this.requestUpdate())}async initAvailableJobs(){const t=await(await fetch("/api/available-jobs")).json();t.sort(((t,e)=>g.indexOf(t.categoryName)>g.indexOf(e.categoryName)?1:-1)).map((t=>(t.jobs.sort(((e,o)=>{const a=v[t.categoryName];return void 0===a?0:a.indexOf(e.name)>a.indexOf(o.name)?1:-1})),t))),this.availableJobs=t}async fetchCollectionJobStates(t){const e=await(await fetch(`/api/collections/${t}/dataset_states`)).json();return Object.fromEntries(e.map((t=>[`${t.job_id}${t.is_sample?"-SAMPLE":""}`,t])))}async pollJobStates(){const{sourceCollectionId:t}=this;if(null!==t&&this.activePollCollectionId===t){this.collectionJobStates[t]=await this.fetchCollectionJobStates(t),this.updateAnyErrors(),this.requestUpdate();for(const e of Object.values(this.collectionJobStates[t]))if(e.state===h.RUNNING)return void setTimeout((()=>{this.pollJobStates()}),2e3);this.activePollCollectionId=null}else this.activePollCollectionId=null}startPolling(){null===this.activePollCollectionId&&(this.activePollCollectionId=this.sourceCollectionId,this.pollJobStates())}expandCategorySection(t){this.categorySections.forEach((e=>{e===t?e.expand():e.collapse()}))}async runJob(t,e){return fetch("/api/datasets/generate",{method:"POST",credentials:"same-origin",headers:{"X-CSRFToken":this.csrfToken},mode:"cors",body:JSON.stringify({collection_id:this.sourceCollectionId,job_type_id:t,is_sample:e})})}async clickHandler(t){const e=t.target,o=e.closest("arch-job-category-section");if(null==o?void 0:o.collapsed)this.expandCategorySection(o);else if("BUTTON"===e.tagName&&e.dataset.buttonType===b.Generate){e.disabled=!0;const{jobId:t,sample:o}=e.dataset,a=void 0!==o;(await this.runJob(t,a)).ok||(e.disabled=!1),this.emailAlert.show(),this.startPolling()}}};C.styles=I,C.urlCollectionParamName="cid",t([e({type:String})],C.prototype,"csrfToken",void 0),t([n()],C.prototype,"collections",void 0),t([n()],C.prototype,"availableJobs",void 0),t([n()],C.prototype,"sourceCollectionId",void 0),t([n()],C.prototype,"collectionJobStates",void 0),t([n()],C.prototype,"activePollCollectionId",void 0),t([n()],C.prototype,"anyErrors",void 0),t([r("select[name=source-collection]")],C.prototype,"collectionSelector",void 0),t([r("arch-alert.error")],C.prototype,"errorAlert",void 0),t([r("arch-alert.email")],C.prototype,"emailAlert",void 0),t([l("arch-job-category-section")],C.prototype,"categorySections",void 0),C=f=t([o("arch-generate-dataset-form")],C);export{C as A,p as C,h as P};
//# sourceMappingURL=chunk-arch-generate-dataset-form.js.map
