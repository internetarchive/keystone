import { LitElement, TemplateResult } from "lit";
import "@spectrum-web-components/theme/sp-theme.js";
import "@spectrum-web-components/theme/src/themes.js";
import "@spectrum-web-components/dialog/sp-dialog-base.js";
import "@spectrum-web-components/dialog/sp-dialog.js";
import "@spectrum-web-components/overlay/overlay-trigger.js";
import "@spectrum-web-components/underlay/sp-underlay.js";
declare const ArchModal_base: (new (...args: any[]) => import("../../lib/webservices/src/mixins/modal").ModalMixinInterface) & typeof LitElement;
export declare class ArchModal extends ArchModal_base {
    hideCancelButton: boolean;
    hideSubmitButton: boolean;
    cancelButtonClass: string;
    cancelButtonText: string;
    submitButtonClass: string;
    submitButtonText: string;
    title: string;
    content: TemplateResult;
    static styles: import("lit").CSSResult[];
    renderDialogContent(): TemplateResult<1>;
    submit(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "arch-modal": ArchModal;
    }
}
export {};
