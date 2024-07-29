import { customElement } from "lit/decorators.js";

import { PublishedDatasetMetadata } from "../../lib/types";
import { ArchJsonSchemaForm } from "../../archJsonSchemaForm/index";

@customElement("arch-dataset-metadata-form")
export class ArchDatasetMetadataForm extends ArchJsonSchemaForm<PublishedDatasetMetadata> {}

// Injects the tag into the global name space
declare global {
  interface HTMLElementTagNameMap {
    "arch-dataset-metadata-form": ArchDatasetMetadataForm;
  }
}
