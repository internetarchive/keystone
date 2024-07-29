import { PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { User, UserRoles } from "../../lib/types";
import { isoStringToDateString, toTitleCase } from "../../lib/helpers";
import { Topics } from "../../lib/pubsub";

import { ArchDataTable } from "../../archDataTable/index";

import { ArchCreateNewUserModal } from "../../archCreateNewUserModal/index";
import { ArchEditUserModal } from "../../archEditUserModal/index.js";

import Styles from "./styles.js";

@customElement("arch-user-table")
export class ArchUserTable extends ArchDataTable<User> {
  @property({ type: Number }) accountId!: number;
  @property({ type: Number }) userId!: number;
  @property({ type: Boolean }) userIsStaff!: boolean;
  @property({ type: String }) userRole!: UserRoles;
  @property({ type: Boolean }) accountMaxUsersReached = false;

  @state() createNewUserModalTrigger!: HTMLElement;
  @state() editUserModal!: ArchEditUserModal;
  @state() editUserModalTrigger!: HTMLElement;

  static styles = [...ArchDataTable.styles, ...Styles];

  willUpdate(_changedProperties: PropertyValues) {
    super.willUpdate(_changedProperties);
    this.actionButtonDisabled = [false, false];
    // Add selection action buttons if user is staff or admin.
    const isStaffOrAdmin =
      this.userIsStaff || this.userRole === UserRoles.ADMIN;
    if (isStaffOrAdmin) {
      this.actionButtonLabels = ["Edit User"];
      this.actionButtonSignals = [Topics.DISPLAY_EDIT_USER_MODAL];
    }
    this.apiCollectionEndpoint = "/users";
    this.apiStaticParamPairs = [];
    this.cellRenderers = [
      undefined,
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      (first_name, user) => {
        const s = `${first_name as string} ${user.last_name}`;
        return `<span title="${s}">${s}</span>`;
      },
      undefined,
      (date_joined) =>
        date_joined ? isoStringToDateString(date_joined as string) : "",
      (last_login) =>
        last_login ? isoStringToDateString(last_login as string) : "",
      (role) =>
        Object.keys(UserRoles)[
          Object.values(UserRoles).indexOf(role as UserRoles)
        ],
    ];
    this.columns = [
      "username",
      "first_name",
      "email",
      "date_joined",
      "last_login",
      "role",
    ];
    this.columnHeaders = [
      "Username",
      "Full Name",
      "Email",
      "Date Created",
      "Last Login",
      "Role",
    ];
    this.filterableColumns = [false, false, false, false, false, true];
    this.pageLength = 50;
    this.persistSearchStateInUrl = true;
    this.pluralName = "Account Users";
    this.rowClickEnabled = true;
    this.searchColumns = ["username", "first_name", "last_name", "email"];
    this.searchColumnLabels = this.searchColumns.map(toTitleCase);
    this.selectable = isStaffOrAdmin;
    this.singleName = "Account User";
    this.sort = "username,role";
    this.sortableColumns = [true, true, true, true, true, true];

    // Display "Create User" button to staff / admin users.
    if (isStaffOrAdmin) {
      this.nonSelectionActions = [Topics.DISPLAY_CREATE_USER_MODAL];
      this.nonSelectionActionLabels = ["Create New User"];
    }
  }

  _createHiddenModalTriggerButton(): HTMLButtonElement {
    const el = document.createElement("button");
    el.setAttribute("slot", "trigger");
    el.style.display = "none";
    return el;
  }

  render() {
    // Instantiate the user create modal and create a trigger element.
    const createNewUserModal = new ArchCreateNewUserModal();
    createNewUserModal.accountId = this.accountId;
    createNewUserModal.onCreate = () => void this.dataTable.throttledDoSearch();
    this.createNewUserModalTrigger = this._createHiddenModalTriggerButton();
    createNewUserModal.appendChild(this.createNewUserModalTrigger);

    // Instantiate the edit user modal and create a trigger element.
    this.editUserModal = new ArchEditUserModal();
    this.editUserModal.userId = this.userId;
    this.editUserModal.onUpdate = () => void this.dataTable.throttledDoSearch();
    this.editUserModalTrigger = this._createHiddenModalTriggerButton();
    this.editUserModal.appendChild(this.editUserModalTrigger);

    return [
      super.render(),
      createNewUserModal,
      this.editUserModal,
    ] as Array<HTMLElement>;
  }

  updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);

    // If account max users has been reached, disable the Create New User button.
    if (this.accountMaxUsersReached) {
      const createNewUserButton = this.dataTable.querySelector(
        "div.non-selection-buttons button"
      ) as HTMLButtonElement;
      createNewUserButton.disabled = true;
      createNewUserButton.title =
        "Your account has reached its maximum number of allowed users. Please contact your account administrator.";
    }
  }

  showEditUserModal(user: User) {
    this.editUserModal.user = user;
    this.editUserModalTrigger.click();
  }

  selectionActionHandler(action: string, selectedRows: Array<User>) {
    switch (action as Topics) {
      case Topics.DISPLAY_EDIT_USER_MODAL:
        this.showEditUserModal(selectedRows[0]);
        break;
      default:
        break;
    }
  }

  nonSelectionActionHandler(action: string) {
    switch (action as Topics) {
      case Topics.DISPLAY_CREATE_USER_MODAL:
        this.createNewUserModalTrigger.click();
        break;
      default:
        break;
    }
  }

  postSelectionChangeHandler(selectedRows: Array<User>) {
    /* Update DataTable.actionButtonDisabled based on the number
       of selected rows.
    */
    const { dataTable } = this;
    const { props } = dataTable;
    const numSelected = selectedRows.length;
    const editUserEnabled = numSelected === 1;
    props.actionButtonDisabled = [!editUserEnabled];
    dataTable.setSelectionActionButtonDisabledState(numSelected === 0);
  }
}

// Injects the <ait-user-table> tag into the global name space
declare global {
  interface HTMLElementTagNameMap {
    "arch-user-table": ArchUserTable;
  }
}
