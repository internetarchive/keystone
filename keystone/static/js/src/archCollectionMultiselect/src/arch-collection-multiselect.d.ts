import { LitElement, TemplateResult } from "lit";
export declare class ArchCollectionMultiselect extends LitElement {
    accountId: number;
    label: string;
    name: string;
    preselectedIds: Array<number>;
    private _collectionIdNamePairs;
    private _numTotal;
    private _numSelected;
    allSelected: boolean;
    connectedCallback(): Promise<void>;
    createRenderRoot(): this;
    render(): TemplateResult;
    private _changeHandler;
}
