import{i as e,_ as t,e as s,y as r,a}from"./chunk-lit-element.js";import{t as o}from"./chunk-state.js";import{g as i,B as l,i as n}from"./chunk-styles.js";import{A as d}from"./chunk-ArchAPI.js";import{a as m,U as c}from"./chunk-helpers.js";import{A as h}from"./chunk-arch-select-adder.js";import{A as u}from"./chunk-arch-modal.js";import"./chunk-scale-large.js";import"./chunk-sizedMixin.js";var p=[i,e`
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
  `];let f=class extends h{connectedCallback(){const{readOnly:e}=this;this.reset(),this.deselectButtonText="remove",this.emptyOptionsPlaceholder=r`
      <em
        >Your account doesn’t have any teams yet.
        <a href="${m.teams}">Manage your teams here.</a></em
      >
    `,this.headingLevel=0,this.readOnlyMessage=e?r`<em>Contact an account admin to modify your teams.</em>`:void 0,this.selectCtaText="Add a team",this.valueGetter=e=>String(e.id),this.labelGetter=e=>e.name,super.connectedCallback()}willUpdate(e){e.has("userTeams")&&this.reset()}reset(){const{accountTeams:e,userTeams:t}=this;this.options=e.slice(),this.selectedOptions=t.slice()}};f.styles=p,t([s({type:Array})],f.prototype,"accountTeams",void 0),t([s({type:Array})],f.prototype,"userTeams",void 0),t([s({type:Boolean})],f.prototype,"readOnly",void 0),f=t([a("arch-user-teams-selector")],f);var y=[...u.styles,l,e`
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
  `];let v=class extends u{constructor(){super(),this.profileMode=!1,this.onUpdate=e=>null,this.accountTeams=[],d.teams.list().then((e=>this.accountTeams=e.items))}set unhandledError(e){const{errorEl:t}=this;e?t.classList.add("show"):t.classList.remove("show")}set user(e){const{accountTeams:t,profileMode:s,userId:a}=this;if(void 0===e)return void(this.content=r``);const o=e.id===a,i=e.role===c.ADMIN;this.content=r`
      <form validate>
        <input type="hidden" name="id" value=${e.id} />

        <label for="first-name">First Name</label>
        <input
          id="first-name"
          name="first-name"
          type="text"
          value=${e.first_name}
        />

        <label for="last-name">Last Name</label>
        <input
          id="last-name"
          name="last-name"
          type="text"
          value=${e.last_name}
        />

        <label for="user-email">Email</label>
        <input
          id="user-email"
          name="user-email"
          type="email"
          required
          value=${e.email}
        />

        ${s?r``:r`
              <label for="user-role">Role</label>
              <select
                id="user-role"
                name="user-role"
                required
                ?disabled=${o}
                title=${o?"Your role can only be changed by another Admin":"Select user role"}
              >
                ${Object.entries(c).map((([t,s])=>r`
                    <option value="${s}" ?selected=${t===e.role}>
                      ${t}
                    </option>
                  `))}
              </select>
            `}
        ${0===t.length&&s&&!i?r``:r`
              <label for="user-teams-selector">Teams</label>
              <arch-user-teams-selector
                .accountTeams=${t}
                .userTeams=${e.teams}
                .readOnly=${!!s&&e.role!==c.ADMIN}
                id="user-teams-selector"
              >
              </arch-user-teams-selector>
            `}
      </form>
      <div class="error alert-danger">
        Something went wrong. Please try again.
      </div>
    `}connectedCallback(){super.connectedCallback();const{profileMode:e}=this;this.scrollable=!0,this.modalSize="m",this.submitButtonText="Save",this.title=e?"Edit Profile":"Edit User",this.addEventListener("sp-opened",this.onOpenHandler.bind(this)),this.addEventListener("sp-closed",this.onCloseHandler.bind(this))}submit(){const{form:e,teamsSelector:t}=this;if(!e.checkValidity())return void e.reportValidity();const s=new FormData(this.form),r=parseInt(s.get("id")),a={email:s.get("user-email"),first_name:s.get("first-name"),last_name:s.get("last-name"),role:s.get("user-role"),teams:t.selectedOptions};this.updateUser(r,a)}clearErrors(){this.unhandledError=!1,this.form&&this.emailInput.setCustomValidity("")}clearInputValidityOnChange(e){const t=()=>{e.setCustomValidity(""),e.removeEventListener("input",t)};e.addEventListener("input",t)}updateUser(e,t){this.clearErrors(),d.users.update(e,t).then((e=>{this.open=!1;try{this.onUpdate(e)}catch(e){console.error(e)}})).catch((e=>{var t;400!==(null===(t=e.response)||void 0===t?void 0:t.status)?this.unhandledError=!0:e.response.json().then((e=>{const{details:t}=e;t.endsWith("already exists for field (email)")?(this.emailInput.setCustomValidity("A user with this Email already exists."),this.emailInput.reportValidity(),this.clearInputValidityOnChange(this.emailInput)):this.unhandledError=!0})).catch((()=>this.unhandledError=!0))}))}onOpenHandler(){const{profileMode:e,userId:t}=this;e&&d.users.get(t).then((e=>this.user=e))}onCloseHandler(){var e;const{profileMode:t}=this;null===(e=this.form)||void 0===e||e.reset(),this.teamsSelector.reset(),this.clearErrors(),t&&(this.user=void 0)}};v.styles=y,t([s({type:Number})],v.prototype,"userId",void 0),t([s({type:Boolean})],v.prototype,"profileMode",void 0),t([s()],v.prototype,"onUpdate",void 0),t([n("form")],v.prototype,"form",void 0),t([n("form > input#user-email")],v.prototype,"emailInput",void 0),t([n("div.error")],v.prototype,"errorEl",void 0),t([n("arch-user-teams-selector")],v.prototype,"teamsSelector",void 0),t([o()],v.prototype,"accountTeams",void 0),v=t([a("arch-edit-user-modal")],v);export{v as ArchEditUserModal};
//# sourceMappingURL=arch-edit-user-modal.js.map
