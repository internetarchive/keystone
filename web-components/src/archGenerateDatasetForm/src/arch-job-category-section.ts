import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import "@spectrum-web-components/tabs/sp-tabs.js";
import "@spectrum-web-components/tabs/sp-tab.js";
import "@spectrum-web-components/tabs/sp-tab-panel.js";
import "@spectrum-web-components/theme/sp-theme.js";
import "@spectrum-web-components/theme/src/themes.js";

import { AvailableJobsCategory, JobState } from "../../lib/types";

import "../../archJobParametersForm/index";
import "./arch-job-card";
import Styles from "./styles";

@customElement("arch-job-category-section")
export class ArchJobCategorySection extends LitElement {
  @property({ type: String }) collectionId!: number;
  @property({ type: String }) collectionName!: string;
  @property({ type: Object }) jobsCat!: AvailableJobsCategory;
  @property({ type: Object }) jobIdStatesMap!: Record<string, JobState>;

  // Apply any ARCH-specific styles.
  static styles = Styles;

  render() {
    const { collectionId, collectionName, jobIdStatesMap } = this;
    const { categoryDescription, jobs } = this.jobsCat;
    return html`
      <div class="category-header">
        <p class="category-description">${categoryDescription}</p>
      </div>

      <label for="job-tabs">Select Dataset Type</label>
      <br />
      <sp-theme color="light" scale="medium">
        <sp-tabs
          compact
          direction="vertical"
          selected="${jobs[0].id}"
          name="job-tabs"
        >
          ${jobs.map(
            (job) => html`<sp-tab
                label="${job.name}"
                value="${job.id}"
              ></sp-tab>
              <sp-tab-panel value="${job.id}">
                <arch-job-card
                  .collectionId=${collectionId}
                  .collectionName=${collectionName}
                  .job=${job}
                  .jobIdStatesMap=${jobIdStatesMap}
                ></arch-job-card>
              </sp-tab-panel>`
          )}
        </sp-tabs>
      </sp-theme>
    `;
  }
}

// Injects the tag into the global name space
declare global {
  interface HTMLElementTagNameMap {
    "arch-job-category-section": ArchJobCategorySection;
  }
}
