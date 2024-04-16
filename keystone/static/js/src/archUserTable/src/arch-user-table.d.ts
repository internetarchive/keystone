import { PropertyValues } from "lit";
import { User, UserRoles } from "../../lib/types";
import { ArchDataTable } from "../../archDataTable/index";
import { ArchEditUserModal } from "../../archEditUserModal/index.js";
export declare class ArchUserTable extends ArchDataTable<User> {
    accountId: number;
    userId: number;
    userIsStaff: boolean;
    userRole: UserRoles;
    createNewUserModalTrigger: HTMLElement;
    editUserModal: ArchEditUserModal;
    editUserModalTrigger: HTMLElement;
    static styles: import("lit").CSSResult[];
    willUpdate(_changedProperties: PropertyValues): void;
    _createHiddenModalTriggerButton(): HTMLButtonElement;
    render(): HTMLElement[];
    showEditUserModal(user: User): void;
    selectionActionHandler(action: string, selectedRows: Array<User>): void;
    nonSelectionActionHandler(action: string): void;
    postSelectionChangeHandler(selectedRows: Array<User>): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "arch-user-table": ArchUserTable;
    }
}
