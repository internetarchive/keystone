import { LitElement, TemplateResult } from "lit";
import "../../archLoadingIndicator/index";
import { JobIdStatesMap, ValueOf } from "../../lib/types";
import "../../archModal/src/arch-modal";
export declare class ArchJobButton extends LitElement {
    buttonClass: string;
    buttonHTML: TemplateResult;
    jobName: string;
    collectionName: string;
    jobStateTuples: ValueOf<JobIdStatesMap>;
    static styles: import("lit").CSSResult[];
    static shadowRootOptions: {
        delegatesFocus: boolean;
        mode: ShadowRootMode;
        slotAssignment?: SlotAssignmentMode | undefined;
        customElements?: CustomElementRegistry | undefined;
    };
    private renderButton;
    render(): TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "arch-job-button": ArchJobButton;
    }
}
