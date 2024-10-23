import { PropertyValues } from "lit";
import { ArchDataTable } from "../../archDataTable/index";
import { Collection, ValueOf } from "../../lib/types";
export declare class ArchCollectionsTable extends ArchDataTable<Collection> {
    static styles: import("lit").CSSResult[];
    static renderNameCell(name: ValueOf<Collection>, collection: Collection): HTMLElement;
    static renderLatestDatasetCell(lastJobName: ValueOf<Collection>, collection: Collection): string | HTMLElement;
    willUpdate(_changedProperties: PropertyValues): void;
    postSelectionChangeHandler(selectedRows: Array<Collection>): void;
    selectionActionHandler(action: string, selectedRows: Array<Collection>): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "arch-collections-table": ArchCollectionsTable;
    }
}
