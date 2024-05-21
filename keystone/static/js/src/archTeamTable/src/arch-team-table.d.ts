import { PropertyValues } from "lit";
import { Team, User, UserRoles } from "../../lib/types";
import { ArchDataTable } from "../../archDataTable/index";
import { ArchEditTeamModal } from "../../archEditTeamModal/index";
export declare class ArchTeamTable extends ArchDataTable<Team> {
    accountId: number;
    userId: User["id"];
    userIsStaff: boolean;
    userRole: UserRoles;
    createNewTeamModalTrigger: HTMLElement;
    editTeamModal: ArchEditTeamModal;
    editTeamModalTrigger: HTMLElement;
    static styles: import("lit").CSSResult[];
    willUpdate(_changedProperties: PropertyValues): void;
    _createHiddenModalTriggerButton(): HTMLButtonElement;
    render(): HTMLElement[];
    showEditTeamModal(team: Team): void;
    selectionActionHandler(action: string, selectedRows: Array<Team>): void;
    nonSelectionActionHandler(action: string): void;
    postSelectionChangeHandler(selectedRows: Array<Team>): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "arch-team-table": ArchTeamTable;
    }
}
