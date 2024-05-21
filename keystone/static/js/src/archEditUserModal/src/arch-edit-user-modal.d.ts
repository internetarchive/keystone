import { Team, User } from "../../lib/types";
import "../../archUserTeamsSelector";
import { ArchUserTeamsSelector } from "../../archUserTeamsSelector";
import { ArchModal } from "../../archModal/index";
export declare class ArchEditUserModal extends ArchModal {
    userId: User["id"];
    profileMode: boolean;
    onUpdate: (user: User) => void;
    form: HTMLFormElement;
    emailInput: HTMLInputElement;
    errorEl: HTMLElement;
    teamsSelector: ArchUserTeamsSelector;
    accountTeams: Array<Team>;
    constructor();
    private set unhandledError(value);
    static styles: import("lit").CSSResult[];
    set user(user: undefined | User);
    connectedCallback(): void;
    submit(): void;
    private clearErrors;
    private clearInputValidityOnChange;
    private updateUser;
    onOpenHandler(): void;
    onCloseHandler(): void;
}
