import{i as t,_ as e,e as i,s as a,y as s,a as n}from"./chunk-lit-element.js";import{t as o}from"./chunk-state.js";import{g as r,b as d,i as l}from"./chunk-styles.js";import{A as c}from"./chunk-ArchAPI.js";import{i as h}from"./chunk-helpers2.js";import{R as u}from"./chunk-helpers.js";import"./chunk-arch-loading-indicator.js";import"./arch-dataset-metadata-form.js";import"./chunk-arch-json-schema-form.js";import"./chunk-_commonjsHelpers.js";import"./chunk-sizedMixin.js";var m=[r,t`
    :host > div.container {
      display: flex;
    }

    :host > div.container > div:first-child {
      flex-grow: 1;
    }

    :host > div.container > button {
      align-self: flex-start;
    }

    :host > div.container > button.cancel {
      margin-right: 0.5rem;
    }

    h2 {
      font-size: 1em;
      margin: 0 0 0.75em 0;
    }

    /* Prevent items from overflow container: https://stackoverflow.com/a/66689926 */
    div.detail {
      min-width: 0;
    }

    div.metadata-display > dl,
    div.metadata-display > arch-loading-indicator,
    div.metadata-display > i {
      margin-left: 2rem;
    }

    div.metadata-edit {
      background-color: ${d};
      border-radius: 8px;
      padding: 1rem 1.5rem;
    }

    dl > div,
    dl > div:last-child {
      margin-bottom: 0.75em;
    }

    [hidden] {
      display: none;
    }

    div.form-buttons {
      text-align: right;
    }
  `],p="https://arch.archive-it.org/js/pub-metadata-schema.json",b="http://json-schema.org/draft-07/schema",g="Published Dataset Metadata",f="object",y=["title","description","creator","subject","licenseurl"],v={title:{type:"string",description:"A title for this dataset.",minLength:8,maxLength:100,nullable:!0,title:"Title"},description:{type:"string",description:"A description of this dataset.",minLength:8,maxLength:1e3,nullable:!0,title:"Description"},creator:{description:"The name(s) of the author(s) of this dataset.",items:{type:"string",minLength:8,maxLength:64},nullable:!0,type:"array",title:"Author(s)",uniqueItems:!0},subject:{description:"A list of keywords that describe this dataset.",items:{type:"string",minLength:4,maxLength:16},nullable:!0,type:"array",title:"Keyword(s)",uniqueItems:!0},licenseurl:{type:"string",description:"The license to apply to this dataset.",nullable:!0,title:"Access Rights",oneOf:[{const:"https://creativecommons.org/licenses/by/4.0/",title:"CC BY",description:"This license allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, so long as attribution is given to the creator. The license allows for commercial use."},{const:"https://creativecommons.org/licenses/by-sa/4.0/",title:"CC BY-SA",description:"This license allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, so long as attribution is given to the creator. The license allows for commercial use. If you remix, adapt, or build upon the material, you must license the modified material under identical terms."},{const:"https://creativecommons.org/licenses/by-nc/4.0/",title:"CC BY-NC",description:"This license allows reusers to distribute, remix, adapt, and build upon the material in any medium or format for noncommercial purposes only, and only so long as attribution is given to the creator."},{const:"https://creativecommons.org/licenses/by-nc-sa/4.0/",title:"CC BY-NC-SA",description:"This license allows reusers to distribute, remix, adapt, and build upon the material in any medium or format for noncommercial purposes only, and only so long as attribution is given to the creator. If you remix, adapt, or build upon the material, you must license the modified material under identical terms."},{const:"https://creativecommons.org/licenses/by-nd/4.0/",title:"CC BY-ND",description:"This license allows reusers to copy and distribute the material in any medium or format in unadapted form only, and only so long as attribution is given to the creator. The license allows for commercial use."},{const:"https://creativecommons.org/licenses/by-nc-nd/4.0/",title:"CC BY-NC-ND",description:"This license allows reusers to copy and distribute the material in any medium or format in unadapted form only, for noncommercial purposes only, and only so long as attribution is given to the creator."},{const:"https://creativecommons.org/publicdomain/zero/1.0/",title:"CC0",description:"Public Domain"}]}},P={$id:p,$schema:b,title:g,type:f,propertiesOrder:y,properties:v},S=Object.freeze({__proto__:null,$id:p,$schema:b,title:g,type:f,propertiesOrder:y,properties:v,default:P});const $=S,k=$.propertiesOrder;var _,w;!function(t){t[t.Loading=0]="Loading",t[t.Unpublished=1]="Unpublished",t[t.PrePublish=2]="PrePublish",t[t.Publishing=3]="Publishing",t[t.Published=4]="Published",t[t.Unpublishing=5]="Unpublishing"}(_||(_={})),function(t){t[t.Displaying=0]="Displaying",t[t.Editing=1]="Editing",t[t.Saving=2]="Saving"}(w||(w={}));const I=Object.keys($.properties).sort(((t,e)=>k.indexOf(t)<k.indexOf(e)?-1:1));let j=class extends a{constructor(){super(...arguments),this.pubState=_.Loading,this.pubInfo=void 0,this.metadataState=w.Displaying,this.metadata=void 0}connectedCallback(){super.connectedCallback(),this._fetchInitialData()}get _metadataFormData(){var t;const e={},i=Array.from(new FormData(this.metadataForm.form).entries()).filter((([,t])=>""!==t.trim())).map((([t,e])=>[t,e.replaceAll("\t"," ").replaceAll("\n","<br>")]));for(const[a,s]of i)e[a]=(null!==(t=e[a])&&void 0!==t?t:[]).concat(s);return e}render(){const{pubState:t}=this;if(t===_.Loading)return s`<arch-loading-indicator></arch-loading-indicator>`;const{metadata:e}=this,i=this.pubInfo;return s`
      <div class="container">
        <div class="detail">
          <dl>
            <div>
              <dt>Last Published</dt>
              <dd>
                ${t===_.Published?h(i.time):"never"}
              </dd>
            </div>
            ${t!==_.Published?s``:s`
                  <div>
                    <dt>ARK</dt>
                    <dd>
                      <a href="https://ark.archive.org/${i.ark}"
                        >${i.ark}</a
                      >
                    </dd>
                  </div>
                `}
          </dl>

          <!-- Metadata section header -->
          <h2>
            ${t<_.PrePublish||t===_.Publishing?"":t===_.PrePublish?s`<i>Enter Metadata</i>`:"Metadata"}
            ${t<_.Published||this.metadataState===w.Editing?"":s`
                  <button
                    class="text"
                    @click=${()=>this.metadataState=w.Editing}
                  >
                    (edit)
                  </button>
                `}
          </h2>

          <!-- Metadata display list -->
          <div
            class="metadata-display"
            ?hidden=${t<_.Published||this.metadataState===w.Editing}
          >
            ${void 0===e?s`<arch-loading-indicator></arch-loading-indicator>`:0===Object.keys(e).length?s`<i>none</i>`:s`
                  <dl>
                    ${I.filter((t=>void 0!==e[t])).map((t=>{const i=function(t){return $.properties[t].title}(t);let a=e[t];return Array.isArray(a)||(a=[a]),s`
                          <div>
                            <dt>${i}</dt>
                            ${a.map((t=>s`<dd>${t}</dd>`))}
                          </div>
                        `}))}
                  </dl>
                `}
          </div>

          <!-- Metadata edit form -->
          <div
            class="metadata-edit"
            ?hidden=${t!==_.PrePublish&&this.metadataState!==w.Editing&&this.metadataState!==w.Saving}
          >
            ${t!==_.PrePublish&&this.metadataState!==w.Editing&&this.metadataState!==w.Saving?s``:s`
                  <arch-dataset-metadata-form
                    .schema=${S}
                    .data=${null!=e?e:{}}
                  >
                  </arch-dataset-metadata-form>
                `}
            <br />
            <div
              ?hidden=${t===_.PrePublish}
              class="form-buttons"
            >
              <button
                type="button"
                @click=${()=>this.metadataState=w.Displaying}
                ?disabled=${this.metadataState===w.Saving}
              >
                Cancel
              </button>
              <button
                type="button"
                class="primary"
                @click=${()=>this._saveMetadata()}
                ?disabled=${this.metadataState===w.Saving}
              >
                ${this.metadataState===w.Saving?s`<arch-loading-indicator
                      style="--color: #fff"
                      text="Saving"
                    ></arch-loading-indicator>`:s`Save`}
              </button>
            </div>
          </div>
        </div>

        <button
          class="cancel"
          @click=${()=>this.pubState=_.Unpublished}
          ?hidden=${t!==_.PrePublish}
        >
          Cancel
        </button>

        <button
          class="${t===_.Unpublished?"primary":t===_.PrePublish?"success":t===_.Published?"danger":""}"
          ?disabled=${t===_.Publishing||t===_.Unpublishing}
          @click=${this._publishButtonClickHandler}
        >
          ${t===_.Unpublished?"Publish":t===_.PrePublish?"Publish Now":t===_.Publishing?"Publish in progress...":t===_.Published?"Unpublish":t===_.Unpublishing?"Unpublishing...":""}
        </button>
      </div>
    `}async _fetchInitialData(){const t=await this._fetchPubInfo();return t?!1===t.complete?(this.pubState=_.Publishing,void setTimeout((()=>{this._fetchInitialData()}),3e3)):(this.pubInfo=t,this.pubState=_.Published,void this._pollItemMetadata()):(this.pubState=_.Unpublished,void(this.metadata={}))}async _pollItemMetadata(){const{pubState:t}=this,e=await this._fetchItemMetadata();void 0===e&&t===_.Published&&setTimeout((()=>{this._pollItemMetadata()}),3e3),this.metadata=e}async _fetchPubInfo(){const{datasetId:t}=this;try{return await c.datasets.publication.info(t)}catch(t){return void(t instanceof u&&404===t.response.status||console.error(t))}}async _fetchItemMetadata(){const{datasetId:t}=this;try{return await c.datasets.publication.metadata.get(t)}catch(t){return void(t instanceof u&&404===t.response.status||console.error(t))}}_publishButtonClickHandler(){const t=this.metadataForm;switch(this.pubState){case _.Unpublished:this.pubState=_.PrePublish;break;case _.PrePublish:t.form.checkValidity()?this._publish():t.form.reportValidity();break;case _.Published:window.confirm("Are you sure you want to unpublish this dataset?")&&this._unpublish()}}async _publish(){const{csrfToken:t,datasetId:e,_metadataFormData:i}=this;await fetch(`/api/datasets/${e}/publication`,{method:"POST",credentials:"same-origin",headers:{"X-CSRFToken":t},mode:"cors",body:JSON.stringify(i)}),this.pubState=_.Publishing,setTimeout((()=>{this._fetchInitialData()}),3e4)}async _unpublish(){const{datasetId:t}=this;this.pubState=_.Unpublishing,await c.datasets.publication.unpublish(t),this.pubState=_.Unpublished,this._fetchInitialData()}async _saveMetadata(){const{datasetId:t,_metadataFormData:e}=this;this.metadata=e,this.metadataState=w.Saving;const i=Object.assign(Object.fromEntries(I.map((t=>[t,[]]))),e);await c.datasets.publication.metadata.update(t,i),this.metadataState=w.Displaying}};j.styles=m,e([i({type:String})],j.prototype,"datasetId",void 0),e([i({type:String})],j.prototype,"csrfToken",void 0),e([o()],j.prototype,"pubState",void 0),e([o()],j.prototype,"pubInfo",void 0),e([o()],j.prototype,"metadataState",void 0),e([o()],j.prototype,"metadata",void 0),e([l("arch-dataset-metadata-form")],j.prototype,"metadataForm",void 0),j=e([n("arch-dataset-publishing-card")],j);export{j as ArchDatasetPublishingCard};
//# sourceMappingURL=arch-dataset-publishing-card.js.map
