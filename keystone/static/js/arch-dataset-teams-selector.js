import{i as t,_ as e,e as s,a}from"./chunk-lit-element.js";import{A as r}from"./chunk-ArchAPI.js";import{ArchGlobalModal as o}from"./arch-global-modal.js";import{A as i}from"./chunk-arch-select-adder.js";import{g as n}from"./chunk-styles.js";import"./chunk-helpers.js";import"./chunk-arch-modal.js";import"./chunk-scale-large.js";import"./chunk-state.js";import"./chunk-sizedMixin.js";var l=[n,t`
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
  `];let d=class extends i{connectedCallback(){const{userTeams:t,datasetTeams:e}=this;this.options=t,this.selectedOptions=e,this.deselectButtonText="stop sharing",this.selectCtaText="Add a team",this.selectedOptionsTitle="Currently Sharing With",this.valueGetter=t=>String(t.id),this.labelGetter=t=>t.name,super.connectedCallback()}async onChange(t,e){const{datasetId:s,selectedOptions:a}=this;this.disabled=!0;try{await r.datasets.updateTeams(s,a)}catch(s){t(),o.showError("","Could not update dataset teams. Please try again.",e)}this.disabled=!1}};d.styles=l,e([s({type:String})],d.prototype,"datasetId",void 0),e([s({type:Array})],d.prototype,"userTeams",void 0),e([s({type:Array})],d.prototype,"datasetTeams",void 0),d=e([a("arch-dataset-teams-selector")],d);export{d as ArchDatasetTeamsSelector};
//# sourceMappingURL=arch-dataset-teams-selector.js.map
