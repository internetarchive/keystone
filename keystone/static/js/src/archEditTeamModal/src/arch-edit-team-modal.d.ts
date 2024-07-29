import { Team, User } from "../../lib/types";
import "../../archTeamMembersSelector";
import { ArchTeamMembersSelector } from "../../archTeamMembersSelector";
import { ArchModal } from "../../archModal/index";
export declare class ArchEditTeamModal extends ArchModal {
    onUpdate: (team: Team) => void;
    form: HTMLFormElement;
    nameInput: HTMLInputElement;
    errorEl: HTMLElement;
    membersSelector: ArchTeamMembersSelector;
    accountUsers: Array<User>;
    constructor();
    private set unhandledError(value);
    static styles: import("lit").CSSResult[];
    set team(team: undefined | Team);
    connectedCallback(): void;
    submit(e: null | Event): void;
    private clearErrors;
    private clearInputValidityOnChange;
    private updateTeam;
    onCloseHandler(): void;
}
