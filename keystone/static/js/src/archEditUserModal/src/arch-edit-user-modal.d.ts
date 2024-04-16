import { User } from "../../lib/types";
import { ArchModal } from "../../archModal/index";
export declare class ArchEditUserModal extends ArchModal {
    userId: User["id"];
    profileMode: boolean;
    onUpdate: (user: User) => void;
    form: HTMLFormElement;
    usernameInput: HTMLInputElement;
    emailInput: HTMLInputElement;
    errorEl: HTMLElement;
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
