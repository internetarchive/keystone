import{o as t,A as e,a as o}from"./chunk-arch-sub-collection-builder.js";import{l as s,o as i,x as a,i as r,e as n,y as c,b as l,_ as d,a as h,s as m}from"./chunk-query-assigned-elements.js";import{t as u}from"./chunk-state.js";import{i as p,g as b,a as v,b as g,B as f}from"./chunk-styles.js";import{S as y,F as x,a as I,d as w,A as k,e as C}from"./chunk-arch-json-schema-form.js";import{S,d as z}from"./chunk-define-element.js";import{l as E}from"./chunk-scale-large.js";import{e as P,i as $,t as j}from"./chunk-directive.js";import{i as T}from"./chunk-helpers.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function A(t,e,o){let a,r=t;return"object"==typeof t?(r=t.slot,a=t):a={flatten:e},o?s({slot:r,flatten:e,selector:o}):i({descriptor:t=>({get(){var t,e;const o="slot"+(r?`[name=${r}]`:":not([name])"),s=null===(t=this.renderRoot)||void 0===t?void 0:t.querySelector(o);return null!==(e=null==s?void 0:s.assignedNodes(a))&&void 0!==e?e:[]},enumerable:!0,configurable:!0})})}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const D=P(class extends ${constructor(t){var e;if(super(t),t.type!==j.ATTRIBUTE||"class"!==t.name||(null===(e=t.strings)||void 0===e?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){var o,s;if(void 0===this.nt){this.nt=new Set,void 0!==t.strings&&(this.st=new Set(t.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in e)e[t]&&!(null===(o=this.st)||void 0===o?void 0:o.has(t))&&this.nt.add(t);return this.render(e)}const i=t.element.classList;this.nt.forEach((t=>{t in e||(i.remove(t),this.nt.delete(t))}));for(const t in e){const o=!!e[t];o===this.nt.has(t)||(null===(s=this.st)||void 0===s?void 0:s.has(t))||(o?(i.add(t),this.nt.add(t)):(i.remove(t),this.nt.delete(t)))}return a}});var U,L,M;!function(t){t.SUBMITTED="SUBMITTED",t.QUEUED="QUEUED",t.RUNNING="RUNNING",t.FINISHED="FINISHED",t.FAILED="FAILED",t.CANCELLED="CANCELLED"}(U||(U={})),function(t){t.AIT="AIT",t.SPECIAL="SPECIAL",t.CUSTOM="CUSTOM"}(L||(L={})),function(t){t.ArsLgaGeneration="ArsLgaGeneration",t.ArsWaneGeneration="ArsWaneGeneration",t.ArsWatGeneration="ArsWatGeneration",t.AudioInformationExtraction="AudioInformationExtraction",t.DomainFrequencyExtraction="DomainFrequencyExtraction",t.DomainGraphExtraction="DomainGraphExtraction",t.ImageGraphExtraction="ImageGraphExtraction",t.ImageInformationExtraction="ImageInformationExtraction",t.PdfInformationExtraction="PdfInformationExtraction",t.PresentationProgramInformationExtraction="PresentationProgramInformationExtraction",t.SpreadsheetInformationExtraction="SpreadsheetInformationExtraction",t.TextFilesInformationExtraction="TextFilesInformationExtraction",t.VideoInformationExtraction="VideoInformationExtraction",t.WebGraphExtraction="WebGraphExtraction",t.WebPagesExtraction="WebPagesExtraction",t.WordProcessorInformationExtraction="WordProcessorInformationExtraction"}(M||(M={}));class O{constructor(){this.iconsetMap=new Map}static getInstance(){return O.instance||(O.instance=new O),O.instance}addIconset(t,e){this.iconsetMap.set(t,e);const o=new CustomEvent("sp-iconset-added",{bubbles:!0,composed:!0,detail:{name:t,iconset:e}});setTimeout((()=>window.dispatchEvent(o)),0)}removeIconset(t){this.iconsetMap.delete(t);const e=new CustomEvent("sp-iconset-removed",{bubbles:!0,composed:!0,detail:{name:t}});setTimeout((()=>window.dispatchEvent(e)),0)}getIconset(t){return this.iconsetMap.get(t)}}const F=r`
:host{fill:currentColor;color:inherit;display:inline-block;pointer-events:none}:host(:not(:root)){overflow:hidden}@media (forced-colors:active){:host{forced-color-adjust:auto}}:host{--spectrum-icon-size-s:var(
--spectrum-alias-workflow-icon-size-s,var(--spectrum-global-dimension-size-200)
);--spectrum-icon-size-m:var(
--spectrum-alias-workflow-icon-size-m,var(--spectrum-global-dimension-size-225)
);--spectrum-icon-size-l:var(--spectrum-alias-workflow-icon-size-l);--spectrum-icon-size-xl:var(
--spectrum-alias-workflow-icon-size-xl,var(--spectrum-global-dimension-size-275)
);--spectrum-icon-size-xxl:var(--spectrum-global-dimension-size-400)}:host([size=s]){height:var(--spectrum-icon-size-s);width:var(--spectrum-icon-size-s)}:host([size=m]){height:var(--spectrum-icon-size-m);width:var(--spectrum-icon-size-m)}:host([size=l]){height:var(--spectrum-icon-size-l);width:var(--spectrum-icon-size-l)}:host([size=xl]){height:var(--spectrum-icon-size-xl);width:var(--spectrum-icon-size-xl)}:host([size=xxl]){height:var(--spectrum-icon-size-xxl);width:var(--spectrum-icon-size-xxl)}:host{height:var(
--spectrum-icon-tshirt-size-height,var(
--spectrum-alias-workflow-icon-size,var(--spectrum-global-dimension-size-225)
)
);width:var(
--spectrum-icon-tshirt-size-width,var(
--spectrum-alias-workflow-icon-size,var(--spectrum-global-dimension-size-225)
)
)}#container{height:100%}::slotted(*),img,svg{color:inherit;height:100%;vertical-align:top;width:100%}@media (forced-colors:active){::slotted(*),img,svg{forced-color-adjust:auto}}
`;var N=Object.defineProperty,_=Object.getOwnPropertyDescriptor,q=(t,e,o,s)=>{for(var i,a=s>1?void 0:s?_(e,o):e,r=t.length-1;r>=0;r--)(i=t[r])&&(a=(s?i(e,o,a):i(a))||a);return s&&a&&N(e,o,a),a};class H extends S{constructor(){super(...arguments),this.label=""}static get styles(){return[F]}update(t){t.has("label")&&(this.label?this.removeAttribute("aria-hidden"):this.setAttribute("aria-hidden","true")),super.update(t)}render(){return c`
            <slot></slot>
        `}}q([n()],H.prototype,"label",2),q([n({reflect:!0})],H.prototype,"size",2);var J=Object.defineProperty,B=Object.getOwnPropertyDescriptor,R=(t,e,o,s)=>{for(var i,a=s>1?void 0:s?B(e,o):e,r=t.length-1;r>=0;r--)(i=t[r])&&(a=(s?i(e,o,a):i(a))||a);return s&&a&&J(e,o,a),a};class G extends H{constructor(){super(...arguments),this.iconsetListener=t=>{if(!this.name)return;const e=this.parseIcon(this.name);t.detail.name===e.iconset&&(this.updateIconPromise=this.updateIcon())}}connectedCallback(){super.connectedCallback(),window.addEventListener("sp-iconset-added",this.iconsetListener)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("sp-iconset-added",this.iconsetListener)}firstUpdated(){this.updateIconPromise=this.updateIcon()}attributeChangedCallback(t,e,o){super.attributeChangedCallback(t,e,o),this.updateIconPromise=this.updateIcon()}announceIconImageSrcError(){this.dispatchEvent(new Event("error",{cancelable:!1,bubbles:!1,composed:!1}))}render(){return this.name?c`
                <div id="container"></div>
            `:this.src?c`
                <img
                    src="${this.src}"
                    alt=${E(this.label)}
                    @error=${this.announceIconImageSrcError}
                />
            `:super.render()}async updateIcon(){if(this.updateIconPromise&&await this.updateIconPromise,!this.name)return Promise.resolve();const t=this.parseIcon(this.name),e=O.getInstance().getIconset(t.iconset);return e&&this.iconContainer?(this.iconContainer.innerHTML="",e.applyIconToElement(this.iconContainer,t.icon,this.size||"",this.label?this.label:"")):Promise.resolve()}parseIcon(t){const e=t.split(":");let o="default",s=t;return e.length>1&&(o=e[0],s=e[1]),{iconset:o,icon:s}}async getUpdateComplete(){const t=await super.getUpdateComplete();return await this.updateIconPromise,t}}R([n()],G.prototype,"src",2),R([n()],G.prototype,"name",2),R([p("#container")],G.prototype,"iconContainer",2),z("sp-icon",G);class W{constructor(t,{target:e,config:o,callback:s,skipInitial:i}){this.t=new Set,this.o=!1,this.i=!1,this.h=t,null!==e&&this.t.add(e??t),this.o=i??this.o,this.callback=s,window.IntersectionObserver?(this.u=new IntersectionObserver((t=>{const e=this.i;this.i=!1,this.o&&e||(this.handleChanges(t),this.h.requestUpdate())}),o),t.addController(this)):console.warn("IntersectionController error: browser does not support IntersectionObserver.")}handleChanges(t){this.value=this.callback?.(t,this.u)}hostConnected(){for(const t of this.t)this.observe(t)}hostDisconnected(){this.disconnect()}async hostUpdated(){const t=this.u.takeRecords();t.length&&this.handleChanges(t)}observe(t){this.t.add(t),this.u.observe(t),this.i=!0}unobserve(t){this.t.delete(t),this.u.unobserve(t)}disconnect(){this.u.disconnect()}}class X{constructor(t,{target:e,config:o,callback:s,skipInitial:i}){this.t=new Set,this.o=!1,this.i=!1,this.h=t,null!==e&&this.t.add(e??t),this.l=o,this.o=i??this.o,this.callback=s,window.ResizeObserver?(this.u=new ResizeObserver((t=>{this.handleChanges(t),this.h.requestUpdate()})),t.addController(this)):console.warn("ResizeController error: browser does not support ResizeObserver.")}handleChanges(t){this.value=this.callback?.(t,this.u)}hostConnected(){for(const t of this.t)this.observe(t)}hostDisconnected(){this.disconnect()}async hostUpdated(){!this.o&&this.i&&this.handleChanges([]),this.i=!1}observe(t){this.t.add(t),this.u.observe(t,this.l),this.i=!0,this.h.requestUpdate()}unobserve(t){this.t.delete(t),this.u.unobserve(t)}disconnect(){this.u.disconnect()}}class K{constructor(t,{target:e,config:o,callback:s,skipInitial:i}){this.t=new Set,this.o=!1,this.i=!1,this.h=t,null!==e&&this.t.add(e??t),this.l=o,this.o=i??this.o,this.callback=s,window.MutationObserver?(this.u=new MutationObserver((t=>{this.handleChanges(t),this.h.requestUpdate()})),t.addController(this)):console.warn("MutationController error: browser does not support MutationObserver.")}handleChanges(t){this.value=this.callback?.(t,this.u)}hostConnected(){for(const t of this.t)this.observe(t)}hostDisconnected(){this.disconnect()}async hostUpdated(){const t=this.u.takeRecords();(t.length||!this.o&&this.i)&&this.handleChanges(t),this.i=!1}observe(t){this.t.add(t),this.u.observe(t,this.l),this.i=!0,this.h.requestUpdate()}disconnect(){this.u.disconnect()}}const Y=Symbol("slotContentIsPresent");var Q=Object.defineProperty,V=Object.getOwnPropertyDescriptor,Z=(t,e,o,s)=>{for(var i,a=s>1?void 0:s?V(e,o):e,r=t.length-1;r>=0;r--)(i=t[r])&&(a=(s?i(e,o,a):i(a))||a);return s&&a&&Q(e,o,a),a};const tt=Symbol("assignedNodes");function et(t,e,o){return typeof t===e?()=>t:"function"==typeof t?t:o}class ot{constructor(t,{direction:e,elementEnterAction:o,elements:s,focusInIndex:i,isFocusableElement:a,listenerScope:r}={elements:()=>[]}){this._currentIndex=-1,this._direction=()=>"both",this.directionLength=5,this.elementEnterAction=t=>{},this._focused=!1,this._focusInIndex=t=>0,this.isFocusableElement=t=>!0,this._listenerScope=()=>this.host,this.offset=0,this.handleFocusin=t=>{if(!this.isEventWithinListenerScope(t))return;this.isRelatedTargetAnElement(t)&&this.hostContainsFocus();const e=t.composedPath();let o=-1;e.find((t=>(o=this.elements.indexOf(t),-1!==o))),this.currentIndex=o>-1?o:this.currentIndex},this.handleFocusout=t=>{this.isRelatedTargetAnElement(t)&&this.hostNoLongerContainsFocus()},this.handleKeydown=t=>{if(!this.acceptsEventCode(t.code)||t.defaultPrevented)return;let e=0;switch(t.code){case"ArrowRight":e+=1;break;case"ArrowDown":e+="grid"===this.direction?this.directionLength:1;break;case"ArrowLeft":e-=1;break;case"ArrowUp":e-="grid"===this.direction?this.directionLength:1;break;case"End":this.currentIndex=0,e-=1;break;case"Home":this.currentIndex=this.elements.length-1,e+=1}t.preventDefault(),"grid"===this.direction&&this.currentIndex+e<0?this.currentIndex=0:"grid"===this.direction&&this.currentIndex+e>this.elements.length-1?this.currentIndex=this.elements.length-1:this.setCurrentIndexCircularly(e),this.elementEnterAction(this.elements[this.currentIndex]),this.focus()},new K(t,{config:{childList:!0,subtree:!0},callback:()=>{this.handleItemMutation()}}),this.host=t,this.host.addController(this),this._elements=s,this.isFocusableElement=a||this.isFocusableElement,this._direction=et(e,"string",this._direction),this.elementEnterAction=o||this.elementEnterAction,this._focusInIndex=et(i,"number",this._focusInIndex),this._listenerScope=et(r,"object",this._listenerScope)}get currentIndex(){return-1===this._currentIndex&&(this._currentIndex=this.focusInIndex),this._currentIndex-this.offset}set currentIndex(t){this._currentIndex=t+this.offset}get direction(){return this._direction()}get elements(){return this.cachedElements||(this.cachedElements=this._elements()),this.cachedElements}set focused(t){t!==this.focused&&(this._focused=t)}get focused(){return this._focused}get focusInElement(){return this.elements[this.focusInIndex]}get focusInIndex(){return this._focusInIndex(this.elements)}isEventWithinListenerScope(t){return this._listenerScope()===this.host||t.composedPath().includes(this._listenerScope())}handleItemMutation(){if(-1==this._currentIndex||this.elements.length<=this._elements().length)return;const t=this.elements[this.currentIndex];if(this.clearElementCache(),this.elements.includes(t))return;const e=this.currentIndex!==this.elements.length,o=e?1:-1;e&&this.setCurrentIndexCircularly(-1),this.setCurrentIndexCircularly(o),this.focus()}update({elements:t}={elements:()=>[]}){this.unmanage(),this._elements=t,this.clearElementCache(),this.manage()}focus(t){const e=this.elements;if(!e.length)return;let o=e[this.currentIndex];(!o||!this.isFocusableElement(o))&&(this.setCurrentIndexCircularly(1),o=e[this.currentIndex]),o&&this.isFocusableElement(o)&&o.focus(t)}clearElementCache(t=0){delete this.cachedElements,this.offset=t}setCurrentIndexCircularly(t){const{length:e}=this.elements;let o=e,s=(e+this.currentIndex+t)%e;for(;o&&this.elements[s]&&!this.isFocusableElement(this.elements[s]);)s=(e+s+t)%e,o-=1;this.currentIndex=s}hostContainsFocus(){this.host.addEventListener("focusout",this.handleFocusout),this.host.addEventListener("keydown",this.handleKeydown),this.focused=!0}hostNoLongerContainsFocus(){this.host.addEventListener("focusin",this.handleFocusin),this.host.removeEventListener("focusout",this.handleFocusout),this.host.removeEventListener("keydown",this.handleKeydown),this.focused=!1}isRelatedTargetAnElement(t){const e=t.relatedTarget;return!this.elements.includes(e)}acceptsEventCode(t){if("End"===t||"Home"===t)return!0;switch(this.direction){case"horizontal":return"ArrowLeft"===t||"ArrowRight"===t;case"vertical":return"ArrowUp"===t||"ArrowDown"===t;case"both":case"grid":return t.startsWith("Arrow")}}manage(){this.addEventListeners()}unmanage(){this.removeEventListeners()}addEventListeners(){this.host.addEventListener("focusin",this.handleFocusin)}removeEventListeners(){this.host.removeEventListener("focusin",this.handleFocusin),this.host.removeEventListener("focusout",this.handleFocusout),this.host.removeEventListener("keydown",this.handleKeydown)}hostConnected(){this.addEventListeners()}hostDisconnected(){this.removeEventListeners()}}class st extends ot{constructor(){super(...arguments),this.managed=!0,this.manageIndexesAnimationFrame=0}set focused(t){t!==this.focused&&(super.focused=t,this.manageTabindexes())}get focused(){return super.focused}clearElementCache(t=0){cancelAnimationFrame(this.manageIndexesAnimationFrame),super.clearElementCache(t),this.managed&&(this.manageIndexesAnimationFrame=requestAnimationFrame((()=>this.manageTabindexes())))}manageTabindexes(){this.focused?this.updateTabindexes((()=>({tabIndex:-1}))):this.updateTabindexes((t=>({removeTabIndex:t.contains(this.focusInElement)&&t!==this.focusInElement,tabIndex:t===this.focusInElement?0:-1})))}updateTabindexes(t){this.elements.forEach((e=>{const{tabIndex:o,removeTabIndex:s}=t(e);if(!s)return void(e.tabIndex=o);e.removeAttribute("tabindex");const i=e;i.requestUpdate&&i.requestUpdate()}))}manage(){this.managed=!0,this.manageTabindexes(),super.manage()}unmanage(){this.managed=!1,this.updateTabindexes((()=>({tabIndex:0}))),super.unmanage()}hostUpdated(){this.host.hasUpdated||this.manageTabindexes()}}const it=r`
#list{--spectrum-tabs-item-height:var(--spectrum-tab-item-height-medium);--spectrum-tabs-item-horizontal-spacing:var(
--spectrum-tab-item-to-tab-item-horizontal-medium
);--spectrum-tabs-item-vertical-spacing:var(
--spectrum-tab-item-to-tab-item-vertical-medium
);--spectrum-tabs-start-to-edge:var(
--spectrum-tab-item-start-to-edge-medium
);--spectrum-tabs-top-to-text:var(--spectrum-tab-item-top-to-text-medium);--spectrum-tabs-bottom-to-text:var(
--spectrum-tab-item-bottom-to-text-medium
);--spectrum-tabs-icon-size:var(--spectrum-workflow-icon-size-75);--spectrum-tabs-icon-to-text:var(--spectrum-text-to-visual-100);--spectrum-tabs-top-to-icon:var(
--spectrum-tab-item-top-to-workflow-icon-medium
);--spectrum-tabs-color:var(
--spectrum-neutral-subdued-content-color-default
);--spectrum-tabs-color-selected:var(
--spectrum-neutral-subdued-content-color-down
);--spectrum-tabs-color-hover:var(
--spectrum-neutral-subdued-content-color-hover
);--spectrum-tabs-color-key-focus:var(
--spectrum-neutral-subdued-content-color-key-focus
);--spectrum-tabs-color-disabled:var(--spectrum-gray-500);--spectrum-tabs-font-family:var(--spectrum-sans-font-family-stack);--spectrum-tabs-font-style:var(--spectrum-default-font-style);--spectrum-tabs-font-size:var(--spectrum-font-size-100);--spectrum-tabs-line-height:var(--spectrum-line-height-100);--spectrum-tabs-focus-indicator-width:var(
--spectrum-focus-indicator-thickness
);--spectrum-tabs-focus-indicator-border-radius:var(
--spectrum-corner-radius-100
);--spectrum-tabs-focus-indicator-gap:var(
--spectrum-tab-item-focus-indicator-gap-medium
);--spectrum-tabs-focus-indicator-color:var(
--spectrum-focus-indicator-color
);--spectrum-tabs-selection-indicator-color:var(
--spectrum-neutral-subdued-content-color-down
);--spectrum-tabs-list-background-direction:top;--spectrum-tabs-divider-background-color:var(--spectrum-gray-300);--spectrum-tabs-divider-size:var(--spectrum-border-width-200);--spectrum-tabs-divider-border-radius:1px;--spectrum-tabs-animation-duration:var(--spectrum-animation-duration-100);--spectrum-tabs-animation-ease:var(--spectrum-animation-ease-in-out)}:host([emphasized]) #list{--mod-tabs-color-selected:var(
--mod-tabs-color-selected-emphasized,var(--spectrum-accent-content-color-default)
);--mod-tabs-color-hover:var(
--mod-tabs-color-hover-emphasized,var(--spectrum-accent-content-color-hover)
);--mod-tabs-color-key-focus:var(
--mod-tabs-color-key-focus-emphasized,var(--spectrum-accent-content-color-key-focus)
);--mod-tabs-selection-indicator-color:var(
--mod-tabs-selection-indicator-color-emphasized,var(--spectrum-accent-content-color-default)
)}:host([direction^=vertical]) #list{--mod-tabs-list-background-direction:var(
--mod-tabs-list-background-direction-vertical,right
)}:host([direction^=vertical-right]) #list{--mod-tabs-list-background-direction:var(
--mod-tabs-list-background-direction-vertical-right,left
)}:host([dir=rtl][direction^=vertical]) #list{--mod-tabs-list-background-direction:var(
--mod-tabs-list-background-direction-vertical,left
)}:host([dir=rtl][direction^=vertical-right]) #list{--mod-tabs-list-background-direction:var(
--mod-tabs-list-background-direction-vertical,right
)}:host([compact]) #list{--mod-tabs-item-height:var(
--mod-tabs-item-height-compact,var(--spectrum-tab-item-compact-height-medium)
);--mod-tabs-top-to-text:var(
--mod-tabs-top-to-text-compact,var(--spectrum-tab-item-top-to-text-compact-medium)
);--mod-tabs-bottom-to-text:var(
--mod-tabs-bottom-to-text-compact,var(--spectrum-tab-item-top-to-text-compact-medium)
);--mod-tabs-top-to-icon:var(
--mod-tabs-top-to-icon-compact,var(--spectrum-tab-item-top-to-workflow-icon-compact-medium)
)}#list{background:linear-gradient(to var(
--mod-tabs-list-background-direction,var(--spectrum-tabs-list-background-direction)
),var(
--highcontrast-tabs-divider-background-color,var(
--mod-tabs-divider-background-color,var(--spectrum-tabs-divider-background-color)
)
) 0 var(--mod-tabs-divider-size,var(--spectrum-tabs-divider-size)),transparent var(--mod-tabs-divider-size,var(--spectrum-tabs-divider-size)));display:flex;margin:0;padding-block:0;position:relative;vertical-align:top;z-index:0}::slotted([selected]:not([slot])){color:var(
--highcontrast-tabs-color-selected,var(--mod-tabs-color-selected,var(--spectrum-tabs-color-selected))
)}::slotted(:not([slot])).is-disabled{color:var(
--highcontrast-tabs-color-disabled,var(--mod-tabs-color-disabled,var(--spectrum-tabs-color-disabled))
);cursor:default}::slotted(:not([slot])).focus-visible,::slotted(:not([slot])):focus{color:var(
--highcontrast-tabs-color-key-focus,var(--mod-tabs-color-key-focus,var(--spectrum-tabs-color-key-focus))
)}::slotted(:not([slot])):focus,::slotted(:not([slot])):focus-visible{color:var(
--highcontrast-tabs-color-key-focus,var(--mod-tabs-color-key-focus,var(--spectrum-tabs-color-key-focus))
)}::slotted(:not([slot])).focus-visible:before,::slotted(:not([slot])):focus:before{border-color:var(
--highcontrast-tabs-focus-indicator-color,var(
--mod-tabs-focus-indicator-color,var(--spectrum-tabs-focus-indicator-color)
)
)}::slotted(:not([slot])).focus-visible:before,::slotted(:not([slot])):focus:before{border-color:var(
--highcontrast-tabs-focus-indicator-color,var(
--mod-tabs-focus-indicator-color,var(--spectrum-tabs-focus-indicator-color)
)
)}::slotted(:not([slot])):focus-visible:before,::slotted(:not([slot])):focus:before{border-color:var(
--highcontrast-tabs-focus-indicator-color,var(
--mod-tabs-focus-indicator-color,var(--spectrum-tabs-focus-indicator-color)
)
)}#selection-indicator{background-color:var(
--highcontrast-tabs-selection-indicator-color,var(
--mod-tabs-selection-indicator-color,var(--spectrum-tabs-selection-indicator-color)
)
);border-radius:var(
--mod-tabs-divider-border-radius,var(--spectrum-tabs-divider-border-radius)
);inset-inline-start:0;position:absolute;transform-origin:0 0;transition:transform var(
--mod-tabs-animation-duration,var(--spectrum-tabs-animation-duration)
) var(--mod-tabs-animation-ease,var(--spectrum-tabs-animation-ease));z-index:0}:host([direction^=horizontal]) #list{align-items:center}:host([direction^=horizontal]) #list ::slotted(:not([slot])){vertical-align:top}:host([direction^=horizontal]) #list ::slotted(:not([slot]):not(:first-child)){margin-inline-start:var(
--mod-tabs-item-horizontal-spacing,var(--spectrum-tabs-item-horizontal-spacing)
)}:host([direction^=horizontal]) #list #selection-indicator{block-size:var(--mod-tabs-divider-size,var(--spectrum-tabs-divider-size));inset-block-end:0;position:absolute}:host([direction^=horizontal][compact]) #list{align-items:end;box-sizing:content-box}:host([quiet]) #list{background:none;border-color:#0000;display:inline-flex}:host([quiet]) #selection-indicator{padding-inline-start:var(
--mod-tabs-start-to-item-quiet,var(--spectrum-tabs-start-to-item-quiet)
)}:host([direction^=vertical-right]) #list,:host([direction^=vertical]) #list{display:inline-flex;flex-direction:column;padding:0}:host([direction^=vertical-right][quiet]) #list,:host([direction^=vertical][quiet]) #list{border-color:#0000}:host([direction^=vertical-right]) #list ::slotted(:not([slot])),:host([direction^=vertical]) #list ::slotted(:not([slot])){block-size:var(--mod-tabs-item-height,var(--spectrum-tabs-item-height));line-height:var(--mod-tabs-item-height,var(--spectrum-tabs-item-height));margin-block-end:var(
--mod-tabs-item-vertical-spacing,var(--spectrum-tabs-item-vertical-spacing)
);margin-inline-end:var(
--mod-tabs-start-to-edge,var(--spectrum-tabs-start-to-edge)
);margin-inline-start:var(
--mod-tabs-start-to-edge,var(--spectrum-tabs-start-to-edge)
);padding-block:0}:host([direction^=vertical-right]) #list ::slotted(:not([slot])):before,:host([direction^=vertical]) #list ::slotted(:not([slot])):before{inset-inline-start:calc(var(
--mod-tabs-focus-indicator-gap,
var(--spectrum-tabs-focus-indicator-gap)
)*-1)}:host([direction^=vertical-right]) #list #selection-indicator,:host([direction^=vertical]) #list #selection-indicator{inline-size:var(
--mod-tabs-divider-size,var(--spectrum-tabs-divider-size)
);inset-block-start:0;inset-inline-start:0;position:absolute}:host([direction^=vertical-right]) #list #selection-indicator{inset-inline:auto 0}@media (forced-colors:active){#list{--highcontrast-tabs-divider-background-color:var(--spectrum-gray-500);--highcontrast-tabs-selection-indicator-color:Highlight;--highcontrast-tabs-focus-indicator-color:CanvasText;--highcontrast-tabs-focus-indicator-background-color:Highlight;--highcontrast-tabs-color:ButtonText;--highcontrast-tabs-color-hover:ButtonText;--highcontrast-tabs-color-selected:HighlightText;--highcontrast-tabs-color-key-focus:ButtonText;--highcontrast-tabs-color-disabled:GrayText;forced-color-adjust:none}#list ::slotted([selected]:not([slot])):before{background-color:var(
--highcontrast-tabs-focus-indicator-background-color
)}#list ::slotted([selected]:not([slot])).focus-visible,#list ::slotted([selected]:not([slot])):focus{color:var(--highcontrast-tabs-color-selected)}#list ::slotted([selected]:not([slot])):focus,#list ::slotted([selected]:not([slot])):focus-visible{color:var(--highcontrast-tabs-color-selected)}:host([direction^=vertical][compact]) #list #list ::slotted(:not([slot])):before{block-size:100%;inset-block-start:0}:host([quiet]) #list{background:linear-gradient(to var(
--mod-tabs-list-background-direction,var(--spectrum-tabs-list-background-direction)
),var(
--highcontrast-tabs-divider-background-color,var(
--mod-tabs-divider-background-color,var(--spectrum-tabs-divider-background-color)
)
) 0 var(--mod-tabs-divider-size,var(--spectrum-tabs-divider-size)),transparent var(--mod-tabs-divider-size,var(--spectrum-tabs-divider-size)))}}#list{--spectrum-tabs-font-weight:var(--system-spectrum-tabs-font-weight)}:host{display:grid;grid-template-columns:100%;position:relative}:host(:not([direction^=vertical])){grid-template-rows:auto 1fr}:host([direction^=vertical]){grid-template-columns:auto 1fr}:host([dir=rtl]) #selection-indicator{left:0;right:auto}:host([direction=vertical-right]) #list #selection-indicator{inset-inline-end:0;inset-inline-start:auto}#list{justify-content:var(--swc-tabs-list-justify-content)}:host([disabled]) #list #selection-indicator{background-color:var(
--mod-tabs-color-disabled,var(--spectrum-tabs-color-disabled)
)}:host([disabled]) ::slotted(sp-tab){color:var(--mod-tabs-color-disabled,var(--spectrum-tabs-color-disabled))}:host([disabled]) #list{pointer-events:none}:host([direction=vertical-right]) #list #selection-indicator,:host([direction=vertical]) #list #selection-indicator{inset-block-start:0}#selection-indicator.first-position{transition:none}:host([dir][direction=horizontal]) #list.scroll{overflow-x:auto;scrollbar-width:none}:host([dir][direction=horizontal]) #list.scroll::-webkit-scrollbar{display:none}
`,at=r`
:host([size=s]) #list{--spectrum-tabs-item-height:var(--spectrum-tab-item-height-small);--spectrum-tabs-item-horizontal-spacing:var(
--spectrum-tab-item-to-tab-item-horizontal-small
);--spectrum-tabs-item-vertical-spacing:var(
--spectrum-tab-item-to-tab-item-vertical-small
);--spectrum-tabs-start-to-edge:var(--spectrum-tab-item-start-to-edge-small);--spectrum-tabs-top-to-text:var(--spectrum-tab-item-top-to-text-small);--spectrum-tabs-bottom-to-text:var(
--spectrum-tab-item-bottom-to-text-small
);--spectrum-tabs-icon-size:var(--spectrum-workflow-icon-size-50);--spectrum-tabs-icon-to-text:var(--spectrum-text-to-visual-75);--spectrum-tabs-top-to-icon:var(
--spectrum-tab-item-top-to-workflow-icon-small
);--spectrum-tabs-focus-indicator-gap:var(
--spectrum-tab-item-focus-indicator-gap-small
);--spectrum-tabs-font-size:var(--spectrum-font-size-75)}:host([size=l]) #list{--spectrum-tabs-item-height:var(--spectrum-tab-item-height-large);--spectrum-tabs-item-horizontal-spacing:var(
--spectrum-tab-item-to-tab-item-horizontal-large
);--spectrum-tabs-item-vertical-spacing:var(
--spectrum-tab-item-to-tab-item-vertical-large
);--spectrum-tabs-start-to-edge:var(--spectrum-tab-item-start-to-edge-large);--spectrum-tabs-top-to-text:var(--spectrum-tab-item-top-to-text-large);--spectrum-tabs-bottom-to-text:var(
--spectrum-tab-item-bottom-to-text-large
);--spectrum-tabs-icon-size:var(--spectrum-workflow-icon-size-100);--spectrum-tabs-icon-to-text:var(--spectrum-text-to-visual-200);--spectrum-tabs-top-to-icon:var(
--spectrum-tab-item-top-to-workflow-icon-large
);--spectrum-tabs-focus-indicator-gap:var(
--spectrum-tab-item-focus-indicator-gap-large
);--spectrum-tabs-font-size:var(--spectrum-font-size-200)}:host([size=xl]) #list{--spectrum-tabs-item-height:var(--spectrum-tab-item-height-extra-large);--spectrum-tabs-item-horizontal-spacing:var(
--spectrum-tab-item-to-tab-item-horizontal-extra-large
);--spectrum-tabs-item-vertical-spacing:var(
--spectrum-tab-item-to-tab-item-vertical-extra-large
);--spectrum-tabs-start-to-edge:var(
--spectrum-tab-item-start-to-edge-extra-large
);--spectrum-tabs-top-to-text:var(
--spectrum-tab-item-top-to-text-extra-large
);--spectrum-tabs-bottom-to-text:var(
--spectrum-tab-item-bottom-to-text-extra-large
);--spectrum-tabs-icon-size:var(--spectrum-workflow-icon-size-200);--spectrum-tabs-icon-to-text:var(--spectrum-text-to-visual-300);--spectrum-tabs-top-to-icon:var(
--spectrum-tab-item-top-to-workflow-icon-extra-large
);--spectrum-tabs-focus-indicator-gap:var(
--spectrum-tab-item-focus-indicator-gap-extra-large
);--spectrum-tabs-font-size:var(--spectrum-font-size-300)}:host([size=s]) #list.spectrum-Tabs--compact{--mod-tabs-item-height:var(
--mod-tabs-item-height-compact,var(--spectrum-tab-item-compact-height-small)
);--mod-tabs-top-to-text:var(
--mod-tabs-top-to-text-compact,var(--spectrum-tab-item-top-to-text-compact-small)
);--mod-tabs-bottom-to-text:var(
--mod-tabs-bottom-to-text-compact,var(--spectrum-tab-item-top-to-text-compact-small)
);--mod-tabs-top-to-icon:var(
--mod-tabs-top-to-icon-compact,var(--spectrum-tab-item-top-to-workflow-icon-compact-small)
)}:host([size=l]) #list.spectrum-Tabs--compact{--mod-tabs-item-height:var(
--mod-tabs-item-height-compact,var(--spectrum-tab-item-compact-height-large)
);--mod-tabs-top-to-text:var(
--mod-tabs-top-to-text-compact,var(--spectrum-tab-item-top-to-text-compact-large)
);--mod-tabs-bottom-to-text:var(
--mod-tabs-bottom-to-text-compact,var(--spectrum-tab-item-top-to-text-compact-large)
);--mod-tabs-top-to-icon:var(
--mod-tabs-top-to-icon-compact,var(--spectrum-tab-item-top-to-workflow-icon-compact-large)
)}:host([size=xl]) #list.spectrum-Tabs--compact{--mod-tabs-item-height:var(
--mod-tabs-item-height-compact,var(--spectrum-tab-item-compact-height-extra-large)
);--mod-tabs-top-to-text:var(
--mod-tabs-top-to-text-compact,var(--spectrum-tab-item-top-to-text-compact-extra-large)
);--mod-tabs-bottom-to-text:var(
--mod-tabs-bottom-to-text-compact,var(--spectrum-tab-item-top-to-text-compact-extra-large)
);--mod-tabs-top-to-icon:var(
--mod-tabs-top-to-icon-compact,var(--spectrum-tab-item-top-to-workflow-icon-compact-extra-large)
)}
`;var rt=Object.defineProperty,nt=Object.getOwnPropertyDescriptor,ct=(t,e,o,s)=>{for(var i,a=s>1?void 0:s?nt(e,o):e,r=t.length-1;r>=0;r--)(i=t[r])&&(a=(s?i(e,o,a):i(a))||a);return s&&a&&rt(e,o,a),a};const lt={baseSize:100,noSelectionStyle:"transform: translateX(0px) scaleX(0) scaleY(0)",transformX(t,e){return`transform: translateX(${t}px) scaleX(${e/this.baseSize});`},transformY(t,e){return`transform: translateY(${t}px) scaleY(${e/this.baseSize});`},baseStyles(){return r`
            :host([direction='vertical-right']) #selection-indicator,
            :host([direction='vertical']) #selection-indicator {
                height: ${this.baseSize}px;
            }
            :host([dir][direction='horizontal']) #selection-indicator {
                width: ${this.baseSize}px;
            }
        `}};class dt extends(y(x,{noDefaultSize:!0})){constructor(){super(),this.auto=!1,this.compact=!1,this.direction="horizontal",this.emphasized=!1,this.label="",this.enableTabsScroll=!1,this.quiet=!1,this.selectionIndicatorStyle=lt.noSelectionStyle,this.shouldAnimate=!1,this.selected="",this._tabs=[],this.resizeController=new X(this,{callback:()=>{this.updateSelectionIndicator()}}),this.rovingTabindexController=new st(this,{focusInIndex:t=>{let e=0;return t.find(((t,o)=>{const s=this.selected?!t.disabled&&t.value===this.selected:!t.disabled;return e=o,s}))?e:-1},direction:()=>"both",elementEnterAction:t=>{this.auto&&(this.shouldAnimate=!0,this.selectTarget(t))},elements:()=>this.tabs,isFocusableElement:t=>!t.disabled,listenerScope:()=>this.tabList}),this.onTabsScroll=()=>{this.dispatchEvent(new Event("sp-tabs-scroll",{bubbles:!0,composed:!0}))},this.onClick=t=>{if(this.disabled)return;const e=t.composedPath().find((t=>t.parentElement===this));!e||e.disabled||(this.shouldAnimate=!0,this.selectTarget(e))},this.onKeyDown=t=>{if("Enter"===t.code||"Space"===t.code){t.preventDefault();const e=t.target;e&&this.selectTarget(e)}},this.updateCheckedState=()=>{if(this.tabs.forEach((t=>{t.removeAttribute("selected")})),this.selected){const t=this.tabs.find((t=>t.value===this.selected));t?t.selected=!0:this.selected=""}else{const t=this.tabs[0];t&&t.setAttribute("tabindex","0")}this.updateSelectionIndicator()},this.updateSelectionIndicator=async()=>{const t=this.tabs.find((t=>t.selected));if(!t)return void(this.selectionIndicatorStyle=lt.noSelectionStyle);await Promise.all([t.updateComplete,document.fonts?document.fonts.ready:Promise.resolve()]);const{width:e,height:o}=t.getBoundingClientRect();this.selectionIndicatorStyle="horizontal"===this.direction?lt.transformX(t.offsetLeft,e):lt.transformY(t.offsetTop,o)},new W(this,{config:{root:null,rootMargin:"0px",threshold:[0,1]},callback:()=>{this.updateSelectionIndicator()}})}static get styles(){return[at,it,lt.baseStyles()]}set tabs(t){t!==this.tabs&&(this._tabs.forEach((t=>{this.resizeController.unobserve(t)})),t.forEach((t=>{this.resizeController.observe(t)})),this._tabs=t,this.rovingTabindexController.clearElementCache())}get tabs(){return this._tabs}get focusElement(){return this.rovingTabindexController.focusInElement||this}scrollTabs(t,e="smooth"){var o;null==(o=this.tabList)||o.scrollBy({left:t,top:0,behavior:e})}get scrollState(){if(this.tabList){const{scrollLeft:t,clientWidth:e,scrollWidth:o}=this.tabList,s=Math.abs(t)>0,i=Math.ceil(Math.abs(t))<o-e;return{canScrollLeft:"ltr"===this.dir?s:i,canScrollRight:"ltr"===this.dir?i:s}}return{}}manageAutoFocus(){const t=[...this.children].map((t=>void 0!==t.updateComplete?t.updateComplete:Promise.resolve(!0)));Promise.all(t).then((()=>super.manageAutoFocus()))}managePanels({target:t}){t.assignedElements().map((t=>{const{value:e,id:o}=t,s=this.querySelector(`[role="tab"][value="${e}"]`);s&&(s.setAttribute("aria-controls",o),t.setAttribute("aria-labelledby",s.id)),t.selected=e===this.selected}))}render(){return c`
            <div
                class=${D({scroll:this.enableTabsScroll})}
                aria-label=${E(this.label?this.label:void 0)}
                @click=${this.onClick}
                @keydown=${this.onKeyDown}
                @scroll=${this.onTabsScroll}
                id="list"
                role="tablist"
                part="tablist"
            >
                <slot @slotchange=${this.onSlotChange}></slot>
                <div
                    id="selection-indicator"
                    class=${E(this.shouldAnimate?void 0:"first-position")}
                    style=${this.selectionIndicatorStyle}
                    role="presentation"
                ></div>
            </div>
            <slot name="tab-panel" @slotchange=${this.managePanels}></slot>
        `}willUpdate(t){if(!this.hasUpdated){const t=this.querySelector(":scope > [selected]");t&&this.selectTarget(t)}if(super.willUpdate(t),t.has("selected")){if(this.tabs.length&&this.updateCheckedState(),t.get("selected")){const e=this.querySelector(`[role="tabpanel"][value="${t.get("selected")}"]`);e&&(e.selected=!1)}const e=this.querySelector(`[role="tabpanel"][value="${this.selected}"]`);e&&(e.selected=!0)}t.has("direction")&&("horizontal"===this.direction?this.removeAttribute("aria-orientation"):this.setAttribute("aria-orientation","vertical")),t.has("dir")&&this.updateSelectionIndicator(),t.has("disabled")&&(this.disabled?this.setAttribute("aria-disabled","true"):this.removeAttribute("aria-disabled")),!this.shouldAnimate&&void 0!==t.get("shouldAnimate")&&(this.shouldAnimate=!0)}selectTarget(t){const e=t.getAttribute("value");if(e){const t=this.selected;this.selected=e,this.dispatchEvent(new Event("change",{cancelable:!0}))||(this.selected=t)}}onSlotChange(){this.tabs=this.slotEl.assignedElements().filter((t=>"tab"===t.getAttribute("role"))),this.updateCheckedState()}connectedCallback(){super.connectedCallback(),window.addEventListener("resize",this.updateSelectionIndicator),"fonts"in document&&document.fonts.addEventListener("loadingdone",this.updateSelectionIndicator)}disconnectedCallback(){window.removeEventListener("resize",this.updateSelectionIndicator),"fonts"in document&&document.fonts.removeEventListener("loadingdone",this.updateSelectionIndicator),super.disconnectedCallback()}}ct([n({type:Boolean})],dt.prototype,"auto",2),ct([n({type:Boolean,reflect:!0})],dt.prototype,"compact",2),ct([n({reflect:!0})],dt.prototype,"dir",2),ct([n({reflect:!0})],dt.prototype,"direction",2),ct([n({type:Boolean,reflect:!0})],dt.prototype,"emphasized",2),ct([n()],dt.prototype,"label",2),ct([n({type:Boolean})],dt.prototype,"enableTabsScroll",2),ct([n({type:Boolean,reflect:!0})],dt.prototype,"quiet",2),ct([n({attribute:!1})],dt.prototype,"selectionIndicatorStyle",2),ct([n({attribute:!1})],dt.prototype,"shouldAnimate",2),ct([p("slot")],dt.prototype,"slotEl",2),ct([p("#list")],dt.prototype,"tabList",2),ct([n({reflect:!0})],dt.prototype,"selected",2),z("sp-tabs",dt);const ht=r`
:host{block-size:calc(var(--mod-tabs-item-height, var(--spectrum-tabs-item-height)) - var(--mod-tabs-divider-size, var(--spectrum-tabs-divider-size)));box-sizing:border-box;color:var(
--highcontrast-tabs-color,var(--mod-tabs-color,var(--spectrum-tabs-color))
);cursor:pointer;outline:none;position:relative;-webkit-text-decoration:none;text-decoration:none;transition:color var(
--mod-tabs-animation-duration,var(--spectrum-tabs-animation-duration)
) ease-out;white-space:nowrap;z-index:1}::slotted([slot=icon]){block-size:var(--mod-tabs-icon-size,var(--spectrum-tabs-icon-size));inline-size:var(--mod-tabs-icon-size,var(--spectrum-tabs-icon-size));margin-block-start:var(
--mod-tabs-top-to-icon,var(--spectrum-tabs-top-to-icon)
)}[name=icon]+#item-label{margin-inline-start:var(
--mod-tabs-icon-to-text,var(--spectrum-tabs-icon-to-text)
)}:host:before{block-size:calc(100% - var(--mod-tabs-top-to-text, var(--spectrum-tabs-top-to-text)));border:var(
--mod-tabs-focus-indicator-width,var(--spectrum-tabs-focus-indicator-width)
) solid transparent;border-radius:var(
--mod-tabs-focus-indicator-border-radius,var(--spectrum-tabs-focus-indicator-border-radius)
);box-sizing:border-box;content:"";inline-size:calc(100% + var(
--mod-tabs-focus-indicator-gap,
var(--spectrum-tabs-focus-indicator-gap)
)*2);inset-block-start:calc(var(--mod-tabs-top-to-text, var(--spectrum-tabs-top-to-text))/2);inset-inline-end:calc(var(
--mod-tabs-focus-indicator-gap,
var(--spectrum-tabs-focus-indicator-gap)
)*-1);inset-inline-start:calc(var(
--mod-tabs-focus-indicator-gap,
var(--spectrum-tabs-focus-indicator-gap)
)*-1);pointer-events:none;position:absolute}:host(:hover){color:var(
--highcontrast-tabs-color-hover,var(--mod-tabs-color-hover,var(--spectrum-tabs-color-hover))
)}:host([selected]){color:var(
--highcontrast-tabs-color-selected,var(--mod-tabs-color-selected,var(--spectrum-tabs-color-selected))
)}:host([disabled]){color:var(
--highcontrast-tabs-color-disabled,var(--mod-tabs-color-disabled,var(--spectrum-tabs-color-disabled))
);cursor:default}:host([disabled]) #item-label{cursor:default}:host(:focus),:host.focus-visible{color:var(
--highcontrast-tabs-color-key-focus,var(--mod-tabs-color-key-focus,var(--spectrum-tabs-color-key-focus))
)}:host(:focus),:host:focus-visible{color:var(
--highcontrast-tabs-color-key-focus,var(--mod-tabs-color-key-focus,var(--spectrum-tabs-color-key-focus))
)}:host(:focus):before,:host.focus-visible:before{border-color:var(
--highcontrast-tabs-focus-indicator-color,var(
--mod-tabs-focus-indicator-color,var(--spectrum-tabs-focus-indicator-color)
)
)}:host(:focus):before,:host:focus-visible:before{border-color:var(
--highcontrast-tabs-focus-indicator-color,var(
--mod-tabs-focus-indicator-color,var(--spectrum-tabs-focus-indicator-color)
)
)}#item-label{cursor:pointer;display:inline-block;font-family:var(--mod-tabs-font-family,var(--spectrum-tabs-font-family));font-size:var(--mod-tabs-font-weight,var(--spectrum-tabs-font-size));font-style:var(--mod-tabs-font-style,var(--spectrum-tabs-font-style));font-weight:var(--mod-tabs-font-weight,var(--spectrum-tabs-font-weight));line-height:var(--mod-tabs-line-height,var(--spectrum-tabs-line-height));margin-block-end:var(
--mod-tabs-bottom-to-text,var(--spectrum-tabs-bottom-to-text)
);margin-block-start:var(
--mod-tabs-top-to-text,var(--spectrum-tabs-top-to-text)
);-webkit-text-decoration:none;text-decoration:none;vertical-align:top}#item-label:empty{display:none}:host([disabled]){pointer-events:none}#item-label[hidden]{display:none}@media (forced-colors:active){:host:before{background-color:ButtonFace}:host ::slotted([slot=icon]){color:inherit;position:relative;z-index:1}#item-label{position:relative;z-index:1}:host([selected]){color:HighlightText}:host([selected]) ::slotted([slot=icon]){color:HighlightText}:host([selected]) #item-label{color:HighlightText}}:host([vertical]){align-items:center;display:flex;flex-direction:column;height:auto;justify-content:center}:host([dir][vertical]) slot[name=icon]+#item-label{margin-block-end:calc(var(--mod-tabs-bottom-to-text, var(--spectrum-tabs-bottom-to-text))/2);margin-block-start:calc(var(--mod-tabs-top-to-text, var(--spectrum-tabs-top-to-text))/2);margin-inline-start:0}:host([vertical]) ::slotted([slot=icon]){margin-block-start:calc(var(--mod-tabs-top-to-icon, var(--spectrum-tabs-top-to-icon))/2)}
`;var mt=Object.defineProperty,ut=Object.getOwnPropertyDescriptor,pt=(t,e,o,s)=>{for(var i,a=s>1?void 0:s?ut(e,o):e,r=t.length-1;r>=0;r--)(i=t[r])&&(a=(s?i(e,o,a):i(a))||a);return s&&a&&mt(e,o,a),a};const bt=class t extends(I(function(t,e,o=[]){var s;const i=t=>e=>t.matches(e);class a extends t{constructor(...t){super(t),this.slotHasContent=!1,new K(this,{config:{characterData:!0,subtree:!0},callback:t=>{for(const e of t)if("characterData"===e.type)return void this.manageTextObservedSlot()}})}manageTextObservedSlot(){if(!this[tt])return;const t=[...this[tt]].filter((t=>{const e=t;return e.tagName?!o.some(i(e)):!!e.textContent&&e.textContent.trim()}));this.slotHasContent=t.length>0}update(t){if(!this.hasUpdated){const{childNodes:t}=this,s=[...t].filter((t=>{const s=t;return s.tagName?!o.some(i(s))&&(e?s.getAttribute("slot")===e:!s.hasAttribute("slot")):!!s.textContent&&s.textContent.trim()}));this.slotHasContent=s.length>0}super.update(t)}firstUpdated(t){super.firstUpdated(t),this.updateComplete.then((()=>{this.manageTextObservedSlot()}))}}return s=tt,Z([n({type:Boolean,attribute:!1})],a.prototype,"slotHasContent",2),Z([A({slot:e,flatten:!0})],a.prototype,s,2),a}(function(t,e){var o;const s=Array.isArray(e)?e:[e];return o=Y,class extends t{constructor(...t){super(t),this[o]=new Map,this.managePresenceObservedSlot=()=>{let t=!1;s.forEach((e=>{const o=!!this.querySelector(e),s=this[Y].get(e)||!1;t=t||s!==o,this[Y].set(e,!!this.querySelector(e))})),t&&this.updateComplete.then((()=>{this.requestUpdate()}))},new K(this,{config:{childList:!0,subtree:!0},callback:()=>{this.managePresenceObservedSlot()}}),this.managePresenceObservedSlot()}get slotContentIsPresent(){if(1===s.length)return this[Y].get(s[0])||!1;throw new Error("Multiple selectors provided to `ObserveSlotPresence` use `getSlotContentPresence(selector: string)` instead.")}getSlotContentPresence(t){if(this[Y].has(t))return this[Y].get(t)||!1;throw new Error(`The provided selector \`${t}\` is not being observed.`)}}}(S,'[slot="icon"]'),""))){constructor(){super(...arguments),this.disabled=!1,this.label="",this.selected=!1,this.vertical=!1,this.value=""}static get styles(){return[ht]}get hasIcon(){return this.slotContentIsPresent}get hasLabel(){return!!this.label||this.slotHasContent}render(){return c`
            ${this.hasIcon?c`
                      <slot name="icon"></slot>
                  `:l}
            <label id="item-label" ?hidden=${!this.hasLabel}>
                ${this.slotHasContent?l:this.label}
                <slot>${this.label}</slot>
            </label>
        `}firstUpdated(e){super.firstUpdated(e),this.setAttribute("role","tab"),this.hasAttribute("id")||(this.id="sp-tab-"+t.instanceCount++)}updated(t){super.updated(t),t.has("selected")&&(this.setAttribute("aria-selected",this.selected?"true":"false"),this.setAttribute("tabindex",this.selected?"0":"-1")),t.has("disabled")&&(this.disabled?this.setAttribute("aria-disabled","true"):this.removeAttribute("aria-disabled"))}};bt.instanceCount=0,pt([n({type:Boolean,reflect:!0})],bt.prototype,"disabled",2),pt([n({reflect:!0})],bt.prototype,"label",2),pt([n({type:Boolean,reflect:!0})],bt.prototype,"selected",2),pt([n({type:Boolean,reflect:!0})],bt.prototype,"vertical",2),pt([n({type:String,reflect:!0})],bt.prototype,"value",2),z("sp-tab",bt);const vt=r`
:host{display:inline-flex}:host(:not([selected])){display:none}
`;var gt=Object.defineProperty,ft=Object.getOwnPropertyDescriptor,yt=(t,e,o,s)=>{for(var i,a=s>1?void 0:s?ft(e,o):e,r=t.length-1;r>=0;r--)(i=t[r])&&(a=(s?i(e,o,a):i(a))||a);return s&&a&&gt(e,o,a),a};const xt=class t extends S{constructor(){super(...arguments),this.selected=!1,this.value=""}handleFocusin(){this.removeAttribute("tabindex")}handleFocusout(){this.tabIndex=this.selected?0:-1}render(){return c`
            <slot
                @focusin=${this.handleFocusin}
                @focusout=${this.handleFocusout}
            ></slot>
        `}firstUpdated(){this.slot="tab-panel",this.setAttribute("role","tabpanel"),this.tabIndex=0,this.hasAttribute("id")||(this.id="sp-tab-panel-"+t.instanceCount++)}updated(t){t.has("selected")&&(this.selected?(this.removeAttribute("aria-hidden"),this.tabIndex=0):(this.setAttribute("aria-hidden","true"),this.tabIndex=-1))}};xt.styles=[vt],xt.instanceCount=0,yt([n({type:Boolean,reflect:!0})],xt.prototype,"selected",2),yt([n({type:String,reflect:!0})],xt.prototype,"value",2),z("sp-tab-panel",xt);var It=[b,...w,r`
    div.input-block {
      background-color: #f8f8f8;
      padding-bottom: 0.5rem;
    }

    label {
      background-color: ${v};
      color: ${g};
      padding: 0.5rem;
      display: block;
      font-size: 0.9rem;
      /* Make it a little brighter than the default background color */
      filter: brightness(1.2);
    }
  `];let wt=class extends k{};wt.styles=It,wt=d([h("arch-job-parameters-form")],wt);let kt=class extends m{constructor(){super(...arguments),this.widthPx=24,this.heightPx=24}render(){const{widthPx:t,heightPx:e}=this;return c`
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
    `}};kt.styles=r`
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
  `,d([n({type:Number})],kt.prototype,"widthPx",void 0),d([n({type:Number})],kt.prototype,"heightPx",void 0),kt=d([h("ait-loading-spinner")],kt);var Ct,St=[b,f,r`
    div > h3 {
      margin-top: 0;
    }

    div > p {
      line-height: 1.2rem;
    }

    button.job-button {
      cursor: wait;
    }

    button.job-button.primary {
      cursor: pointer;
    }
  `];let zt=Ct=class extends m{constructor(){super(...arguments),this.jobParameters={}}startTimeStatePairsToButtonProps(t){switch(t){case void 0:return[this.collectionId?"Loading...":"n/a","",!0];case null:return["Generate Dataset","primary",!1]}const e=t[0][1];switch(e){case U.FINISHED:return["Generate New Dataset","primary",!1];case U.SUBMITTED:return['\n            <div style="display: flex;">\n              <span style="margin: auto 0.5rem auto 0;">Starting</span>\n              <ait-loading-spinner style="margin: auto 0; --ait-loading-spinner-color: #2991CC"></ait-loading-spinner>\n            </div>\n          ',"",!0];default:return[e,"",Lt(e)]}}extendParamsSchemaWithDefaultOptions(t){return t=null!=t?t:Ct.DefaultParametersSchema,Object.assign(t,{properties:Object.assign(t.properties,{sample:{type:"boolean",title:"Sample",default:!0,description:"Generate a sample dataset from a small subset of records"}})})}get historicalDatasetsUrl(){const{collectionDetailPageUrlTemplate:t,collectionId:e,job:o}=this;return`${t.replace("0",e)}?column-name=${encodeURIComponent(o.name)}`}renderHistory(){const{jobIdStatesMap:t,job:e}=this,o=t&&t[e.id];if(void 0===o||0===o.length)return c``;const s=o.filter((([,t])=>t===U.FINISHED));if(0===s.length)return c``;const i=s.length>1?"Click here to view these previous datasets":"Click here to view this previous dataset";return c`
      <h4>History</h4>
      <p>
        You've generated this dataset
        <strong>${s.length}</strong> times before for this
        collection, most recently on
        <strong>${T(s[0][0])}</strong>.
        <br />
        <a href="${this.historicalDatasetsUrl}" target="_blank">${i}</a>
      </p>
    `}renderConfigureJob(){const{job:t}=this;return c`
      <h4>Configure Job</h4>
      <arch-job-parameters-form
        .schema=${this.extendParamsSchemaWithDefaultOptions(t.parameters_schema)}
        .data=${this.jobParameters}
      ></arch-job-parameters-form>
    `}emitGenerateDataset(t){t.stopPropagation(),this.dispatchEvent(new CustomEvent("generate-dataset",{detail:{archJobCard:this},bubbles:!0,composed:!0}))}render(){var e;const{collectionId:o,job:s,jobIdStatesMap:i}=this,{id:a}=s,r=this.jobIdStatesMap?null!==(e=i[a])&&void 0!==e?e:null:void 0,[n,l,d]=this.startTimeStatePairsToButtonProps(r);return c` <div>
      <h3>${s.name}</h3>
      <p>${s.description}</p>
      ${null===o?c`<p class="alert alert-info">
            Select a Source Collection above to display the options for
            generating a Dataset of this type.
          </p>`:c`
            ${this.renderHistory()} ${this.renderConfigureJob()}
            <button
              class="job-button ${l}"
              ?disabled=${d}
              @click=${this.emitGenerateDataset}
            >
              ${t(n)}
            </button>
          `}
    </div>`}};zt.styles=St,zt.DefaultParametersSchema={type:"object",required:[],properties:{}},d([n()],zt.prototype,"collectionId",void 0),d([n()],zt.prototype,"job",void 0),d([n()],zt.prototype,"jobIdStatesMap",void 0),d([n()],zt.prototype,"collectionDetailPageUrlTemplate",void 0),d([p("button.job-button")],zt.prototype,"button",void 0),d([u()],zt.prototype,"jobParameters",void 0),zt=Ct=d([h("arch-job-card")],zt);var Et=[b,r`
    label {
      background-color: ${v};
      color: ${g};
      padding: 0.5rem;
      display: block;
      font-size: 0.9rem;
      font-weight: bold;
    }

    select[name="source-collection"] {
      width: 100%;
    }

    label[for="job-category"] {
      margin-top: 1rem;
    }

    arch-job-category-section {
      flex-grow: 1;
    }

    .category-header {
      padding: 1rem 0 0.5rem 0;
      background-color: #eee;
    }

    .category-title {
      font-weight: bold;
      font-size: 1.5rem;
    }

    .category-image {
      float: left;
      max-height: 5em;
      width: auto;
    }

    sp-tabs[name="job-tabs"] sp-tab {
      padding: 0 1rem;
    }

    sp-tabs[name="job-tabs"] sp-tab[selected] {
      background-color: #fff;
      margin-right: 0;
    }

    sp-tabs[name="job-tabs"] sp-tab-panel > arch-job-card {
      flex-grow: 1;
      background-color: #fff;
      padding: 1rem;
    }
  `];let Pt=class extends m{render(){const{collectionDetailPageUrlTemplate:t,collectionId:e,jobIdStatesMap:o}=this,{categoryDescription:s,categoryId:i,categoryImage:a,categoryName:r,jobs:n}=this.jobsCat;return c`
      <div class="category-header">
        <img
          class="category-image"
          src="${a}"
          alt="Icon for ${r}"
        />
        <h2 id="${i}" class="category-title">${r}</h2>
        <p class="category-description">${s}</p>
      </div>

      <label for="job-tabs">Select Dataset Type</label>
      <br />
      <sp-theme color="light" scale="medium">
        <sp-tabs
          compact
          direction="vertical"
          selected="${n[0].id}"
          name="job-tabs"
        >
          ${n.map((s=>c`<sp-tab
                label="${s.name}"
                value="${s.id}"
              ></sp-tab>
              <sp-tab-panel value="${s.id}">
                <arch-job-card
                  .collectionId=${e}
                  .job=${s}
                  .jobIdStatesMap=${o}
                  .collectionDetailPageUrlTemplate=${t}
                ></arch-job-card>
              </sp-tab-panel>`))}
        </sp-tabs>
      </sp-theme>
    `}};var $t;Pt.styles=Et,d([n({type:String})],Pt.prototype,"collectionId",void 0),d([n({type:Object})],Pt.prototype,"jobsCat",void 0),d([n({type:Object})],Pt.prototype,"jobIdStatesMap",void 0),d([n({type:String})],Pt.prototype,"collectionDetailPageUrlTemplate",void 0),Pt=d([h("arch-job-category-section")],Pt);const jt=["Collection","Network","Text","File Formats"],Tt={Collection:["Domain frequency","Web archive transformation (WAT)"],Network:["Domain graph","Image graph","Longitudinal graph","Web graph"],Text:["Named entities","Plain text of webpages","Text file information"],"File Formats":["Audio file information","Image file information","PDF file information","Presentation file information","Spreadsheet file information","Video file information","Word processing file information"]};let At=$t=class extends m{constructor(){super(...arguments),this.collections=null,this.availableJobs=[],this.sourceCollectionId=null,this.collectionJobIdStatesMapMap={},this.activePollCollectionId=null}async connectedCallback(){await this.initAvailableJobs(),this.initCollections(),super.connectedCallback(),this.addEventListener("generate-dataset",(t=>{this.generateDatasetHandler(t)}))}render(){var t;const{collectionDetailPageUrlTemplate:e}=this,o=this.sourceCollectionId&&this.collectionJobIdStatesMapMap[this.sourceCollectionId];return c`
      <label for="source-collection">Select Source Collection</label>
      <select
        name="source-collection"
        @change=${this.sourceCollectionChangeHandler}
        ?disabled=${null===this.collections}
      >
        ${null===this.collections?c`<option>Loading...</option>`:c`<option value="">~ Choose Source Collection ~</option>`}
        ${(null!==(t=this.collections)&&void 0!==t?t:[]).map((t=>c`
            <option
              value="${t.id}"
              ?selected=${t.id===this.sourceCollectionId}
            >
              ${t.name}
            </option>
          `))}
      </select>

      <label for="job-category">Select Dataset Category</label>
      <sp-theme color="light" scale="medium">
        <sp-tabs selected="${this.availableJobs[0].categoryId}" size="l">
          ${this.availableJobs.map((t=>c`<sp-tab
              label="${t.categoryName}"
              value="${t.categoryId}"
              style="--mod-tabs-icon-to-text: 0;"
            >
              <sp-icon
                label="${t.categoryName}"
                src="${t.categoryImage}"
                slot="icon"
                size="l"
              ></sp-icon>
            </sp-tab> `))}
          ${this.availableJobs.map((t=>c`
              <sp-tab-panel value="${t.categoryId}">
                <arch-job-category-section
                  .collectionId=${this.sourceCollectionId}
                  .jobsCat=${t}
                  .jobIdStatesMap=${o}
                  .collectionDetailPageUrlTemplate=${e}
                >
                </arch-job-category-section>
              </sp-tab-panel>
            `))}
        </sp-tabs>
      </sp-theme>
    `}setCollectionIdUrlParam(t){const{urlCollectionParamName:e}=$t,o=new URL(window.location.href);t?o.searchParams.set(e,t.toString()):o.searchParams.delete(e),history.replaceState(null,"",o.toString())}async sourceCollectionChangeHandler(t){const e=parseInt(t.target.value)||null;this.setCollectionIdUrlParam(e),await this.setSourceCollectionId(e),this.requestUpdate()}async setSourceCollectionId(t){this.sourceCollectionId=t,t&&(this.collectionJobIdStatesMapMap[t]=await this.fetchJobIdStatesMap(t))}async initCollections(){var t;const o=await e.collections.get();this.collections=o.items;const s=parseInt(null!==(t=new URLSearchParams(window.location.search).get($t.urlCollectionParamName))&&void 0!==t?t:"");Number.isNaN(s)||(await this.setSourceCollectionId(s),this.requestUpdate())}async initAvailableJobs(){const t=await(await fetch("/api/available-jobs")).json();t.sort(((t,e)=>jt.indexOf(t.categoryName)>jt.indexOf(e.categoryName)?1:-1)).map((t=>(t.jobs.sort(((e,o)=>{const s=Tt[t.categoryName];return void 0===s?0:s.indexOf(e.name)>s.indexOf(o.name)?1:-1})),t))),this.availableJobs=t}async fetchJobIdStatesMap(t){return await(await fetch(`/api/collections/${t}/dataset_states`)).json()}async pollDatasetStates(){const{sourceCollectionId:t}=this;if(null!==t&&this.activePollCollectionId===t){this.collectionJobIdStatesMapMap[t]=await this.fetchJobIdStatesMap(t),this.requestUpdate();for(const e of Object.values(this.collectionJobIdStatesMapMap[t]))if(e[0][1]===U.RUNNING)return void setTimeout((()=>{this.pollDatasetStates()}),2e3);this.activePollCollectionId=null}else this.activePollCollectionId=null}startPolling(){null===this.activePollCollectionId&&(this.activePollCollectionId=this.sourceCollectionId,this.pollDatasetStates())}async runJob(t,e){return fetch("/api/datasets/generate",{method:"POST",credentials:"same-origin",headers:{"X-CSRFToken":this.csrfToken},mode:"cors",body:JSON.stringify({collection_id:this.sourceCollectionId,job_type_id:t,is_sample:e})})}async generateDatasetHandler(t){const e=t.detail.archJobCard,o=e.button;o.disabled=!0;const s=e.job.id,i=e.jobParameters.sample,{collectionJobIdStatesMapMap:a}=this,r=a[this.sourceCollectionId],n=[(new Date).toISOString(),U.SUBMITTED];r[s]?r[s].unshift(n):r[s]=[n],e.requestUpdate();if(!(await this.runJob(s,i)).ok)return o.disabled=!1,delete r[s],void e.requestUpdate();this.startPolling()}};At.styles=Et,At.urlCollectionParamName="cid",d([n({type:String})],At.prototype,"csrfToken",void 0),d([n({type:String})],At.prototype,"collectionDetailPageUrlTemplate",void 0),d([u()],At.prototype,"collections",void 0),d([u()],At.prototype,"availableJobs",void 0),d([u()],At.prototype,"sourceCollectionId",void 0),d([u()],At.prototype,"collectionJobIdStatesMapMap",void 0),d([u()],At.prototype,"activePollCollectionId",void 0),d([p("select[name=source-collection]")],At.prototype,"collectionSelector",void 0),d([C("arch-job-category-section")],At.prototype,"categorySections",void 0),At=$t=d([h("arch-generate-dataset-form")],At);const Dt=encodeURIComponent,Ut={collection:t=>`/collections/${Dt(t)}`,dataset:t=>`/datasets/${Dt(t)}`,generateCollectionDataset:t=>`/datasets/generate?${Dt(At.urlCollectionParamName)}=${Dt(t)}`,buildSubCollection:t=>void 0===t?"/collections/custom-collection-builder":`/collections/custom-collection-builder?${t.map((t=>`${Dt(o.urlCollectionsParamName)}=${Dt(t)}`)).join("&")}`};function Lt(t){return t===U.SUBMITTED||t===U.QUEUED||t===U.RUNNING}export{At as A,L as C,U as P,Ut as a,Lt as i};
//# sourceMappingURL=chunk-helpers2.js.map
