import { LitElement, html } from "lit";

import { customElement, property, query, state } from "lit/decorators.js";

import {
  AvailableJob,
  JobIdStatesMap,
  JobParameters,
  ProcessingState,
  SomeJSONSchema,
} from "../../lib/types";

import { Paths, isoStringToDateString } from "../../lib/helpers";

import { ArchJobButton } from "./arch-job-button";
import "./arch-job-button";
import styles from "./arch-job-card-styles";

@customElement("arch-job-card")
export class ArchJobCard extends LitElement {
  @property({ type: Number }) collectionId!: number;
  @property({ type: String }) collectionName!: string;
  @property() job!: AvailableJob;
  @property() jobIdStatesMap!: JobIdStatesMap;

  @state() jobParameters: object | JobParameters = {};

  @query("arch-job-button") jobButton!: ArchJobButton;

  static styles = styles;

  static DefaultParametersSchema: SomeJSONSchema = {
    type: "object",
    required: [],
    properties: {},
  };

  private extendParamsSchemaWithDefaultOptions(
    schema: AvailableJob["parameters_schema"]
  ): AvailableJob["parameters_schema"] {
    schema = schema ?? ArchJobCard.DefaultParametersSchema;
    return Object.assign(schema, {
      properties: Object.assign(
        schema.properties as Record<string, SomeJSONSchema>,
        {
          sample: {
            type: "boolean",
            title: "Sample",
            default: false,
            description:
              "Generate a sample dataset from a small subset of records",
          },
        }
      ),
    });
  }

  get historicalDatasetsUrl() {
    const { collectionId, job } = this;
    return `${Paths.collection(collectionId)}?column-name=${encodeURIComponent(
      job.name
    )}`;
  }

  renderHistory() {
    const { jobIdStatesMap, job } = this;
    const stateTuples = jobIdStatesMap && jobIdStatesMap[job.id];
    if (stateTuples === undefined || stateTuples.length === 0) {
      return html`
        <h4>History</h4>
        <p class="history">
          No datasets of this type have been generated for this collection.
        </p>
      `;
    }
    const finishedStates = stateTuples.filter(
      ([, , state]) => state === ProcessingState.FINISHED
    );
    if (finishedStates.length === 0) {
      return html`
        <h4>History</h4>
        <p class="history">
          No datasets of this type have been completed for this collection.
        </p>
      `;
    }
    const hasMulti = finishedStates.length > 1;
    return html`
      <h4>History</h4>
      <p class="history">
        You've generated this dataset
        <a href="${this.historicalDatasetsUrl}" target="_blank">
          <strong
            >${finishedStates.length}&nbsp;time${hasMulti ? "s" : ""}</strong
          >
        </a>
        for this collection, most recently on
        <a href="${Paths.dataset(finishedStates[0][0])}">
          <strong>${isoStringToDateString(finishedStates[0][1])}</strong> </a
        >.
      </p>
    `;
  }

  renderConfigureJob() {
    const { job, jobParameters } = this;
    // Call jobButton.requestUpdate() on data-change event in to ensure that it
    // has a fresh copy of jobParameters to display in the confirmation modal.
    return html`
      <h4>Configure</h4>
      <arch-job-parameters-form
        .schema=${this.extendParamsSchemaWithDefaultOptions(
          job.parameters_schema
        )}
        .data=${jobParameters as JobParameters}
        @data-change=${() => this.jobButton.requestUpdate()}
      ></arch-job-parameters-form>
    `;
  }

  emitGenerateDataset(e: Event) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent("generate-dataset", {
        detail: { archJobCard: this },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    // Get the current job states.
    const { collectionId, collectionName, job, jobIdStatesMap, jobParameters } =
      this;
    const { id: jobId } = job;
    // Use undefined to indicate that a job state is loading, and null to
    // indicate that no such job run exists.
    const stateTuples = !this.jobIdStatesMap
      ? undefined
      : jobIdStatesMap[jobId] ?? null;

    return html` <div>
      <h3>${job.name}</h3>
      <p>
        ${job.description}
        <a href="${job.info_url}">Learn&nbsp;more &gt;</a>.
        <a href="${job.code_url}">Read&nbsp;the&nbsp;code &gt;</a>.
      </p>
      ${collectionId === null
        ? html`<p class="alert alert-info">
            Select a Source Collection above to display the options for
            generating a Dataset of this type.
          </p>`
        : html`
            ${this.renderHistory()} ${this.renderConfigureJob()}
            <arch-job-button
              .jobName=${job.name}
              .collectionName=${collectionName}
              .jobStateTuples=${stateTuples}
              .jobParameters=${jobParameters}
              @submit=${this.emitGenerateDataset.bind(this)}
            >
            </arch-job-button>
          `}
    </div>`;
  }
}

// Injects the tag into the global name space
declare global {
  interface HTMLElementTagNameMap {
    "arch-job-card": ArchJobCard;
  }
}
