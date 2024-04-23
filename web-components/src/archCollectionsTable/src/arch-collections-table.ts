import { PropertyValues } from "lit";
import { customElement } from "lit/decorators.js";

import { ArchDataTable } from "../../archDataTable/index";
import { CollectionTypeDisplayMap } from "../../lib/constants";
import {
  Collection,
  CollectionType,
  CustomCollectionMetadata,
  ProcessingState,
} from "../../lib/types";
import { Topics } from "../../lib/pubsub";
import {
  Paths,
  humanBytes,
  htmlAttrEscape as _,
  isActiveProcessingState,
  isoStringToDateString,
} from "../../lib/helpers";
import Styles from "./styles";

@customElement("arch-collections-table")
export class ArchCollectionsTable extends ArchDataTable<Collection> {
  static styles = [...ArchDataTable.styles, ...Styles];

  willUpdate(_changedProperties: PropertyValues) {
    super.willUpdate(_changedProperties);

    this.actionButtonLabels = ["Generate Dataset", "Create Custom Collection"];
    this.actionButtonSignals = [
      Topics.GENERATE_DATASET,
      Topics.CREATE_SUB_COLLECTION,
    ];
    this.apiCollectionEndpoint = "/collections";
    this.apiItemResponseIsArray = true;
    this.apiItemTemplate = "/collections?id=:id";
    this.itemPollPredicate = (item) =>
      item.collection_type === CollectionType.CUSTOM
        ? isActiveProcessingState(
            (item.metadata as CustomCollectionMetadata).state
          )
        : false;
    this.itemPollPeriodSeconds = 3;

    /* eslint-disable @typescript-eslint/restrict-template-expressions */
    this.cellRenderers = [
      (name, collection: Collection) => {
        const nonRunningCustomValue = `
            <a href="/collections/${_(collection.id.toString())}" title="${_(
          name as string
        )}">
              <span class="highlightable">${name}</span>
            </a>
        `;

        if (collection.collection_type !== CollectionType.CUSTOM) {
          return nonRunningCustomValue;
        }

        const { state } = collection.metadata as CustomCollectionMetadata;
        if (state === ProcessingState.FINISHED) {
          return nonRunningCustomValue;
        }

        return `
            <span title="This Custom collection is in the process of being created">${name} <i>(${
          state === ProcessingState.RUNNING ? "CREATING" : state
        })</i></span>
        `;
      },

      (collectionType) =>
        CollectionTypeDisplayMap[collectionType as CollectionType],

      (isPublic) => `${isPublic ? "Yes" : "No"}`,

      (lastJobName, collection: Collection) => {
        if (lastJobName === null) {
          return "";
        }
        lastJobName = lastJobName as string;
        return `
          <a href="${Paths.dataset(collection.latest_dataset.id)}"
             title="${_(lastJobName)}">
            ${lastJobName}
          </a>
        `;
      },

      (lastJobTime) =>
        !lastJobTime ? "" : isoStringToDateString(lastJobTime as string),

      (_, collection: Collection) =>
        collection.collection_type === CollectionType.CUSTOM &&
        (collection.metadata as CustomCollectionMetadata).state !==
          ProcessingState.FINISHED
          ? ""
          : humanBytes(collection.size_bytes, 1),
    ];
    /* eslint-enable @typescript-eslint/restrict-template-expressions */

    this.columnFilterDisplayMaps = [
      undefined,
      undefined,
      { true: "Yes", false: "No" },
    ];
    this.columns = [
      "name",
      "collection_type",
      "metadata.is_public",
      "latest_dataset.name",
      "latest_dataset.start_time",
      "size_bytes",
    ];
    this.columnHeaders = [
      "Name",
      "Type",
      "Public",
      "Latest Dataset",
      "Dataset Date",
      "Size",
    ];
    this.rowSelectDisabledCallback = (row: Collection) => {
      const metadata = row.metadata as CustomCollectionMetadata;
      return metadata.state && isActiveProcessingState(metadata.state);
    };
    this.selectable = true;
    this.sort = "-id";
    this.sortableColumns = [true, true, false, false, false, true];
    this.filterableColumns = [false, true, true];
    this.searchColumns = ["name"];
    this.searchColumnLabels = ["Name"];
    this.singleName = "Collection";
    this.persistSearchStateInUrl = true;
    this.pluralName = "Collections";
  }

  postSelectionChangeHandler(selectedRows: Array<Collection>) {
    /* Update DataTable.actionButtonDisabled based on the number
       of selected rows.
    */
    const { dataTable } = this;
    const { props } = dataTable;
    const numSelected = selectedRows.length;
    const generateDatasetEnabled = numSelected === 1;
    const createSubCollectionEnabled = true;
    props.actionButtonDisabled = [
      !generateDatasetEnabled,
      !createSubCollectionEnabled,
    ];
    dataTable.setSelectionActionButtonDisabledState(numSelected === 0);
  }

  selectionActionHandler(action: string, selectedRows: Array<Collection>) {
    switch (action) {
      case Topics.GENERATE_DATASET:
        window.location.href = Paths.generateCollectionDataset(
          selectedRows[0].id
        );
        break;
      case Topics.CREATE_SUB_COLLECTION:
        window.location.href = Paths.buildSubCollection(
          selectedRows.map((x) => x.id)
        );
    }
  }
}

// Injects the tag into the global name space
declare global {
  interface HTMLElementTagNameMap {
    "arch-collections-table": ArchCollectionsTable;
  }
}
