import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { EventHelpers } from "@internetarchive/ads-library";

@customElement("collection-surveyor-search-bar")
export class CollectionSurveyorSearchBar extends LitElement {
  @property({ type: String }) searchText = "";

  render() {
    return html`
      <div class="search-bar-container">
        <div class="search-bar-contents">
          <h3>Explore All Collections</h3>
          <p>
            Collections in the archive are listed below. Narrow your results
            below at left, or enter a search query.
          </p>
          <div class="search-bar">
            <input
              type="text"
              placeholder="Search..."
              .value="${this.searchText}"
              @input="${this.handleInputChange}"
              @keydown="${this.handleEnter}"
            />
            <button @click="${this.handleSearch}">Search</button>
            <button @click="${this.handleClear}">Clear</button>
          </div>
        </div>
      </div>
    `;
  }

  handleInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchText = inputElement.value;
  }

  handleSearch() {
    this.emitEvent("search-clicked", { searchText: this.searchText });
  }

  handleClear() {
    this.searchText = "";
    this.handleSearch();
  }

  handleEnter(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.handleSearch();
    }
  }

  private emitEvent(eventName: string, detail = {}) {
    this.dispatchEvent(
      EventHelpers.createEvent(eventName, detail ? { detail } : {})
    );
  }

  static styles = css`
    .search-bar-container {
      padding: 0px 0px 6px 0px;
    }

    .search-bar-contents {
      padding: 20px;
      background-color: rgb(255, 255, 255);
      box-shadow: rgb(136, 136, 136) 1px 1px 6px;
      border-radius: 6px;
    }

    .search-bar {
      display: flex;
    }

    input {
      flex-grow: 1;
      height: 30px;
    }

    button {
      margin: 2px;
    }
  `;
}
