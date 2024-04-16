import { ArchModal } from "../../archModal/index";
export declare class ArchCreateNewUserModal extends ArchModal {
    accountId: number;
    onCreate: () => void;
    form: HTMLFormElement;
    usernameInput: HTMLInputElement;
    emailInput: HTMLInputElement;
    errorEl: HTMLElement;
    private set unhandledError(value);
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    submit(): void;
    private clearErrors;
    private clearInputValidityOnChange;
    private createUser;
    onCloseHandler(): void;
}
