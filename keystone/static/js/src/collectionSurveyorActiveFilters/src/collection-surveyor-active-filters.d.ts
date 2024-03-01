import { LitElement } from "lit";
import { SelectedFacets } from "../../lib/types";
export declare class CollectionSurveyorActiveFilters extends LitElement {
    activeFilters: SelectedFacets;
    handleRemoveActiveFilter(facetFieldName: string, facetName: string): void;
    private emitEvent;
    readableFacetFieldName(text: string): string;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
