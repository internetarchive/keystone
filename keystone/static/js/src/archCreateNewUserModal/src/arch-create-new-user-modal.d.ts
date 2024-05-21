import { Team } from "../../lib/types";
import "../../archUserTeamsSelector";
import { ArchUserTeamsSelector } from "../../archUserTeamsSelector";
import { ArchModal } from "../../archModal/index";
export declare class ArchCreateNewUserModal extends ArchModal {
    accountId: number;
    onCreate: () => void;
    form: HTMLFormElement;
    usernameInput: HTMLInputElement;
    emailInput: HTMLInputElement;
    errorEl: HTMLElement;
    teamsSelector: ArchUserTeamsSelector;
    accountTeams: Array<Team>;
    constructor();
    private set unhandledError(value);
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    renderContent(): void;
    submit(): void;
    private clearErrors;
    private clearInputValidityOnChange;
    private createUser;
    onCloseHandler(): void;
}
