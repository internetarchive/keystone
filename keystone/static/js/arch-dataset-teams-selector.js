import{s as e,_ as t,e as s,y as i,a,i as o}from"./chunk-lit-element.js";import{A as l}from"./chunk-ArchAPI.js";import{ArchGlobalModal as n}from"./arch-global-modal.js";import{t as r}from"./chunk-state.js";import{g as d}from"./chunk-styles.js";import"./chunk-helpers.js";import"./chunk-arch-modal.js";import"./chunk-scale-large.js";import"./chunk-sizedMixin.js";let p=class extends e{constructor(){super(...arguments),this.deselectButtonText="remove",this.headingLevel=3,this.selectedOptionsTitle="Selected Options",this.selectCtaText="Select value to add",this.availableOptions=[],this.disabled=!1}heading(e){const{headingLevel:t}=this;switch(t){case 1:return i`<h1>${e}</h1>`;case 2:return i`<h2>${e}</h2>`;case 3:return i`<h3>${e}</h3>`;case 4:return i`<h4>${e}</h4>`;case 5:return i`<h5>${e}</h5>`;case 6:return i`<h6>${e}</h6>`;default:return i``}}render(){const{deselectButtonText:e,disabled:t,labelGetter:s,selectCtaText:a,selectedOptions:o,selectedOptionsTitle:l,valueGetter:n}=this;return this.updateAvailableOptions(),i`
      ${0===o.length?i``:i`
            ${this.heading(l)}
            <ul>
              ${o.map((a=>i`<li>
                    ${s(a)}<button
                      ?disabled=${t}
                      @click=${e=>this.deselectOption(e.target,a)}
                    >
                      ${e}
                    </button>
                  </li>`))}
            </ul>
          `}
      ${0===this.availableOptions.length?i``:i`
            <label>
              ${a}
              <select ?disabled=${t} @change=${this.selectHandler}>
                <option selected value>~ choose ~</option>
                ${this.availableOptions.map((e=>i`<option value="${n(e)}">
                      ${s(e)}
                    </option>`))}
              </select>
            </label>
          `}
    `}updateAvailableOptions(){const{options:e,selectedOptions:t,valueGetter:s}=this,i=new Set(t.map(s));this.availableOptions=e.filter((e=>!i.has(s(e))))}selectOption(e){this.selectedOptions.push(e),this.updateAvailableOptions()}get revertFn(){const e=[...this.selectedOptions];return()=>{this.selectedOptions=e,this.updateAvailableOptions()}}deselectOption(e,t){const{revertFn:s,valueGetter:i}=this,a=i(t);this.selectedOptions=this.selectedOptions.filter((e=>i(e)!==a)),this.updateAvailableOptions(),this.onChange(s,e)}selectHandler(e){const{options:t,revertFn:s,valueGetter:i}=this,a=e.target,o=a.value;""!==o&&(this.selectOption(t.find((e=>String(i(e))===o))),a.children[0].selected=!0,this.onChange(s,a))}onChange(e,t){}};p.shadowRootOptions={...e.shadowRootOptions,delegatesFocus:!0},t([s({type:String})],p.prototype,"deselectButtonText",void 0),t([s({type:Number})],p.prototype,"headingLevel",void 0),t([s({type:String})],p.prototype,"labelGetter",void 0),t([s({type:Array})],p.prototype,"options",void 0),t([s({type:Array})],p.prototype,"selectedOptions",void 0),t([s({type:Array})],p.prototype,"selectedOptionsTitle",void 0),t([s({type:String})],p.prototype,"selectCtaText",void 0),t([s({type:String})],p.prototype,"valueGetter",void 0),t([r()],p.prototype,"availableOptions",void 0),t([r()],p.prototype,"disabled",void 0),p=t([a("arch-select-adder")],p);var h=[d,o`
    h3 {
      margin-block-start: 0;
      margin-block-end: 0.5rem;
      font-size: 1rem;
    }

    ul {
      line-height: 1.6rem;
      font-style: italic;
    }

    button {
      padding: 0;
      background-color: transparent;
      margin-left: 1rem;
      text-decoration: underline;
      color: red;
      font-size: 0.8em;
    }

    label {
      margin-left: 1.2rem;
    }

    select {
      padding: 0.2rem;
      border-radius: 8px;
    }
  `];let c=class extends p{connectedCallback(){const{userTeams:e,datasetTeams:t}=this;this.options=e,this.selectedOptions=t,this.deselectButtonText="stop sharing",this.selectCtaText="Add a team",this.selectedOptionsTitle="Currently Sharing With",this.valueGetter=e=>e.id,this.labelGetter=e=>e.name,super.connectedCallback()}async onChange(e,t){const{datasetId:s,selectedOptions:i}=this;this.disabled=!0;try{await l.datasets.updateTeams(s,i)}catch(s){e(),n.showError("","Could not update dataset teams. Please try again.",t)}this.disabled=!1}};c.styles=h,t([s({type:String})],c.prototype,"datasetId",void 0),t([s({type:Array})],c.prototype,"userTeams",void 0),t([s({type:Array})],c.prototype,"datasetTeams",void 0),c=t([a("arch-dataset-teams-selector")],c);export{c as ArchDatasetTeamsSelector};
//# sourceMappingURL=arch-dataset-teams-selector.js.map
