import { LitElement, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import ArchAPI from "../../lib/ArchAPI";
import {
  HtmlStatusCodeRegex,
  SurtPrefixRegex,
  UrlCollectionsParamName,
} from "../../lib/constants";
import {
  Paths,
  createElement,
  identity,
  isValidCustomInputCollection,
} from "../../lib/helpers";
import { Collection, ValueOf } from "../../lib/types";
import { AlertClass } from "../../archAlert/index";
import { ArchGlobalModal } from "../../archGlobalModal";
import "../../archAlert/index";

import "./arch-sub-collection-builder-submit-button";
import styles from "./styles";
import {
  DecodedFormData,
  FormFieldName,
  FormFieldValue,
  ParsedFormFieldValue,
} from "./types";

// https://www.iana.org/assignments/media-types/media-types.xhtml
import ValidMediaTypeSubTypesMap from "./mediaTypes.js";

/*
 * Helpers
 */

function splitFieldValue(s: string): Array<string> {
  return s
    .split("|")
    .map((x) => x.trim())
    .filter((x) => x !== "");
}

function prepareDatetimeFieldValue(isoDateStr: string): string {
  // Convert Date to ARCH timestamp string (yyyyMMddHHmmSS).
  const d = new Date(isoDateStr);
  const yearStr = d.getFullYear();
  const monthStr = (d.getMonth() + 1).toString().padStart(2, "0");
  const dateStr = d.getDate().toString().padStart(2, "0");
  const hoursStr = d.getHours().toString().padStart(2, "0");
  const minutesStr = d.getMinutes().toString().padStart(2, "0");
  // The form input only provides for minute resolution, so append 00 for the seconds.
  return `${yearStr}${monthStr}${dateStr}${hoursStr}${minutesStr}00`;
}

/*
 * ArchSubCollectionBuilder Class
 */

@customElement("arch-sub-collection-builder")
export class ArchSubCollectionBuilder extends LitElement {
  @property({ type: String }) csrfToken!: string;

  @state() collections: Array<Collection> = [];
  @state() sourceCollectionIds: Set<Collection["id"]> = new Set();
  @state() data: undefined | DecodedFormData = undefined;

  @query("form") form!: HTMLFormElement;
  @query("select#source") sourceSelect!: HTMLSelectElement;
  @query("arch-sub-collection-builder-submit-button")
  submitButton!: HTMLElement;

  static styles = styles;

  async connectedCallback() {
    super.connectedCallback();

    // Fetch available Collections and Jobs.
    await this.initCollections();
    // Select any initial Collections.
    this.sourceCollectionIds = new Set(
      new URLSearchParams(window.location.search)
        .getAll(UrlCollectionsParamName)
        .map((s) => parseInt(s))
    );
  }

  render() {
    const { collections, sourceCollectionIds } = this;
    const sourceCollections = collections.filter((x) =>
      sourceCollectionIds.has(x.id)
    );
    return html`
      <arch-alert
        .alertClass=${AlertClass.Primary}
        .message=${'Use this form to create a custom collection by filtering the contents of one or more existing source collections. You may use as many of the filtering options below as you desire and leave others blank. <a href="https://arch-webservices.zendesk.com/hc/en-us/articles/16107865758228" target="_blank">Learn about options and common choices here</a>. ARCH will email you when your custom collection is ready to use.'}
      >
      </arch-alert>

      <form @input=${this.inputHandler}>
        <label for="sources" class="required"> Source Collection(s) </label>
        <em id="sourceDesc">
          Select the collection(s) to use as the source for this custom
          collection.
        </em>
        <select
          name="sources"
          id="sources"
          aria-labelledby="source sourceDesc"
          required
          multiple
          size="8"
          ?disabled=${this.collections.length === 0}
          @change=${this.sourceCollectionsChangeHandler}
        >
          ${this.collections.length === 0
            ? html`<option value="">Loading Collections...</option>`
            : html``}
          ${collections.map(
            (collection) => html`
              <option
                value="${collection.id}"
                ?selected=${sourceCollectionIds.has(collection.id)}
              >
                ${collection.name}
              </option>
            `
          )}
        </select>

        <label for="name" class="required"> Custom Collection Name </label>
        <em id="nameDesc">
          Give your custom collection a name to describe its contents.
        </em>
        <input
          type="text"
          name="name"
          id="name"
          aria-labelledby="name nameDesc"
          placeholder="${sourceCollections.length > 0
            ? sourceCollections[0].name
            : "Example Collection"} - My filters"
          required
        />

        <label for="surts"> SURT Prefix(es) </label>
        <em id="surtsDesc">
          Choose
          <a
            href="https://arch-webservices.zendesk.com/hc/en-us/articles/14410683244948#document"
            target="_blank"
            >web documents</a
          >
          to include in your custom collection by their
          <a
            href="https://arch-webservices.zendesk.com/hc/en-us/articles/14410683244948#surt"
            target="_blank"
            >SURT prefix/es</a
          >.
          <br />
          Separate multiple SURTs with a <code>|</code> character and no space
          in-between.
        </em>
        <input
          type="text"
          name="surtPrefixesOR"
          id="surts"
          aria-labelledby="surts surtsDesc"
          placeholder="org,archive|gov,congress)/committees"
        />

        <label for="timestampFrom"> Crawl Date (start) </label>
        <em id="timestampFromDesc">
          Specify the earliest in a range of
          <a
            href="https://arch-webservices.zendesk.com/hc/en-us/articles/14410683244948#timestamp"
            target="_blank"
            >timestamps</a
          >
          to include in your custom collection, or leave blank to include all
          web documents going back to the earliest collected.
        </em>
        <input
          type="datetime-local"
          name="timestampFrom"
          id="timestampFrom"
          aria-labelledby="timestampFrom timestampFromDesc"
        />

        <label for="timestampTo"> Crawl Date (end) </label>
        <em id="timestampToDesc">
          Specify the latest in a range of
          <a
            href="https://arch-webservices.zendesk.com/hc/en-us/articles/14410683244948#timestamp"
            target="_blank"
            >timestamps</a
          >
          to include in your custom collection, or leave blank to include all
          web documents up to the most recent collected.
        </em>
        <input
          type="datetime-local"
          name="timestampTo"
          id="timestampTo"
          aria-labelledby="timestampTo timestampToDesc"
        />

        <label for="status"> HTTP Status </label>
        <em id="statusDesc">
          Choose web documents to include in your custom collection by their
          <a
            href="https://arch-webservices.zendesk.com/hc/en-us/articles/14410683244948#status"
            target="_blank"
            >HTTP status code/s</a
          >.
          <br />
          Separate multiple HTTP Status values with a <code>|</code> character
          and no space in-between.
        </em>
        <input
          type="text"
          name="statusPrefixesOR"
          id="status"
          aria-labelledby="status statusDesc"
          placeholder="200"
        />

        <label for="mime"> MIME Type </label>
        <em id="mimeDesc">
          Choose web documents to include in your custom collection by their
          file format/s, expressed as
          <a
            href="https://arch-webservices.zendesk.com/hc/en-us/articles/14410683244948#mime"
            target="_blank"
            >MIME type/s</a
          >.
          <br />
          Separate multiple MIMEs with a <code>|</code> character and no space
          in-between.
        </em>
        <input
          type="text"
          name="mimesOR"
          id="mime"
          aria-labelledby="mime mimeDesc"
          placeholder="text/html|application/pdf"
        />
        <br />
        <arch-sub-collection-builder-submit-button
          .validateForm=${this.validateForm.bind(this)}
          .collections=${this.collections}
          .data=${this.data}
          @submit=${this.createSubCollection}
        >
        </arch-sub-collection-builder-submit-button>
      </form>
    `;
  }

  private inputHandler(e: Event) {
    // Clear any custom validity message on input value change.
    (e.target as HTMLInputElement | HTMLSelectElement).setCustomValidity("");
    this.data = this.formData;
  }

  private async initCollections() {
    const response = await ArchAPI.collections.get();
    this.collections = response.items.filter(isValidCustomInputCollection);
  }

  private setSourceCollectionIdsUrlParam(
    collectionIds: Array<Collection["id"]>
  ) {
    const url = new URL(window.location.href);
    // Unconditionally delete the params in preparation for any params.append()
    url.searchParams.delete(UrlCollectionsParamName);
    collectionIds.forEach((collectionId) =>
      url.searchParams.append(UrlCollectionsParamName, collectionId.toString())
    );
    history.replaceState(null, "", url.toString());
  }

  private sourceCollectionsChangeHandler(e: Event) {
    const collectionIds = Array.from(
      (e.target as HTMLSelectElement).selectedOptions
    ).map((el) => parseInt(el.value));
    this.sourceCollectionIds = new Set(collectionIds);
    this.setSourceCollectionIdsUrlParam(collectionIds);
  }

  private static fieldValueParserMap: Record<
    FormFieldName,
    (s: FormFieldValue) => ParsedFormFieldValue
  > = {
    mimesOR: (s) => splitFieldValue(s as string),
    name: (s) => identity<string>(s as string),
    sources: (s) => identity<Array<string>>(s as Array<string>),
    statusPrefixesOR: (s) => splitFieldValue(s as string),
    surtPrefixesOR: (s) => splitFieldValue(s as string),
    timestampFrom: (s) => identity<string>(s as string),
    timestampTo: (s) => identity<string>(s as string),
  };

  private static fieldValueValidatorMessagePairMap: Record<
    string,
    [(s: string) => boolean, string]
  > = {
    statusPrefixesOR: [
      (s) => HtmlStatusCodeRegex.test(s),
      "Please correct the invalid status code(s)",
    ],
    surtPrefixesOR: [
      (s) => SurtPrefixRegex.test(s),
      "Please correct the invalid SURT(s)",
    ],
    mimesOR: [
      (s) => {
        const splits = s.split("/");
        return (
          splits.length === 2 &&
          (ValidMediaTypeSubTypesMap as Record<string, Array<string>>)[
            splits[0]
          ]?.includes(splits[1])
        );
      },
      "Please correct the invalid MIME(s)",
    ],
  };

  private static fieldValuePreSendPrepareMap: Map<
    keyof DecodedFormData,
    (x: ValueOf<DecodedFormData>) => ValueOf<DecodedFormData>
  > = new Map([
    ["mimesOR", identity<ValueOf<DecodedFormData>>],
    ["name", identity<ValueOf<DecodedFormData>>],
    ["sources", identity<ValueOf<DecodedFormData>>],
    ["statusPrefixesOR", identity<ValueOf<DecodedFormData>>],
    ["surtPrefixesOR", identity<ValueOf<DecodedFormData>>],
    [
      "timestampFrom",
      (s) => prepareDatetimeFieldValue(s as string) as ValueOf<DecodedFormData>,
    ],
    [
      "timestampTo",
      (s) => prepareDatetimeFieldValue(s as string) as ValueOf<DecodedFormData>,
    ],
  ]);

  private static decodeFormDataValue(
    k: FormFieldName,
    v: string
  ): ValueOf<DecodedFormData> {
    let rv: ValueOf<DecodedFormData> =
      ArchSubCollectionBuilder.fieldValueParserMap[k](v);
    // If a validator is defined, apply it.
    const isValidMessagePair =
      ArchSubCollectionBuilder.fieldValueValidatorMessagePairMap[k];
    if (isValidMessagePair !== undefined) {
      const [isValid, message] = isValidMessagePair;
      const badVals = (Array.isArray(rv) ? rv : [rv]).filter(
        (s) => !isValid(s)
      );
      if (badVals.length > 0) {
        rv = new Error(`${message}: ${badVals.join(", ")}`);
      }
    }
    return rv;
  }

  private static validateDecodedFormData(
    data: DecodedFormData
  ): DecodedFormData {
    // If a timestampFrom/To pair is invalid, add a validation error to the ...To field.
    if (
      typeof data.timestampFrom === "string" &&
      typeof data.timestampTo === "string" &&
      data.timestampFrom >= data.timestampTo
    ) {
      data.timestampTo = new Error(
        "Crawl Date (end) must be later than Crawl Date (start)"
      );
    }
    return data;
  }

  private get formData(): DecodedFormData {
    // Return the <form> inputs as a validated, API POST-ready object.
    const formData = new FormData(this.form);
    let data = Object.fromEntries(
      Array.from(new Set(formData.keys()).values()) // use Set to dedupe keys
        .map((k) => [k, k === "sources" ? formData.getAll(k) : formData.get(k)])
        // Convert the form input strings to their API POST-ready values.
        .map(([k, v]) => [
          k,
          // Sources may be an Array<string>, and requires no parsing, so special-case it.
          k === "sources"
            ? (v as Array<string>)
            : ArchSubCollectionBuilder.decodeFormDataValue(
                k as FormFieldName,
                v as string
              ),
        ])
        // Remove fields with an empty string or Array value.
        .filter(
          ([, v]) =>
            v instanceof Error || (v as string | Array<string>).length > 0
        )
    ) as DecodedFormData;
    data = ArchSubCollectionBuilder.validateDecodedFormData(data);
    return data;
  }

  private setFormInputValidity(data: DecodedFormData) {
    // Set or clear each form <input>'s validity based on whether a decoding
    // attempt failed.
    for (const [k, v] of Object.entries(data)) {
      if (k !== "sources") {
        (
          this.form.querySelector(`input[name="${k}"]`) as HTMLInputElement
        ).setCustomValidity(v instanceof Error ? v.message : "");
      }
    }
  }

  private async doPost(data: DecodedFormData) {
    const { csrfToken } = this;

    //  Apply any pre-flight conversions.
    const finalData = Object.assign({}, data);
    Array.from(
      ArchSubCollectionBuilder.fieldValuePreSendPrepareMap.entries()
    ).forEach(([k, prepareFn]) => {
      if (finalData[k] !== undefined) {
        finalData[k] = (
          Array.isArray(finalData[k])
            ? (finalData[k] as Array<ValueOf<DecodedFormData>>).map(prepareFn)
            : prepareFn(finalData[k] as ValueOf<DecodedFormData>)
        ) as ValueOf<DecodedFormData>;
      }
    });

    return fetch("/api/collections/custom", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "content-type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      mode: "cors",
      body: JSON.stringify(finalData),
    });
  }

  validateForm(): boolean {
    /* Validate the form inputs and return a boolean indicating whether the
       inputs are valid.*/
    const { form, formData } = this;

    // Update form field validity.
    this.setFormInputValidity(formData);

    // Check form validity and return true if valid.
    if (form.checkValidity()) {
      return true;
    }
    form.reportValidity();
    return false;
  }

  private get successModalContent(): HTMLSpanElement {
    /* Return an element to serve as the success modal content. */
    return createElement("span", {
      children: [
        "You will receive an email when your custom collection is ready to view. You will be able to access it from the ",
        createElement("a", {
          href: Paths.collections,
          textContent: "Collections page",
        }),
      ],
    });
  }

  private async createSubCollection(e: Event) {
    // Prevent the form submission.
    e.preventDefault();
    // Make the request.
    const res = await this.doPost(this.formData);
    const { submitButton } = this;
    if (res.ok) {
      // Request was successful. Reset the form and show the notification modal.
      this.form.reset();
      ArchGlobalModal.showNotification(
        "ARCH is creating your custom collection",
        this.successModalContent,
        submitButton
      );
    } else {
      // Request failed. Show the error modal.
      ArchGlobalModal.showError(
        "",
        "Could not create custom collection. Please try again.",
        submitButton
      );
    }
  }
}

// Injects the tag into the global name space
declare global {
  interface HTMLElementTagNameMap {
    "arch-sub-collection-builder": ArchSubCollectionBuilder;
  }
}
