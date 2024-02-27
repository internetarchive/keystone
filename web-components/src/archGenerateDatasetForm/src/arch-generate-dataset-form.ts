import { LitElement, html } from "lit";
import {
  customElement,
  property,
  query,
  queryAll,
  state,
} from "lit/decorators.js";

import ArchAPI from "../../lib/ArchAPI";
import {
  AvailableJob,
  AvailableJobs,
  AvailableJobsCategory,
  Collection,
  JobState,
  FilteredApiResponse,
  ProcessingState,
} from "../../lib/types";
import { AlertClass, ArchAlert } from "../../archAlert/index";
import "./arch-job-category-section";
import { ArchJobCategorySection } from "./arch-job-category-section";
import { ArchJobCard, JobButtonType } from "./arch-job-card";

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
  @state() availableJobs: AvailableJobs = [];
  @state() sourceCollectionId: Collection["id"] | null = null;
  @state() collectionJobStates: Record<
    Collection["id"],
    Record<string, JobState>
  > = {};
  @state() activePollCollectionId: Collection["id"] | null = null;
  @state() anyErrors = false;

  @query("select[name=source-collection]")
  collectionSelector!: HTMLSelectElement;
  @query("arch-alert.error") errorAlert!: ArchAlert;
  @query("arch-alert.email") emailAlert!: ArchAlert;
  @queryAll("arch-job-category-section")
  categorySections!: Array<ArchJobCategorySection>;

  // Apply any ARCH-specific styles.
  static styles = Styles;

  static urlCollectionParamName = "cid";

  async connectedCallback() {
    // Fetch available Collections and Jobs.
    await this.initAvailableJobs();
    void this.initCollections();
    super.connectedCallback();
    this.addEventListener("click", (e: Event) => void this.clickHandler(e));
  }

  createRenderRoot() {
    /* Disable the shadow root for this component to let in global styles.
       https://stackoverflow.com/a/55213037 */
    return this;
  }

  render() {
    const jobIdStatesMap =
      this.sourceCollectionId &&
      this.collectionJobStates[this.sourceCollectionId];
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

      <arch-alert
        class="sample"
        alertClass=${AlertClass.Secondary}
        message="Sample datasets can be quickly generated in order to ensure that the analysis will produce datasets that meet your needs. These datasets use the first 100 relative records from the collection if they are available. We strongly recommend generating samples for any collections over 100GB."
      ></arch-alert>

      <arch-alert
        class="email"
        alertClass=${AlertClass.Primary}
        message="ARCH is creating your dataset. You will receive an email notification when the dataset is complete."
        hidden
      ></arch-alert>

      <arch-alert
        class="error"
        alertClass=${AlertClass.Danger}
        message="A dataset generation job has failed, and we are currently investigating it."
        ?hidden=${!this.anyErrors}
      ></arch-alert>

      ${this.availableJobs.map(
        (jobsCat, i) => html`
          <arch-job-category-section
            .collectionId=${this.sourceCollectionId}
            .jobsCat=${jobsCat}
            .jobIdStatesMap=${jobIdStatesMap}
            ?collapsed=${i > 0}
          >
          </arch-job-category-section>
        `
      )}
    `;
  }

  private setCollectionIdUrlParam(collectionId: Collection["id"]) {
    const { urlCollectionParamName } = ArchGenerateDatasetForm;
    const url = new URL(window.location.href);
    if (!collectionId) {
      url.searchParams.delete(urlCollectionParamName);
    } else {
      url.searchParams.set(urlCollectionParamName, collectionId.toString());
    }
    history.replaceState(null, "", url.toString());
  }

  private async sourceCollectionChangeHandler(e: Event) {
    const collectionId = parseInt((e.target as HTMLSelectElement).value);
    this.setCollectionIdUrlParam(collectionId);
    await this.setSourceCollectionId(collectionId);
    this.requestUpdate();
  }

  private updateAnyErrors() {
    /* If collectionId is set, set anyErrors=true if any job failed, otherwise set
     * anyErrors=false
     */
    const { sourceCollectionId } = this;
    if (sourceCollectionId) {
      for (const jobState of Object.values(
        this.collectionJobStates[sourceCollectionId]
      )) {
        if (jobState.state === ProcessingState.FAILED) {
          this.anyErrors = true;
          return;
        }
      }
    }
    this.anyErrors = false;
  }

  private async setSourceCollectionId(collectionId: Collection["id"]) {
    this.sourceCollectionId = collectionId;
    // If a collection is selected, fetch the job states.
    if (collectionId) {
      this.collectionJobStates[collectionId] =
        await this.fetchCollectionJobStates(collectionId);
    }
    // Update the visibility of the error alert.
    this.updateAnyErrors();
  }

  private async initCollections() {
    const response =
      (await ArchAPI.collections.get()) as FilteredApiResponse<Collection>;
    this.collections = response.items;
    // Maybe select an initial Collection.
    const initialCollectionId = parseInt(
      new URLSearchParams(window.location.search).get(
        ArchGenerateDatasetForm.urlCollectionParamName
      ) ?? ""
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

  private async fetchCollectionJobStates(collectionId: Collection["id"]) {
    const jobStates = (await (
      await fetch(`/api/collections/${collectionId}/dataset_states`)
    ).json()) as Array<JobState>;
    return Object.fromEntries(
      jobStates.map((jobState) => [
        `${jobState.job_id}${jobState.is_sample ? "-SAMPLE" : ""}`,
        jobState,
      ])
    ) as Record<string, JobState>;
  }

  async pollJobStates() {
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
    this.collectionJobStates[sourceCollectionId] =
      await this.fetchCollectionJobStates(sourceCollectionId);
    // Show the error alert if any jobs failed.
    this.updateAnyErrors();
    // Request a lit component update.
    this.requestUpdate();
    // Keep polling if any jobs remain active.
    for (const jobState of Object.values(
      this.collectionJobStates[sourceCollectionId]
    )) {
      if (jobState.state === ProcessingState.RUNNING) {
        // A job is active, set a polling timeout and return.
        setTimeout(() => void this.pollJobStates(), 2000);
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
    void this.pollJobStates();
  }

  private expandCategorySection(categorySection: ArchJobCategorySection) {
    this.categorySections.forEach((el) => {
      if (el === categorySection) {
        el.expand();
      } else {
        el.collapse();
      }
    });
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

  private async clickHandler(e: Event) {
    const target = e.target as HTMLElement;
    // Handle a collapsed category section click.
    const categorySection = target.closest("arch-job-category-section");
    if (categorySection?.collapsed) {
      this.expandCategorySection(categorySection);
      return;
    }

    // Handle a job button click.
    if (
      target.tagName === "BUTTON" &&
      target.dataset.buttonType === JobButtonType.Generate
    ) {
      // Disable the button and display the starting... indicator.
      const button = target as HTMLButtonElement;
      button.disabled = true;
      const { jobId, sample: sampleStr } = target.dataset as {
        jobId: string;
        sample: string;
      };
      // Cast presence / absence of sample value to bool.
      const sample = sampleStr !== undefined;
      // Update the internal state of this job to SUBMITTED.
      const { collectionJobStates } = this;
      let { sourceCollectionId } = this;
      sourceCollectionId = sourceCollectionId as Collection["id"];
      const jobStateKey = `${jobId}${sample ? "-SAMPLE" : ""}`;
      const jobStates = collectionJobStates[sourceCollectionId];
      // Create a synthetic/dummy JobState object with state = SUBMITTED in order to
      // cause the ArchJobCard button to update its displayed text. This object will
      // be overwritten with a real JobState object once polling starts.
      jobStates[jobStateKey] = {
        category_name: "",
        collection_id: sourceCollectionId,
        collection_name: "",
        finished_time: new Date(),
        id: "",
        is_sample: sample,
        job_id: jobId,
        name: "",
        start_time: new Date(),
        state: ProcessingState.SUBMITTED,
      };
      // Request a manual re-render.
      const archJobCard = target.closest("arch-job-card") as ArchJobCard;
      archJobCard.requestUpdate();
      // Make the request.
      const res = await this.runJob(jobId, sample);
      if (!res.ok) {
        // Re-enable the button on error.
        button.disabled = false;
        // Delete the synthetic JobState object and request a manual re-render.
        delete jobStates[jobStateKey];
        archJobCard.requestUpdate();
        return;
      }
      this.emailAlert.show();
      this.startPolling();
    }
  }
}

// Injects the tag into the global name space
declare global {
  interface HTMLElementTagNameMap {
    "arch-generate-dataset-form": ArchGenerateDatasetForm;
  }
}
