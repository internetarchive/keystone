import { LitElement } from "lit";
import "@spectrum-web-components/tabs/sp-tabs.js";
import "@spectrum-web-components/tabs/sp-tab.js";
import "@spectrum-web-components/tabs/sp-tab-panel.js";
import "@spectrum-web-components/theme/sp-theme.js";
import "@spectrum-web-components/theme/src/themes.js";
import { AvailableJobsCategory, JobState } from "../../lib/types";
import "../../archJobParametersForm/index";
import "./arch-job-card";
export declare class ArchJobCategorySection extends LitElement {
    collectionId: string;
    jobsCat: AvailableJobsCategory;
    jobIdStatesMap: Record<string, JobState>;
    collectionDetailPageUrlTemplate: string;
    static styles: import("lit").CSSResult[];
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "arch-job-category-section": ArchJobCategorySection;
    }
}
