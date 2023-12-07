import { LitElement } from "lit";
import { CollectionSelectedDetail } from "../../lib/types";
export declare class CollectionSurveyorCart extends LitElement {
    collectionsInCart: {
        [collectionName: string]: CollectionSelectedDetail;
    };
    private get totalCollectionSizeSelected();
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
