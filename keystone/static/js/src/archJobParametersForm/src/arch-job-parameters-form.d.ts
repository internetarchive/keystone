import { JobParameters } from "../../lib/types";
import { ArchJsonSchemaForm } from "../../archJsonSchemaForm/index";
export declare class ArchJobParametersForm extends ArchJsonSchemaForm<JobParameters> {
    static styles: import("lit").CSSResult[];
}
declare global {
    interface HTMLElementTagNameMap {
        "arch-job-parameters-form": ArchJobParametersForm;
    }
}
