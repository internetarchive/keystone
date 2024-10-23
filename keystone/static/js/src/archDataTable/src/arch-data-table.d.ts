import { PropertyValues } from "lit";
import { AitDataTable } from "../../lib/webservices/src/aitDataTable/index";
export declare class ArchDataTable<RowT> extends AitDataTable<RowT> {
    columnNameHeaderTooltipMap: Record<string, string>;
    static styles: import("lit").CSSResult[];
    constructor();
    addHeaderTooltip(headerName: string, text: string): void;
    firstUpdated(_changedProperties: PropertyValues): void;
}
