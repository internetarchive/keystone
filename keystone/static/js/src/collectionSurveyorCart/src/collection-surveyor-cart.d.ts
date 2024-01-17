import { LitElement } from "lit";
import { CollectionSelectedDetail } from "../../lib/types";
export declare class CollectionSurveyorCart extends LitElement {
    collectionsInCart: {
        [collectionName: string]: CollectionSelectedDetail;
    };
    private get totalCollectionSizeSelected();
    handleRemoveCollectionFromCart(collectionName: string): void;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
