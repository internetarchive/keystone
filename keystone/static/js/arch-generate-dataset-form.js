import{i as t,y as e,e as o,b as s,_ as a,a as i,s as r}from"./chunk-lit-element.js";import{t as n}from"./chunk-state.js";import{d as c,l,F as d,i as h,f as m,S as b,g as u,B as p,o as v}from"./chunk-styles.js";import{d as g,A as f,e as y}from"./chunk-arch-json-schema-form.js";import{I as x,s as I,o as w,O as k,a as S}from"./chunk-arch-modal.js";import{S as C}from"./chunk-sizedMixin.js";import"./chunk-scale-large.js";import{P as z,a as j,D as E,U as $,i as A}from"./chunk-helpers.js";import{A as T}from"./chunk-ArchAPI.js";import{ArchGlobalModal as L}from"./arch-global-modal.js";import"./chunk-arch-loading-indicator.js";import{i as P}from"./chunk-helpers2.js";import"./chunk-_commonjsHelpers.js";c("sp-icon",x);class D{constructor(t,{target:e,config:o,callback:s,skipInitial:a}){this.t=new Set,this.o=!1,this.i=!1,this.h=t,null!==e&&this.t.add(e??t),this.o=a??this.o,this.callback=s,window.IntersectionObserver?(this.u=new IntersectionObserver((t=>{const e=this.i;this.i=!1,this.o&&e||(this.handleChanges(t),this.h.requestUpdate())}),o),t.addController(this)):console.warn("IntersectionController error: browser does not support IntersectionObserver.")}handleChanges(t){this.value=this.callback?.(t,this.u)}hostConnected(){for(const t of this.t)this.observe(t)}hostDisconnected(){this.disconnect()}async hostUpdated(){const t=this.u.takeRecords();t.length&&this.handleChanges(t)}observe(t){this.t.add(t),this.u.observe(t),this.i=!0}unobserve(t){this.t.delete(t),this.u.unobserve(t)}disconnect(){this.u.disconnect()}}function M(t,e,o){return typeof t===e?()=>t:"function"==typeof t?t:o}class N{constructor(t,{direction:e,elementEnterAction:o,elements:s,focusInIndex:a,isFocusableElement:i,listenerScope:r}={elements:()=>[]}){this._currentIndex=-1,this._direction=()=>"both",this.directionLength=5,this.elementEnterAction=t=>{},this._focused=!1,this._focusInIndex=t=>0,this.isFocusableElement=t=>!0,this._listenerScope=()=>this.host,this.offset=0,this.recentlyConnected=!1,this.handleFocusin=t=>{if(!this.isEventWithinListenerScope(t))return;this.isRelatedTargetAnElement(t)&&this.hostContainsFocus();const e=t.composedPath();let o=-1;e.find((t=>(o=this.elements.indexOf(t),-1!==o))),this.currentIndex=o>-1?o:this.currentIndex},this.handleFocusout=t=>{this.isRelatedTargetAnElement(t)&&this.hostNoLongerContainsFocus()},this.handleKeydown=t=>{if(!this.acceptsEventCode(t.code)||t.defaultPrevented)return;let e=0;switch(t.code){case"ArrowRight":e+=1;break;case"ArrowDown":e+="grid"===this.direction?this.directionLength:1;break;case"ArrowLeft":e-=1;break;case"ArrowUp":e-="grid"===this.direction?this.directionLength:1;break;case"End":this.currentIndex=0,e-=1;break;case"Home":this.currentIndex=this.elements.length-1,e+=1}t.preventDefault(),"grid"===this.direction&&this.currentIndex+e<0?this.currentIndex=0:"grid"===this.direction&&this.currentIndex+e>this.elements.length-1?this.currentIndex=this.elements.length-1:this.setCurrentIndexCircularly(e),this.elementEnterAction(this.elements[this.currentIndex]),this.focus()},this.mutationObserver=new MutationObserver((()=>{this.handleItemMutation()})),this.host=t,this.host.addController(this),this._elements=s,this.isFocusableElement=i||this.isFocusableElement,this._direction=M(e,"string",this._direction),this.elementEnterAction=o||this.elementEnterAction,this._focusInIndex=M(a,"number",this._focusInIndex),this._listenerScope=M(r,"object",this._listenerScope)}get currentIndex(){return-1===this._currentIndex&&(this._currentIndex=this.focusInIndex),this._currentIndex-this.offset}set currentIndex(t){this._currentIndex=t+this.offset}get direction(){return this._direction()}get elements(){return this.cachedElements||(this.cachedElements=this._elements()),this.cachedElements}set focused(t){t!==this.focused&&(this._focused=t)}get focused(){return this._focused}get focusInElement(){return this.elements[this.focusInIndex]}get focusInIndex(){return this._focusInIndex(this.elements)}isEventWithinListenerScope(t){return this._listenerScope()===this.host||t.composedPath().includes(this._listenerScope())}handleItemMutation(){if(-1==this._currentIndex||this.elements.length<=this._elements().length)return;const t=this.elements[this.currentIndex];if(this.clearElementCache(),this.elements.includes(t))return;const e=this.currentIndex!==this.elements.length,o=e?1:-1;e&&this.setCurrentIndexCircularly(-1),this.setCurrentIndexCircularly(o),this.focus()}update({elements:t}={elements:()=>[]}){this.unmanage(),this._elements=t,this.clearElementCache(),this.manage()}focus(t){const e=this.elements;if(!e.length)return;let o=e[this.currentIndex];(!o||!this.isFocusableElement(o))&&(this.setCurrentIndexCircularly(1),o=e[this.currentIndex]),o&&this.isFocusableElement(o)&&o.focus(t)}clearElementCache(t=0){this.mutationObserver.disconnect(),delete this.cachedElements,this.offset=t,requestAnimationFrame((()=>{this.elements.forEach((t=>{this.mutationObserver.observe(t,{attributes:!0})}))}))}setCurrentIndexCircularly(t){const{length:e}=this.elements;let o=e,s=(e+this.currentIndex+t)%e;for(;o&&this.elements[s]&&!this.isFocusableElement(this.elements[s]);)s=(e+s+t)%e,o-=1;this.currentIndex=s}hostContainsFocus(){this.host.addEventListener("focusout",this.handleFocusout),this.host.addEventListener("keydown",this.handleKeydown),this.focused=!0}hostNoLongerContainsFocus(){this.host.addEventListener("focusin",this.handleFocusin),this.host.removeEventListener("focusout",this.handleFocusout),this.host.removeEventListener("keydown",this.handleKeydown),this.focused=!1}isRelatedTargetAnElement(t){const e=t.relatedTarget;return!this.elements.includes(e)}acceptsEventCode(t){if("End"===t||"Home"===t)return!0;switch(this.direction){case"horizontal":return"ArrowLeft"===t||"ArrowRight"===t;case"vertical":return"ArrowUp"===t||"ArrowDown"===t;case"both":case"grid":return t.startsWith("Arrow")}}manage(){this.addEventListeners()}unmanage(){this.removeEventListeners()}addEventListeners(){this.host.addEventListener("focusin",this.handleFocusin)}removeEventListeners(){this.host.removeEventListener("focusin",this.handleFocusin),this.host.removeEventListener("focusout",this.handleFocusout),this.host.removeEventListener("keydown",this.handleKeydown)}hostConnected(){this.recentlyConnected=!0,this.addEventListeners()}hostDisconnected(){this.mutationObserver.disconnect(),this.removeEventListeners()}hostUpdated(){this.recentlyConnected&&(this.recentlyConnected=!1,this.elements.forEach((t=>{this.mutationObserver.observe(t,{attributes:!0})})))}}class F extends N{constructor(){super(...arguments),this.managed=!0,this.manageIndexesAnimationFrame=0}set focused(t){t!==this.focused&&(super.focused=t,this.manageTabindexes())}get focused(){return super.focused}clearElementCache(t=0){cancelAnimationFrame(this.manageIndexesAnimationFrame),super.clearElementCache(t),this.managed&&(this.manageIndexesAnimationFrame=requestAnimationFrame((()=>this.manageTabindexes())))}manageTabindexes(){this.focused?this.updateTabindexes((()=>({tabIndex:-1}))):this.updateTabindexes((t=>({removeTabIndex:t.contains(this.focusInElement)&&t!==this.focusInElement,tabIndex:t===this.focusInElement?0:-1})))}updateTabindexes(t){this.elements.forEach((e=>{const{tabIndex:o,removeTabIndex:s}=t(e);if(!s)return void(e.tabIndex=o);e.removeAttribute("tabindex");const a=e;a.requestUpdate&&a.requestUpdate()}))}manage(){this.managed=!0,this.manageTabindexes(),super.manage()}unmanage(){this.managed=!1,this.updateTabindexes((()=>({tabIndex:0}))),super.unmanage()}hostUpdated(){super.hostUpdated(),this.host.hasUpdated||this.manageTabindexes()}}const U=t`
    #list{--spectrum-tabs-item-height:var(--spectrum-tab-item-height-medium);--spectrum-tabs-item-horizontal-spacing:var(--spectrum-tab-item-to-tab-item-horizontal-medium);--spectrum-tabs-item-vertical-spacing:var(--spectrum-tab-item-to-tab-item-vertical-medium);--spectrum-tabs-start-to-edge:var(--spectrum-tab-item-start-to-edge-medium);--spectrum-tabs-top-to-text:var(--spectrum-tab-item-top-to-text-medium);--spectrum-tabs-bottom-to-text:var(--spectrum-tab-item-bottom-to-text-medium);--spectrum-tabs-icon-size:var(--spectrum-workflow-icon-size-75);--spectrum-tabs-icon-to-text:var(--spectrum-text-to-visual-100);--spectrum-tabs-top-to-icon:var(--spectrum-tab-item-top-to-workflow-icon-medium);--spectrum-tabs-color:var(--spectrum-neutral-subdued-content-color-default);--spectrum-tabs-color-selected:var(--spectrum-neutral-subdued-content-color-down);--spectrum-tabs-color-hover:var(--spectrum-neutral-subdued-content-color-hover);--spectrum-tabs-color-key-focus:var(--spectrum-neutral-subdued-content-color-key-focus);--spectrum-tabs-color-disabled:var(--spectrum-gray-500);--spectrum-tabs-font-family:var(--spectrum-sans-font-family-stack);--spectrum-tabs-font-style:var(--spectrum-default-font-style);--spectrum-tabs-font-size:var(--spectrum-font-size-100);--spectrum-tabs-line-height:var(--spectrum-line-height-100);--spectrum-tabs-focus-indicator-width:var(--spectrum-focus-indicator-thickness);--spectrum-tabs-focus-indicator-border-radius:var(--spectrum-corner-radius-100);--spectrum-tabs-focus-indicator-gap:var(--spectrum-tab-item-focus-indicator-gap-medium);--spectrum-tabs-focus-indicator-color:var(--spectrum-focus-indicator-color);--spectrum-tabs-selection-indicator-color:var(--spectrum-neutral-subdued-content-color-down);--spectrum-tabs-list-background-direction:top;--spectrum-tabs-divider-background-color:var(--spectrum-gray-300);--spectrum-tabs-divider-size:var(--spectrum-border-width-200);--spectrum-tabs-divider-border-radius:1px;--spectrum-tabs-animation-duration:var(--spectrum-animation-duration-100);--spectrum-tabs-animation-ease:var(--spectrum-animation-ease-in-out)}:host([emphasized]) #list{--mod-tabs-color-selected:var(--mod-tabs-color-selected-emphasized,var(--spectrum-accent-content-color-default));--mod-tabs-color-hover:var(--mod-tabs-color-hover-emphasized,var(--spectrum-accent-content-color-hover));--mod-tabs-color-key-focus:var(--mod-tabs-color-key-focus-emphasized,var(--spectrum-accent-content-color-key-focus));--mod-tabs-selection-indicator-color:var(--mod-tabs-selection-indicator-color-emphasized,var(--spectrum-accent-content-color-default))}:host([direction^=vertical]) #list{--mod-tabs-list-background-direction:var(--mod-tabs-list-background-direction-vertical,right)}:host([direction^=vertical-right]) #list{--mod-tabs-list-background-direction:var(--mod-tabs-list-background-direction-vertical-right,left)}:host([dir=rtl][direction^=vertical]) #list{--mod-tabs-list-background-direction:var(--mod-tabs-list-background-direction-vertical,left)}:host([dir=rtl][direction^=vertical-right]) #list{--mod-tabs-list-background-direction:var(--mod-tabs-list-background-direction-vertical,right)}:host([compact]) #list{--mod-tabs-item-height:var(--mod-tabs-item-height-compact,var(--spectrum-tab-item-compact-height-medium));--mod-tabs-top-to-text:var(--mod-tabs-top-to-text-compact,var(--spectrum-tab-item-top-to-text-compact-medium));--mod-tabs-bottom-to-text:var(--mod-tabs-bottom-to-text-compact,var(--spectrum-tab-item-top-to-text-compact-medium));--mod-tabs-top-to-icon:var(--mod-tabs-top-to-icon-compact,var(--spectrum-tab-item-top-to-workflow-icon-compact-medium))}#list{z-index:0;vertical-align:top;background:linear-gradient(to var(--mod-tabs-list-background-direction,var(--spectrum-tabs-list-background-direction)),var(--highcontrast-tabs-divider-background-color,var(--mod-tabs-divider-background-color,var(--spectrum-tabs-divider-background-color)))0 var(--mod-tabs-divider-size,var(--spectrum-tabs-divider-size)),transparent var(--mod-tabs-divider-size,var(--spectrum-tabs-divider-size)));margin:0;padding-block:0;display:flex;position:relative}::slotted([selected]:not([slot])){color:var(--highcontrast-tabs-color-selected,var(--mod-tabs-color-selected,var(--spectrum-tabs-color-selected)))}::slotted([disabled]:not([slot])){cursor:default;color:var(--highcontrast-tabs-color-disabled,var(--mod-tabs-color-disabled,var(--spectrum-tabs-color-disabled)))}#selection-indicator{background-color:var(--highcontrast-tabs-selection-indicator-color,var(--mod-tabs-selection-indicator-color,var(--spectrum-tabs-selection-indicator-color)));z-index:0;transition:transform var(--mod-tabs-animation-duration,var(--spectrum-tabs-animation-duration))var(--mod-tabs-animation-ease,var(--spectrum-tabs-animation-ease));transform-origin:0 0;border-radius:var(--mod-tabs-divider-border-radius,var(--spectrum-tabs-divider-border-radius));position:absolute;inset-inline-start:0}:host([direction^=horizontal]) #list{align-items:center}:host([direction^=horizontal]) #list ::slotted(:not([slot])){vertical-align:top}:host([direction^=horizontal]) #list ::slotted(:not([slot]):not(:first-child)){margin-inline-start:var(--mod-tabs-item-horizontal-spacing,var(--spectrum-tabs-item-horizontal-spacing))}:host([direction^=horizontal]) #list #selection-indicator{block-size:var(--mod-tabs-divider-size,var(--spectrum-tabs-divider-size));position:absolute;inset-block-end:0}:host([direction^=horizontal][compact]) #list{box-sizing:content-box;align-items:end}:host([quiet]) #list{background:0 0;border-color:#0000;display:inline-flex}:host([quiet]) #selection-indicator{padding-inline-start:var(--mod-tabs-start-to-item-quiet,var(--spectrum-tabs-start-to-item-quiet))}:host([direction^=vertical]) #list,:host([direction^=vertical-right]) #list{flex-direction:column;padding:0;display:inline-flex}:host([direction^=vertical][quiet]) #list,:host([direction^=vertical-right][quiet]) #list{border-color:#0000}:host([direction^=vertical]) #list ::slotted(:not([slot])),:host([direction^=vertical-right]) #list ::slotted(:not([slot])){block-size:var(--mod-tabs-item-height,var(--spectrum-tabs-item-height));line-height:var(--mod-tabs-item-height,var(--spectrum-tabs-item-height));margin-block-end:var(--mod-tabs-item-vertical-spacing,var(--spectrum-tabs-item-vertical-spacing));margin-inline-start:var(--mod-tabs-start-to-edge,var(--spectrum-tabs-start-to-edge));margin-inline-end:var(--mod-tabs-start-to-edge,var(--spectrum-tabs-start-to-edge));padding-block:0}:host([direction^=vertical]) #list ::slotted(:not([slot])):before,:host([direction^=vertical-right]) #list ::slotted(:not([slot])):before{inset-inline-start:calc(var(--mod-tabs-focus-indicator-gap,var(--spectrum-tabs-focus-indicator-gap))*-1)}:host([direction^=vertical]) #list #selection-indicator,:host([direction^=vertical-right]) #list #selection-indicator{inline-size:var(--mod-tabs-divider-size,var(--spectrum-tabs-divider-size));position:absolute;inset-block-start:0;inset-inline-start:0}:host([direction^=vertical-right]) #list #selection-indicator{inset-inline:auto 0}@media (forced-colors:active){#list{--highcontrast-tabs-divider-background-color:var(--spectrum-gray-500);--highcontrast-tabs-selection-indicator-color:Highlight;--highcontrast-tabs-focus-indicator-color:CanvasText;--highcontrast-tabs-focus-indicator-background-color:Highlight;--highcontrast-tabs-color:ButtonText;--highcontrast-tabs-color-hover:ButtonText;--highcontrast-tabs-color-selected:HighlightText;--highcontrast-tabs-color-key-focus:ButtonText;--highcontrast-tabs-color-disabled:GrayText;forced-color-adjust:none}#list ::slotted([selected]:not([slot])):before{background-color:var(--highcontrast-tabs-focus-indicator-background-color)}:host([direction^=vertical][compact]) #list #list ::slotted(:not([slot])):before{block-size:100%;inset-block-start:0}:host([quiet]) #list{background:linear-gradient(to var(--mod-tabs-list-background-direction,var(--spectrum-tabs-list-background-direction)),var(--highcontrast-tabs-divider-background-color,var(--mod-tabs-divider-background-color,var(--spectrum-tabs-divider-background-color)))0 var(--mod-tabs-divider-size,var(--spectrum-tabs-divider-size)),transparent var(--mod-tabs-divider-size,var(--spectrum-tabs-divider-size)))}}#list{--spectrum-tabs-font-weight:var(--system-spectrum-tabs-font-weight)}:host{grid-template-columns:100%;display:grid;position:relative}:host(:not([direction^=vertical])){grid-template-rows:auto 1fr}:host([direction^=vertical]){grid-template-columns:auto 1fr}:host([dir=rtl]) #selection-indicator{left:0;right:auto}:host([direction=vertical-right]) #list #selection-indicator{inset-inline:auto 0}#list{justify-content:var(--swc-tabs-list-justify-content)}:host([disabled]) #list{pointer-events:none}:host([disabled]) #list #selection-indicator{background-color:var(--mod-tabs-color-disabled,var(--spectrum-tabs-color-disabled))}:host([disabled]) ::slotted(sp-tab){color:var(--mod-tabs-color-disabled,var(--spectrum-tabs-color-disabled))}:host([direction=vertical-right]) #list #selection-indicator,:host([direction=vertical]) #list #selection-indicator{inset-block-start:0}#selection-indicator.first-position{transition:none}:host([dir][direction=horizontal]) #list.scroll{scrollbar-width:none;overflow:auto hidden}:host([dir][direction=horizontal]) #list.scroll::-webkit-scrollbar{display:none}
`,_=t`
    :host([size=s]) #list{--spectrum-tabs-item-height:var(--spectrum-tab-item-height-small);--spectrum-tabs-item-horizontal-spacing:var(--spectrum-tab-item-to-tab-item-horizontal-small);--spectrum-tabs-item-vertical-spacing:var(--spectrum-tab-item-to-tab-item-vertical-small);--spectrum-tabs-start-to-edge:var(--spectrum-tab-item-start-to-edge-small);--spectrum-tabs-top-to-text:var(--spectrum-tab-item-top-to-text-small);--spectrum-tabs-bottom-to-text:var(--spectrum-tab-item-bottom-to-text-small);--spectrum-tabs-icon-size:var(--spectrum-workflow-icon-size-50);--spectrum-tabs-icon-to-text:var(--spectrum-text-to-visual-75);--spectrum-tabs-top-to-icon:var(--spectrum-tab-item-top-to-workflow-icon-small);--spectrum-tabs-focus-indicator-gap:var(--spectrum-tab-item-focus-indicator-gap-small);--spectrum-tabs-font-size:var(--spectrum-font-size-75)}:host([size=l]) #list{--spectrum-tabs-item-height:var(--spectrum-tab-item-height-large);--spectrum-tabs-item-horizontal-spacing:var(--spectrum-tab-item-to-tab-item-horizontal-large);--spectrum-tabs-item-vertical-spacing:var(--spectrum-tab-item-to-tab-item-vertical-large);--spectrum-tabs-start-to-edge:var(--spectrum-tab-item-start-to-edge-large);--spectrum-tabs-top-to-text:var(--spectrum-tab-item-top-to-text-large);--spectrum-tabs-bottom-to-text:var(--spectrum-tab-item-bottom-to-text-large);--spectrum-tabs-icon-size:var(--spectrum-workflow-icon-size-100);--spectrum-tabs-icon-to-text:var(--spectrum-text-to-visual-200);--spectrum-tabs-top-to-icon:var(--spectrum-tab-item-top-to-workflow-icon-large);--spectrum-tabs-focus-indicator-gap:var(--spectrum-tab-item-focus-indicator-gap-large);--spectrum-tabs-font-size:var(--spectrum-font-size-200)}:host([size=xl]) #list{--spectrum-tabs-item-height:var(--spectrum-tab-item-height-extra-large);--spectrum-tabs-item-horizontal-spacing:var(--spectrum-tab-item-to-tab-item-horizontal-extra-large);--spectrum-tabs-item-vertical-spacing:var(--spectrum-tab-item-to-tab-item-vertical-extra-large);--spectrum-tabs-start-to-edge:var(--spectrum-tab-item-start-to-edge-extra-large);--spectrum-tabs-top-to-text:var(--spectrum-tab-item-top-to-text-extra-large);--spectrum-tabs-bottom-to-text:var(--spectrum-tab-item-bottom-to-text-extra-large);--spectrum-tabs-icon-size:var(--spectrum-workflow-icon-size-200);--spectrum-tabs-icon-to-text:var(--spectrum-text-to-visual-300);--spectrum-tabs-top-to-icon:var(--spectrum-tab-item-top-to-workflow-icon-extra-large);--spectrum-tabs-focus-indicator-gap:var(--spectrum-tab-item-focus-indicator-gap-extra-large);--spectrum-tabs-font-size:var(--spectrum-font-size-300)}:host([size=s]) #list.spectrum-Tabs--compact{--mod-tabs-item-height:var(--mod-tabs-item-height-compact,var(--spectrum-tab-item-compact-height-small));--mod-tabs-top-to-text:var(--mod-tabs-top-to-text-compact,var(--spectrum-tab-item-top-to-text-compact-small));--mod-tabs-bottom-to-text:var(--mod-tabs-bottom-to-text-compact,var(--spectrum-tab-item-top-to-text-compact-small));--mod-tabs-top-to-icon:var(--mod-tabs-top-to-icon-compact,var(--spectrum-tab-item-top-to-workflow-icon-compact-small))}:host([size=l]) #list.spectrum-Tabs--compact{--mod-tabs-item-height:var(--mod-tabs-item-height-compact,var(--spectrum-tab-item-compact-height-large));--mod-tabs-top-to-text:var(--mod-tabs-top-to-text-compact,var(--spectrum-tab-item-top-to-text-compact-large));--mod-tabs-bottom-to-text:var(--mod-tabs-bottom-to-text-compact,var(--spectrum-tab-item-top-to-text-compact-large));--mod-tabs-top-to-icon:var(--mod-tabs-top-to-icon-compact,var(--spectrum-tab-item-top-to-workflow-icon-compact-large))}:host([size=xl]) #list.spectrum-Tabs--compact{--mod-tabs-item-height:var(--mod-tabs-item-height-compact,var(--spectrum-tab-item-compact-height-extra-large));--mod-tabs-top-to-text:var(--mod-tabs-top-to-text-compact,var(--spectrum-tab-item-top-to-text-compact-extra-large));--mod-tabs-bottom-to-text:var(--mod-tabs-bottom-to-text-compact,var(--spectrum-tab-item-top-to-text-compact-extra-large));--mod-tabs-top-to-icon:var(--mod-tabs-top-to-icon-compact,var(--spectrum-tab-item-top-to-workflow-icon-compact-extra-large))}
`;var O=Object.defineProperty,q=Object.getOwnPropertyDescriptor,J=(t,e,o,s)=>{for(var a,i=s>1?void 0:s?q(e,o):e,r=t.length-1;r>=0;r--)(a=t[r])&&(i=(s?a(e,o,i):a(i))||i);return s&&i&&O(e,o,i),i};const B={baseSize:100,noSelectionStyle:"transform: translateX(0px) scaleX(0) scaleY(0)",transformX(t,e){return`transform: translateX(${t}px) scaleX(${e/this.baseSize});`},transformY(t,e){return`transform: translateY(${t}px) scaleY(${e/this.baseSize});`},baseStyles(){return t`
            :host([direction='vertical-right']) #selection-indicator,
            :host([direction='vertical']) #selection-indicator {
                height: ${this.baseSize}px;
            }
            :host([dir][direction='horizontal']) #selection-indicator {
                width: ${this.baseSize}px;
            }
        `}};class H extends(C(d,{noDefaultSize:!0})){constructor(){super(),this.auto=!1,this.compact=!1,this.direction="horizontal",this.emphasized=!1,this.label="",this.enableTabsScroll=!1,this.quiet=!1,this.selectionIndicatorStyle=B.noSelectionStyle,this.shouldAnimate=!1,this.selected="",this._tabs=[],this.resizeController=new I(this,{callback:()=>{this.updateSelectionIndicator()}}),this.rovingTabindexController=new F(this,{focusInIndex:t=>{let e=0;return t.find(((t,o)=>{const s=this.selected?!t.disabled&&t.value===this.selected:!t.disabled;return e=o,s}))?e:-1},direction:()=>"both",elementEnterAction:t=>{this.auto&&(this.shouldAnimate=!0,this.selectTarget(t))},elements:()=>this.tabs,isFocusableElement:t=>!t.disabled,listenerScope:()=>this.tabList}),this.onTabsScroll=()=>{this.dispatchEvent(new Event("sp-tabs-scroll",{bubbles:!0,composed:!0}))},this.onClick=t=>{if(this.disabled)return;const e=t.composedPath().find((t=>t.parentElement===this));!e||e.disabled||(this.shouldAnimate=!0,this.selectTarget(e))},this.onKeyDown=t=>{if("Enter"===t.code||"Space"===t.code){t.preventDefault();const e=t.target;e&&this.selectTarget(e)}},this.updateCheckedState=()=>{if(this.tabs.forEach((t=>{t.removeAttribute("selected")})),this.selected){const t=this.tabs.find((t=>t.value===this.selected));t?t.selected=!0:this.selected=""}else{const t=this.tabs[0];t&&t.setAttribute("tabindex","0")}this.updateSelectionIndicator()},this.updateSelectionIndicator=async()=>{const t=this.tabs.find((t=>t.selected));if(!t)return void(this.selectionIndicatorStyle=B.noSelectionStyle);await Promise.all([t.updateComplete,document.fonts?document.fonts.ready:Promise.resolve()]);const{width:e,height:o}=t.getBoundingClientRect();this.selectionIndicatorStyle="horizontal"===this.direction?B.transformX(t.offsetLeft,e):B.transformY(t.offsetTop,o)},new D(this,{config:{root:null,rootMargin:"0px",threshold:[0,1]},callback:()=>{this.updateSelectionIndicator()}})}static get styles(){return[_,U,B.baseStyles()]}set tabs(t){t!==this.tabs&&(this._tabs.forEach((t=>{this.resizeController.unobserve(t)})),t.forEach((t=>{this.resizeController.observe(t)})),this._tabs=t,this.rovingTabindexController.clearElementCache())}get tabs(){return this._tabs}get focusElement(){return this.rovingTabindexController.focusInElement||this}scrollTabs(t,e="smooth"){var o;null==(o=this.tabList)||o.scrollBy({left:t,top:0,behavior:e})}get scrollState(){if(this.tabList){const{scrollLeft:t,clientWidth:e,scrollWidth:o}=this.tabList,s=Math.abs(t)>0,a=Math.ceil(Math.abs(t))<o-e;return{canScrollLeft:"ltr"===this.dir?s:a,canScrollRight:"ltr"===this.dir?a:s}}return{}}async getUpdateComplete(){const t=await super.getUpdateComplete(),e=[...this.children].map((t=>void 0!==t.updateComplete?t.updateComplete:Promise.resolve(!0)));return await Promise.all(e),t}async scrollToSelection(){if(!this.enableTabsScroll||!this.selected)return;await this.updateComplete;const t=this.tabs.find((t=>t.value===this.selected));null==t||t.scrollIntoView()}updated(t){super.updated(t),t.has("selected")&&this.scrollToSelection()}managePanels({target:t}){t.assignedElements().map((t=>{const{value:e,id:o}=t,s=this.querySelector(`[role="tab"][value="${e}"]`);s&&(s.setAttribute("aria-controls",o),t.setAttribute("aria-labelledby",s.id)),t.selected=e===this.selected}))}render(){return e`
            <div
                class=${w({scroll:this.enableTabsScroll})}
                aria-label=${l(this.label?this.label:void 0)}
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
                    class=${l(this.shouldAnimate?void 0:"first-position")}
                    style=${this.selectionIndicatorStyle}
                    role="presentation"
                ></div>
            </div>
            <slot name="tab-panel" @slotchange=${this.managePanels}></slot>
        `}willUpdate(t){if(!this.hasUpdated){const t=this.querySelector(":scope > [selected]");t&&this.selectTarget(t)}if(super.willUpdate(t),t.has("selected")){if(this.tabs.length&&this.updateCheckedState(),t.get("selected")){const e=this.querySelector(`[role="tabpanel"][value="${t.get("selected")}"]`);e&&(e.selected=!1)}const e=this.querySelector(`[role="tabpanel"][value="${this.selected}"]`);e&&(e.selected=!0)}t.has("direction")&&("horizontal"===this.direction?this.removeAttribute("aria-orientation"):this.setAttribute("aria-orientation","vertical")),t.has("dir")&&this.updateSelectionIndicator(),t.has("disabled")&&(this.disabled?this.setAttribute("aria-disabled","true"):this.removeAttribute("aria-disabled")),!this.shouldAnimate&&void 0!==t.get("shouldAnimate")&&(this.shouldAnimate=!0)}selectTarget(t){const e=t.getAttribute("value");if(e){const t=this.selected;this.selected=e,this.dispatchEvent(new Event("change",{cancelable:!0}))||(this.selected=t)}}onSlotChange(){this.tabs=this.slotEl.assignedElements().filter((t=>"tab"===t.getAttribute("role"))),this.updateCheckedState()}connectedCallback(){super.connectedCallback(),window.addEventListener("resize",this.updateSelectionIndicator),"fonts"in document&&document.fonts.addEventListener("loadingdone",this.updateSelectionIndicator)}disconnectedCallback(){window.removeEventListener("resize",this.updateSelectionIndicator),"fonts"in document&&document.fonts.removeEventListener("loadingdone",this.updateSelectionIndicator),super.disconnectedCallback()}}J([o({type:Boolean})],H.prototype,"auto",2),J([o({type:Boolean,reflect:!0})],H.prototype,"compact",2),J([o({reflect:!0})],H.prototype,"dir",2),J([o({reflect:!0})],H.prototype,"direction",2),J([o({type:Boolean,reflect:!0})],H.prototype,"emphasized",2),J([o()],H.prototype,"label",2),J([o({type:Boolean})],H.prototype,"enableTabsScroll",2),J([o({type:Boolean,reflect:!0})],H.prototype,"quiet",2),J([o({attribute:!1})],H.prototype,"selectionIndicatorStyle",2),J([o({attribute:!1})],H.prototype,"shouldAnimate",2),J([h("slot")],H.prototype,"slotEl",2),J([h("#list")],H.prototype,"tabList",2),J([o({reflect:!0})],H.prototype,"selected",2),c("sp-tabs",H);const R=t`
    :host{box-sizing:border-box;block-size:calc(var(--mod-tabs-item-height,var(--spectrum-tabs-item-height)) - var(--mod-tabs-divider-size,var(--spectrum-tabs-divider-size)));z-index:1;white-space:nowrap;color:var(--highcontrast-tabs-color,var(--mod-tabs-color,var(--spectrum-tabs-color)));transition:color var(--mod-tabs-animation-duration,var(--spectrum-tabs-animation-duration))ease-out;cursor:pointer;outline:none;text-decoration:none;position:relative}::slotted([slot=icon]){block-size:var(--mod-tabs-icon-size,var(--spectrum-tabs-icon-size));inline-size:var(--mod-tabs-icon-size,var(--spectrum-tabs-icon-size));margin-block-start:var(--mod-tabs-top-to-icon,var(--spectrum-tabs-top-to-icon))}[name=icon]+#item-label{margin-inline-start:var(--mod-tabs-icon-to-text,var(--spectrum-tabs-icon-to-text))}:host:before{content:"";box-sizing:border-box;block-size:calc(100% - var(--mod-tabs-top-to-text,var(--spectrum-tabs-top-to-text)));inline-size:calc(100% + var(--mod-tabs-focus-indicator-gap,var(--spectrum-tabs-focus-indicator-gap))*2);border:var(--mod-tabs-focus-indicator-width,var(--spectrum-tabs-focus-indicator-width))solid transparent;border-radius:var(--mod-tabs-focus-indicator-border-radius,var(--spectrum-tabs-focus-indicator-border-radius));pointer-events:none;position:absolute;inset-block-start:calc(var(--mod-tabs-top-to-text,var(--spectrum-tabs-top-to-text))/2);inset-inline-start:calc(var(--mod-tabs-focus-indicator-gap,var(--spectrum-tabs-focus-indicator-gap))*-1);inset-inline-end:calc(var(--mod-tabs-focus-indicator-gap,var(--spectrum-tabs-focus-indicator-gap))*-1)}@media (hover:hover){:host(:hover){color:var(--highcontrast-tabs-color-hover,var(--mod-tabs-color-hover,var(--spectrum-tabs-color-hover)))}}:host([selected]){color:var(--highcontrast-tabs-color-selected,var(--mod-tabs-color-selected,var(--spectrum-tabs-color-selected)))}:host([disabled]){cursor:default;color:var(--highcontrast-tabs-color-disabled,var(--mod-tabs-color-disabled,var(--spectrum-tabs-color-disabled)))}:host([disabled]) #item-label{cursor:default}:host(:focus-visible){color:var(--highcontrast-tabs-color-key-focus,var(--mod-tabs-color-key-focus,var(--spectrum-tabs-color-key-focus)))}:host(:focus-visible):before{border-color:var(--highcontrast-tabs-focus-indicator-color,var(--mod-tabs-focus-indicator-color,var(--spectrum-tabs-focus-indicator-color)))}#item-label{cursor:pointer;vertical-align:top;font-family:var(--mod-tabs-font-family,var(--spectrum-tabs-font-family));font-style:var(--mod-tabs-font-style,var(--spectrum-tabs-font-style));font-size:var(--mod-tabs-font-weight,var(--spectrum-tabs-font-size));font-weight:var(--mod-tabs-font-weight,var(--spectrum-tabs-font-weight));line-height:var(--mod-tabs-line-height,var(--spectrum-tabs-line-height));margin-block-start:var(--mod-tabs-top-to-text,var(--spectrum-tabs-top-to-text));margin-block-end:var(--mod-tabs-bottom-to-text,var(--spectrum-tabs-bottom-to-text));text-decoration:none;display:inline-block}#item-label:empty{display:none}:host{scroll-margin-inline:var(--mod-tabs-item-horizontal-spacing,var(--spectrum-tabs-item-horizontal-spacing))}:host([disabled]){pointer-events:none}#item-label[hidden]{display:none}@media (forced-colors:active){:host:before{background-color:buttonface}:host ::slotted([slot=icon]){z-index:1;color:inherit;position:relative}#item-label{z-index:1;position:relative}:host([selected]),:host([selected]) ::slotted([slot=icon]),:host([selected]) #item-label{color:highlighttext}}:host([vertical]){flex-direction:column;justify-content:center;align-items:center;height:auto;display:flex}:host([dir][vertical]) slot[name=icon]+#item-label{margin-block-start:calc(var(--mod-tabs-top-to-text,var(--spectrum-tabs-top-to-text))/2);margin-block-end:calc(var(--mod-tabs-bottom-to-text,var(--spectrum-tabs-bottom-to-text))/2);margin-inline-start:0}:host([vertical]) ::slotted([slot=icon]){margin-block-start:calc(var(--mod-tabs-top-to-icon,var(--spectrum-tabs-top-to-icon))/2)}
`;var W=Object.defineProperty,Y=Object.getOwnPropertyDescriptor,G=(t,e,o,s)=>{for(var a,i=s>1?void 0:s?Y(e,o):e,r=t.length-1;r>=0;r--)(a=t[r])&&(i=(s?a(e,o,i):a(i))||i);return s&&i&&W(e,o,i),i};const K=class t extends(m(k(S(b,'[slot="icon"]'),""))){constructor(){super(...arguments),this.disabled=!1,this.label="",this.selected=!1,this.vertical=!1,this.value=""}static get styles(){return[R]}get hasIcon(){return this.slotContentIsPresent}get hasLabel(){return!!this.label||this.slotHasContent}render(){return e`
            ${this.hasIcon?e`
                      <slot name="icon"></slot>
                  `:s}
            <label id="item-label" ?hidden=${!this.hasLabel}>
                ${this.slotHasContent?s:this.label}
                <slot>${this.label}</slot>
            </label>
        `}firstUpdated(e){super.firstUpdated(e),this.setAttribute("role","tab"),this.hasAttribute("id")||(this.id="sp-tab-"+t.instanceCount++)}updated(t){super.updated(t),t.has("selected")&&(this.setAttribute("aria-selected",this.selected?"true":"false"),this.setAttribute("tabindex",this.selected?"0":"-1")),t.has("disabled")&&(this.disabled?this.setAttribute("aria-disabled","true"):this.removeAttribute("aria-disabled"))}};K.instanceCount=0,G([o({type:Boolean,reflect:!0})],K.prototype,"disabled",2),G([o({reflect:!0})],K.prototype,"label",2),G([o({type:Boolean,reflect:!0})],K.prototype,"selected",2),G([o({type:Boolean,reflect:!0})],K.prototype,"vertical",2),G([o({type:String,reflect:!0})],K.prototype,"value",2),c("sp-tab",K);const X=t`
    :host{display:inline-flex}:host(:not([selected])){display:none}
`;var Q=Object.defineProperty,V=Object.getOwnPropertyDescriptor,Z=(t,e,o,s)=>{for(var a,i=s>1?void 0:s?V(e,o):e,r=t.length-1;r>=0;r--)(a=t[r])&&(i=(s?a(e,o,i):a(i))||i);return s&&i&&Q(e,o,i),i};const tt=class t extends b{constructor(){super(...arguments),this.selected=!1,this.value=""}handleFocusin(){this.removeAttribute("tabindex")}handleFocusout(){this.tabIndex=this.selected?0:-1}render(){return e`
            <slot
                @focusin=${this.handleFocusin}
                @focusout=${this.handleFocusout}
            ></slot>
        `}firstUpdated(){this.slot="tab-panel",this.setAttribute("role","tabpanel"),this.tabIndex=0,this.hasAttribute("id")||(this.id="sp-tab-panel-"+t.instanceCount++)}updated(t){t.has("selected")&&(this.selected?(this.removeAttribute("aria-hidden"),this.tabIndex=0):(this.setAttribute("aria-hidden","true"),this.tabIndex=-1))}};tt.styles=[X],tt.instanceCount=0,Z([o({type:Boolean,reflect:!0})],tt.prototype,"selected",2),Z([o({type:String,reflect:!0})],tt.prototype,"value",2),c("sp-tab-panel",tt);var et=[u,...g,t`
    div.input-block {
      background-color: #f8f8f8;
      padding-bottom: 0.5rem;
    }

    label {
      background-color: #666;
      color: #fff;
      padding: 0.5rem;
      display: block;
      font-size: 0.9rem;
      /* Make it a little brighter than the default background color */
      filter: brightness(1.2);
    }
  `];let ot=class extends f{};ot.styles=et,ot=a([i("arch-job-parameters-form")],ot);var st=[u,p,t`
    dl {
      padding-inline-start: 1rem;
      line-height: 1.4rem;
    }

    dt {
      display: inline-block;
      font-weight: normal;
    }

    dd {
      font-weight: bold;
    }

    dd:after {
      content: "";
      padding: 0;
    }

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

    p.history > a {
      text-decoration: underline;
    }

    /* Disabled button text style should match ArchLoadingIndicator */
    button:disabled {
      font-style: italic;
      color: #666;
    }
  `];let at=class extends r{constructor(){super(...arguments),this.buttonClass="",this.buttonHTML=e``,this.jobName="",this.collectionName="",this.jobStateTuples=[]}renderButton(){const{jobStateTuples:t}=this,o=(t,o,s)=>e`
      <button slot="trigger" class=${o} ?disabled=${s}>
        ${v(t)}
      </button>
    `;switch(t){case void 0:return o("Loading...","",!0);case null:return o("Generate Dataset","primary",!1)}switch(t[0][2]){case z.SUBMITTED:return o('<arch-loading-indicator text="Job Starting"></arch-loading-indicator>',"",!0);case z.QUEUED:return o("Job Queued","",!0);case z.RUNNING:return o('<arch-loading-indicator text="Job Running"></arch-loading-indicator>',"",!0);case z.FINISHED:case z.FAILED:case z.CANCELLED:return o("Generate New Dataset","primary",!1)}}render(){const{jobParameters:t,jobName:o,collectionName:s}=this;return e`
      <arch-modal title="Generate Dataset">
        <div slot="content">
          <p>
            You're about to generate a <strong>${o}</strong> dataset from
            the <strong>${s}</strong> collection with the following
            configuration:
            <dl>
            ${Object.entries(t).map((([t,o])=>e`
                <dt>${t}</dt>
                <dd>${"boolean"==typeof o?o?"Yes":"No":o}</dd>
                <br />
              `))}
            </dl>
          </p>
        </div>
        ${this.renderButton()}
      </arch-modal>
    `}};var it;at.styles=st,at.shadowRootOptions={...r.shadowRootOptions,delegatesFocus:!0},a([o()],at.prototype,"buttonClass",void 0),a([o()],at.prototype,"buttonHTML",void 0),a([o()],at.prototype,"jobName",void 0),a([o()],at.prototype,"collectionName",void 0),a([o()],at.prototype,"jobParameters",void 0),a([o()],at.prototype,"jobStateTuples",void 0),at=a([i("arch-job-button")],at);let rt=it=class extends r{constructor(){super(...arguments),this.jobParameters={}}extendParamsSchemaWithDefaultOptions(t){return t=null!=t?t:it.DefaultParametersSchema,Object.assign(t,{properties:Object.assign(t.properties,{sample:{type:"boolean",title:"Sample",default:!1,description:"Generate a sample dataset from a small subset of records"}})})}get historicalDatasetsUrl(){const{collectionId:t,job:e}=this;return`${j.collection(t)}?column-name=${encodeURIComponent(e.name)}`}renderHistory(){const{jobIdStatesMap:t,job:o}=this,s=t&&t[o.id];if(void 0===s||0===s.length)return e`
        <h4>History</h4>
        <p class="history">
          No datasets of this type have been generated for this collection.
        </p>
      `;const a=s.filter((([,,t])=>t===z.FINISHED));if(0===a.length)return e`
        <h4>History</h4>
        <p class="history">
          No datasets of this type have been completed for this collection.
        </p>
      `;const i=a.length>1;return e`
      <h4>History</h4>
      <p class="history">
        You've generated this dataset
        <a href="${this.historicalDatasetsUrl}" target="_blank">
          <strong
            >${a.length}&nbsp;time${i?"s":""}</strong
          >
        </a>
        for this collection, most recently on
        <a href="${j.dataset(a[0][0])}">
          <strong>${P(a[0][1])}</strong> </a
        >.
      </p>
    `}renderConfigureJob(){const{job:t,jobParameters:o}=this;return e`
      <h4>Configure</h4>
      <arch-job-parameters-form
        .schema=${this.extendParamsSchemaWithDefaultOptions(t.parameters_schema)}
        .data=${o}
        @data-change=${()=>this.jobButton.requestUpdate()}
      ></arch-job-parameters-form>
    `}emitGenerateDataset(t){t.stopPropagation(),this.dispatchEvent(new CustomEvent("generate-dataset",{detail:{archJobCard:this},bubbles:!0,composed:!0}))}render(){var t;const{collectionId:o,collectionName:s,job:a,jobIdStatesMap:i,jobParameters:r}=this,{id:n}=a,c=this.jobIdStatesMap?null!==(t=i[n])&&void 0!==t?t:null:void 0;return e` <div>
      <h3>${a.name}</h3>
      <p>
        ${a.description}
        <a href="${a.info_url}">Learn&nbsp;more &gt;</a>.
        <a href="${a.code_url}">Read&nbsp;the&nbsp;code &gt;</a>.
      </p>
      ${null===o?e`<p class="alert alert-info">
            Select a Source Collection above to display the options for
            generating a Dataset of this type.
          </p>`:e`
            ${this.renderHistory()} ${this.renderConfigureJob()}
            <arch-job-button
              .jobName=${a.name}
              .collectionName=${s}
              .jobStateTuples=${c}
              .jobParameters=${r}
              @submit=${this.emitGenerateDataset.bind(this)}
            >
            </arch-job-button>
          `}
    </div>`}};rt.styles=st,rt.DefaultParametersSchema={type:"object",required:[],properties:{}},a([o({type:Number})],rt.prototype,"collectionId",void 0),a([o({type:String})],rt.prototype,"collectionName",void 0),a([o()],rt.prototype,"job",void 0),a([o()],rt.prototype,"jobIdStatesMap",void 0),a([n()],rt.prototype,"jobParameters",void 0),a([h("arch-job-button")],rt.prototype,"jobButton",void 0),rt=it=a([i("arch-job-card")],rt);var nt=[u,t`
    label {
      background-color: #000;
      color: #fff;
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
      padding: 0.5rem;
      background-color: #eee;
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
  `];let ct=class extends r{render(){const{collectionId:t,collectionName:o,jobIdStatesMap:s}=this,{categoryDescription:a,jobs:i}=this.jobsCat;return e`
      <div class="category-header">
        <p class="category-description">${a}</p>
      </div>

      <label for="job-tabs">Select Dataset Type</label>
      <br />
      <sp-theme color="light" scale="medium">
        <sp-tabs
          compact
          direction="vertical"
          selected="${i[0].id}"
          name="job-tabs"
        >
          ${i.map((a=>e`<sp-tab
                label="${a.name}"
                value="${a.id}"
              ></sp-tab>
              <sp-tab-panel value="${a.id}">
                <arch-job-card
                  .collectionId=${t}
                  .collectionName=${o}
                  .job=${a}
                  .jobIdStatesMap=${s}
                ></arch-job-card>
              </sp-tab-panel>`))}
        </sp-tabs>
      </sp-theme>
    `}};ct.styles=nt,a([o({type:String})],ct.prototype,"collectionId",void 0),a([o({type:String})],ct.prototype,"collectionName",void 0),a([o({type:Object})],ct.prototype,"jobsCat",void 0),a([o({type:Object})],ct.prototype,"jobIdStatesMap",void 0),ct=a([i("arch-job-category-section")],ct);const lt=["Collection","Network","Text","File Formats"],dt={Collection:["Domain frequency","Web archive transformation (WAT)"],Network:["Domain graph","Image graph","Longitudinal graph","Web graph"],Text:["Named entities","Plain text of webpages","Text file information"],"File Formats":["Audio file information","Image file information","PDF file information","Presentation file information","Spreadsheet file information","Video file information","Word processing file information"]};let ht=class extends r{constructor(){super(...arguments),this.collections=null,this.collectionIdNameMap=new Map,this.availableJobs=[],this.sourceCollectionId=null,this.collectionJobIdStatesMapMap={},this.activePollCollectionId=null}async connectedCallback(){await this.initAvailableJobs(),this.initCollections(),super.connectedCallback(),this.addEventListener("generate-dataset",(t=>{this.generateDatasetHandler(t)}))}render(){var t;const o=this.sourceCollectionId&&this.collectionJobIdStatesMapMap[this.sourceCollectionId];return e`
      <label for="source-collection">Select Source Collection</label>
      <select
        name="source-collection"
        @change=${this.sourceCollectionChangeHandler}
        ?disabled=${null===this.collections}
      >
        ${null===this.collections?e`<option>Loading...</option>`:e`<option value="">${E}</option>`}
        ${(null!==(t=this.collections)&&void 0!==t?t:[]).map((t=>e`
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
          ${this.availableJobs.map((t=>e`<sp-tab
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
          ${this.availableJobs.map((t=>{var s;return e`
              <sp-tab-panel value="${t.categoryId}">
                <arch-job-category-section
                  .collectionId=${this.sourceCollectionId}
                  .collectionName=${this.collectionIdNameMap.get(null!==(s=this.sourceCollectionId)&&void 0!==s?s:0)}
                  .jobsCat=${t}
                  .jobIdStatesMap=${o}
                >
                </arch-job-category-section>
              </sp-tab-panel>
            `}))}
        </sp-tabs>
      </sp-theme>
    `}setCollectionIdUrlParam(t){const e=new URL(window.location.href);t?e.searchParams.set($,t.toString()):e.searchParams.delete($),history.replaceState(null,"",e.toString())}async sourceCollectionChangeHandler(t){const e=parseInt(t.target.value)||null;this.setCollectionIdUrlParam(e),await this.setSourceCollectionId(e),this.requestUpdate()}async setSourceCollectionId(t){this.sourceCollectionId=t,t&&(this.collectionJobIdStatesMapMap[t]=await this.fetchJobIdStatesMap(t),this.maybeStartPolling())}async initCollections(){var t;const e=await T.collections.get();this.collections=e.items,this.collectionIdNameMap=new Map(this.collections.map((t=>[t.id,t.name])));const o=parseInt(null!==(t=new URLSearchParams(window.location.search).get($))&&void 0!==t?t:"");Number.isNaN(o)||(await this.setSourceCollectionId(o),this.requestUpdate())}async initAvailableJobs(){const t=await(await fetch("/api/available-jobs")).json();t.sort(((t,e)=>lt.indexOf(t.categoryName)>lt.indexOf(e.categoryName)?1:-1)).map((t=>(t.jobs.sort(((e,o)=>{const s=dt[t.categoryName];return void 0===s?0:s.indexOf(e.name)>s.indexOf(o.name)?1:-1})),t))),this.availableJobs=t}async fetchJobIdStatesMap(t){return await(await fetch(`/api/collections/${t}/dataset_states`)).json()}async pollDatasetStates(){const{sourceCollectionId:t}=this;if(null!==t&&this.activePollCollectionId===t){this.collectionJobIdStatesMapMap[t]=await this.fetchJobIdStatesMap(t),this.requestUpdate();for(const e of Object.values(this.collectionJobIdStatesMapMap[t]))if(A(e[0][2]))return void setTimeout((()=>{this.pollDatasetStates()}),1e4);this.activePollCollectionId=null}else this.activePollCollectionId=null}maybeStartPolling(){const{collectionJobIdStatesMapMap:t,sourceCollectionId:e}=this;if(null!==e&&null===this.activePollCollectionId)for(const o of Object.values(t[e]))if(A(o[0][2]))return this.activePollCollectionId=e,void this.pollDatasetStates()}async generateDatasetHandler(t){const e=t.detail.archJobCard,o=e.job.id,s=e.jobParameters,{collectionJobIdStatesMapMap:a}=this,i=this.sourceCollectionId,r=a[i],n=[0,(new Date).toISOString(),z.SUBMITTED];r[o]?r[o].unshift(n):r[o]=[n],e.jobButton.requestUpdate();try{await T.jobs.run(i,o,s)}catch{return r[o].shift(),e.jobButton.requestUpdate(),void L.showError("","Dataset generation failed. Please try again.",e.jobButton)}L.showNotification("ARCH is generating your dataset",`You will receive an email when your dataset is ready. You can monitor its progress on the <a href="${j.datasets}">Dataset list</a>.`,e.jobButton),this.maybeStartPolling()}};ht.styles=nt,a([o({type:String})],ht.prototype,"csrfToken",void 0),a([n()],ht.prototype,"collections",void 0),a([n()],ht.prototype,"collectionIdNameMap",void 0),a([n()],ht.prototype,"availableJobs",void 0),a([n()],ht.prototype,"sourceCollectionId",void 0),a([n()],ht.prototype,"collectionJobIdStatesMapMap",void 0),a([n()],ht.prototype,"activePollCollectionId",void 0),a([h("select[name=source-collection]")],ht.prototype,"collectionSelector",void 0),a([y("arch-job-category-section")],ht.prototype,"categorySections",void 0),ht=a([i("arch-generate-dataset-form")],ht);export{ht as ArchGenerateDatasetForm};
//# sourceMappingURL=arch-generate-dataset-form.js.map
