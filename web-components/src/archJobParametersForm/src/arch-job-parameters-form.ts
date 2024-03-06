import { customElement } from "lit/decorators.js";

import { JobParameters } from "../../lib/types";
import { ArchJsonSchemaForm } from "../../archJsonSchemaForm/index";

import styles from "./styles";

@customElement("arch-job-parameters-form")
export class ArchJobParametersForm extends ArchJsonSchemaForm<JobParameters> {
  static styles = styles;
}

// Injects the tag into the global name space
declare global {
  interface HTMLElementTagNameMap {
    "arch-job-parameters-form": ArchJobParametersForm;
  }
}
