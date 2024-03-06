import{i as t,_ as e,e as i,s as a,y as s,a as n}from"./chunk-query-assigned-elements.js";import{t as o}from"./chunk-state.js";import{g as r,d,i as l}from"./chunk-styles.js";import{i as c}from"./chunk-helpers.js";import"./chunk-helpers2.js";import"./chunk-arch-sub-collection-builder.js";import"./chunk-arch-loading-indicator.js";import"./arch-dataset-metadata-form.js";import"./chunk-arch-json-schema-form.js";import"./chunk-define-element.js";import"./chunk-scale-large.js";import"./chunk-directive.js";var h=[r,t`
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
  `],u="https://arch.archive-it.org/js/pub-metadata-schema.json",m="http://json-schema.org/draft-07/schema",p="Published Dataset Metadata",b="object",g=["title","description","creator","subject","licenseurl"],f={title:{type:"string",description:"A title for this dataset.",minLength:8,maxLength:100,nullable:!0,title:"Title"},description:{type:"string",description:"A description of this dataset.",minLength:8,maxLength:1e3,nullable:!0,title:"Description"},creator:{description:"The name(s) of the author(s) of this dataset.",items:{type:"string",minLength:8,maxLength:64},nullable:!0,type:"array",title:"Author(s)",uniqueItems:!0},subject:{description:"A list of keywords that describe this dataset.",items:{type:"string",minLength:4,maxLength:16},nullable:!0,type:"array",title:"Keyword(s)",uniqueItems:!0},licenseurl:{type:"string",description:"The license to apply to this dataset.",nullable:!0,title:"Access Rights",oneOf:[{const:"https://creativecommons.org/licenses/by/4.0/",title:"CC BY",description:"This license allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, so long as attribution is given to the creator. The license allows for commercial use."},{const:"https://creativecommons.org/licenses/by-sa/4.0/",title:"CC BY-SA",description:"This license allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, so long as attribution is given to the creator. The license allows for commercial use. If you remix, adapt, or build upon the material, you must license the modified material under identical terms."},{const:"https://creativecommons.org/licenses/by-nc/4.0/",title:"CC BY-NC",description:"This license allows reusers to distribute, remix, adapt, and build upon the material in any medium or format for noncommercial purposes only, and only so long as attribution is given to the creator."},{const:"https://creativecommons.org/licenses/by-nc-sa/4.0/",title:"CC BY-NC-SA",description:"This license allows reusers to distribute, remix, adapt, and build upon the material in any medium or format for noncommercial purposes only, and only so long as attribution is given to the creator. If you remix, adapt, or build upon the material, you must license the modified material under identical terms."},{const:"https://creativecommons.org/licenses/by-nd/4.0/",title:"CC BY-ND",description:"This license allows reusers to copy and distribute the material in any medium or format in unadapted form only, and only so long as attribution is given to the creator. The license allows for commercial use."},{const:"https://creativecommons.org/licenses/by-nc-nd/4.0/",title:"CC BY-NC-ND",description:"This license allows reusers to copy and distribute the material in any medium or format in unadapted form only, for noncommercial purposes only, and only so long as attribution is given to the creator."},{const:"https://creativecommons.org/publicdomain/zero/1.0/",title:"CC0",description:"Public Domain"}]}},y={$id:u,$schema:m,title:p,type:b,propertiesOrder:g,properties:f},v=Object.freeze({__proto__:null,$id:u,$schema:m,title:p,type:b,propertiesOrder:g,properties:f,default:y});const P=v,S=P.propertiesOrder;var $,k;!function(t){t[t.Loading=0]="Loading",t[t.Unpublished=1]="Unpublished",t[t.PrePublish=2]="PrePublish",t[t.Publishing=3]="Publishing",t[t.Published=4]="Published",t[t.Unpublishing=5]="Unpublishing"}($||($={})),function(t){t[t.Displaying=0]="Displaying",t[t.Editing=1]="Editing",t[t.Saving=2]="Saving"}(k||(k={}));const w=Object.keys(P.properties).sort(((t,e)=>S.indexOf(t)<S.indexOf(e)?-1:1));let I=class extends a{constructor(){super(...arguments),this.pubState=$.Loading,this.pubInfo=void 0,this.metadataState=k.Displaying,this.metadata=void 0}connectedCallback(){super.connectedCallback(),this._fetchInitialData()}get _metadataFormData(){var t;const e={},i=Array.from(new FormData(this.metadataForm.form).entries()).filter((([,t])=>""!==t.trim())).map((([t,e])=>[t,e.replaceAll("\t"," ").replaceAll("\n","<br>")]));for(const[a,s]of i)e[a]=(null!==(t=e[a])&&void 0!==t?t:[]).concat(s);return e}render(){const{pubState:t}=this;if(t===$.Loading)return s`<arch-loading-indicator></arch-loading-indicator>`;const{metadata:e}=this,i=this.pubInfo;return s`
      <div class="container">
        <div class="detail">
          <dl>
            <div>
              <dt>Last Published</dt>
              <dd>
                ${t===$.Published?c(i.time):"never"}
              </dd>
            </div>
            ${t!==$.Published?s``:s`
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
            ${t<$.PrePublish||t===$.Publishing?"":t===$.PrePublish?s`<i>Enter Metadata</i>`:"Metadata"}
            ${t<$.Published||this.metadataState===k.Editing?"":s`
                  <button
                    class="text"
                    @click=${()=>this.metadataState=k.Editing}
                  >
                    (edit)
                  </button>
                `}
          </h2>

          <!-- Metadata display list -->
          <div
            class="metadata-display"
            ?hidden=${t<$.Published||this.metadataState===k.Editing}
          >
            ${void 0===e?s`<arch-loading-indicator></arch-loading-indicator>`:0===Object.keys(e).length?s`<i>none</i>`:s`
                  <dl>
                    ${w.filter((t=>void 0!==e[t])).map((t=>{const i=function(t){return P.properties[t].title}(t);let a=e[t];return Array.isArray(a)||(a=[a]),s`
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
            ?hidden=${t!==$.PrePublish&&this.metadataState!==k.Editing&&this.metadataState!==k.Saving}
          >
            ${t!==$.PrePublish&&this.metadataState!==k.Editing&&this.metadataState!==k.Saving?s``:s`
                  <arch-dataset-metadata-form
                    .schema=${v}
                    .data=${null!=e?e:{}}
                  >
                  </arch-dataset-metadata-form>
                `}
            <br />
            <div
              ?hidden=${t===$.PrePublish}
              class="form-buttons"
            >
              <button
                type="button"
                @click=${()=>this.metadataState=k.Displaying}
                ?disabled=${this.metadataState===k.Saving}
              >
                Cancel
              </button>
              <button
                type="button"
                class="primary"
                @click=${()=>this._saveMetadata()}
                ?disabled=${this.metadataState===k.Saving}
              >
                ${this.metadataState===k.Saving?s`<arch-loading-indicator
                      style="--color: #fff"
                      text="Saving"
                    ></arch-loading-indicator>`:s`Save`}
              </button>
            </div>
          </div>
        </div>

        <button
          class="cancel"
          @click=${()=>this.pubState=$.Unpublished}
          ?hidden=${t!==$.PrePublish}
        >
          Cancel
        </button>

        <button
          class="${t===$.Unpublished?"primary":t===$.PrePublish?"success":t===$.Published?"danger":""}"
          ?disabled=${t===$.Publishing||t===$.Unpublishing}
          @click=${this._publishButtonClickHandler}
        >
          ${t===$.Unpublished?"Publish":t===$.PrePublish?"Publish Now":t===$.Publishing?"Publish in progress...":t===$.Published?"Unpublish":t===$.Unpublishing?"Unpublishing...":""}
        </button>
      </div>
    `}async _fetchInitialData(){const t=await this._fetchPubInfo();return t?!1===t.complete?(this.pubState=$.Publishing,void setTimeout((()=>{this._fetchInitialData()}),3e3)):(this.pubInfo=t,this.pubState=$.Published,void this._pollItemMetadata()):(this.pubState=$.Unpublished,void(this.metadata={}))}async _pollItemMetadata(){const{pubState:t}=this,e=this.pubInfo,i=await this._fetchItemMetadata(e.item);void 0===i&&t===$.Published&&setTimeout((()=>{this._pollItemMetadata()}),3e3),this.metadata=i}async _fetchPubInfo(){const{datasetId:t}=this,e=await fetch(`/api/datasets/${t}/publication`);if(404!==e.status){const t=await e.json();return t.time=new Date(t.time),t}}async _fetchItemMetadata(t){const{datasetId:e}=this,i=await fetch(`/api/datasets/${e}/publication/${t}`);if(404!==i.status)return await i.json()}_publishButtonClickHandler(){const t=this.metadataForm;switch(this.pubState){case $.Unpublished:this.pubState=$.PrePublish;break;case $.PrePublish:t.form.checkValidity()?this._publish():t.form.reportValidity();break;case $.Published:window.confirm("Are you sure you want to unpublish this dataset?")&&this._unpublish()}}async _publish(){const{csrfToken:t,datasetId:e,_metadataFormData:i}=this;await fetch(`/api/datasets/${e}/publication`,{method:"POST",credentials:"same-origin",headers:{"X-CSRFToken":t},mode:"cors",body:JSON.stringify(i)}),this.pubState=$.Publishing,setTimeout((()=>{this._fetchInitialData()}),3e4)}async _unpublish(){const{csrfToken:t,datasetId:e,pubInfo:i}=this,{item:a}=i;this.pubState=$.Unpublishing,await fetch(`/api/datasets/${e}/publication/${a}`,{method:"DELETE",credentials:"same-origin",headers:{"X-CSRFToken":t},mode:"cors",body:JSON.stringify({delete:!0})}),this.pubState=$.Unpublished,this._fetchInitialData()}async _saveMetadata(){const{csrfToken:t,datasetId:e,pubInfo:i,_metadataFormData:a}=this,{item:s}=i;this.metadata=a,this.metadataState=k.Saving;const n=Object.assign(Object.fromEntries(w.map((t=>[t,[]]))),a);await fetch(`/api/datasets/${e}/publication/${s}`,{method:"POST",credentials:"same-origin",headers:{"X-CSRFToken":t},mode:"cors",body:JSON.stringify(n)}),this.metadataState=k.Displaying}};I.styles=h,e([i({type:String})],I.prototype,"datasetId",void 0),e([i({type:String})],I.prototype,"csrfToken",void 0),e([o()],I.prototype,"pubState",void 0),e([o()],I.prototype,"pubInfo",void 0),e([o()],I.prototype,"metadataState",void 0),e([o()],I.prototype,"metadata",void 0),e([l("arch-dataset-metadata-form")],I.prototype,"metadataForm",void 0),I=e([n("arch-dataset-publishing-card")],I);export{I as ArchDatasetPublishingCard};
//# sourceMappingURL=arch-dataset-publishing-card.js.map
