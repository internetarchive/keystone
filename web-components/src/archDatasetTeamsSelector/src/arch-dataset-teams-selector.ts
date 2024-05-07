import { customElement, property } from "lit/decorators.js";

import { Dataset, Team } from "../../lib/types";
import ArchAPI from "../../lib/ArchAPI";

import { ArchGlobalModal } from "../../archGlobalModal";
import { ArchSelectAdder } from "../../archSelectAdder/index";

import styles from "./styles";

@customElement("arch-dataset-teams-selector")
export class ArchDatasetTeamsSelector extends ArchSelectAdder<Team> {
  @property({ type: String }) datasetId!: Dataset["id"];
  @property({ type: Array }) userTeams!: Array<Team>;
  @property({ type: Array }) datasetTeams!: Array<Team>;

  static styles = styles;

  connectedCallback() {
    const { userTeams, datasetTeams } = this;
    this.options = userTeams;
    this.selectedOptions = datasetTeams;
    this.deselectButtonText = "stop sharing";
    this.selectCtaText = "Add a team";
    this.selectedOptionsTitle = "Currently Sharing With";
    this.valueGetter = (x) => x.id;
    this.labelGetter = (x) => x.name;
    super.connectedCallback();
  }

  async onChange(revertToPreviousState: () => void, srcEl: HTMLElement) {
    const { datasetId, selectedOptions: teams } = this;
    // Disable the inputs while we make the request.
    this.disabled = true;
    try {
      await ArchAPI.datasets.updateTeams(datasetId, teams);
    } catch (e) {
      // Restore the previous selected option state and display an error.
      revertToPreviousState();
      ArchGlobalModal.showError(
        "",
        "Could not update dataset teams. Please try again.",
        srcEl
      );
    }
    // Re-enable the inputs.
    this.disabled = false;
  }
}

// Injects the tag into the global name space
declare global {
  interface HTMLElementTagNameMap {
    "arch-dataset-teams-selector": ArchDatasetTeamsSelector;
  }
}
