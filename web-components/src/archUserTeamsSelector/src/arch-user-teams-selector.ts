import { PropertyValues, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { Paths } from "../../lib/helpers";
import { MinimalTeam } from "../../lib/types";

import { ArchSelectAdder } from "../../archSelectAdder/index";

import styles from "./styles";

@customElement("arch-user-teams-selector")
export class ArchUserTeamsSelector extends ArchSelectAdder<MinimalTeam> {
  @property({ type: Array }) accountTeams!: Array<MinimalTeam>;
  @property({ type: Array }) userTeams!: Array<MinimalTeam>;
  @property({ type: Boolean }) readOnly!: boolean;

  static styles = styles;

  connectedCallback() {
    const { readOnly } = this;
    this.reset();
    this.deselectButtonText = "remove";
    this.emptyOptionsPlaceholder = html`
      <em
        >Your account doesn’t have any teams yet.
        <a href="${Paths.teams}">Manage your teams here.</a></em
      >
    `;
    this.headingLevel = 0;
    this.readOnlyMessage = readOnly
      ? html`<em>Contact an account admin to modify your teams.</em>`
      : undefined;
    this.selectCtaText = "Add a team";
    this.valueGetter = (x) => String(x.id);
    this.labelGetter = (x) => x.name;
    super.connectedCallback();
  }

  willUpdate(changedProperties: PropertyValues) {
    if (changedProperties.has("userTeams")) {
      this.reset();
    }
  }

  reset() {
    /* Reset selector options and selectedOptions */
    const { accountTeams, userTeams } = this;
    // Use Array.slice() to prevent mutation.
    this.options = accountTeams.slice();
    this.selectedOptions = userTeams.slice();
  }
}

// Injects the tag into the global name space
declare global {
  interface HTMLElementTagNameMap {
    "arch-user-teams-selector": ArchUserTeamsSelector;
  }
}
