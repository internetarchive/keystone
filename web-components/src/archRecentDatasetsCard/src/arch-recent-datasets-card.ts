import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";

import ArchAPI from "../../lib/ArchAPI";
import { Paths } from "../../lib/helpers";
import { Dataset } from "../../lib/types";
import { isoStringToDateString } from "../../lib/webservices/src/lib/helpers";

import "../../archCard/index";
import "../../archLoadingIndicator/index";

import styles from "./styles";

@customElement("arch-recent-datasets-card")
export class ArchRecentDatasetsCard extends LitElement {
  @state() numTotalDatasets = 0;
  @state() datasets: undefined | Array<Dataset> = undefined;

  static maxDisplayedDatasets = 10;
  static styles = styles;

  constructor() {
    super();
    void this.initDatasets();
  }

  render() {
    const { numTotalDatasets } = this;
    const isLoading = this.datasets === undefined;
    // Note that the value of hasDatasets is only valid when isLoading=false;
    const hasDatasets = (this.datasets ?? []).length > 0;
    const datasets = this.datasets ?? [];

    const getRows = () =>
      isLoading
        ? [
            html`<tr>
              <td colspan="3">
                <arch-loading-indicator></arch-loading-indicator>
              </td>
            </tr>`,
          ]
        : !hasDatasets
        ? [
            html`<tr>
              <td colspan="3"><i>New datasets will be listed here.</i></td>
            </tr>`,
          ]
        : datasets.map((dataset) => {
            const name = `${dataset.name}${
              dataset.is_sample ? " (Sample)" : ""
            }`;
            return html`
              <tr>
                <td class="name">
                  <a href="${Paths.dataset(dataset.id)}" title="${name}">
                    ${name}
                  </a>
                </td>
                <td class="collection" title="${dataset.collection_name}">
                  ${dataset.collection_name}
                </td>
                <td class="date">
                  ${isoStringToDateString(dataset.finished_time)}
                </td>
              </tr>
            `;
          });

    return html`
      <arch-card
        title="Recent Datasets"
        ctatext="Generate New Dataset"
        ctahref="/datasets/generate"
      >
        <div slot="content">
          <table>
            <thead>
              <tr class="${isLoading || !hasDatasets ? "hidden-header" : ""}">
                <th class="name">Dataset</th>
                <th class="collection">Collection Name</th>
                <th class="date">Date Generated</th>
              </tr>
            </thead>
            <tbody>
              ${getRows()}
            </tbody>
          </table>
        </div>
        <div slot="footer">
          ${isLoading || !hasDatasets
            ? html``
            : html`
                <a href="/datasets/explore" class="view-all">
                  View
                  ${datasets.length < numTotalDatasets
                    ? html`All ${numTotalDatasets}`
                    : html``}
                  Datasets
                </a>
              `}
        </div>
      </arch-card>
    `;
  }

  private async initDatasets() {
    const response = await ArchAPI.datasets.get([
      ["state", "=", "FINISHED"],
      ["sort", "=", "-start_time"],
      ["limit", "=", ArchRecentDatasetsCard.maxDisplayedDatasets],
    ]);
    this.numTotalDatasets = response.count;
    this.datasets = response.items;
  }
}

// Injects the tag into the global name space
declare global {
  interface HTMLElementTagNameMap {
    "arch-recent-datasets-card": ArchRecentDatasetsCard;
  }
}
