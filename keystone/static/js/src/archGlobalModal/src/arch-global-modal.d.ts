import { ArchModal } from "../../archModal";
export declare class ArchGlobalModal extends ArchModal {
    static styles: import("lit").CSSResult[];
    private static NotificationModalEventName;
    private static ErrorModalEventName;
    connectedCallback(): void;
    private get headingEl();
    private get contentSlot();
    private errorHandler;
    private notificationHandler;
    private static show;
    static showNotification(title: string, content: string | HTMLElement, elementToFocusOnClose: HTMLElement): void;
    static showError(title: string, content: string | HTMLElement, elementToFocusOnClose: HTMLElement): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "arch-global-modal": ArchGlobalModal;
    }
}
