import { ArchModal } from "../../archModal/index";
export declare class ArchCreateNewTeamModal extends ArchModal {
    accountId: number;
    onCreate: () => void;
    form: HTMLFormElement;
    nameInput: HTMLInputElement;
    errorEl: HTMLElement;
    private set unhandledError(value);
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    submit(e: null | Event): void;
    private clearErrors;
    private clearInputValidityOnChange;
    private createTeam;
    onCloseHandler(): void;
}
