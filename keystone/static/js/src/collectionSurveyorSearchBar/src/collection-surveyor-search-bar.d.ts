import { LitElement } from "lit";
export declare class CollectionSurveyorSearchBar extends LitElement {
    searchText: string;
    render(): import("lit-html").TemplateResult<1>;
    handleInputChange(event: Event): void;
    handleSearch(): void;
    handleClear(): void;
    handleEnter(event: KeyboardEvent): void;
    private emitEvent;
    static styles: import("lit").CSSResult;
}
