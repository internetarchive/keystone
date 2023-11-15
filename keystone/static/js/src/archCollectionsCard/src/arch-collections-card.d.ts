import { LitElement } from "lit";
import { Collection } from "../../lib/types";
import "../../archCard/index";
import "../../archLoadingIndicator/index";
export declare class ArchCollectionsCard extends LitElement {
    numTotalCollections: number;
    collections: undefined | Array<Collection>;
    static maxDisplayedCollections: number;
    static styles: import("lit").CSSResult[];
    constructor();
    render(): import("lit-html").TemplateResult<1>;
    private initCollections;
}
declare global {
    interface HTMLElementTagNameMap {
        "arch-collections-card": ArchCollectionsCard;
    }
}
