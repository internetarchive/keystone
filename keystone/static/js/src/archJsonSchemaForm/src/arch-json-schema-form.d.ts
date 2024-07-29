import { JSONSchemaType } from "ajv/lib/types/json-schema";
import { LitElement, PropertyValues, TemplateResult } from "lit";
import "@spectrum-web-components/switch/sp-switch.js";
export declare class ArchJsonSchemaForm<T> extends LitElement {
    schema: JSONSchemaType<T>;
    data: T;
    propertiesOrder: Array<keyof T>;
    form: HTMLFormElement;
    inputs: NodeList;
    static styles: import("lit").CSSResult[];
    get validator(): import("ajv").ValidateFunction<T>;
    connectedCallback(): void;
    private generateSelectInput;
    private generateRadioInput;
    private generateTextInput;
    private generateTextareaInput;
    private generateCheckboxInput;
    private _propToInput;
    render(): TemplateResult<1>;
    willUpdate(changedProperties: PropertyValues<this>): void;
    updated(): void;
    private _addFieldSelectHandler;
    private _addDataValue;
    private _updateDataValue;
    private _removeDataValue;
    onChange(data: T): void;
}
