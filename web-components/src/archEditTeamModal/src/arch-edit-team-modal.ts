import { html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import ArchAPI from "../../lib/ArchAPI";
import { ResponseError, Team, TeamUpdate, User } from "../../lib/types";

import "../../archTeamMembersSelector";
import { ArchTeamMembersSelector } from "../../archTeamMembersSelector";
import { ArchModal } from "../../archModal/index";

import styles from "./styles";

@customElement("arch-edit-team-modal")
export class ArchEditTeamModal extends ArchModal {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @property() onUpdate: (team: Team) => void = (team) => null;

  @query("form") form!: HTMLFormElement;
  @query("form > input#name") nameInput!: HTMLInputElement;
  @query("div.error") errorEl!: HTMLElement;
  @query("arch-team-members-selector")
  membersSelector!: ArchTeamMembersSelector;

  @state() accountUsers: Array<User> = [];

  constructor() {
    super();
    void ArchAPI.users
      .list()
      .then((response) => (this.accountUsers = response.items));
  }

  private set unhandledError(showError: boolean) {
    const { errorEl } = this;
    if (showError) {
      errorEl.classList.add("show");
    } else {
      errorEl.classList.remove("show");
    }
  }

  static styles = styles;

  set team(team: undefined | Team) {
    const { accountUsers } = this;
    // Clear the content if team has been set to undefined.
    if (team === undefined) {
      this.content = html``;
      return;
    }
    this.content = html`
      <form @submit=${this.submit} validate>
        <input type="hidden" name="id" value=${team.id} />

        <label for="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value=${team.name}
          autocomplete="off"
        />
      </form>
      <br />
      <label for="team-members-selector">Members</label>
      <br />
      <arch-team-members-selector
        .accountUsers=${accountUsers}
        .teamMembers=${team.members}
        id="team-members-selector"
      >
      </arch-team-members-selector>
      <div class="error alert-danger">
        Something went wrong. Please try again.
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.scrollable = true;
    this.modalSize = "m";
    this.submitButtonText = "Save";
    this.title = "Edit Team";
    this.addEventListener("sp-closed", this.onCloseHandler.bind(this));
  }

  submit(e: null | Event) {
    // Prevent default form submit action.
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const { form, membersSelector } = this;

    // Validate the form and show any errors.
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(this.form);
    const teamId = parseInt(formData.get("id") as string);
    const data: TeamUpdate = {
      name: formData.get("name") as string,
      members: membersSelector.selectedOptions,
    };
    this.updateTeam(teamId, data);
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

  private updateTeam(teamId: Team["id"], data: TeamUpdate) {
    this.clearErrors();
    ArchAPI.teams
      .update(teamId, data)
      .then((team: Team) => {
        this.open = false;
        // Invoke any registered onUpdate handler and catch/log any error
        // to prevent triggering display of the modal error element.
        try {
          this.onUpdate(team);
        } catch (e) {
          console.error(e);
        }
      })
      .catch((error: ResponseError) => {
        if (error.response?.status !== 400) {
          this.unhandledError = true;
        } else {
          error.response
            .json()
            .then((data: { details: string }) => {
              const { details } = data;
              // Maybe handle a duplicate teamname error.
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
              } else {
                this.unhandledError = true;
              }
            })
            .catch(() => (this.unhandledError = true));
        }
      });
  }

  onCloseHandler(): void {
    /* Reset form and members selector, and clear errors on close. */
    this.form?.reset();
    this.membersSelector.reset();
    this.clearErrors();
  }
}
