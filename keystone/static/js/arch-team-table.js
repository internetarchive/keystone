import{i as e,_ as t,e as a,y as r,a as s}from"./chunk-lit-element.js";import{t as o}from"./chunk-state.js";import{U as i}from"./chunk-helpers.js";import{t as n}from"./chunk-helpers2.js";import{T as l}from"./chunk-pubsub.js";import{A as d}from"./chunk-arch-data-table.js";import{B as m,i as c,g as h}from"./chunk-styles.js";import{A as p}from"./chunk-ArchAPI.js";import{A as u}from"./chunk-arch-modal.js";import{A as b}from"./chunk-arch-select-adder.js";import"./arch-loading-indicator.js";import"./arch-hover-tooltip.js";import"./chunk-scale-large.js";import"./chunk-sp-overlay.js";import"./chunk-sizedMixin.js";var f=[...u.styles,m,e`
    form > label {
      font-weight: normal;
      margin-top: 0.5rem;
      font-size: 0.95rem;
    }

    form > label:first-child {
      margin-top: 0;
    }

    form > label > em {
      display: block;
      font-size: 0.9em;
    }

    form > input,
    form > select {
      box-sizing: border-box;
      width: 100%;
    }

    form > label[for="send-email"],
    form > input#send-email {
      display: inline-block;
      width: auto;
    }

    form > label[for="send-email"] {
      margin-left: 0.5em;
    }

    div.error {
      margin-top: 1rem;
      padding: 0.5rem 0.75rem;
      display: none;
    }

    div.error.show {
      display: block;
    }
  `];let y=class extends u{set unhandledError(e){const{errorEl:t}=this;e?t.classList.add("show"):t.classList.remove("show")}connectedCallback(){super.connectedCallback(),this.scrollable=!0,this.modalSize="m",this.title="Create a New Team",this.submitButtonText="Create",this.content=r`
      <form @submit=${this.submit} validate>
        <input type="hidden" name="account-id" value=${this.accountId} />

        <label for="name"> Name </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          title="255 characters or fewer"
          autocomplete="off"
        />
      </form>
      <div class="error alert-danger">
        Something went wrong. Please try again.
      </div>
    `,this.addEventListener("sp-closed",this.onCloseHandler.bind(this))}submit(e){e&&(e.preventDefault(),e.stopPropagation());const{form:t}=this;if(!t.checkValidity())return void t.reportValidity();const a=new FormData(this.form),r={account_id:parseInt(a.get("account-id")),name:a.get("name")};this.createTeam(r)}clearErrors(){this.unhandledError=!1,this.form&&this.nameInput.setCustomValidity("")}clearInputValidityOnChange(e){const t=()=>{e.setCustomValidity(""),e.removeEventListener("input",t)};e.addEventListener("input",t)}createTeam(e){this.clearErrors(),p.teams.create(e).then((()=>{this.open=!1,this.onCreate()})).catch((e=>{var t;400!==(null===(t=e.response)||void 0===t?void 0:t.status)?this.unhandledError=!0:e.response.json().then((e=>{const{details:t}=e;let a=!0;t.endsWith("already exists for fields ('lower(name::text)', 'account_id')")&&(this.nameInput.setCustomValidity("A team with this name already exists."),this.nameInput.reportValidity(),this.clearInputValidityOnChange(this.nameInput),a=!1),this.unhandledError=a})).catch((()=>{this.unhandledError=!0}))}))}onCloseHandler(){var e;null===(e=this.form)||void 0===e||e.reset(),this.clearErrors()}};y.styles=f,t([a({type:Number})],y.prototype,"accountId",void 0),t([a()],y.prototype,"onCreate",void 0),t([c("form")],y.prototype,"form",void 0),t([c("form > input#name")],y.prototype,"nameInput",void 0),t([c("div.error")],y.prototype,"errorEl",void 0),y=t([s("arch-create-new-team-modal")],y);var g=[h,e`
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
  `];let v=class extends b{connectedCallback(){this.reset(),this.deselectButtonText="remove",this.headingLevel=0,this.selectCtaText="Add a user",this.valueGetter=e=>String(e.id),this.labelGetter=e=>e.username,super.connectedCallback()}willUpdate(e){e.has("teamMembers")&&this.reset()}reset(){const{accountUsers:e,teamMembers:t}=this;this.options=e.slice(),this.selectedOptions=t.slice()}};v.styles=g,t([a({type:Array})],v.prototype,"accountUsers",void 0),t([a({type:Array})],v.prototype,"teamMembers",void 0),v=t([s("arch-team-members-selector")],v);var T=[...u.styles,m,e`
    form > label {
      font-weight: normal;
      margin-top: 0.5rem;
      font-size: 0.95rem;
    }

    form > label:first-child {
      margin-top: 0;
    }

    form > label > em {
      display: block;
      font-size: 0.9em;
    }

    form > input,
    form > select {
      box-sizing: border-box;
      width: 100%;
    }

    form > label[for="send-email"],
    form > input#send-email {
      display: inline-block;
      width: auto;
    }

    select[name="user-role"]:disabled {
      cursor: not-allowed;
    }

    form > label[for="send-email"] {
      margin-left: 0.5em;
    }

    div.error {
      margin-top: 1rem;
      padding: 0.5rem 0.75rem;
      display: none;
    }

    div.error.show {
      display: block;
    }
  `];let w=class extends u{constructor(){super(),this.onUpdate=e=>null,this.accountUsers=[],p.users.list().then((e=>this.accountUsers=e.items))}set unhandledError(e){const{errorEl:t}=this;e?t.classList.add("show"):t.classList.remove("show")}set team(e){const{accountUsers:t}=this;this.content=void 0!==e?r`
      <form @submit=${this.submit} validate>
        <input type="hidden" name="id" value=${e.id} />

        <label for="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value=${e.name}
          autocomplete="off"
        />
      </form>
      <br />
      <label for="team-members-selector">Members</label>
      <br />
      <arch-team-members-selector
        .accountUsers=${t}
        .teamMembers=${e.members}
        id="team-members-selector"
      >
      </arch-team-members-selector>
      <div class="error alert-danger">
        Something went wrong. Please try again.
      </div>
    `:r``}connectedCallback(){super.connectedCallback(),this.scrollable=!0,this.modalSize="m",this.submitButtonText="Save",this.title="Edit Team",this.addEventListener("sp-closed",this.onCloseHandler.bind(this))}submit(e){e&&(e.preventDefault(),e.stopPropagation());const{form:t,membersSelector:a}=this;if(!t.checkValidity())return void t.reportValidity();const r=new FormData(this.form),s=parseInt(r.get("id")),o={name:r.get("name"),members:a.selectedOptions};this.updateTeam(s,o)}clearErrors(){this.unhandledError=!1,this.form&&this.nameInput.setCustomValidity("")}clearInputValidityOnChange(e){const t=()=>{e.setCustomValidity(""),e.removeEventListener("input",t)};e.addEventListener("input",t)}updateTeam(e,t){this.clearErrors(),p.teams.update(e,t).then((e=>{this.open=!1;try{this.onUpdate(e)}catch(e){console.error(e)}})).catch((e=>{var t;400!==(null===(t=e.response)||void 0===t?void 0:t.status)?this.unhandledError=!0:e.response.json().then((e=>{const{details:t}=e;t.endsWith("already exists for fields ('lower(name::text)', 'account_id')")?(this.nameInput.setCustomValidity("A team with this name already exists."),this.nameInput.reportValidity(),this.clearInputValidityOnChange(this.nameInput)):this.unhandledError=!0})).catch((()=>this.unhandledError=!0))}))}onCloseHandler(){var e;null===(e=this.form)||void 0===e||e.reset(),this.membersSelector.reset(),this.clearErrors()}};w.styles=T,t([a()],w.prototype,"onUpdate",void 0),t([c("form")],w.prototype,"form",void 0),t([c("form > input#name")],w.prototype,"nameInput",void 0),t([c("div.error")],w.prototype,"errorEl",void 0),t([c("arch-team-members-selector")],w.prototype,"membersSelector",void 0),t([o()],w.prototype,"accountUsers",void 0),w=t([s("arch-edit-team-modal")],w);var E=[e`
    data-table > table {
      table-layout: fixed;
    }

    data-table > table > thead > tr > th,
    data-table > table > tbody > tr > td {
      white-space: nowrap;
      max-width: none;
    }

    data-table > table > thead > tr > th.date-created {
      width: 8em;
    }

    data-table > table > thead > tr > th.last-login {
      width: 8em;
    }

    data-table > table > thead > tr > th.role {
      width: 5em;
    }
  `];let C=class extends d{willUpdate(e){super.willUpdate(e),this.actionButtonDisabled=[!1,!1];const t=this.userIsStaff||this.userRole===i.ADMIN;t&&(this.actionButtonLabels=["Edit Team"],this.actionButtonSignals=[l.DISPLAY_EDIT_TEAM_MODAL]),this.apiCollectionEndpoint="/teams",this.apiStaticParamPairs=[],this.cellRenderers=[void 0,e=>e.username],this.columns=["name","members"],this.columnHeaders=["Name","Members"],this.pageLength=50,this.persistSearchStateInUrl=!0,this.pluralName="Account Teams",this.rowClickEnabled=!0,this.searchColumns=["name","members"],this.searchColumnLabels=this.searchColumns.map(n),this.selectable=t,this.singleName="Account Team",this.sort="-id",this.sortableColumns=[!0],t&&(this.nonSelectionActions=[l.DISPLAY_CREATE_TEAM_MODAL],this.nonSelectionActionLabels=["Create New Team"])}_createHiddenModalTriggerButton(){const e=document.createElement("button");return e.setAttribute("slot","trigger"),e.style.display="none",e}render(){const e=new y;return e.accountId=this.accountId,e.onCreate=()=>{this.dataTable.throttledDoSearch()},this.createNewTeamModalTrigger=this._createHiddenModalTriggerButton(),e.appendChild(this.createNewTeamModalTrigger),this.editTeamModal=new w,this.editTeamModal.onUpdate=()=>{this.dataTable.throttledDoSearch()},this.editTeamModalTrigger=this._createHiddenModalTriggerButton(),this.editTeamModal.appendChild(this.editTeamModalTrigger),[super.render(),e,this.editTeamModal]}showEditTeamModal(e){this.editTeamModal.team=e,this.editTeamModalTrigger.click()}selectionActionHandler(e,t){if(e===l.DISPLAY_EDIT_TEAM_MODAL)this.showEditTeamModal(t[0])}nonSelectionActionHandler(e){if(e===l.DISPLAY_CREATE_TEAM_MODAL)this.createNewTeamModalTrigger.click()}postSelectionChangeHandler(e){const{dataTable:t}=this,{props:a}=t,r=e.length,s=1===r;a.actionButtonDisabled=[!s],t.setSelectionActionButtonDisabledState(0===r)}};C.styles=[...d.styles,...E],t([a({type:Number})],C.prototype,"accountId",void 0),t([a({type:Number})],C.prototype,"userId",void 0),t([a({type:Boolean})],C.prototype,"userIsStaff",void 0),t([a({type:String})],C.prototype,"userRole",void 0),t([o()],C.prototype,"createNewTeamModalTrigger",void 0),t([o()],C.prototype,"editTeamModal",void 0),t([o()],C.prototype,"editTeamModalTrigger",void 0),C=t([s("arch-team-table")],C);export{C as ArchTeamTable};
//# sourceMappingURL=arch-team-table.js.map
