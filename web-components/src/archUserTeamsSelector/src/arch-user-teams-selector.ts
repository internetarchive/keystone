import { PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

import { MinimalTeam } from "../../lib/types";

import { ArchSelectAdder } from "../../archSelectAdder/index";

import styles from "./styles";

@customElement("arch-user-teams-selector")
export class ArchUserTeamsSelector extends ArchSelectAdder<MinimalTeam> {
  @property({ type: Array }) accountTeams!: Array<MinimalTeam>;
  @property({ type: Array }) userTeams!: Array<MinimalTeam>;

  static styles = styles;

  connectedCallback() {
    this.reset();
    this.deselectButtonText = "remove";
    this.headingLevel = 0;
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
