import{o as t,i as e,s as o,b as r,x as n,e as i}from"./chunk-lit-element.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function a(e,o){return t({descriptor:t=>{const r={get(){var t,o;return null!==(o=null===(t=this.renderRoot)||void 0===t?void 0:t.querySelector(e))&&void 0!==o?o:null},enumerable:!0,configurable:!0};if(o){const o="symbol"==typeof t?Symbol():"__"+t;r.get=function(){var t,r;return void 0===this[o]&&(this[o]=null!==(r=null===(t=this.renderRoot)||void 0===t?void 0:t.querySelector(e))&&void 0!==r?r:null),this[o]}}return r}})}const s=e`#2b74a1`,l=e`#1b4865`,c=e`#f0f0f0`,d=e`#222`,u=s,b=e`#fff`,h=e`#1e7b34`,f=e`#fff`;e`#e3e7e8`;const m={backgroundColor:u,border:e`none`,color:b,cursor:e`pointer`,hoverBackgroundColor:l,hoverColor:b,transition:e`background-color 300ms ease-out`};var p=e`
  :host {
    /* DataTable action buttons */
    --data-table-action-button-background-color: ${m.backgroundColor};
    --data-table-action-button-border: ${m.border};
    --data-table-action-button-color: ${m.color};
    --data-table-action-button-cursor: ${m.cursor};
    --data-table-action-button-hover-background-color: ${m.hoverBackgroundColor};
    --data-table-action-button-hover-color: ${m.hoverColor};
    --data-table-action-button-transition: ${m.transition};

    /* DataTable paginator */
    --data-table-paginator-wrapper-font-size: 1rem;
    --data-table-paginator-control-button-background-color: transparent;
    --data-table-paginator-control-button-border: none;
    --data-table-paginator-control-button-color: #348fc6;
    --data-table-paginator-control-button-padding: 0.25rem;
  }

  a:any-link {
    color: ${s};
  }

  a:hover {
    color: ${l};
  }
`;const g="0.41.2",v=new Set,y=new MutationObserver((()=>{const t="rtl"===document.documentElement.dir?document.documentElement.dir:"ltr";v.forEach((e=>{e.setAttribute("dir",t)}))}));y.observe(document.documentElement,{attributes:!0,attributeFilter:["dir"]});const $=t=>void 0!==t.startManagingContentDirection||"SP-THEME"===t.tagName;class E extends(function(t){return class extends t{get isLTR(){return"ltr"===this.dir}hasVisibleFocusInTree(){const t=((t=document)=>{var e;let o=t.activeElement;for(;null!=o&&o.shadowRoot&&o.shadowRoot.activeElement;)o=o.shadowRoot.activeElement;const r=o?[o]:[];for(;o;){const t=o.assignedSlot||o.parentElement||(null==(e=o.getRootNode())?void 0:e.host);t&&r.push(t),o=t}return r})(this.getRootNode())[0];if(!t)return!1;try{return t.matches(":focus-visible")||t.matches(".focus-visible")}catch(e){return t.matches(".focus-visible")}}connectedCallback(){if(!this.hasAttribute("dir")){let t=this.assignedSlot||this.parentNode;for(;t!==document.documentElement&&!$(t);)t=t.assignedSlot||t.parentNode||t.host;if(this.dir="rtl"===t.dir?t.dir:this.dir||"ltr",t===document.documentElement)v.add(this);else{const{localName:e}=t;e.search("-")>-1&&!customElements.get(e)?customElements.whenDefined(e).then((()=>{t.startManagingContentDirection(this)})):t.startManagingContentDirection(this)}this._dirParent=t}super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback(),this._dirParent&&(this._dirParent===document.documentElement?v.delete(this):this._dirParent.stopManagingContentDirection(this),this.removeAttribute("dir"))}}}(o)){}function x(t,e){customElements.define(t,e)}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */E.VERSION=g;const k=t=>null!=t?t:r
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,w={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},A=t=>(...e)=>({_$litDirective$:t,values:e});class C{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,o){this._$Ct=t,this._$AM=e,this._$Ci=o}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class T extends C{constructor(t){if(super(t),this.it=r,t.type!==w.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===r||null==t)return this._t=void 0,this.it=t;if(t===n)return t;if("string"!=typeof t)throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}}T.directiveName="unsafeHTML",T.resultType=1;const _=A(T);let I=!0;try{document.body.querySelector(":focus-visible")}catch(t){I=!1,import("./chunk-focus-visible.js").then((function(t){return t.f}))}const F=t=>{var e;const o=Symbol("endPolyfillCoordination");return e=o,class extends t{constructor(){super(...arguments),this[e]=null}connectedCallback(){super.connectedCallback&&super.connectedCallback(),I||requestAnimationFrame((()=>{null==this[o]&&(this[o]=(t=>{if(null==t.shadowRoot||t.hasAttribute("data-js-focus-visible"))return()=>{};if(!self.applyFocusVisiblePolyfill){const e=()=>{self.applyFocusVisiblePolyfill&&t.shadowRoot&&self.applyFocusVisiblePolyfill(t.shadowRoot),t.manageAutoFocus&&t.manageAutoFocus()};return self.addEventListener("focus-visible-polyfill-ready",e,{once:!0}),()=>{self.removeEventListener("focus-visible-polyfill-ready",e)}}return self.applyFocusVisiblePolyfill(t.shadowRoot),t.manageAutoFocus&&t.manageAutoFocus(),()=>{}})(this))}))}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),I||requestAnimationFrame((()=>{null!=this[o]&&(this[o](),this[o]=null)}))}}};var N=Object.defineProperty,P=Object.getOwnPropertyDescriptor,M=(t,e,o,r)=>{for(var n,i=r>1?void 0:r?P(e,o):e,a=t.length-1;a>=0;a--)(n=t[a])&&(i=(r?n(e,o,i):n(i))||i);return r&&i&&N(e,o,i),i};function R(){return new Promise((t=>requestAnimationFrame((()=>t()))))}class S extends(F(E)){constructor(){super(...arguments),this.disabled=!1,this.autofocus=!1,this._tabIndex=0,this.manipulatingTabindex=!1,this._recentlyConnected=!1}get tabIndex(){if(this.focusElement===this){const t=this.hasAttribute("tabindex")?Number(this.getAttribute("tabindex")):NaN;return isNaN(t)?-1:t}const t=parseFloat(this.hasAttribute("tabindex")&&this.getAttribute("tabindex")||"0");return this.disabled||t<0?-1:this.focusElement?this.focusElement.tabIndex:t}set tabIndex(t){if(this.manipulatingTabindex)this.manipulatingTabindex=!1;else if(this.focusElement!==this){if(-1===t?this.addEventListener("pointerdown",this.onPointerdownManagementOfTabIndex):(this.manipulatingTabindex=!0,this.removeEventListener("pointerdown",this.onPointerdownManagementOfTabIndex)),-1===t||this.disabled)return this.setAttribute("tabindex","-1"),this.removeAttribute("focusable"),void(-1!==t&&this.manageFocusElementTabindex(t));this.setAttribute("focusable",""),this.hasAttribute("tabindex")?this.removeAttribute("tabindex"):this.manipulatingTabindex=!1,this.manageFocusElementTabindex(t)}else if(t!==this._tabIndex){this._tabIndex=t;const e=this.disabled?"-1":""+t;this.manipulatingTabindex=!0,this.setAttribute("tabindex",e)}}onPointerdownManagementOfTabIndex(){-1===this.tabIndex&&setTimeout((()=>{this.tabIndex=0,this.focus({preventScroll:!0}),this.tabIndex=-1}))}async manageFocusElementTabindex(t){this.focusElement||await this.updateComplete,null===t?this.focusElement.removeAttribute("tabindex"):this.focusElement.tabIndex=t}get focusElement(){throw new Error("Must implement focusElement getter!")}focus(t){this.disabled||!this.focusElement||(this.focusElement!==this?this.focusElement.focus(t):HTMLElement.prototype.focus.apply(this,[t]))}blur(){const t=this.focusElement||this;t!==this?t.blur():HTMLElement.prototype.blur.apply(this)}click(){if(this.disabled)return;const t=this.focusElement||this;t!==this?t.click():HTMLElement.prototype.click.apply(this)}manageAutoFocus(){this.autofocus&&(this.dispatchEvent(new KeyboardEvent("keydown",{code:"Tab"})),this.focusElement.focus())}firstUpdated(t){super.firstUpdated(t),(!this.hasAttribute("tabindex")||"-1"!==this.getAttribute("tabindex"))&&this.setAttribute("focusable","")}update(t){t.has("disabled")&&this.handleDisabledChanged(this.disabled,t.get("disabled")),super.update(t)}updated(t){super.updated(t),t.has("disabled")&&this.disabled&&this.blur()}async handleDisabledChanged(t,e){const o=()=>this.focusElement!==this&&void 0!==this.focusElement.disabled;t?(this.manipulatingTabindex=!0,this.setAttribute("tabindex","-1"),await this.updateComplete,o()?this.focusElement.disabled=!0:this.setAttribute("aria-disabled","true")):e&&(this.manipulatingTabindex=!0,this.focusElement===this?this.setAttribute("tabindex",""+this._tabIndex):this.removeAttribute("tabindex"),await this.updateComplete,o()?this.focusElement.disabled=!1:this.removeAttribute("aria-disabled"))}async getUpdateComplete(){const t=await super.getUpdateComplete();return this._recentlyConnected&&(this._recentlyConnected=!1,await R(),await R()),t}connectedCallback(){super.connectedCallback(),this._recentlyConnected=!0,this.updateComplete.then((()=>{this.manageAutoFocus()}))}}M([i({type:Boolean,reflect:!0})],S.prototype,"disabled",2),M([i({type:Boolean})],S.prototype,"autofocus",2),M([i({type:Number})],S.prototype,"tabIndex",1),e`#2991cc`,e`#fff`,e`#dce0e0`,e`#dce0e0`;const D=e`#052c65`,L=e`#2b2f32`,O=e`#0a3622`,B=e`#055160`,H=e`#664d03`,U=e`#58151c`,q=e`#495057`,V=e`#495057`,z=e`#f8d7da`,j=e`
  :host {
    color: #222;
    font-family: "Open Sans", Helvetica, Arial, sans-serif;
  }

  a:any-link {
    color: ${s};
    text-decoration: none;
  }

  button {
    white-space: nowrap;
    font-size: 0.9rem;
    border-radius: 3px;
    border: none;
    padding: 0.4rem 1rem;
    cursor: pointer;
    background-color: ${c};
    color: ${d};
  }

  button:disabled,
  input:disabled,
  select:disabled {
    cursor: default;
  }

  button.primary {
    background-color: ${u};
    color: ${b};
  }

  button.success {
    background-color: ${h};
    color: ${f};
  }

  button.danger {
    background-color: ${z};
    color: ${U};
  }

  a:any-link:hover,
  button.text:hover {
    color: ${l};
    cursor: pointer;
  }

  button.text {
    background: transparent;
    border: none;
    padding: 0;
    color: ${s};
    font-size: 1rem;
  }

  dl {
    margin-block-start: 0;
    margin-block-end: 0;
  }

  dl > div {
    margin-bottom: 1rem;
  }

  dl > div:last-child {
    margin-bottom: 0;
  }

  dt {
    display: inline;
    font-weight: bold;
  }

  dt:after {
    content: ":";
    margin-right: 0.5em;
  }

  dd {
    display: inline;
    margin: 0;
    line-height: 1.2em;
    font-style: italic;
  }

  dd::after {
    content: ",";
    padding-right: 0.2em;
  }

  dd:last-child::after {
    content: none;
    padding-right: 0;
  }

  form > label {
    font-size: 1rem;
    color: black;
    cursor: pointer;
    display: block;
    font-weight: bold;
    line-height: 1.5;
    margin-bottom: 0;
  }

  form > em {
    display: block;
    padding: 0.5rem 0;
    color: #444;
  }

  input,
  select {
    background-color: #fff;
    font-family: inherit;
    border: 1px solid #ccc;
    color: rgba(0, 0, 0, 0.75);
    font-size: 0.875rem;
    padding: 0.5rem;
    cursor: pointer;
  }

  label.required:after {
    content: "*";
    color: red;
  }

  .hidden {
    display: none;
  }
`,G=e`
  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  tr {
    border-bottom: solid #eee 1px;
  }

  tr:last-child {
    border-bottom: none;
  }

  tbody > tr:hover {
    background-color: #f7f7f7;
  }

  th,
  td {
    text-align: left;
    padding: 0.5rem 0.25rem;
  }

  th {
    color: #555;
    font-size: 0.9rem;
  }

  a.view-all {
    font-weight: bold;
  }
`,K=e`
  .alert {
    position: relative;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-radius: 0.375rem;
  }

  .alert a {
    font-weight: 700;
  }

  .alert-primary {
    color: ${D};
    background-color: ${e`#cfe2ff`};
    border-color: ${e`#9ec5fe`};
  }

  .alert-primary a {
    color: ${D};
  }

  .alert-secondary {
    color: ${L};
    background-color: ${e`#e2e3e5`};
    border-color: ${e`#c4c8cb`};
  }

  .alert-secondary a {
    color: ${L};
  }

  .alert-success {
    color: ${O};
    background-color: ${e`#d1e7dd`};
    border-color: ${e`#a3cfbb`};
  }

  .alert-success a {
    color: ${O};
  }

  .alert-info {
    color: ${B};
    background-color: ${e`#cff4fc`};
    border-color: ${e`#9eeaf9`};
  }

  .alert-info a {
    color: ${B};
  }

  .alert-warning {
    color: ${H};
    background-color: ${e`#fff3cd`};
    border-color: ${e`#ffe69c`};
  }

  .alert-warning a {
    color: ${H};
  }

  .alert-danger {
    color: ${U};
    background-color: ${z};
    border-color: ${e`#f1aeb5`};
  }

  .alert-danger a {
    color: ${U};
  }

  .alert-light {
    color: ${q};
    background-color: ${e`#fcfcfd`};
    border-color: ${e`#e9ecef`};
  }

  .alert-light a {
    color: ${q};
  }

  .alert-dark {
    color: ${V};
    background-color: ${e`#ced4da`};
    border-color: ${e`#adb5bd`};
  }

  .alert-dark a {
    color: ${V};
  }
`;export{K as B,S as F,p as G,E as S,C as a,c as b,G as c,x as d,A as e,F as f,j as g,a as i,k as l,_ as o,w as t,g as v};
//# sourceMappingURL=chunk-styles.js.map
