import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";

import ArchAPI from "../../lib/ArchAPI";
import { Collection } from "../../lib/types";
import { Paths, humanBytes } from "../../lib/helpers";

import "../../archCard/index";
import "../../archLoadingIndicator/index";

import styles from "./styles";

@customElement("arch-collections-card")
export class ArchCollectionsCard extends LitElement {
  @state() numTotalCollections = 0;
  @state() collections: undefined | Array<Collection> = undefined;

  static maxDisplayedCollections = 10;
  static styles = styles;

  constructor() {
    super();
    void this.initCollections();
  }

  render() {
    const { maxDisplayedCollections } = ArchCollectionsCard;
    const isLoading = this.collections === undefined;
    // Note that the value of hasCollection is only valid when isLoading=false;
    const hasCollections = this.numTotalCollections > 0;
    const getRows = () =>
      isLoading
        ? [
            html`
              <tr>
                <td colspan="3">
                  <arch-loading-indicator></arch-loading-indicator>
                </td>
              </tr>
            `,
          ]
        : !hasCollections
        ? [
            html`
              <tr>
                <td colspan="3">
                  <i
                    >No collections found.
                    <a
                      href="https://arch-webservices.zendesk.com/hc/en-us/articles/14795196010772"
                      >Contact us</a
                    >
                    to access collections or report an error.</i
                  >
                </td>
              </tr>
            `,
          ]
        : (this.collections ?? []).slice(0, maxDisplayedCollections).map(
            (collection) => html`
              <tr>
                <td class="name">
                  <a
                    href="/collections/${collection.id}"
                    title="${collection.name}"
                  >
                    ${collection.name}
                  </a>
                </td>
                <td class="size">${humanBytes(collection.size_bytes, 1)}</td>
                <td class="num-datasets">
                  ${collection.dataset_count} Datasets
                </td>
              </tr>
            `
          );
    return html`
      <arch-card
        title="Collections"
        ctatext=${!isLoading && hasCollections
          ? "Create Custom Collection"
          : ""}
        ctahref="${Paths.buildSubCollection()}"
        ctaTooltipHeader="Custom Collection"
        ctaTooltipText="Combine and filter your collections into a Custom Collection of only the data you need."
        ctaTooltipLearnMoreUrl="https://arch-webservices.zendesk.com/hc/en-us/articles/16107865758228-How-to-create-a-custom-ARCH-collection"
      >
        <div slot="content">
          <table>
            <thead>
              <tr
                class="${isLoading || !hasCollections ? "hidden-header" : ""}"
              >
                <th class="name">Collection Name</th>
                <th class="size">Collection Size</th>
                <th class="num-datasets">Generated Datasets</th>
              </tr>
            </thead>
            <tbody>
              ${getRows()}
            </tbody>
          </table>
        </div>
        <div slot="footer">
          ${isLoading || !hasCollections
            ? html``
            : html`
                <a href="/collections" class="view-all">
                  View
                  ${this.numTotalCollections > maxDisplayedCollections
                    ? html`All ${this.numTotalCollections}`
                    : html``}
                  Collections
                </a>
              `}
        </div>
      </arch-card>
    `;
  }

  private async initCollections() {
    const response = await ArchAPI.collections.get([
      // TODO
      //      ["sort", "=", "-lastJobTime"],
      ["limit", "=", ArchCollectionsCard.maxDisplayedCollections],
    ]);
    this.numTotalCollections = response.count;
    this.collections = response.items;
  }
}

// Injects the tag into the global name space
declare global {
  interface HTMLElementTagNameMap {
    "arch-collections-card": ArchCollectionsCard;
  }
}
