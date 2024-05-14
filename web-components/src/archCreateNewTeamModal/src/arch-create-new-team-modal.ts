import { html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import ArchAPI from "../../lib/ArchAPI";
import { ResponseError, Team } from "../../lib/types";

import { ArchModal } from "../../archModal/index";

import styles from "./styles";

@customElement("arch-create-new-team-modal")
export class ArchCreateNewTeamModal extends ArchModal {
  @property({ type: Number }) accountId!: number;
  @property() onCreate!: () => void;

  @query("form") form!: HTMLFormElement;
  @query("form > input#name") nameInput!: HTMLInputElement;
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
    this.title = "Create a New Team";
    this.submitButtonText = "Create";
    this.content = html`
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
    `;

    this.addEventListener("sp-closed", this.onCloseHandler.bind(this));
  }

  submit(e: null | Event) {
    // Prevent default form submit action.
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const { form } = this;

    // Validate the form and show any errors.
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(this.form);
    const data: Partial<Team> = {
      account_id: parseInt(formData.get("account-id") as string),
      name: formData.get("name") as string,
    };
    this.createTeam(data);
  }

  private clearErrors() {
    this.unhandledError = false;
    if (this.form) {
      this.nameInput.setCustomValidity("");
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

  private createTeam(data: Partial<Team>) {
    this.clearErrors();
    ArchAPI.teams
      .create(data as Team)
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
              // Maybe handle a duplicate name error.
              if (
                details.endsWith(
                  "already exists for fields ('lower(name::text)', 'account_id')"
                )
              ) {
                this.nameInput.setCustomValidity(
                  "A team with this name already exists."
                );
                this.nameInput.reportValidity();
                this.clearInputValidityOnChange(this.nameInput);
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
