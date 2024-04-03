import { LitElement, html } from "lit";
import {
  customElement,
  property,
  query,
  queryAll,
  state,
} from "lit/decorators.js";

import "@spectrum-web-components/icon/sp-icon.js";
import "@spectrum-web-components/tabs/sp-tabs.js";
import "@spectrum-web-components/tabs/sp-tab.js";
import "@spectrum-web-components/tabs/sp-tab-panel.js";
import "@spectrum-web-components/theme/sp-theme.js";
import "@spectrum-web-components/theme/src/themes.js";

import { Paths } from "../../lib/helpers";
import { UrlCollectionParamName } from "../../lib/constants";
import ArchAPI from "../../lib/ArchAPI";
import {
  AvailableJob,
  AvailableJobs,
  AvailableJobsCategory,
  Collection,
  Dataset,
  GenerateDatasetDetail,
  JobIdStatesMap,
  JobParameters,
  ProcessingState,
} from "../../lib/types";

import { ArchGlobalModal } from "../../archGlobalModal";

import "./arch-job-category-section";
import { ArchJobCategorySection } from "./arch-job-category-section";

import Styles from "./styles";

// Define the display order of known categories and jobs.
const sortedCatNames = ["Collection", "Network", "Text", "File Formats"];

const catNameSortedJobNamesMap: Record<
  AvailableJobsCategory["categoryName"],
  Array<AvailableJob["name"]>
> = {
  Collection: ["Domain frequency", "Web archive transformation (WAT)"],
  Network: ["Domain graph", "Image graph", "Longitudinal graph", "Web graph"],
  Text: ["Named entities", "Plain text of webpages", "Text file information"],
  "File Formats": [
    "Audio file information",
    "Image file information",
    "PDF file information",
    "Presentation file information",
    "Spreadsheet file information",
    "Video file information",
    "Word processing file information",
  ],
};

@customElement("arch-generate-dataset-form")
export class ArchGenerateDatasetForm extends LitElement {
  @property({ type: String }) csrfToken!: string;

  @state() collections: null | Array<Collection> = null;
  @state() collectionIdNameMap: Map<Collection["id"], Collection["name"]> =
    new Map();
  @state() availableJobs: AvailableJobs = [];
  @state() sourceCollectionId: Collection["id"] | null = null;
  @state() collectionJobIdStatesMapMap: Record<
    Collection["id"],
    JobIdStatesMap
  > = {};
  @state() activePollCollectionId: Collection["id"] | null = null;

  @query("select[name=source-collection]")
  collectionSelector!: HTMLSelectElement;
  @queryAll("arch-job-category-section")
  categorySections!: Array<ArchJobCategorySection>;

  // Apply any ARCH-specific styles.
  static styles = Styles;

  async connectedCallback() {
    // Fetch available Collections and Jobs.
    await this.initAvailableJobs();
    void this.initCollections();
    super.connectedCallback();
    this.addEventListener(
      "generate-dataset",
      (e: Event) => void this.generateDatasetHandler(e)
    );
  }

  render() {
    const jobIdStatesMap =
      this.sourceCollectionId &&
      this.collectionJobIdStatesMapMap[this.sourceCollectionId];
    return html`
      <label for="source-collection">Select Source Collection</label>
      <select
        name="source-collection"
        @change=${this.sourceCollectionChangeHandler}
        ?disabled=${this.collections === null}
      >
        ${this.collections === null
          ? html`<option>Loading...</option>`
          : html`<option value="">~ Choose Source Collection ~</option>`}
        ${(this.collections ?? []).map(
          (collection) => html`
            <option
              value="${collection.id}"
              ?selected=${collection.id === this.sourceCollectionId}
            >
              ${collection.name}
            </option>
          `
        )}
      </select>

      <label for="job-category">Select Dataset Category</label>
      <sp-theme color="light" scale="medium">
        <sp-tabs selected="${this.availableJobs[0].categoryId}" size="l">
          ${this.availableJobs.map(
            (jobsCat) => html`<sp-tab
              label="${jobsCat.categoryName}"
              value="${jobsCat.categoryId}"
              style="--mod-tabs-icon-to-text: 0;"
            >
              <sp-icon
                label="${jobsCat.categoryName}"
                src="${jobsCat.categoryImage}"
                slot="icon"
                size="l"
              ></sp-icon>
            </sp-tab> `
          )}
          ${this.availableJobs.map(
            (jobsCat) => html`
              <sp-tab-panel value="${jobsCat.categoryId}">
                <arch-job-category-section
                  .collectionId=${this.sourceCollectionId}
                  .collectionName=${this.collectionIdNameMap.get(
                    this.sourceCollectionId ?? 0
                  )}
                  .jobsCat=${jobsCat}
                  .jobIdStatesMap=${jobIdStatesMap}
                >
                </arch-job-category-section>
              </sp-tab-panel>
            `
          )}
        </sp-tabs>
      </sp-theme>
    `;
  }

  private setCollectionIdUrlParam(collectionId: Collection["id"] | null) {
    const url = new URL(window.location.href);
    if (!collectionId) {
      url.searchParams.delete(UrlCollectionParamName);
    } else {
      url.searchParams.set(UrlCollectionParamName, collectionId.toString());
    }
    history.replaceState(null, "", url.toString());
  }

  private async sourceCollectionChangeHandler(e: Event) {
    const collectionId =
      parseInt((e.target as HTMLSelectElement).value) || null;
    this.setCollectionIdUrlParam(collectionId);
    await this.setSourceCollectionId(collectionId);
    this.requestUpdate();
  }

  private async setSourceCollectionId(collectionId: Collection["id"] | null) {
    this.sourceCollectionId = collectionId;
    // If a collection is selected, fetch the job states.
    if (collectionId) {
      this.collectionJobIdStatesMapMap[collectionId] =
        await this.fetchJobIdStatesMap(collectionId);
    }
  }

  private async initCollections() {
    const response = await ArchAPI.collections.get();
    this.collections = response.items;
    this.collectionIdNameMap = new Map(
      this.collections.map((c) => [c.id, c.name])
    );
    // Maybe select an initial Collection.
    const initialCollectionId = parseInt(
      new URLSearchParams(window.location.search).get(UrlCollectionParamName) ??
        ""
    );
    if (!Number.isNaN(initialCollectionId)) {
      await this.setSourceCollectionId(initialCollectionId);
      this.requestUpdate();
    }
  }

  private async initAvailableJobs() {
    const availableJobs = (await (
      await fetch("/api/available-jobs")
    ).json()) as AvailableJobs;
    // Apply the desired display order.
    availableJobs
      .sort((a, b) =>
        sortedCatNames.indexOf(a.categoryName) >
        sortedCatNames.indexOf(b.categoryName)
          ? 1
          : -1
      )
      .map((jobCat) => {
        jobCat.jobs.sort((a, b) => {
          const sortedJobNames = catNameSortedJobNamesMap[jobCat.categoryName];
          return sortedJobNames === undefined
            ? 0
            : sortedJobNames.indexOf(a.name) > sortedJobNames.indexOf(b.name)
            ? 1
            : -1;
        });
        return jobCat;
      });
    this.availableJobs = availableJobs;
  }

  private async fetchJobIdStatesMap(collectionId: Collection["id"]) {
    return (await (
      await fetch(`/api/collections/${collectionId}/dataset_states`)
    ).json()) as JobIdStatesMap;
  }

  async pollDatasetStates() {
    const { sourceCollectionId } = this;
    // Stop polling if the selected collection has changed.
    if (
      sourceCollectionId === null ||
      this.activePollCollectionId !== sourceCollectionId
    ) {
      this.activePollCollectionId = null;
      return;
    }
    // Fetch the current collection job states.
    this.collectionJobIdStatesMapMap[sourceCollectionId] =
      await this.fetchJobIdStatesMap(sourceCollectionId);
    // Request a lit component update.
    this.requestUpdate();
    // Keep polling if any jobs remain active.
    for (const startTimeStateTuples of Object.values(
      this.collectionJobIdStatesMapMap[sourceCollectionId]
    )) {
      if (startTimeStateTuples[0][2] === ProcessingState.RUNNING) {
        // A job is active, set a polling timeout and return.
        setTimeout(() => void this.pollDatasetStates(), 2000);
        return;
      }
    }
    // No jobs remain active, so stop polling.
    this.activePollCollectionId = null;
  }

  private startPolling() {
    // Abort if polling is already active.
    if (this.activePollCollectionId !== null) {
      return;
    }
    this.activePollCollectionId = this.sourceCollectionId;
    void this.pollDatasetStates();
  }

  private async runJob(jobId: string, sample: boolean) {
    return fetch("/api/datasets/generate", {
      method: "POST",
      credentials: "same-origin",
      headers: { "X-CSRFToken": this.csrfToken },
      mode: "cors",
      body: JSON.stringify({
        collection_id: this.sourceCollectionId,
        job_type_id: jobId,
        is_sample: sample,
      }),
    });
  }

  private async generateDatasetHandler(e: Event) {
    const archJobCard = (e as CustomEvent<GenerateDatasetDetail>).detail
      .archJobCard;
    const jobId = archJobCard.job.id;
    const sample = (archJobCard.jobParameters as JobParameters).sample;
    // Update the internal state of this job to SUBMITTED.
    const { collectionJobIdStatesMapMap } = this;
    const sourceCollectionId = this.sourceCollectionId as Collection["id"];
    const datasetStates = collectionJobIdStatesMapMap[sourceCollectionId];
    // Prepend a synthetic/dummy JobState object with state = SUBMITTED in order to
    // cause the ArchJobCard button to update its displayed text. This object will
    // be overwritten with a real JobState object once polling starts.
    const syntheticStateArr: [Dataset["id"], string, Dataset["state"]] = [
      0,
      new Date().toISOString(),
      ProcessingState.SUBMITTED,
    ];
    // Prepend if datasetStates[jobId] is defined, otherwise assign.
    if (datasetStates[jobId]) {
      datasetStates[jobId].unshift(syntheticStateArr);
    } else {
      datasetStates[jobId] = [syntheticStateArr];
    }
    // Request a manual re-render.
    archJobCard.jobButton.requestUpdate();
    // Make the request.
    const res = await this.runJob(jobId, sample);

    if (!res.ok) {
      // Delete the synthetic DatasetState object and request a manual re-render.
      datasetStates[jobId].shift();
      archJobCard.jobButton.requestUpdate();
      ArchGlobalModal.showError(
        "",
        "Dataset generation failed. Please try again.",
        archJobCard.jobButton
      );
      return;
    }
    ArchGlobalModal.showNotification(
      "ARCH is generating your dataset",
      `You will receive an email when your dataset is ready. You can monitor its progress on the <a href="${Paths.datasets}">Dataset list</a>.`,
      archJobCard.jobButton
    );
    this.startPolling();
  }
}

// Injects the tag into the global name space
declare global {
  interface HTMLElementTagNameMap {
    "arch-generate-dataset-form": ArchGenerateDatasetForm;
  }
}
