import{s as e,_ as t,e as s,y as o,a as i}from"./chunk-lit-element.js";import{t as l}from"./chunk-state.js";import{D as a}from"./chunk-helpers.js";let n=class extends e{constructor(){super(...arguments),this.deselectButtonText="remove",this.headingLevel=3,this.optionsSortCompareFn=void 0,this.selectedOptionsTitle="Selected Options",this.selectCtaText="Select value to add",this.availableOptions=[],this.disabled=!1}sortByLabel(e,t){const{labelGetter:s}=this,o=s(e),i=s(t);return o>i?1:o<i?-1:0}heading(e){const{headingLevel:t}=this;switch(t){case 1:return o`<h1>${e}</h1>`;case 2:return o`<h2>${e}</h2>`;case 3:return o`<h3>${e}</h3>`;case 4:return o`<h4>${e}</h4>`;case 5:return o`<h5>${e}</h5>`;case 6:return o`<h6>${e}</h6>`;default:return o``}}render(){const{deselectButtonText:e,disabled:t,labelGetter:s,selectCtaText:i,selectedOptions:l,selectedOptionsTitle:n,valueGetter:r}=this;return this.updateAvailableOptions(),o`
      ${0===l.length?o``:o`
            ${this.heading(n)}
            <ul>
              ${l.map((i=>o`<li>
                    ${s(i)}<button
                      ?disabled=${t}
                      @click=${e=>this.deselectOption(e.target,i)}
                    >
                      ${e}
                    </button>
                  </li>`))}
            </ul>
          `}
      ${0===this.availableOptions.length?o``:o`
            <label>
              ${i}
              <select ?disabled=${t} @change=${this.selectHandler}>
                <option selected value>
                  ${a}
                </option>
                ${this.availableOptions.map((e=>o`<option value="${r(e)}">
                      ${s(e)}
                    </option>`))}
              </select>
            </label>
          `}
    `}updateAvailableOptions(){const{options:e,optionsSortCompareFn:t,selectedOptions:s,valueGetter:o}=this,i=new Set(s.map(o));this.availableOptions=e.filter((e=>!i.has(o(e)))).sort(null!=t?t:this.sortByLabel.bind(this))}selectOption(e){this.selectedOptions.push(e),this.updateAvailableOptions()}get revertFn(){const e=[...this.selectedOptions];return()=>{this.selectedOptions=e,this.updateAvailableOptions()}}deselectOption(e,t){const{revertFn:s,valueGetter:o}=this,i=o(t);this.selectedOptions=this.selectedOptions.filter((e=>o(e)!==i)),this.updateAvailableOptions(),this.onChange(s,e)}selectHandler(e){const{options:t,revertFn:s,valueGetter:o}=this,i=e.target,l=i.value;""!==l&&(this.selectOption(t.find((e=>String(o(e))===l))),i.children[0].selected=!0,this.onChange(s,i))}onChange(e,t){}};n.shadowRootOptions={...e.shadowRootOptions,delegatesFocus:!0},t([s({type:String})],n.prototype,"deselectButtonText",void 0),t([s({type:Number})],n.prototype,"headingLevel",void 0),t([s()],n.prototype,"labelGetter",void 0),t([s({type:Array})],n.prototype,"options",void 0),t([s()],n.prototype,"optionsSortCompareFn",void 0),t([s({type:Array})],n.prototype,"selectedOptions",void 0),t([s({type:Array})],n.prototype,"selectedOptionsTitle",void 0),t([s({type:String})],n.prototype,"selectCtaText",void 0),t([s()],n.prototype,"valueGetter",void 0),t([l()],n.prototype,"availableOptions",void 0),t([l()],n.prototype,"disabled",void 0),n=t([i("arch-select-adder")],n);export{n as A};
//# sourceMappingURL=chunk-arch-select-adder.js.map
