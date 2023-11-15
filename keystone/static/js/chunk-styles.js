import{o,i as r}from"./chunk-query-assigned-elements.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function t(r,t){return o({descriptor:o=>{const a={get(){var o,t;return null!==(t=null===(o=this.renderRoot)||void 0===o?void 0:o.querySelector(r))&&void 0!==t?t:null},enumerable:!0,configurable:!0};if(t){const t="symbol"==typeof o?Symbol():"__"+o;a.get=function(){var o,a;return void 0===this[t]&&(this[t]=null!==(a=null===(o=this.renderRoot)||void 0===o?void 0:o.querySelector(r))&&void 0!==a?a:null),this[t]}}return a}})}const a=r`#2b74a1`,e=r`#1b4865`,n=r`#f0f0f0`,l=r`#222`,c=a,d=r`#fff`,i=r`#1e7b34`,b=r`#fff`;r`#e3e7e8`;const s={backgroundColor:c,border:r`none`,color:d,cursor:r`pointer`,hoverBackgroundColor:e,hoverColor:d,transition:r`background-color 300ms ease-out`};var u=r`
  :host {
    /* DataTable action buttons */
    --data-table-action-button-background-color: ${s.backgroundColor};
    --data-table-action-button-border: ${s.border};
    --data-table-action-button-color: ${s.color};
    --data-table-action-button-cursor: ${s.cursor};
    --data-table-action-button-hover-background-color: ${s.hoverBackgroundColor};
    --data-table-action-button-hover-color: ${s.hoverColor};
    --data-table-action-button-transition: ${s.transition};

    /* DataTable paginator */
    --data-table-paginator-wrapper-font-size: 1rem;
    --data-table-paginator-control-button-background-color: transparent;
    --data-table-paginator-control-button-border: none;
    --data-table-paginator-control-button-color: #348fc6;
    --data-table-paginator-control-button-padding: 0.25rem;
  }

  a:any-link {
    color: ${a};
  }

  a:hover {
    color: ${e};
  }
`;const f=r`#052c65`,g=r`#2b2f32`,$=r`#0a3622`,m=r`#055160`,p=r`#664d03`,h=r`#58151c`,k=r`#495057`,v=r`#495057`,y=r`#f8d7da`,w=r`
  :host {
    color: #222;
    font-family: "Open Sans", Helvetica, Arial, sans-serif;
  }

  a:any-link {
    color: ${a};
    text-decoration: none;
  }

  button {
    white-space: nowrap;
    font-size: 0.9rem;
    border-radius: 3px;
    border: none;
    padding: 0.4rem 1rem;
    cursor: pointer;
    background-color: ${n};
    color: ${l};
  }

  button:disabled {
    cursor: default;
  }

  button.primary {
    background-color: ${c};
    color: ${d};
  }

  button.success {
    background-color: ${i};
    color: ${b};
  }

  button.danger {
    background-color: ${y};
    color: ${h};
  }

  a:any-link:hover,
  button.text:hover {
    color: ${e};
    cursor: pointer;
  }

  button.text {
    background: transparent;
    border: none;
    padding: 0;
    color: ${a};
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
  }

  label.required:after {
    content: "*";
    color: red;
  }
`,x=r`
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
`,z=r`
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
    color: ${f};
    background-color: ${r`#cfe2ff`};
    border-color: ${r`#9ec5fe`};
  }

  .alert-primary a {
    color: ${f};
  }

  .alert-secondary {
    color: ${g};
    background-color: ${r`#e2e3e5`};
    border-color: ${r`#c4c8cb`};
  }

  .alert-secondary a {
    color: ${g};
  }

  .alert-success {
    color: ${$};
    background-color: ${r`#d1e7dd`};
    border-color: ${r`#a3cfbb`};
  }

  .alert-success a {
    color: ${$};
  }

  .alert-info {
    color: ${m};
    background-color: ${r`#cff4fc`};
    border-color: ${r`#9eeaf9`};
  }

  .alert-info a {
    color: ${m};
  }

  .alert-warning {
    color: ${p};
    background-color: ${r`#fff3cd`};
    border-color: ${r`#ffe69c`};
  }

  .alert-warning a {
    color: ${p};
  }

  .alert-danger {
    color: ${h};
    background-color: ${y};
    border-color: ${r`#f1aeb5`};
  }

  .alert-danger a {
    color: ${h};
  }

  .alert-light {
    color: ${k};
    background-color: ${r`#fcfcfd`};
    border-color: ${r`#e9ecef`};
  }

  .alert-light a {
    color: ${k};
  }

  .alert-dark {
    color: ${v};
    background-color: ${r`#ced4da`};
    border-color: ${r`#adb5bd`};
  }

  .alert-dark a {
    color: ${v};
  }
`;export{z as B,u as G,x as c,n as d,w as g,t as i};
//# sourceMappingURL=chunk-styles.js.map
