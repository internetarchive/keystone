import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import { FacetResultMap } from "../../lib/types";

@customElement("collection-surveyor-facet")
export class CollectionSurveyorFacet extends LitElement {
  @property({ type: String }) facetField = "";

  @property({ type: Array }) facetFieldResults: FacetResultMap[] = [];

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
      <div class="facet">
        <h3>${this.readableFacetFieldName(this.facetField)}</h3>
        <hr />
        <div class="facetResults">
          <ul>
            ${this.facetFieldResults.map(
              (facetFieldResult) => html`
                <li>${facetFieldResult.name} (${facetFieldResult.count})</li>
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
  `;
}
