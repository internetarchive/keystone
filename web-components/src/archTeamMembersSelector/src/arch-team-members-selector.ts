import { PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

import { MinimalUser } from "../../lib/types";

import { ArchSelectAdder } from "../../archSelectAdder/index";

import styles from "./styles";

@customElement("arch-team-members-selector")
export class ArchTeamMembersSelector extends ArchSelectAdder<MinimalUser> {
  @property({ type: Array }) accountUsers!: Array<MinimalUser>;
  @property({ type: Array }) teamMembers!: Array<MinimalUser>;

  static styles = styles;

  connectedCallback() {
    this.reset();
    this.deselectButtonText = "remove";
    this.headingLevel = 0;
    this.selectCtaText = "Add a user";
    this.valueGetter = (x) => String(x.id);
    this.labelGetter = (x) => x.username;
    super.connectedCallback();
  }

  willUpdate(changedProperties: PropertyValues) {
    if (changedProperties.has("teamMembers")) {
      this.reset();
    }
  }

  reset() {
    /* Reset selector options and selectedOptions */
    const { accountUsers, teamMembers } = this;
    // Use Array.slice() to prevent mutation.
    this.options = accountUsers.slice();
    this.selectedOptions = teamMembers.slice();
  }
}

// Injects the tag into the global name space
declare global {
  interface HTMLElementTagNameMap {
    "arch-team-members-selector": ArchTeamMembersSelector;
  }
}
