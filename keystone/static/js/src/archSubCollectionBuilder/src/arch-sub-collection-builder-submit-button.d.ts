import { LitElement } from "lit";
import "../../archModal/src/arch-modal";
import { Collection } from "../../lib/types";
import { DecodedFormData } from "./types";
export declare class ArchSubCollectionBuilderSubmitButton extends LitElement {
    validateForm: () => boolean;
    collections: Array<Collection>;
    data: undefined | DecodedFormData;
    static styles: import("lit").CSSResult[];
    static shadowRootOptions: {
        delegatesFocus: boolean;
        mode: ShadowRootMode;
        slotAssignment?: SlotAssignmentMode | undefined;
        customElements?: CustomElementRegistry | undefined;
    };
    static dataKeyTitlePairs: Array<[keyof DecodedFormData, string]>;
    static dataKeyValueFormatterMap: Record<keyof DecodedFormData, (s: string) => string>;
    private getCollectionName;
    render(): import("lit-html").TemplateResult<1>;
    private clickHandler;
}
declare global {
    interface HTMLElementTagNameMap {
        "arch-sub-collection-builder-submit-button": ArchSubCollectionBuilderSubmitButton;
    }
}
