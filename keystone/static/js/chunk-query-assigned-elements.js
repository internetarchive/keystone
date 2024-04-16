/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=(e,i)=>"method"===i.kind&&i.descriptor&&!("value"in i.descriptor)?{...i,finisher(r){r.createProperty(i.key,e)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:i.key,initializer(){"function"==typeof i.initializer&&(this[i.key]=i.initializer.call(this))},finisher(r){r.createProperty(i.key,e)}};function i(i){return(r,t)=>void 0!==t?((e,i,r)=>{i.constructor.createProperty(r,e)})(i,r,t):e(i,r)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}const r=({finisher:e,descriptor:i})=>(r,t)=>{var o;if(void 0===t){const t=null!==(o=r.originalKey)&&void 0!==o?o:r.key,n=null!=i?{kind:"method",placement:"prototype",key:t,descriptor:i(r.key)}:{...r,key:t};return null!=e&&(n.finisher=function(i){e(i,t)}),n}{const o=r.constructor;void 0!==i&&Object.defineProperty(r,t,i(t)),null==e||e(o,t)}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;function t(e,i){return r({descriptor:r=>{const t={get(){var i,r;return null!==(r=null===(i=this.renderRoot)||void 0===i?void 0:i.querySelector(e))&&void 0!==r?r:null},enumerable:!0,configurable:!0};if(i){const i="symbol"==typeof r?Symbol():"__"+r;t.get=function(){var r,t;return void 0===this[i]&&(this[i]=null!==(t=null===(r=this.renderRoot)||void 0===r?void 0:r.querySelector(e))&&void 0!==t?t:null),this[i]}}return t}})}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var o;null===(o=window.HTMLSlotElement)||void 0===o||o.prototype.assignedElements;export{i as e,t as i};
//# sourceMappingURL=chunk-query-assigned-elements.js.map
