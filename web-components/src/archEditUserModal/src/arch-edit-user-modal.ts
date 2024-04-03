import { html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import ArchAPI from "../../lib/ArchAPI";
import { ResponseError, User, UserRoles } from "../../lib/types";

import { ArchModal } from "../../archModal/index";

import styles from "./styles";

@customElement("arch-edit-user-modal")
export class ArchEditUserModal extends ArchModal {
  @property({ type: Number }) userId!: User["id"];
  @property({ type: Boolean }) profileMode = false;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @property() onUpdate: (user: User) => void = (user) => null;

  @query("form") form!: HTMLFormElement;
  @query("form > input#user-name") usernameInput!: HTMLInputElement;
  @query("form > input#user-email") emailInput!: HTMLInputElement;
  @query("div.error") errorEl!: HTMLElement;

  private set unhandledError(showError: boolean) {
    const { errorEl } = this;
    if (showError) {
      errorEl.classList.add("show");
    } else {
      errorEl.classList.remove("show");
    }
  }

  static styles = styles;

  set user(user: undefined | User) {
    const { profileMode, userId } = this;
    // Clear the content if user has been set to undefined.
    if (user === undefined) {
      this.content = html``;
      return;
    }
    const userIsSelf = user.id === userId;
    this.content = html`
      <form validate>
        <input type="hidden" name="id" value=${user.id} />

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
          value=${user.username}
        />

        <label for="first-name">First Name</label>
        <input
          id="first-name"
          name="first-name"
          type="text"
          value=${user.first_name}
        />

        <label for="last-name">Last Name</label>
        <input
          id="last-name"
          name="last-name"
          type="text"
          value=${user.last_name}
        />

        <label for="user-email">Email</label>
        <input
          id="user-email"
          name="user-email"
          type="email"
          required
          value=${user.email}
        />

        ${profileMode
          ? html``
          : html`
              <label for="user-role">Role</label>
              <select
                id="user-role"
                name="user-role"
                required
                ?disabled=${userIsSelf}
                title=${userIsSelf
                  ? "Your role can only be changed by another Admin"
                  : "Select user role"}
              >
                ${Object.entries(UserRoles).map(
                  ([k, v]) => html`
                    <option value="${v}" ?selected=${k === user.role}>
                      ${k}
                    </option>
                  `
                )}
              </select>
            `}
      </form>
      <div class="error alert-danger">
        Something went wrong. Please try again.
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    const { profileMode } = this;
    this.scrollable = true;
    this.modalSize = "m";
    this.submitButtonText = "Save";
    this.title = profileMode ? "Edit Profile" : "Edit User";
    this.addEventListener("sp-opened", this.onOpenHandler.bind(this));
    this.addEventListener("sp-closed", this.onCloseHandler.bind(this));
  }

  submit() {
    const { form } = this;

    // Validate the form and show any errors.
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(this.form);
    const data: Partial<User> = {
      id: parseInt(formData.get("id") as string),
      email: formData.get("user-email") as string,
      first_name: formData.get("first-name") as string,
      last_name: formData.get("last-name") as string,
      role: formData.get("user-role") as User["role"],
      username: formData.get("user-name") as string,
    };
    this.updateUser(data);
  }

  private clearErrors() {
    this.unhandledError = false;
    if (this.form) {
      this.usernameInput.setCustomValidity("");
      this.emailInput.setCustomValidity("");
    }
  }

  private clearInputValidityOnChange(inputEl: HTMLInputElement) {
    /* Clear the custom validity error message for the specified input
     element on the first "input" event using a one-shot handler. */
    const handler = () => {
      inputEl.setCustomValidity("");
      inputEl.removeEventListener("input", handler);
    };
    inputEl.addEventListener("input", handler);
  }

  private updateUser(data: Partial<User>) {
    this.clearErrors();
    ArchAPI.users
      .update(data as User)
      .then((user: User) => {
        this.open = false;
        // Invoke any registered onUpdate handler and catch/log any error
        // to prevent triggering display of the modal error element.
        try {
          this.onUpdate(user);
        } catch (e) {
          console.error(e);
        }
      })
      .catch((error: ResponseError) => {
        let unhandledError = true;
        if (error.response?.status === 400) {
          error.response
            .json()
            .then((data: { details: string }) => {
              const { details } = data;
              // Maybe handle a duplicate username error.
              if (details.endsWith("already exists for field (username)")) {
                this.usernameInput.setCustomValidity(
                  "A user with this Username already exists."
                );
                this.usernameInput.reportValidity();
                this.clearInputValidityOnChange(this.usernameInput);
                unhandledError = false;
              }

              // Maybe handle a duplicate email error.
              if (details.endsWith("already exists for field (email)")) {
                this.emailInput.setCustomValidity(
                  "A user with this Email already exists."
                );
                this.emailInput.reportValidity();
                this.clearInputValidityOnChange(this.emailInput);
                unhandledError = false;
              }
            })
            .catch(() => null);
        }
        this.unhandledError = unhandledError;
      });
  }

  onOpenHandler(): void {
    /* In profile mode, load the user data on each open. */
    const { profileMode, userId } = this;
    if (profileMode) {
      void ArchAPI.users.get(userId).then((user) => (this.user = user));
    }
  }

  onCloseHandler(): void {
    /* Clear error on close, and in profile mode, set user=undefined to prevent
       a flash of potentially-stale user data prior to fetch completion.
     */
    const { profileMode } = this;
    this.form?.reset();
    this.clearErrors();
    if (profileMode) {
      this.user = undefined;
    }
  }
}
