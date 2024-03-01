import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import { FacetResultMap } from "../../lib/types";
import { EventHelpers } from "../../lib/eventHelpers";

@customElement("collection-surveyor-facet")
export class CollectionSurveyorFacet extends LitElement {
  @property({ type: String }) facetField = "";

  @property({ type: Array }) facetFieldResults: FacetResultMap[] = [];

  @property({ type: Array }) selectedfacetFieldResults: string[] = [];

  readableFacetFieldName(text: string) {
    // convert field name into a more readable form - eg. 'f_organizationName' --> 'Organization Name'

    const camelCasefield = text.split("_")[1]; // remove 'f_' prefix
    const fieldNameWordsSeparated = camelCasefield.split(/(?=[A-Z])/); // split on capital letter

    return fieldNameWordsSeparated
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "); // capitalize each word and join with spaces
  }

  handleSelectFacet(facetName: string) {
    if (!this.selectedfacetFieldResults.includes(facetName)) {
      this.emitEvent("facet-selected", {
        facetFieldName: this.facetField,
        facetName: facetName,
      });
    }
  }

  handleDeselectFacet(facetName: string) {
    this.emitEvent("facet-deselected", {
      facetFieldName: this.facetField,
      facetName: facetName,
    });
  }

  private emitEvent(eventName: string, detail = {}) {
    this.dispatchEvent(
      EventHelpers.createEvent(eventName, detail ? { detail } : {})
    );
  }

  render() {
    return html`
      <div class="facet">
        <h3>${this.readableFacetFieldName(this.facetField)}</h3>
        <hr />
        <div class="facetResults">
          <ul>
            ${this.facetFieldResults.map(
              (facetFieldResult) => html`
                ${facetFieldResult.count > 0
                  ? html`
                      <li
                        class=${this.selectedfacetFieldResults.includes(
                          facetFieldResult.name
                        )
                          ? "selected"
                          : "notSelected"}
                      >
                        <span
                          class="facet-data"
                          @click=${() => {
                            this.handleSelectFacet(facetFieldResult.name);
                          }}
                          @keydown=${() => {
                            /* Placeholder event listener for acessibility */
                          }}
                        >
                          ${facetFieldResult.name} (${facetFieldResult.count})
                        </span>
                        ${this.selectedfacetFieldResults.includes(
                          facetFieldResult.name
                        )
                          ? html`
                              <button
                                @click=${() =>
                                  this.handleDeselectFacet(
                                    facetFieldResult.name
                                  )}
                              >
                                remove
                              </button>
                            `
                          : ""}
                      </li>
                    `
                  : html``}
              `
            )}
          </ul>
        </div>
      </div>
    `;
  }

  static styles = css`
    .facet {
      border-radius: 6px;
      background-color: rgb(255, 255, 255);
      box-shadow: rgb(136, 136, 136) 1px 1px 6px;
      padding: 10px;
      margin-bottom: 15px;
    }

    .facetResults {
      max-height: 300px;
      overflow-y: auto;
    }

    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }

    li {
      margin: 0.2em 0 0.2em 0;
    }

    .notSelected .facet-data:hover {
      text-decoration: underline;
      cursor: pointer;
    }

    button {
      background: none;
      border: none;
      cursor: pointer;
      color: red;
    }
  `;
}
