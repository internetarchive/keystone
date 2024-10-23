import { PropertyValues } from "lit";
import { customElement, state } from "lit/decorators.js";

import { ArchDataTable } from "../../archDataTable/index";
import { BoolDisplayMap, EventTypeDisplayMap } from "../../lib/constants";
import { Dataset, ProcessingState, ValueOf } from "../../lib/types";
import {
  Paths,
  createElement,
  isActiveProcessingState,
  isoStringToDateString,
} from "../../lib/helpers";
import Styles from "./styles";

@customElement("arch-dataset-explorer-table")
export class ArchDatasetExplorerTable extends ArchDataTable<Dataset> {
  @state() columnNameHeaderTooltipMap = {
    category:
      "Dataset categories are Collection, Network, Text, and File Format",
    sample:
      "Sample datasets contain only the first 100 available records from a collection",
  };

  static styles = [...ArchDataTable.styles, ...Styles];

  static renderNameCell(
    name: ValueOf<Dataset>,
    dataset: Dataset
  ): string | HTMLElement {
    /*
     * Render the `Name` cell value.
     */
    if (dataset.state !== ProcessingState.FINISHED) {
      return dataset.name;
    }
    return createElement("a", {
      href: Paths.dataset(dataset.id),
      children: [
        createElement("span", {
          className: "highlightable",
          textContent: dataset.name,
        }),
      ],
    });
  }

  static renderCollectionCell(
    collectionName: ValueOf<Dataset>,
    dataset: Dataset
  ): HTMLElement {
    const nameEl = createElement("span", {
      className: "highlightable",
      textContent: collectionName.toString(),
    });

    if (!dataset.collection_access) {
      nameEl.classList.add("no-collection-access");
      nameEl.title = "You are not authorized to access this collection";
      return nameEl;
    }

    return createElement("a", {
      href: Paths.collection(dataset.collection_id),
      children: [nameEl],
    });
  }

  willUpdate(_changedProperties: PropertyValues) {
    super.willUpdate(_changedProperties);

    this.apiCollectionEndpoint = "/datasets";
    this.apiItemResponseIsArray = true;
    this.apiItemTemplate = "/datasets?id=:id";
    this.itemPollPredicate = (item) => isActiveProcessingState(item.state);
    this.itemPollPeriodSeconds = 3;
    this.apiStaticParamPairs = [];
    this.cellRenderers = [
      ArchDatasetExplorerTable.renderNameCell,

      (categoryName) => categoryName as Dataset["category_name"],

      ArchDatasetExplorerTable.renderCollectionCell,

      (isSample) =>
        BoolDisplayMap[(isSample as Dataset["is_sample"]).toString()],

      (state) => EventTypeDisplayMap[state as Dataset["state"]],

      (startTime) => isoStringToDateString(startTime as Dataset["start_time"]),

      (finishedTime) =>
        finishedTime === null
          ? ""
          : isoStringToDateString(finishedTime as Dataset["finished_time"]),
    ];
    this.columnFilterDisplayMaps = [
      undefined,
      undefined,
      undefined,
      BoolDisplayMap,
    ];
    this.columns = [
      "name",
      "category_name",
      "collection_name",
      "is_sample",
      "state",
      "start_time",
      "finished_time",
    ];
    this.columnHeaders = [
      "Dataset",
      "Category",
      "Collection",
      "Sample",
      "State",
      "Started",
      "Finished",
    ];
    this.filterableColumns = [true, true, true, true, true, false, false];
    this.searchColumns = ["name", "category_name", "collection_name", "state"];
    this.searchColumnLabels = ["Name", "Category", "Collection", "State"];
    this.singleName = "Dataset";
    this.sort = "-start_time";
    this.sortableColumns = [true, true, true, true, true, true, true];
    this.persistSearchStateInUrl = true;
    this.pluralName = "Datasets";
  }
}

// Injects the tag into the global name space
declare global {
  interface HTMLElementTagNameMap {
    "arch-dataset-explorer-table": ArchDatasetExplorerTable;
  }
}
