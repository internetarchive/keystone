import { LitElement } from "lit";
import { FacetResultMap } from "../../lib/types";
export declare class CollectionSurveyorFacet extends LitElement {
    facetField: string;
    facetFieldResults: FacetResultMap[];
    readableFacetFieldName(text: string): string;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
