import { LitElement, TemplateResult } from "lit";
type Constructor<T> = new (...args: any[]) => T;
export declare class ModalMixinInterface {
    renderDialogContent(): TemplateResult;
    themeColor: string;
    themeScale: string;
    modalSize: string;
    scrollable: boolean;
    dismissable: boolean;
    open: boolean;
    elementToFocusOnClose: undefined | HTMLElement;
}
export declare const ModalMixin: <T extends Constructor<LitElement>>(superClass: T) => Constructor<ModalMixinInterface> & T;
export {};
