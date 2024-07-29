import Ajv from "ajv";
import { JSONSchemaType, SomeJSONSchema } from "ajv/lib/types/json-schema";
import { LitElement, PropertyValues, TemplateResult, html } from "lit";
import {
  customElement,
  property,
  query,
  queryAll,
  state,
} from "lit/decorators.js";

import "@spectrum-web-components/switch/sp-switch.js";
import { Switch } from "@spectrum-web-components/switch";

import styles from "./styles";

@customElement("arch-json-schema-form")
export class ArchJsonSchemaForm<T> extends LitElement {
  @property({ type: Object }) schema!: JSONSchemaType<T>;
  @property({ type: Object }) data!: T;

  @state() propertiesOrder: Array<keyof T> = [];

  @query("form") form!: HTMLFormElement;
  @queryAll("input, textarea") inputs!: NodeList;

  static styles = styles;

  get validator() {
    const ajv = new Ajv();
    ajv.addKeyword("propertiesOrder");
    return ajv.compile(this.schema);
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.propertiesOrder.length > 0) {
      return;
    }
    // It proved difficult to extend the JSONSchemaType with the extra propertiesOrder
    // attribute, so we'll just state its type here and, if not defined, use the key
    // order of schema.properties instead.
    const { schema } = this;
    this.propertiesOrder = (schema.propertiesOrder ||
      Array.from(
        Object.keys(schema.properties as Record<string, SomeJSONSchema>)
      )) as Array<keyof T>;
  }

  private generateSelectInput(
    name: string,
    choices: Array<string>,
    value: string
  ): TemplateResult {
    return html`
      <select
        name=${name}
        @change=${(e: Event) =>
          this._updateDataValue(
            name,
            (e.target as HTMLSelectElement).value as T[keyof T]
          )}
      >
        ${choices.map(
          (choice) =>
            html`<option value=${choice} ?selected=${choice === value}>
              ${choice}
            </option>`
        )}
      </select>
    `;
  }

  private generateRadioInput(
    name: string,
    valueSpecs: Array<{
      title?: string;
      const: string;
      description?: string;
    }>,
    value: string
  ): TemplateResult {
    return html`
      <div>
        ${valueSpecs.map(
          (choice: {
            const: string;
            title?: string;
            description?: string;
          }) => html`
            <div class="radio-row">
              <input
                type="radio"
                id=${`${name}-${choice.const}`}
                name=${name}
                value=${choice.const}
                ?checked=${choice.const === value}
                @change=${(e: Event) =>
                  this._updateDataValue(
                    name,
                    (e.target as HTMLInputElement).value as T[keyof T]
                  )}
                aria-describedby="${name}-${choice.const}-description"
              />
              <label for=${`${name}-${choice.const}`} value=${choice.const}>
                ${choice.title ?? choice.const}
                <br />
                <em id="${name}-${choice.const}-description"
                  >${choice.description ?? ""}</em
                >
              </label>
            </div>
          `
        )}
      </div>
    `;
  }

  private generateTextInput(
    name: string,
    value: string,
    minLength: number,
    maxLength: number,
    valueIndex: undefined | number
  ): TemplateResult {
    return html`<input
      type="text"
      name=${name}
      value=${value}
      minlength=${minLength}
      maxlength=${maxLength}
      size=${maxLength}
      aria-describedby="${name}-description"
      @change=${(e: Event) =>
        this._updateDataValue(
          name,
          (e.target as HTMLInputElement).value as T[keyof T],
          valueIndex
        )}
    />`;
  }

  private generateTextareaInput(
    name: string,
    value: string,
    minLength: number,
    maxLength: number,
    valueIndex: undefined | number
  ): TemplateResult {
    return html`<textarea
      name=${name}
      value=${value}
      minlength=${minLength}
      maxlength=${maxLength}
      cols=${Math.floor(maxLength / 4)}
      aria-describedby="${name}-description"
      @change=${(e: Event) =>
        this._updateDataValue(
          name,
          (e.target as HTMLTextAreaElement).value as T[keyof T],
          valueIndex
        )}
    ></textarea>`;
  }

  private generateCheckboxInput(
    name: string,
    checked: boolean
  ): TemplateResult {
    return html`<sp-switch
      name=${name}
      ?checked=${checked}
      size="m"
      aria-describedby="${name}-description"
      @change=${(e: Event) =>
        this._updateDataValue(name, (e.target as Switch).checked as T[keyof T])}
      >${name} ${checked ? "ON" : "OFF"}</sp-switch
    >`;
  }

  private _propToInput(
    name: string,
    schema: SomeJSONSchema,
    value: T[keyof T],
    valueIndex?: number,
    title?: string,
    showAddButton?: boolean
  ) {
    /* Return the appropriate form input element for the specified args.
     */
    let inputHtml;
    switch (schema.type) {
      case "boolean":
        inputHtml = this.generateCheckboxInput(name, value as boolean);
        break;
      case "string":
        if (
          schema.oneOf &&
          Array.isArray(schema.oneOf) &&
          typeof schema.oneOf[0] === "object" &&
          (schema.oneOf[0] as SomeJSONSchema).const
        ) {
          // Display a radio input choice with description.
          inputHtml = this.generateRadioInput(
            name,
            schema.oneOf.map(({ title, const: _const, description }) => ({
              title: String(title),
              const: String(_const),
              description: String(description),
            })),
            String(value)
          );
        } else if (Array.isArray(schema.enum)) {
          // Display a select input.
          inputHtml = this.generateSelectInput(
            name,
            schema.enum.map(String),
            String(value)
          );
        } else if (schema.maxLength <= 100) {
          // Display a text input.
          inputHtml = this.generateTextInput(
            name,
            String(value),
            schema.minLength as number,
            schema.maxLength as number,
            valueIndex
          );
        } else {
          // Display a textarea input.
          inputHtml = this.generateTextareaInput(
            name,
            String(value),
            schema.minLength as number,
            schema.maxLength as number,
            valueIndex
          );
        }
        break;

      default:
        throw new Error(
          `Form input not defined for schema: ${JSON.stringify(schema)}`
        );
        break;
    }

    // Given that we're starting with a fairly limited initial set of data fields,
    // I've been asked make all inputs always visible, so am hiding the remove buttons
    // for scalar and non-index-zero array value input rows.
    const hideRemoveButton = valueIndex === undefined || showAddButton;

    return html`
      <div class="input-row">
        ${inputHtml}
        <button
          type="button"
          class="danger remove-value"
          title="Remove Value"
          ?hidden=${hideRemoveButton}
          @click=${() => this._removeDataValue(name, valueIndex)}
        >
          &times;
        </button>
        <button
          type="button"
          title="Add another ${title} value"
          ?hidden=${!showAddButton}
          @click=${() => this._addDataValue(name)}
        >
          +
        </button>
      </div>
    `;
  }

  render() {
    const { data, propertiesOrder, schema } = this;

    if (data === null || data === undefined) {
      return html``;
    }

    const availableKeys: Array<string> = [];
    const inputs = propertiesOrder.map((k: keyof T) => {
      // Abort if data doesn't specify this key.
      if (!Object.prototype.hasOwnProperty.call(data, k as string)) {
        availableKeys.push(k as string);
        return;
      }

      const value_s = data[k] as T[keyof T];
      const propSchema = (schema.properties as JSONSchemaType<T>["properties"])[
        k
      ];

      // Handle a non-Array type field.
      if (!Array.isArray(value_s)) {
        return html`
          <div class="input-block">
            <label for=${k}>${propSchema.title}</label>
            ${!propSchema.description
              ? html``
              : html`<em id="${k}-description">${propSchema.description}</em>`}
            ${this._propToInput(k as string, propSchema, value_s)}
          </div>
        `;
      }

      // Handle an Array-type field.
      return html`
        <div class="input-block">
          <label for=${k}>${propSchema.title}</label>
          ${!propSchema.description
            ? html``
            : html`<em>${propSchema.description}</em>`}
          ${value_s.map((value, i) =>
            this._propToInput(
              k as string,
              propSchema.items as SomeJSONSchema,
              value as T[keyof T],
              i,
              propSchema.title as string,
              i === value_s.length - 1
            )
          )}
        </div>
      `;
    });

    return html`
      <form>${inputs}</form>
      ${availableKeys.length === 0
        ? html``
        : html`
            <select name="add-new-field" @input=${this._addFieldSelectHandler}>
              <option value="">Add Field</option>
              ${availableKeys.map(
                (k) => html`
                  <option value=${k}>
                    ${(schema.properties as JSONSchemaType<T>["properties"])[
                      k as keyof T
                    ].title}
                  </option>
                `
              )}
            </select>
          `}
    `;
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    const { data, propertiesOrder, schema } = this;
    // Normalize the data object on any change.
    if (data && changedProperties.has("data")) {
      // Ensure that scalar-type data values are not wrapped in arrays and that each
      // key is represented in order to display all available form fields by default.
      // The ARCH API sends and expects all-array-type data values but our schema definition
      // is aware of which fields are scalars vs. arrays, so we normalize to our schema here.
      for (const k of propertiesOrder) {
        // Get the data value or a default single-element array that will get unwrapped
        // if necessary.
        const propSchema = (
          schema.properties as JSONSchemaType<T>["properties"]
        )[k];
        const wantsArray = propSchema.type === "array";
        const v = data[k] as T[keyof T];
        // If key is undefined or null, populate it with a default value to ensure that the form
        // field will be displayed.
        if (v === undefined || v === null) {
          if (wantsArray) {
            (data[k] as T[keyof T]) = [propSchema.default ?? ""] as T[keyof T];
          } else {
            (data[k] as T[keyof T]) = (propSchema.default ?? "") as T[keyof T];
          }
          continue;
        }
        // If the value is an array and the schema wants a scalar, unwrap it if it's
        // a single-element array, otherwise throw an error.
        if (!wantsArray && Array.isArray(v)) {
          if (v.length === 0) {
            // Convert the empty array to an empty string.
            (data[k] as T[keyof T]) = (propSchema.default ?? "") as T[keyof T];
          } else if (v.length === 1) {
            // Unwrap the scalar.
            (data[k] as T[keyof T]) = v[0] as T[keyof T];
          } else {
            throw new Error(
              `Invalid non-array type data (${String(k)}) value: ${String(v)}`
            );
          }
        }
        // Append an empty string to the end of each array as a new value placeholder.
        if (wantsArray) {
          (data[k] as Array<string>) = (data[k] as Array<string>).concat("");
        }
      }
    }
  }

  updated() {
    /* Ensure that all form input objects have a value property that reflect their
       value attribute.
    */
    (
      Array.from(this.inputs) as Array<HTMLInputElement | HTMLTextAreaElement>
    ).forEach((el) => {
      el.value = el.getAttribute("value") as string;
    });
  }

  private _addFieldSelectHandler(e: Event) {
    const { data, schema } = this;

    const target = e.target as HTMLSelectElement;
    const name = target.value as keyof T;
    if (
      (
        (schema.properties as JSONSchemaType<T>["properties"])[
          name
        ] as SomeJSONSchema
      ).type === "array"
    ) {
      data[name] = [""] as T[keyof T];
    } else {
      data[name] = "" as T[keyof T];
    }
    // Reselect the first, placeholder option.
    target.options[0].selected = true;
    this.requestUpdate();
  }

  private _addDataValue(dataKey: string) {
    const { data } = this;
    const values = data[dataKey as keyof T] as Array<T[keyof T]>;
    values.push("" as T[keyof T]);
    this.requestUpdate();
    this.onChange(data);
  }

  private _updateDataValue(
    dataKey: string,
    value: T[keyof T],
    valueIndex?: number
  ) {
    const { data } = this;
    if (valueIndex === undefined) {
      data[dataKey as keyof T] = value;
    } else {
      (data[dataKey as keyof T] as Array<T[keyof T]>)[valueIndex] = value;
    }
    this.requestUpdate();
    this.onChange(data);
  }

  private _removeDataValue(dataKey: string, valueIndex?: number) {
    const { data } = this;
    /* Remove a value, and perhaps a key, from data. */
    if (valueIndex === undefined) {
      // This is a scalar / non-Array value, so remove the whole key.
      delete data[dataKey as keyof T];
    } else {
      // This is an Array-type value.
      const values = data[dataKey as keyof T] as Array<string>;
      // Remove the specified values index.
      values.splice(valueIndex, 1);
      // If the array is now empty, remove the whole key.
      if (values.length === 0) {
        delete data[dataKey as keyof T];
      }
    }
    this.requestUpdate();
    this.onChange(data);
  }

  onChange(data: T) {
    this.dispatchEvent(new CustomEvent("data-change", { detail: { data } }));
  }
}
