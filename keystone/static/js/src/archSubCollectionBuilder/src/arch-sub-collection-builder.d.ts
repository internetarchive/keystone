import { LitElement } from "lit";
import { Collection } from "../../lib/types";
import "../../archAlert/index";
import "./arch-sub-collection-builder-submit-button";
import { DecodedFormData } from "./types";
export declare class ArchSubCollectionBuilder extends LitElement {
    csrfToken: string;
    collections: Array<Collection>;
    sourceCollectionIds: Set<Collection["id"]>;
    data: undefined | DecodedFormData;
    form: HTMLFormElement;
    sourceSelect: HTMLSelectElement;
    submitButton: HTMLElement;
    static styles: import("lit").CSSResult[];
    connectedCallback(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
    private inputHandler;
    private initCollections;
    private setSourceCollectionIdsUrlParam;
    private sourceCollectionsChangeHandler;
    private static fieldValueParserMap;
    private static fieldValueValidatorMessagePairMap;
    private static fieldValuePreSendPrepareMap;
    private static decodeFormDataValue;
    private static validateDecodedFormData;
    private get formData();
    private setFormInputValidity;
    private doPost;
    validateForm(): boolean;
    private get successModalContent();
    private createSubCollection;
}
declare global {
    interface HTMLElementTagNameMap {
        "arch-sub-collection-builder": ArchSubCollectionBuilder;
    }
}
