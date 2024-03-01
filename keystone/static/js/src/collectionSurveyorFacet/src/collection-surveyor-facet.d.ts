import { LitElement } from "lit";
import { FacetResultMap } from "../../lib/types";
export declare class CollectionSurveyorFacet extends LitElement {
    facetField: string;
    facetFieldResults: FacetResultMap[];
    selectedfacetFieldResults: string[];
    readableFacetFieldName(text: string): string;
    handleSelectFacet(facetName: string): void;
    handleDeselectFacet(facetName: string): void;
    private emitEvent;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
