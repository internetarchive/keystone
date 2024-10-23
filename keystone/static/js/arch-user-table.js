import{i as e,_ as t,e as a,y as s,a as r}from"./chunk-lit-element.js";import{t as i}from"./chunk-state.js";import{U as o}from"./chunk-helpers.js";import{i as n,t as l}from"./chunk-helpers2.js";import{c as d}from"./chunk-domLib.js";import{T as m}from"./chunk-pubsub.js";import{A as c}from"./chunk-arch-data-table.js";import{B as u,i as h}from"./chunk-styles.js";import{A as p}from"./chunk-ArchAPI.js";import{ArchEditUserModal as b}from"./arch-edit-user-modal.js";import{A as f}from"./chunk-arch-modal.js";import"./arch-loading-indicator.js";import"./arch-hover-tooltip.js";import"./chunk-scale-large.js";import"./chunk-sp-overlay.js";import"./chunk-arch-select-adder.js";import"./chunk-sizedMixin.js";var y=[...f.styles,u,e`
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
  `];let g=class extends f{constructor(){super(),this.accountTeams=[],p.teams.list().then((e=>{this.accountTeams=e.items,this.renderContent()}))}set unhandledError(e){const{errorEl:t}=this;e?t.classList.add("show"):t.classList.remove("show")}connectedCallback(){super.connectedCallback(),this.scrollable=!0,this.modalSize="m",this.title="Create a New User",this.submitButtonText="Create",this.renderContent(),this.addEventListener("sp-closed",this.onCloseHandler.bind(this))}renderContent(){this.content=s`
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
          ${Object.entries(o).map((([e,t])=>s`
              <option value="${t}" ?selected=${"USER"===e}>${e}</option>
            `))}
        </select>

        <label for="user-teams-selector">Teams</label>
        <arch-user-teams-selector
          .accountTeams=${this.accountTeams}
          .userTeams=${[]}
          id="user-teams-selector"
        >
        </arch-user-teams-selector>

        <br />
        <input type="checkbox" id="send-email" name="send-email" checked />
        <label for="send-email">Send welcome email</label>
      </form>

      <div class="error alert-danger">
        Something went wrong. Please try again.
      </div>
    `}submit(){const{form:e,teamsSelector:t}=this;if(!e.checkValidity())return void e.reportValidity();const a=new FormData(this.form),s={account_id:parseInt(a.get("account-id")),email:a.get("user-email"),first_name:a.get("first-name"),last_name:a.get("last-name"),role:a.get("user-role"),username:a.get("user-name"),teams:t.selectedOptions.map((e=>({id:e.id,name:e.name})))};this.createUser(s,a.has("send-email"))}clearErrors(){this.unhandledError=!1,this.form&&(this.usernameInput.setCustomValidity(""),this.emailInput.setCustomValidity(""))}clearInputValidityOnChange(e){const t=()=>{e.setCustomValidity(""),e.removeEventListener("input",t)};e.addEventListener("input",t)}createUser(e,t){this.clearErrors(),p.users.create(e,t).then((()=>{this.open=!1,this.onCreate()})).catch((e=>{var t;400!==(null===(t=e.response)||void 0===t?void 0:t.status)?this.unhandledError=!0:e.response.json().then((e=>{const{details:t}=e;let a=!0;t.endsWith("already exists for field (username)")&&(this.usernameInput.setCustomValidity("A user with this Username already exists."),this.usernameInput.reportValidity(),this.clearInputValidityOnChange(this.usernameInput),a=!1),t.endsWith("already exists for field (email)")&&(this.emailInput.setCustomValidity("A user with this Email already exists."),this.emailInput.reportValidity(),this.clearInputValidityOnChange(this.emailInput),a=!1),"account max users limit reached"===t&&(this.usernameInput.setCustomValidity("Your account has reached its maximum number of allowed users"),this.usernameInput.reportValidity(),this.clearInputValidityOnChange(this.usernameInput),a=!1),this.unhandledError=a})).catch((()=>{this.unhandledError=!0}))}))}onCloseHandler(){var e;null===(e=this.form)||void 0===e||e.reset(),this.teamsSelector.reset(),this.clearErrors()}};g.styles=y,t([a({type:Number})],g.prototype,"accountId",void 0),t([a()],g.prototype,"onCreate",void 0),t([h("form")],g.prototype,"form",void 0),t([h("form > input#user-name")],g.prototype,"usernameInput",void 0),t([h("form > input#user-email")],g.prototype,"emailInput",void 0),t([h("div.error")],g.prototype,"errorEl",void 0),t([h("arch-user-teams-selector")],g.prototype,"teamsSelector",void 0),t([i()],g.prototype,"accountTeams",void 0),g=t([r("arch-create-new-user-modal")],g);var v=[e`
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
  `];let U=class extends c{constructor(){super(...arguments),this.accountMaxUsersReached=!1}willUpdate(e){super.willUpdate(e),this.actionButtonDisabled=[!1,!1];const t=this.userIsStaff||this.userRole===o.ADMIN;t&&(this.actionButtonLabels=["Edit User"],this.actionButtonSignals=[m.DISPLAY_EDIT_USER_MODAL]),this.apiCollectionEndpoint="/users",this.apiStaticParamPairs=[],this.cellRenderers=[void 0,(e,t)=>{const a=`${e} ${t.last_name}`;return d("span",{title:a,textContent:a})},void 0,e=>e?n(e):"",e=>e?n(e):"",e=>Object.keys(o)[Object.values(o).indexOf(e)]],this.columns=["username","first_name","email","date_joined","last_login","role"],this.columnHeaders=["Username","Full Name","Email","Date Created","Last Login","Role"],this.filterableColumns=[!1,!1,!1,!1,!1,!0],this.pageLength=50,this.persistSearchStateInUrl=!0,this.pluralName="Account Users",this.rowClickEnabled=!0,this.searchColumns=["username","first_name","last_name","email"],this.searchColumnLabels=this.searchColumns.map(l),this.selectable=t,this.singleName="Account User",this.sort="username,role",this.sortableColumns=[!0,!0,!0,!0,!0,!0],t&&(this.nonSelectionActions=[m.DISPLAY_CREATE_USER_MODAL],this.nonSelectionActionLabels=["Create New User"])}_createHiddenModalTriggerButton(){const e=document.createElement("button");return e.setAttribute("slot","trigger"),e.style.display="none",e}render(){const e=new g;return e.accountId=this.accountId,e.onCreate=()=>{this.dataTable.throttledDoSearch()},this.createNewUserModalTrigger=this._createHiddenModalTriggerButton(),e.appendChild(this.createNewUserModalTrigger),this.editUserModal=new b,this.editUserModal.userId=this.userId,this.editUserModal.onUpdate=()=>{this.dataTable.throttledDoSearch()},this.editUserModalTrigger=this._createHiddenModalTriggerButton(),this.editUserModal.appendChild(this.editUserModalTrigger),[super.render(),e,this.editUserModal]}updated(e){if(super.updated(e),this.accountMaxUsersReached){const e=this.dataTable.querySelector("div.non-selection-buttons button");e.disabled=!0,e.title="Your account has reached its maximum number of allowed users. Please contact your account administrator."}}showEditUserModal(e){this.editUserModal.user=e,this.editUserModalTrigger.click()}selectionActionHandler(e,t){if(e===m.DISPLAY_EDIT_USER_MODAL)this.showEditUserModal(t[0])}nonSelectionActionHandler(e){if(e===m.DISPLAY_CREATE_USER_MODAL)this.createNewUserModalTrigger.click()}postSelectionChangeHandler(e){const{dataTable:t}=this,{props:a}=t,s=e.length,r=1===s;a.actionButtonDisabled=[!r],t.setSelectionActionButtonDisabledState(0===s)}};U.styles=[...c.styles,...v],t([a({type:Number})],U.prototype,"accountId",void 0),t([a({type:Number})],U.prototype,"userId",void 0),t([a({type:Boolean})],U.prototype,"userIsStaff",void 0),t([a({type:String})],U.prototype,"userRole",void 0),t([a({type:Boolean})],U.prototype,"accountMaxUsersReached",void 0),t([i()],U.prototype,"createNewUserModalTrigger",void 0),t([i()],U.prototype,"editUserModal",void 0),t([i()],U.prototype,"editUserModalTrigger",void 0),U=t([r("arch-user-table")],U);export{U as ArchUserTable};
//# sourceMappingURL=arch-user-table.js.map
