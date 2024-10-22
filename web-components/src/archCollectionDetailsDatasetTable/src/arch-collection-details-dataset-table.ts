import { PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { ArchDataTable } from "../../archDataTable/index";
import { BoolDisplayMap, EventTypeDisplayMap } from "../../lib/constants";
import { Dataset, ValueOf } from "../../lib/types";
import { Topics } from "../../lib/pubsub";
import {
  Paths,
  createElement,
  isActiveProcessingState,
  isoStringToDateString,
} from "../../lib/helpers";
import { ProcessingState } from "../../lib/types";
import Styles from "./styles";

@customElement("arch-collection-details-dataset-table")
export class ArchCollectionDetailsDatasetTable extends ArchDataTable<Dataset> {
  @property({ type: Number }) collectionId!: number;

  @state() columnNameHeaderTooltipMap = {
    category:
      "Dataset categories are Collection, Network, Text, and File Format",
    sample:
      "Sample datasets contain only the first 100 available records from a collection",
  };

  static styles = [...ArchDataTable.styles, ...Styles];

  static renderDatasetCell(
    name: ValueOf<Dataset>,
    dataset: Dataset
  ): string | HTMLElement {
    /*
     * Render a `Dataset` cell value.
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

  willUpdate(_changedProperties: PropertyValues) {
    super.willUpdate(_changedProperties);

    this.apiCollectionEndpoint = "/datasets";
    this.apiItemResponseIsArray = true;
    this.apiItemTemplate = "/datasets?id=:id";
    this.itemPollPredicate = (item) => isActiveProcessingState(item.state);
    this.itemPollPeriodSeconds = 3;
    this.apiStaticParamPairs = [["collection_id", `${this.collectionId}`]];
    this.cellRenderers = [
      ArchCollectionDetailsDatasetTable.renderDatasetCell,
      (categoryName) => categoryName as Dataset["category_name"],
      (isSample) =>
        BoolDisplayMap[(isSample as Dataset["is_sample"]).toString()],
      (state) => EventTypeDisplayMap[state as Dataset["state"]],
      (startTime) => isoStringToDateString(startTime as Dataset["start_time"]),
      (finishedTime) =>
        finishedTime === null
          ? ""
          : isoStringToDateString(finishedTime as Dataset["finished_time"]),
    ];
    this.columnFilterDisplayMaps = [undefined, undefined, BoolDisplayMap];
    this.columns = [
      "name",
      "category_name",
      "is_sample",
      "state",
      "start_time",
      "finished_time",
    ];
    this.columnHeaders = [
      "Dataset",
      "Category",
      "Sample",
      "State",
      "Started",
      "Finished",
    ];
    this.filterableColumns = [true, true, true, true, false, false];
    this.nonSelectionActionLabels = ["Generate a New Dataset"];
    this.nonSelectionActions = [Topics.GENERATE_DATASET];
    this.singleName = "Dataset";
    this.sort = "-start_time";
    this.sortableColumns = [true, true, true, true, true, true];
    this.persistSearchStateInUrl = true;
    this.pluralName = "Datasets";
  }

  nonSelectionActionHandler(action: string) {
    switch (action) {
      case Topics.GENERATE_DATASET:
        window.location.href = Paths.generateCollectionDataset(
          this.collectionId
        );
        break;
      default:
        break;
    }
  }
}

// Injects the tag into the global name space
declare global {
  interface HTMLElementTagNameMap {
    "arch-collection-details-dataset-table": ArchCollectionDetailsDatasetTable;
  }
}
