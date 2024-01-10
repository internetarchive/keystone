import { LitElement } from "lit";
export declare class CollectionSurveyorPagination extends LitElement {
    currentPage: number;
    itemsPerPage: number;
    totalResults: number;
    get totalPages(): number;
    jumpToPage(pageNumber: number): void;
    nextPage(): void;
    prevPage(): void;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
