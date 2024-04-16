import{i as e,_ as t,e as r,y as s,a as i}from"./chunk-lit-element.js";import{B as a,i as o}from"./chunk-styles.js";import{A as n}from"./chunk-ArchAPI.js";import{U as l}from"./chunk-types.js";import{A as d}from"./chunk-arch-modal.js";import"./chunk-scale-large.js";import"./chunk-state.js";import"./chunk-sizedMixin.js";import"./chunk-query-assigned-elements.js";var m=[...d.styles,a,e`
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
  `];let u=class extends d{constructor(){super(...arguments),this.profileMode=!1,this.onUpdate=e=>null}set unhandledError(e){const{errorEl:t}=this;e?t.classList.add("show"):t.classList.remove("show")}set user(e){const{profileMode:t,userId:r}=this;if(void 0===e)return void(this.content=s``);const i=e.id===r;this.content=s`
      <form validate>
        <input type="hidden" name="id" value=${e.id} />

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
          value=${e.username}
        />

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

        ${t?s``:s`
              <label for="user-role">Role</label>
              <select
                id="user-role"
                name="user-role"
                required
                ?disabled=${i}
                title=${i?"Your role can only be changed by another Admin":"Select user role"}
              >
                ${Object.entries(l).map((([t,r])=>s`
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
    `}connectedCallback(){super.connectedCallback();const{profileMode:e}=this;this.scrollable=!0,this.modalSize="m",this.submitButtonText="Save",this.title=e?"Edit Profile":"Edit User",this.addEventListener("sp-opened",this.onOpenHandler.bind(this)),this.addEventListener("sp-closed",this.onCloseHandler.bind(this))}submit(){const{form:e}=this;if(!e.checkValidity())return void e.reportValidity();const t=new FormData(this.form),r={id:parseInt(t.get("id")),email:t.get("user-email"),first_name:t.get("first-name"),last_name:t.get("last-name"),role:t.get("user-role"),username:t.get("user-name")};this.updateUser(r)}clearErrors(){this.unhandledError=!1,this.form&&(this.usernameInput.setCustomValidity(""),this.emailInput.setCustomValidity(""))}clearInputValidityOnChange(e){const t=()=>{e.setCustomValidity(""),e.removeEventListener("input",t)};e.addEventListener("input",t)}updateUser(e){this.clearErrors(),n.users.update(e).then((e=>{this.open=!1;try{this.onUpdate(e)}catch(e){console.error(e)}})).catch((e=>{var t;let r=!0;400===(null===(t=e.response)||void 0===t?void 0:t.status)&&e.response.json().then((e=>{const{details:t}=e;t.endsWith("already exists for field (username)")&&(this.usernameInput.setCustomValidity("A user with this Username already exists."),this.usernameInput.reportValidity(),this.clearInputValidityOnChange(this.usernameInput),r=!1),t.endsWith("already exists for field (email)")&&(this.emailInput.setCustomValidity("A user with this Email already exists."),this.emailInput.reportValidity(),this.clearInputValidityOnChange(this.emailInput),r=!1)})).catch((()=>null)),this.unhandledError=r}))}onOpenHandler(){const{profileMode:e,userId:t}=this;e&&n.users.get(t).then((e=>this.user=e))}onCloseHandler(){var e;const{profileMode:t}=this;null===(e=this.form)||void 0===e||e.reset(),this.clearErrors(),t&&(this.user=void 0)}};u.styles=m,t([r({type:Number})],u.prototype,"userId",void 0),t([r({type:Boolean})],u.prototype,"profileMode",void 0),t([r()],u.prototype,"onUpdate",void 0),t([o("form")],u.prototype,"form",void 0),t([o("form > input#user-name")],u.prototype,"usernameInput",void 0),t([o("form > input#user-email")],u.prototype,"emailInput",void 0),t([o("div.error")],u.prototype,"errorEl",void 0),u=t([i("arch-edit-user-modal")],u);export{u as ArchEditUserModal};
//# sourceMappingURL=arch-edit-user-modal.js.map
