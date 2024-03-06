import { PublishedDatasetMetadata } from "../../lib/types";
import { ArchJsonSchemaForm } from "../../archJsonSchemaForm/index";
export declare class ArchDatasetMetadataForm extends ArchJsonSchemaForm<PublishedDatasetMetadata> {
}
declare global {
    interface HTMLElementTagNameMap {
        "arch-dataset-metadata-form": ArchDatasetMetadataForm;
    }
}
