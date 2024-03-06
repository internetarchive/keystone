import { LitElement, html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { customElement, eventOptions, property } from "lit/decorators.js";

import "../../archModal/src/arch-modal";

import { identity, isoStringToDateString } from "../../lib/helpers";
import { Collection } from "../../lib/types";

import { DecodedFormData } from "./types";
import styles from "./arch-sub-collection-builder-submit-button-styles";

@customElement("arch-sub-collection-builder-submit-button")
export class ArchSubCollectionBuilderSubmitButton extends LitElement {
  @property() validateForm!: () => boolean;
  @property() collections!: Array<Collection>;
  @property() data!: undefined | DecodedFormData;

  static styles = styles;

  // Set delegatesFocus=true so that we can restore focus to the job button
  // on arch-global-modal close.
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static dataKeyTitlePairs: Array<[keyof DecodedFormData, string]> = [
    ["surtPrefixesOR", "SURT Prefix(es)"],
    ["timestampFrom", "Crawl Date (start)"],
    ["timestampTo", "Crawl Date (end)"],
    ["statusPrefixesOR", "HTTP Status"],
    ["mimesOR", "MIME Type"],
  ];

  static dataKeyValueFormatterMap: Record<
    keyof DecodedFormData,
    (s: string) => string
  > = {
    mimesOR: identity<string>,
    name: identity<string>,
    sources: identity<string>,
    statusPrefixesOR: identity<string>,
    surtPrefixesOR: identity<string>,
    timestampFrom: (s) => `on or after ${isoStringToDateString(s)}`,
    timestampTo: (s) => `on or before ${isoStringToDateString(s)}`,
  };

  private getCollectionName(cid: Collection["id"]): Collection["name"] {
    for (const c of this.collections) {
      if (c.id === cid) {
        return c.name;
      }
    }
    return "";
  }

  render() {
    const { data } = this;

    const filterTitleValuePairs: Array<[string, string]> =
      data === undefined
        ? []
        : ArchSubCollectionBuilderSubmitButton.dataKeyTitlePairs
            .filter(([key]) => data[key] !== undefined)
            .map(([key, title]) => {
              const values = (
                Array.isArray(data[key]) ? data[key] : [data[key]]
              ) as Array<string>;
              return [
                title,
                values
                  .map(
                    (v) =>
                      `<span class="filter-value">${ArchSubCollectionBuilderSubmitButton.dataKeyValueFormatterMap[
                        key
                      ](v)}</span>`
                  )
                  .join(" or "),
              ];
            });

    return html`
      <arch-modal title="Review Your Custom Collection" modalSize="l">
        <div slot="content">
          ${data === undefined
            ? html``
            : html`
            <p>
      You are about to create a custom collection named &quot;<span class="new-name">${
        data.name
      }</span>&quot; from the following
              source collections:
              <ul>
                ${Array.from((data.sources as Array<string>) ?? []).map(
                  (cid) =>
                    html`<li class="input-collection">
                      ${this.getCollectionName(parseInt(cid))}
                    </li>`
                )}
              </ul>
            </p>
            <p>
              This custom collection will be
              ${
                filterTitleValuePairs.length === 0
                  ? html`an unfiltered combination of the source collections.`
                  : html`
                      the result of filtering the source collections by:
                      <dl>
                        ${filterTitleValuePairs.map(
                          ([title, value], i) => html` ${i === 0
                              ? html``
                              : html`<em>and</em>`}
                            <dt>${title}</dt>
                            <dd>${unsafeHTML(value)}</dd>
                            <br />`
                        )}
                      </dl>
                    `
              }
            </p>
      `}
        </div>
        <button slot="trigger" class="primary" @click=${this.clickHandler}>
          Create Custom Collection
        </button>
      </arch-modal>
    `;
  }

  @eventOptions({ capture: true })
  private clickHandler(e: Event) {
    /* Capture clicks from the modal trigger button in order to first check
       whether the form is valid, and if not, do not open the modal. */
    if (!this.validateForm()) {
      e.stopPropagation();
    }
  }
}

// Injects the tag into the global name space
declare global {
  interface HTMLElementTagNameMap {
    "arch-sub-collection-builder-submit-button": ArchSubCollectionBuilderSubmitButton;
  }
}
