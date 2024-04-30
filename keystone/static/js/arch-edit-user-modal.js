import{i as e,_ as t,e as r,y as i,a as s}from"./chunk-lit-element.js";import{B as o,i as a}from"./chunk-styles.js";import{A as l}from"./chunk-ArchAPI.js";import{e as n}from"./chunk-helpers.js";import{A as d}from"./chunk-arch-modal.js";import"./chunk-scale-large.js";import"./chunk-state.js";import"./chunk-sizedMixin.js";var m=[...d.styles,o,e`
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
  `];let p=class extends d{constructor(){super(...arguments),this.profileMode=!1,this.onUpdate=e=>null}set unhandledError(e){const{errorEl:t}=this;e?t.classList.add("show"):t.classList.remove("show")}set user(e){const{profileMode:t,userId:r}=this;if(void 0===e)return void(this.content=i``);const s=e.id===r;this.content=i`
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

        ${t?i``:i`
              <label for="user-role">Role</label>
              <select
                id="user-role"
                name="user-role"
                required
                ?disabled=${s}
                title=${s?"Your role can only be changed by another Admin":"Select user role"}
              >
                ${Object.entries(n).map((([t,r])=>i`
                    <option value="${r}" ?selected=${t===e.role}>
                      ${t}
                    </option>
                  `))}
              </select>
            `}
      </form>
      <div class="error alert-danger">
        Something went wrong. Please try again.
      </div>
    `}connectedCallback(){super.connectedCallback();const{profileMode:e}=this;this.scrollable=!0,this.modalSize="m",this.submitButtonText="Save",this.title=e?"Edit Profile":"Edit User",this.addEventListener("sp-opened",this.onOpenHandler.bind(this)),this.addEventListener("sp-closed",this.onCloseHandler.bind(this))}submit(){const{form:e}=this;if(!e.checkValidity())return void e.reportValidity();const t=new FormData(this.form),r=parseInt(t.get("id")),i={email:t.get("user-email"),first_name:t.get("first-name"),last_name:t.get("last-name"),role:t.get("user-role")};this.updateUser(r,i)}clearErrors(){this.unhandledError=!1,this.form&&this.emailInput.setCustomValidity("")}clearInputValidityOnChange(e){const t=()=>{e.setCustomValidity(""),e.removeEventListener("input",t)};e.addEventListener("input",t)}updateUser(e,t){this.clearErrors(),l.users.update(e,t).then((e=>{this.open=!1;try{this.onUpdate(e)}catch(e){console.error(e)}})).catch((e=>{var t;400!==(null===(t=e.response)||void 0===t?void 0:t.status)?this.unhandledError=!0:e.response.json().then((e=>{const{details:t}=e;t.endsWith("already exists for field (email)")?(this.emailInput.setCustomValidity("A user with this Email already exists."),this.emailInput.reportValidity(),this.clearInputValidityOnChange(this.emailInput)):this.unhandledError=!0})).catch((()=>this.unhandledError=!0))}))}onOpenHandler(){const{profileMode:e,userId:t}=this;e&&l.users.get(t).then((e=>this.user=e))}onCloseHandler(){var e;const{profileMode:t}=this;null===(e=this.form)||void 0===e||e.reset(),this.clearErrors(),t&&(this.user=void 0)}};p.styles=m,t([r({type:Number})],p.prototype,"userId",void 0),t([r({type:Boolean})],p.prototype,"profileMode",void 0),t([r()],p.prototype,"onUpdate",void 0),t([a("form")],p.prototype,"form",void 0),t([a("form > input#user-email")],p.prototype,"emailInput",void 0),t([a("div.error")],p.prototype,"errorEl",void 0),p=t([s("arch-edit-user-modal")],p);export{p as ArchEditUserModal};
//# sourceMappingURL=arch-edit-user-modal.js.map
