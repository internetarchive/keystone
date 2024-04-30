import{i as e,_ as t,e as r,y as a,a as s}from"./chunk-lit-element.js";import{t as i}from"./chunk-state.js";import{e as o}from"./chunk-helpers.js";import{i as l,t as n}from"./chunk-helpers2.js";import{T as d}from"./chunk-pubsub.js";import{A as m}from"./chunk-arch-data-table.js";import{B as h,i as c}from"./chunk-styles.js";import{A as u}from"./chunk-ArchAPI.js";import{A as p}from"./chunk-arch-modal.js";import{ArchEditUserModal as b}from"./arch-edit-user-modal.js";import"./chunk-arch-loading-indicator.js";import"./arch-hover-tooltip.js";import"./chunk-scale-large.js";import"./chunk-sp-overlay.js";import"./chunk-sizedMixin.js";var f=[...p.styles,h,e`
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
  `];let g=class extends p{set unhandledError(e){const{errorEl:t}=this;e?t.classList.add("show"):t.classList.remove("show")}connectedCallback(){super.connectedCallback(),this.scrollable=!0,this.modalSize="m",this.title="Create a New User",this.submitButtonText="Create",this.content=a`
      <form validate>
        <input type="hidden" name="account-id" value=${this.accountId} />

        <label for="user-name">
          Username
          <em>
            150 characters or fewer. Letters, digits and &quot;@/./+/-/_&quot;
            only
          </em>
        </label>
        <input
          id="user-name"
          name="user-name"
          type="text"
          pattern="[a-zA-Z0-9@.+-_]+"
          required
          title='150 characters or fewer. Letters, digits and "@/./+/-/_" only'
        />

        <label for="first-name">First Name</label>
        <input id="first-name" name="first-name" type="text" />

        <label for="last-name">Last Name</label>
        <input id="last-name" name="last-name" type="text" />

        <label for="user-email">Email</label>
        <input id="user-email" name="user-email" type="email" required />

        <label for="user-role">Role</label>
        <select id="user-role" name="user-role" required>
          ${Object.entries(o).map((([e,t])=>a`
              <option value="${t}" ?selected=${"USER"===e}>${e}</option>
            `))}
        </select>
        <input type="checkbox" id="send-email" name="send-email" checked />
        <label for="send-email">Send welcome email</label>
      </form>
      <div class="error alert-danger">
        Something went wrong. Please try again.
      </div>
    `,this.addEventListener("sp-closed",this.onCloseHandler.bind(this))}submit(){const{form:e}=this;if(!e.checkValidity())return void e.reportValidity();const t=new FormData(this.form),r={account_id:parseInt(t.get("account-id")),email:t.get("user-email"),first_name:t.get("first-name"),last_name:t.get("last-name"),role:t.get("user-role"),username:t.get("user-name")};this.createUser(r,t.has("send-email"))}clearErrors(){this.unhandledError=!1,this.form&&(this.usernameInput.setCustomValidity(""),this.emailInput.setCustomValidity(""))}clearInputValidityOnChange(e){const t=()=>{e.setCustomValidity(""),e.removeEventListener("input",t)};e.addEventListener("input",t)}createUser(e,t){this.clearErrors(),u.users.create(e,t).then((()=>{this.open=!1,this.onCreate()})).catch((e=>{var t;400!==(null===(t=e.response)||void 0===t?void 0:t.status)?this.unhandledError=!0:e.response.json().then((e=>{const{details:t}=e;let r=!0;t.endsWith("already exists for field (username)")&&(this.usernameInput.setCustomValidity("A user with this Username already exists."),this.usernameInput.reportValidity(),this.clearInputValidityOnChange(this.usernameInput),r=!1),t.endsWith("already exists for field (email)")&&(this.emailInput.setCustomValidity("A user with this Email already exists."),this.emailInput.reportValidity(),this.clearInputValidityOnChange(this.emailInput),r=!1),this.unhandledError=r})).catch((()=>{this.unhandledError=!0}))}))}onCloseHandler(){var e;null===(e=this.form)||void 0===e||e.reset(),this.clearErrors()}};g.styles=f,t([r({type:Number})],g.prototype,"accountId",void 0),t([r()],g.prototype,"onCreate",void 0),t([c("form")],g.prototype,"form",void 0),t([c("form > input#user-name")],g.prototype,"usernameInput",void 0),t([c("form > input#user-email")],g.prototype,"emailInput",void 0),t([c("div.error")],g.prototype,"errorEl",void 0),g=t([s("arch-create-new-user-modal")],g);var y=[e`
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
  `];let v=class extends m{willUpdate(e){super.willUpdate(e),this.actionButtonDisabled=[!1,!1];const t=this.userIsStaff||this.userRole===o.ADMIN;t&&(this.actionButtonLabels=["Edit User"],this.actionButtonSignals=[d.DISPLAY_EDIT_USER_MODAL]),this.apiCollectionEndpoint="/users",this.apiStaticParamPairs=[],this.cellRenderers=[void 0,(e,t)=>{const r=`${e} ${t.last_name}`;return`<span title="${r}">${r}</span>`},void 0,e=>e?l(e):"",e=>e?l(e):"",e=>Object.keys(o)[Object.values(o).indexOf(e)]],this.columns=["username","first_name","email","date_joined","last_login","role"],this.columnHeaders=["Username","Full Name","Email","Date Created","Last Login","Role"],this.filterableColumns=[!1,!1,!1,!1,!1,!0],this.pageLength=50,this.persistSearchStateInUrl=!1,this.pluralName="Account Users",this.rowClickEnabled=!0,this.searchColumns=["username","first_name","last_name","email"],this.searchColumnLabels=this.searchColumns.map(n),this.selectable=t,this.singleName="Account User",this.sort="username,role",this.sortableColumns=[!0,!0,!0,!0,!0,!0],t&&(this.nonSelectionActions=[d.DISPLAY_CREATE_USER_MODAL],this.nonSelectionActionLabels=["Create New User"])}_createHiddenModalTriggerButton(){const e=document.createElement("button");return e.setAttribute("slot","trigger"),e.style.display="none",e}render(){const e=new g;return e.accountId=this.accountId,e.onCreate=()=>{this.dataTable.throttledDoSearch()},this.createNewUserModalTrigger=this._createHiddenModalTriggerButton(),e.appendChild(this.createNewUserModalTrigger),this.editUserModal=new b,this.editUserModal.userId=this.userId,this.editUserModal.onUpdate=()=>{this.dataTable.throttledDoSearch()},this.editUserModalTrigger=this._createHiddenModalTriggerButton(),this.editUserModal.appendChild(this.editUserModalTrigger),[super.render(),e,this.editUserModal]}showEditUserModal(e){this.editUserModal.user=e,this.editUserModalTrigger.click()}selectionActionHandler(e,t){if(e===d.DISPLAY_EDIT_USER_MODAL)this.showEditUserModal(t[0])}nonSelectionActionHandler(e){if(e===d.DISPLAY_CREATE_USER_MODAL)this.createNewUserModalTrigger.click()}postSelectionChangeHandler(e){const{dataTable:t}=this,{props:r}=t,a=e.length,s=1===a;r.actionButtonDisabled=[!s],t.setSelectionActionButtonDisabledState(0===a)}};v.styles=[...m.styles,...y],t([r({type:Number})],v.prototype,"accountId",void 0),t([r({type:Number})],v.prototype,"userId",void 0),t([r({type:Boolean})],v.prototype,"userIsStaff",void 0),t([r({type:String})],v.prototype,"userRole",void 0),t([i()],v.prototype,"createNewUserModalTrigger",void 0),t([i()],v.prototype,"editUserModal",void 0),t([i()],v.prototype,"editUserModalTrigger",void 0),v=t([s("arch-user-table")],v);export{v as ArchUserTable};
//# sourceMappingURL=arch-user-table.js.map
