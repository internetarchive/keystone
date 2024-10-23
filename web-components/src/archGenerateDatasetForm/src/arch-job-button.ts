import { LitElement, TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import "../../archLoadingIndicator/index";

import {
  JobIdStatesMap,
  JobParameters,
  ProcessingState,
  ValueOf,
} from "../../lib/types";

import "../../archModal/src/arch-modal";
import styles from "./arch-job-card-styles";

@customElement("arch-job-button")
export class ArchJobButton extends LitElement {
  @property() buttonClass = "";
  @property() buttonHTML: TemplateResult = html``;
  @property() jobName = "";
  @property() collectionName = "";
  @property() jobParameters!: JobParameters;
  @property() jobStateTuples: ValueOf<JobIdStatesMap> = [];

  static styles = styles;

  // Set delegatesFocus=true so that we can restore focus to the job button
  // on arch-global-modal close.
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  private renderButton(): TemplateResult {
    const { jobStateTuples } = this;

    const _renderButton = (
      text: string,
      loading: boolean,
      disabled: boolean,
      className = ""
    ) => html`
      <button slot="trigger" class=${className} ?disabled=${disabled}>
        ${!loading
          ? text
          : html`<arch-loading-indicator
              text=${text}
            ></arch-loading-indicator>`}
      </button>
    `;

    switch (jobStateTuples) {
      case undefined:
        // Job states are loading - likely in response to a collection selection change.
        return _renderButton("Loading", true, true);
        break;
      case null:
        // No previous runs exist for this job.
        return _renderButton("Generate Dataset", false, false, "primary");
        break;
    }

    const latestState = jobStateTuples[0][2];
    switch (latestState) {
      case ProcessingState.SUBMITTED:
        // A new job was submitted.
        return _renderButton("Job Starting", true, true);
        break;
      case ProcessingState.QUEUED:
        return _renderButton("Job Queued", false, true);
        break;
      case ProcessingState.RUNNING:
        return _renderButton("Job Running", true, true);
        break;
      case ProcessingState.FINISHED:
      case ProcessingState.FAILED:
      case ProcessingState.CANCELLED:
        // The most recent job run has finished.
        return _renderButton("Generate New Dataset", false, false, "primary");
        break;
    }
  }

  render() {
    const { jobParameters, jobName, collectionName } = this;
    return html`
      <arch-modal title="Generate Dataset">
        <div slot="content">
          <p>
            You're about to generate a <strong>${jobName}</strong> dataset from
            the <strong>${collectionName}</strong> collection with the following
            configuration:
            <dl>
            ${Object.entries(jobParameters).map(
              ([k, v]) => html`
                <dt>${k}</dt>
                <dd>${typeof v === "boolean" ? (v ? "Yes" : "No") : v}</dd>
                <br />
              `
            )}
            </dl>
          </p>
        </div>
        ${this.renderButton()}
      </arch-modal>
    `;
  }
}

// Injects the tag into the global name space
declare global {
  interface HTMLElementTagNameMap {
    "arch-job-button": ArchJobButton;
  }
}
