import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SelectedFacets } from "../../lib/types";
import { EventHelpers } from "@internetarchive/ads-library";
import { readableFacetName } from "../../lib/helpers";

@customElement("collection-surveyor-active-filters")
export class CollectionSurveyorActiveFilters extends LitElement {
  @property({ type: Object })
  activeFilters: SelectedFacets = {
    f_organizationName: [],
    f_organizationType: [],
  };

  handleRemoveActiveFilter(facetFieldName: string, facetName: string) {
    this.emitEvent("facet-deselected", {
      facetFieldName: facetFieldName,
      facetName: facetName,
    });
  }

  private emitEvent(eventName: string, detail = {}) {
    this.dispatchEvent(
      EventHelpers.createEvent(eventName, detail ? { detail } : {})
    );
  }

  readableFacetFieldName(text: string) {
    // convert field name into a more readable form - eg. 'f_organizationName' --> 'Organization Name'

    const camelCasefield = text.split("_")[1]; // remove 'f_' prefix
    const fieldNameWordsSeparated = camelCasefield.split(/(?=[A-Z])/); // split on capital letter

    return fieldNameWordsSeparated
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "); // capitalize each word and join with spaces
  }

  render() {
    return html`
      <div class="active-filters">
        <h4>Active Filters:</h4>
        <ul>
          ${Object.entries(this.activeFilters).map(
            ([facetFieldName, facetValues]: [string, string[]]) =>
              html` ${facetValues.length > 0
                ? html`
                    ${facetValues.map(
                      (facetValue) => html`
                        <li>
                          <strong
                            >${this.readableFacetFieldName(
                              facetFieldName
                            )}:</strong
                          >
                          ${readableFacetName(facetValue, facetFieldName)}
                          <button
                            @click=${() =>
                              this.handleRemoveActiveFilter(
                                facetFieldName,
                                facetValue
                              )}
                          >
                            remove
                          </button>
                        </li>
                      `
                    )}
                  `
                : ""}`
          )}
        </ul>
      </div>
    `;
  }

  static styles = css`
    .active-filters {
      padding: 0px 0px 30px 0px;
    }

    button {
      background: none;
      border: none;
      cursor: pointer;
      color: red;
    }
  `;
}
