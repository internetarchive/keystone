import { PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { Team, User, UserRoles } from "../../lib/types";
import { toTitleCase } from "../../lib/helpers";
import { Topics } from "../../lib/pubsub";

import { ArchDataTable } from "../../archDataTable/index";

import { ArchCreateNewTeamModal } from "../../archCreateNewTeamModal/index";
import { ArchEditTeamModal } from "../../archEditTeamModal/index";

import Styles from "./styles.js";

@customElement("arch-team-table")
export class ArchTeamTable extends ArchDataTable<Team> {
  @property({ type: Number }) accountId!: number;
  @property({ type: Number }) userId!: User["id"];
  @property({ type: Boolean }) userIsStaff!: boolean;
  @property({ type: String }) userRole!: UserRoles;

  @state() createNewTeamModalTrigger!: HTMLElement;
  @state() editTeamModal!: ArchEditTeamModal;
  @state() editTeamModalTrigger!: HTMLElement;

  static styles = [...ArchDataTable.styles, ...Styles];

  willUpdate(_changedProperties: PropertyValues) {
    super.willUpdate(_changedProperties);
    this.actionButtonDisabled = [false, false];
    // Add selection action buttons if user is staff or admin.
    const isStaffOrAdmin =
      this.userIsStaff || this.userRole === UserRoles.ADMIN;
    if (isStaffOrAdmin) {
      this.actionButtonLabels = ["Edit Team"];
      this.actionButtonSignals = [Topics.DISPLAY_EDIT_TEAM_MODAL];
    }
    this.apiCollectionEndpoint = "/teams";
    this.apiStaticParamPairs = [];
    this.cellRenderers = [
      undefined,
      (member) => (member as unknown as Team["members"][0]).username,
    ];
    this.columns = ["name", "members"];
    this.columnHeaders = ["Name", "Members"];
    this.pageLength = 50;
    this.persistSearchStateInUrl = true;
    this.pluralName = "Account Teams";
    this.rowClickEnabled = true;
    this.searchColumns = ["name", "members"];
    this.searchColumnLabels = this.searchColumns.map(toTitleCase);
    this.selectable = isStaffOrAdmin;
    this.singleName = "Account Team";
    this.sort = "-id";
    this.sortableColumns = [true];

    // Display "Create User" button to staff / admin users.
    if (isStaffOrAdmin) {
      this.nonSelectionActions = [Topics.DISPLAY_CREATE_TEAM_MODAL];
      this.nonSelectionActionLabels = ["Create New Team"];
    }
  }

  _createHiddenModalTriggerButton(): HTMLButtonElement {
    const el = document.createElement("button");
    el.setAttribute("slot", "trigger");
    el.style.display = "none";
    return el;
  }

  render() {
    // Instantiate the team create modal and create a trigger element.
    const createNewTeamModal = new ArchCreateNewTeamModal();
    createNewTeamModal.accountId = this.accountId;
    createNewTeamModal.onCreate = () => void this.dataTable.throttledDoSearch();
    this.createNewTeamModalTrigger = this._createHiddenModalTriggerButton();
    createNewTeamModal.appendChild(this.createNewTeamModalTrigger);

    // Instantiate the edit team modal and create a trigger element.
    this.editTeamModal = new ArchEditTeamModal();
    this.editTeamModal.onUpdate = () => void this.dataTable.throttledDoSearch();
    this.editTeamModalTrigger = this._createHiddenModalTriggerButton();
    this.editTeamModal.appendChild(this.editTeamModalTrigger);

    return [
      super.render(),
      createNewTeamModal,
      this.editTeamModal,
    ] as Array<HTMLElement>;
  }

  showEditTeamModal(team: Team) {
    this.editTeamModal.team = team;
    this.editTeamModalTrigger.click();
  }

  selectionActionHandler(action: string, selectedRows: Array<Team>) {
    switch (action as Topics) {
      case Topics.DISPLAY_EDIT_TEAM_MODAL:
        this.showEditTeamModal(selectedRows[0]);
        break;
      default:
        break;
    }
  }

  nonSelectionActionHandler(action: string) {
    switch (action as Topics) {
      case Topics.DISPLAY_CREATE_TEAM_MODAL:
        this.createNewTeamModalTrigger.click();
        break;
      default:
        break;
    }
  }

  postSelectionChangeHandler(selectedRows: Array<Team>) {
    /* Update DataTable.actionButtonDisabled based on the number
       of selected rows.
    */
    const { dataTable } = this;
    const { props } = dataTable;
    const numSelected = selectedRows.length;
    const editTeamEnabled = numSelected === 1;
    props.actionButtonDisabled = [!editTeamEnabled];
    dataTable.setSelectionActionButtonDisabledState(numSelected === 0);
  }
}

// Injects the <ait-team-table> tag into the global name space
declare global {
  interface HTMLElementTagNameMap {
    "arch-team-table": ArchTeamTable;
  }
}
