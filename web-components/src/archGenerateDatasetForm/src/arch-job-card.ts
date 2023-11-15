import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { AvailableJob, JobState, ProcessingState } from "../../lib/types";

export enum JobButtonType {
  Generate = "generate",
  View = "view",
  Status = "status",
}

@customElement("arch-job-card")
export class ArchJobCard extends LitElement {
  @property() collectionId!: string;
  @property() job!: AvailableJob;
  @property() jobIdStatesMap!: Record<string, JobState>;

  createRenderRoot() {
    /* Disable the shadow root for this component to let in global styles.
       https://stackoverflow.com/a/55213037 */
    return this;
  }

  private jobStateToButtonProps(
    jobState: JobState | undefined | null,
    sample: boolean
  ) {
    /* Return the [ButtonText, ButtonType, ClassName] tuple for the specificed JobState */
    if (jobState === undefined) {
      return [
        this.collectionId ? "Loading..." : "n/a",
        JobButtonType.Status,
        "job-statebutton",
      ];
    }
    const sampleStr = sample ? "Sample " : "";
    if (jobState === null) {
      return [
        `Generate ${sampleStr}Dataset`,
        JobButtonType.Generate,
        "job-runbutton",
      ];
    }
    if (jobState.state === ProcessingState.FINISHED) {
      return [
        `View ${sampleStr}Dataset`,
        JobButtonType.View,
        "job-resultsbutton",
      ];
    }
    return [jobState.state, JobButtonType.Status, "job-statebutton"];
  }

  render() {
    // Get the current job states.
    const { collectionId, job } = this;
    const { id: jobId } = job;
    // Use undefined to indicate that a job state is loading, and null to
    // indicate that no such job run exists.
    const [sampleJobState, jobState] = !this.jobIdStatesMap
      ? [undefined, undefined]
      : [
          this.jobIdStatesMap[`${jobId}-SAMPLE`] ?? null,
          this.jobIdStatesMap[jobId] ?? null,
        ];
    const [sampleButtonText, sampleButtonType, sampleClassName] =
      this.jobStateToButtonProps(sampleJobState, true);
    const [buttonText, buttonType, className] = this.jobStateToButtonProps(
      jobState,
      false
    );
    const title = collectionId
      ? ""
      : "Select a source collection to enable this button";
    return html` <div class="card">
      <div class="card-body">
        <h2 class="card-title">${job.name}</h2>
        <p class="card-text">${job.description}</p>
        <div class="job-card-flex">
          <div class="job-card-sample">
            ${sampleButtonType === JobButtonType.View
              ? html`
                  <a
                    href="/datasets/${(sampleJobState as JobState).id}"
                    class="button ${sampleClassName}"
                  >
                    ${sampleButtonText}
                  </a>
                `
              : html`
                  <button
                    class="job-button ${sampleClassName}"
                    style="display: block"
                    data-job-id="${jobId}"
                    data-button-type="${sampleButtonType}"
                    data-sample=""
                    title="${title}"
                  >
                    ${sampleButtonText}
                  </button>
                `}
          </div>
          <div class="job-card-full">
            ${buttonType === JobButtonType.View
              ? html`
                  <a
                    href="/datasets/${(jobState as JobState).id}"
                    class="button ${className}"
                  >
                    ${buttonText}
                  </a>
                `
              : html`
                  <button
                    class="job-button ${className}"
                    style="display: block"
                    data-job-id="${jobId}"
                    data-button-type="${buttonType}"
                    title="${title}"
                  >
                    ${buttonText}
                  </button>
                `}
          </div>
        </div>
      </div>
    </div>`;
  }
}

// Injects the tag into the global name space
declare global {
  interface HTMLElementTagNameMap {
    "arch-job-card": ArchJobCard;
  }
}
