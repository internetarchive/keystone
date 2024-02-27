import{_ as t,e,a as o,s as i,y as a,i as n}from"./chunk-query-assigned-elements.js";import{t as s}from"./chunk-state.js";import{r,s as l,$ as c,i as d}from"./chunk-styles.js";import{e as p}from"./chunk-query-all.js";import{o as h,A as m,a as u}from"./chunk-arch-alert.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const b=t=>e=>"function"==typeof e?((t,e)=>(window.customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:o,elements:i}=e;return{kind:o,elements:i,finisher(e){window.customElements.define(t,e)}}})(t,e)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,y=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(o){o.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(o){o.createProperty(e.key,t)}};function g(t){return(e,o)=>void 0!==o?((t,e,o)=>{e.constructor.createProperty(o,t)})(t,e,o):y(t,e)
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}var v,f,I,S;null===(v=window.HTMLSlotElement)||void 0===v||v.prototype.assignedElements,function(t){t.SUBMITTED="SUBMITTED",t.QUEUED="QUEUED",t.RUNNING="RUNNING",t.FINISHED="FINISHED",t.FAILED="FAILED",t.CANCELLED="CANCELLED"}(f||(f={})),function(t){t.AIT="AIT",t.SPECIAL="SPECIAL",t.CUSTOM="CUSTOM"}(I||(I={})),function(t){t.ArsLgaGeneration="ArsLgaGeneration",t.ArsWaneGeneration="ArsWaneGeneration",t.ArsWatGeneration="ArsWatGeneration",t.AudioInformationExtraction="AudioInformationExtraction",t.DomainFrequencyExtraction="DomainFrequencyExtraction",t.DomainGraphExtraction="DomainGraphExtraction",t.ImageGraphExtraction="ImageGraphExtraction",t.ImageInformationExtraction="ImageInformationExtraction",t.PdfInformationExtraction="PdfInformationExtraction",t.PresentationProgramInformationExtraction="PresentationProgramInformationExtraction",t.SpreadsheetInformationExtraction="SpreadsheetInformationExtraction",t.TextFilesInformationExtraction="TextFilesInformationExtraction",t.VideoInformationExtraction="VideoInformationExtraction",t.WebGraphExtraction="WebGraphExtraction",t.WebPagesExtraction="WebPagesExtraction",t.WordProcessorInformationExtraction="WordProcessorInformationExtraction"}(S||(S={}));let C=class extends l{constructor(){super(...arguments),this.widthPx=24,this.heightPx=24}render(){const{widthPx:t,heightPx:e}=this;return c`
      <style>
        .loading-spinner {
          width: ${t}px;
          height: ${e}px;
        }

        .loading-spinner div {
          transform-origin: ${t/2}px ${e/2}px;
        }

        .loading-spinner div:after {
          top: ${.0375*e}px;
          left: ${.4625*t}px;
          width: ${.075*t}px;
          height: ${.225*e}px;
        }
      </style>

      <div class="loading-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    `}};var j;C.styles=r`
    .loading-spinner {
      display: inline-block;
      position: relative;
    }
    .loading-spinner div {
      animation: lds-spinner 1.2s linear infinite;
    }
    .loading-spinner div:after {
      content: " ";
      display: block;
      position: absolute;
      border-radius: 20%;
      background: var(--ait-loading-spinner-color, #fff);
    }
    .loading-spinner div:nth-child(1) {
      transform: rotate(0deg);
      animation-delay: -1.1s;
    }
    .loading-spinner div:nth-child(2) {
      transform: rotate(30deg);
      animation-delay: -1s;
    }
    .loading-spinner div:nth-child(3) {
      transform: rotate(60deg);
      animation-delay: -0.9s;
    }
    .loading-spinner div:nth-child(4) {
      transform: rotate(90deg);
      animation-delay: -0.8s;
    }
    .loading-spinner div:nth-child(5) {
      transform: rotate(120deg);
      animation-delay: -0.7s;
    }
    .loading-spinner div:nth-child(6) {
      transform: rotate(150deg);
      animation-delay: -0.6s;
    }
    .loading-spinner div:nth-child(7) {
      transform: rotate(180deg);
      animation-delay: -0.5s;
    }
    .loading-spinner div:nth-child(8) {
      transform: rotate(210deg);
      animation-delay: -0.4s;
    }
    .loading-spinner div:nth-child(9) {
      transform: rotate(240deg);
      animation-delay: -0.3s;
    }
    .loading-spinner div:nth-child(10) {
      transform: rotate(270deg);
      animation-delay: -0.2s;
    }
    .loading-spinner div:nth-child(11) {
      transform: rotate(300deg);
      animation-delay: -0.1s;
    }
    .loading-spinner div:nth-child(12) {
      transform: rotate(330deg);
      animation-delay: 0s;
    }
    @keyframes lds-spinner {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  `,t([g({type:Number})],C.prototype,"widthPx",void 0),t([g({type:Number})],C.prototype,"heightPx",void 0),C=t([b("ait-loading-spinner")],C),function(t){t.Generate="generate",t.View="view",t.Status="status"}(j||(j={}));let $=class extends i{createRenderRoot(){return this}jobStateToButtonProps(t,e){if(void 0===t)return[this.collectionId?"Loading...":"n/a",j.Status,"job-statebutton"];const o=e?"Sample ":"";return null===t?[`Generate ${o}Dataset`,j.Generate,"job-runbutton"]:t.state===f.SUBMITTED?['Starting&nbsp;<ait-loading-spinner style="position: absolute; --ait-loading-spinner-color: #2991CC"></ait-loading-spinner>',j.Status,"job-statebutton"]:t.state===f.FINISHED?[`View ${o}Dataset`,j.View,"job-resultsbutton"]:[t.state,j.Status,"job-statebutton"]}render(){var t,e;const{collectionId:o,job:i}=this,{id:n}=i,[s,r]=this.jobIdStatesMap?[null!==(t=this.jobIdStatesMap[`${n}-SAMPLE`])&&void 0!==t?t:null,null!==(e=this.jobIdStatesMap[n])&&void 0!==e?e:null]:[void 0,void 0],[l,c,d]=this.jobStateToButtonProps(s,!0),[p,m,u]=this.jobStateToButtonProps(r,!1),b=o?"":"Select a source collection to enable this button";return a` <div class="card">
      <div class="card-body">
        <h2 class="card-title">${i.name}</h2>
        <p class="card-text">${i.description}</p>
        <div class="job-card-flex">
          <div class="job-card-sample">
            ${c===j.View?a`
                  <a
                    href="/datasets/${s.id}"
                    class="button ${d}"
                  >
                    ${h(l)}
                  </a>
                `:a`
                  <button
                    class="job-button ${d}"
                    style="display: block"
                    data-job-id="${n}"
                    data-button-type="${c}"
                    data-sample=""
                    title="${b}"
                  >
                    ${h(l)}
                  </button>
                `}
          </div>
          <div class="job-card-full">
            ${m===j.View?a`
                  <a
                    href="/datasets/${r.id}"
                    class="button ${u}"
                  >
                    ${h(p)}
                  </a>
                `:a`
                  <button
                    class="job-button ${u}"
                    style="display: block"
                    data-job-id="${n}"
                    data-button-type="${m}"
                    title="${b}"
                  >
                    ${h(p)}
                  </button>
                `}
          </div>
        </div>
      </div>
    </div>`}};t([e()],$.prototype,"collectionId",void 0),t([e()],$.prototype,"job",void 0),t([e()],$.prototype,"jobIdStatesMap",void 0),$=t([o("arch-job-card")],$);let E=class extends i{constructor(){super(...arguments),this.collapsed=!1}createRenderRoot(){return this}expand(){this.collapsed=!1}collapse(){this.collapsed=!0}render(){return a`
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
          ${this.jobsCat.jobs.map((t=>a`
              <arch-job-card
                .collectionId=${this.collectionId}
                .job=${t}
                .jobIdStatesMap=${this.jobIdStatesMap}
              >
              </arch-job-card>
            `))}
        </div>
      </div>
    `}};t([e({type:Boolean})],E.prototype,"collapsed",void 0),t([e({type:String})],E.prototype,"collectionId",void 0),t([e({type:Object})],E.prototype,"jobsCat",void 0),t([e({type:Object})],E.prototype,"jobIdStatesMap",void 0),E=t([o("arch-job-category-section")],E);var x,P=n``;const w=["Collection","Network","Text","File Formats"],N={Collection:["Domain frequency","Web archive transformation (WAT)"],Network:["Domain graph","Image graph","Longitudinal graph","Web graph"],Text:["Named entities","Plain text of webpages","Text file information"],"File Formats":["Audio file information","Image file information","PDF file information","Presentation file information","Spreadsheet file information","Video file information","Word processing file information"]};let A=x=class extends i{constructor(){super(...arguments),this.collections=null,this.availableJobs=[],this.sourceCollectionId=null,this.collectionJobStates={},this.activePollCollectionId=null,this.anyErrors=!1}async connectedCallback(){await this.initAvailableJobs(),this.initCollections(),super.connectedCallback(),this.addEventListener("click",(t=>{this.clickHandler(t)}))}createRenderRoot(){return this}render(){var t;const e=this.sourceCollectionId&&this.collectionJobStates[this.sourceCollectionId];return a`
      <label for="source-collection">Select Source Collection</label>
      <select
        name="source-collection"
        @change=${this.sourceCollectionChangeHandler}
        ?disabled=${null===this.collections}
      >
        ${null===this.collections?a`<option>Loading...</option>`:a`<option value="">~ Choose Source Collection ~</option>`}
        ${(null!==(t=this.collections)&&void 0!==t?t:[]).map((t=>a`
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
        alertClass=${m.Secondary}
        message="Sample datasets can be quickly generated in order to ensure that the analysis will produce datasets that meet your needs. These datasets use the first 100 relative records from the collection if they are available. We strongly recommend generating samples for any collections over 100GB."
      ></arch-alert>

      <arch-alert
        class="email"
        alertClass=${m.Primary}
        message="ARCH is creating your dataset. You will receive an email notification when the dataset is complete."
        hidden
      ></arch-alert>

      <arch-alert
        class="error"
        alertClass=${m.Danger}
        message="A dataset generation job has failed, and we are currently investigating it."
        ?hidden=${!this.anyErrors}
      ></arch-alert>

      ${this.availableJobs.map(((t,o)=>a`
          <arch-job-category-section
            .collectionId=${this.sourceCollectionId}
            .jobsCat=${t}
            .jobIdStatesMap=${e}
            ?collapsed=${o>0}
          >
          </arch-job-category-section>
        `))}
    `}setCollectionIdUrlParam(t){const{urlCollectionParamName:e}=x,o=new URL(window.location.href);t?o.searchParams.set(e,t.toString()):o.searchParams.delete(e),history.replaceState(null,"",o.toString())}async sourceCollectionChangeHandler(t){const e=parseInt(t.target.value);this.setCollectionIdUrlParam(e),await this.setSourceCollectionId(e),this.requestUpdate()}updateAnyErrors(){const{sourceCollectionId:t}=this;if(t)for(const e of Object.values(this.collectionJobStates[t]))if(e.state===f.FAILED)return void(this.anyErrors=!0);this.anyErrors=!1}async setSourceCollectionId(t){this.sourceCollectionId=t,t&&(this.collectionJobStates[t]=await this.fetchCollectionJobStates(t)),this.updateAnyErrors()}async initCollections(){var t;const e=await u.collections.get();this.collections=e.items;const o=parseInt(null!==(t=new URLSearchParams(window.location.search).get(x.urlCollectionParamName))&&void 0!==t?t:"");Number.isNaN(o)||(await this.setSourceCollectionId(o),this.requestUpdate())}async initAvailableJobs(){const t=await(await fetch("/api/available-jobs")).json();t.sort(((t,e)=>w.indexOf(t.categoryName)>w.indexOf(e.categoryName)?1:-1)).map((t=>(t.jobs.sort(((e,o)=>{const i=N[t.categoryName];return void 0===i?0:i.indexOf(e.name)>i.indexOf(o.name)?1:-1})),t))),this.availableJobs=t}async fetchCollectionJobStates(t){const e=await(await fetch(`/api/collections/${t}/dataset_states`)).json();return Object.fromEntries(e.map((t=>[`${t.job_id}${t.is_sample?"-SAMPLE":""}`,t])))}async pollJobStates(){const{sourceCollectionId:t}=this;if(null!==t&&this.activePollCollectionId===t){this.collectionJobStates[t]=await this.fetchCollectionJobStates(t),this.updateAnyErrors(),this.requestUpdate();for(const e of Object.values(this.collectionJobStates[t]))if(e.state===f.RUNNING)return void setTimeout((()=>{this.pollJobStates()}),2e3);this.activePollCollectionId=null}else this.activePollCollectionId=null}startPolling(){null===this.activePollCollectionId&&(this.activePollCollectionId=this.sourceCollectionId,this.pollJobStates())}expandCategorySection(t){this.categorySections.forEach((e=>{e===t?e.expand():e.collapse()}))}async runJob(t,e){return fetch("/api/datasets/generate",{method:"POST",credentials:"same-origin",headers:{"X-CSRFToken":this.csrfToken},mode:"cors",body:JSON.stringify({collection_id:this.sourceCollectionId,job_type_id:t,is_sample:e})})}async clickHandler(t){const e=t.target,o=e.closest("arch-job-category-section");if(null==o?void 0:o.collapsed)this.expandCategorySection(o);else if("BUTTON"===e.tagName&&e.dataset.buttonType===j.Generate){const t=e;t.disabled=!0;const{jobId:o,sample:i}=e.dataset,a=void 0!==i,{collectionJobStates:n}=this;let{sourceCollectionId:s}=this;const r=`${o}${a?"-SAMPLE":""}`,l=n[s];l[r]={category_name:"",collection_id:s,collection_name:"",finished_time:new Date,id:"",is_sample:a,job_id:o,name:"",start_time:new Date,state:f.SUBMITTED};const c=e.closest("arch-job-card");c.requestUpdate();if(!(await this.runJob(o,a)).ok)return t.disabled=!1,delete l[r],void c.requestUpdate();this.emailAlert.show(),this.startPolling()}}};A.styles=P,A.urlCollectionParamName="cid",t([e({type:String})],A.prototype,"csrfToken",void 0),t([s()],A.prototype,"collections",void 0),t([s()],A.prototype,"availableJobs",void 0),t([s()],A.prototype,"sourceCollectionId",void 0),t([s()],A.prototype,"collectionJobStates",void 0),t([s()],A.prototype,"activePollCollectionId",void 0),t([s()],A.prototype,"anyErrors",void 0),t([d("select[name=source-collection]")],A.prototype,"collectionSelector",void 0),t([d("arch-alert.error")],A.prototype,"errorAlert",void 0),t([d("arch-alert.email")],A.prototype,"emailAlert",void 0),t([p("arch-job-category-section")],A.prototype,"categorySections",void 0),A=x=t([o("arch-generate-dataset-form")],A);export{A,I as C,f as P,g as e,b as n};
//# sourceMappingURL=chunk-arch-generate-dataset-form.js.map
