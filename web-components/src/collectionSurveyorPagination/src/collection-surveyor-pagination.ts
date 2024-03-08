import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("collection-surveyor-pagination")
export class CollectionSurveyorPagination extends LitElement {
  @property({ type: Number }) currentPage = 1;

  @property({ type: Number }) itemsPerPage = 1;

  @property({ type: Number }) totalResults = 0;

  @property({ type: Boolean }) backgroundCollectionsLoaded = false;

  get totalPages(): number {
    return Math.ceil(this.totalResults / this.itemsPerPage);
  }

  jumpToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.dispatchEvent(
      new CustomEvent("page-changed", { detail: this.currentPage })
    );
    window.scrollTo({ top: 300, behavior: "smooth" });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.jumpToPage(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage <= this.totalPages) {
      this.jumpToPage(this.currentPage - 1);
    }
  }

  render() {
    return html`
      <div class="pagination">
        <button @click="${this.prevPage}" ?disabled="${this.currentPage === 1}">
          Previous
        </button>
        ${this.backgroundCollectionsLoaded
          ? html` <span
              >Page ${this.currentPage} of ${this.totalPages}
              (${this.totalResults} Total Results)</span
            >`
          : html`<span>Page ${this.currentPage} </span>`}
        <button
          @click="${this.nextPage}"
          ?disabled="${this.currentPage === this.totalPages}"
        >
          Next
        </button>
      </div>
    `;
  }

  static styles = css`
    .pagination {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
  `;
}
