import { html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import ArchAPI from "../../lib/ArchAPI";
import { ResponseError, User, UserRoles } from "../../lib/types";

import { ArchModal } from "../../archModal/index";

import styles from "./styles";

@customElement("arch-create-new-user-modal")
export class ArchCreateNewUserModal extends ArchModal {
  @property({ type: Number }) accountId!: number;
  @property() onCreate!: () => void;

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

  connectedCallback() {
    super.connectedCallback();
    this.scrollable = true;
    this.modalSize = "m";
    this.title = "Create a New User";
    this.submitButtonText = "Create";
    this.content = html`
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
          ${Object.entries(UserRoles).map(
            ([k, v]) => html`
              <option value="${v}" ?selected=${k === "USER"}>${k}</option>
            `
          )}
        </select>
        <input type="checkbox" id="send-email" name="send-email" checked />
        <label for="send-email">Send welcome email</label>
      </form>
      <div class="error alert-danger">
        Something went wrong. Please try again.
      </div>
    `;

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
      account_id: parseInt(formData.get("account-id") as string),
      email: formData.get("user-email") as string,
      first_name: formData.get("first-name") as string,
      last_name: formData.get("last-name") as string,
      role: formData.get("user-role") as User["role"],
      username: formData.get("user-name") as string,
    };
    this.createUser(data, formData.has("send-email"));
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

  private createUser(data: Partial<User>, sendWelcomeEmail: boolean) {
    this.clearErrors();
    ArchAPI.users
      .create(data as User, sendWelcomeEmail)
      .then(() => {
        this.open = false;
        this.onCreate();
      })
      .catch((error: ResponseError) => {
        if (error.response?.status !== 400) {
          // Use assignment to state property instead of mutation to avoid having
          // to manually invoke this.requestUpdate().
          this.unhandledError = true;
        } else {
          error.response
            .json()
            .then((data: { details: string }) => {
              const { details } = data;
              let unhandledError = true;
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

              // Maybe handle an unknown error.
              this.unhandledError = unhandledError;
            })
            .catch(() => {
              this.unhandledError = true;
            });
        }
      });
  }

  onCloseHandler(): void {
    // ensure any previously entered text in the form field
    // is reset so it doesn't show on subsequent renders
    this.form?.reset();
    this.clearErrors();
  }
}
