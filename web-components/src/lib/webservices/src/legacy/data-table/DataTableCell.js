import { populateTemplate } from "../lib/lib.js";

import { customElementsMaybeDefine } from "../lib/domLib.js";

export default class DataTableCell extends HTMLTableCellElement {
  constructor() {
    super();
    // Create a promise that will be resolved at the end of connectedCallback.
    this.connectedPromise = new Promise((resolve) => {
      this.connectedResolver = resolve;
    });
  }

  connectedCallback() {
    const {
      columnName,
      linkFormat,
      linkTarget,
      nullString,
      rowData,
      renderer,
    } = this.props;

    // Set the class.
    this.classList.add(columnName);

    // Get the discrete value for this column.
    let value = rowData;
    // If columnName was specified, split it to support dot-separated
    // property paths and retrieve the value.
    if (columnName) {
      for (const k of columnName.split(".")) {
        // nosemgrep: javascript.lang.security.audit.prototype-pollution.prototype-pollution-loop.prototype-pollution-loop
        value = value[k];
        // Break if value is no longer indexable to prevent a
        // "Cannot read properties of null ..." error on any next attempt.
        if (typeof value !== "object" || value === null) {
          break;
        }
      }
    }

    // Generate the HTML.
    const childEls = [];
    if (!renderer) {
      // No rendered was specified.
      // If value is a supported scalar type, set html to the value.
      const valueType = typeof value;
      if (valueType === "string" || valueType === "number") {
        childEls.push(document.createTextNode(value));
        // Set a title attribute for simple values in order to reveal
        // potentially truncated values.
        this.title = value;
      } else if (value !== undefined && value !== null) {
        // eslint-disable-next-line no-console
        console.warn(
          `Renderer not specified for value type (${valueType}) in column: ${columnName}`
        );
      }
    } else {
      // Apply the function or object/map-type renderer.
      const render =
        typeof renderer === "function"
          ? (v) => renderer(v, rowData) ?? ""
          : (v) => renderer[v] ?? "";
      // If value is an array, apply the renderer separately to each element.
      if (Array.isArray(value)) {
        value.forEach((x) => childEls.push(render(x)));
      } else {
        childEls.push(render(value));
      }
    }

    // Maybe wrap html in a link.
    if (linkFormat && childEls.length > 0) {
      const aEl = document.createElement("a");
      aEl.href = populateTemplate(linkFormat, rowData);
      if (linkTarget !== "_self") {
        aEl.target = linkTarget;
      }
      // If renderer was not used, add the "highlightable" class.
      if (!renderer) {
        aEl.classList.add("highlightable");
      }
      // Add all previously-defined childEls as children of the <a>.
      while (childEls.length > 0) {
        aEl.appendChild(childEls.shift());
      }
      childEls.push(aEl);
    }

    if (childEls.length === 0) {
      const nullPlaceholder = document.createElement("span");
      nullPlaceholder.classList.add("null-placeholder", "highlightable");
      nullPlaceholder.textContent = nullString;
      childEls.push(nullPlaceholder);
    }

    this.replaceChildren(...childEls);

    // Propagate any data-table-cell-colspan attribute specified by a child to this
    // element.
    const colspanEl = this.querySelector("[data-table-cell-colspan]");
    if (colspanEl) {
      this.colSpan = parseInt(
        colspanEl.getAttribute("data-table-cell-colspan"),
        10
      );
    }

    // Invoke the connected promise resolver.
    this.connectedResolver();
  }
}

customElementsMaybeDefine("data-table-cell", DataTableCell, { extends: "td" });
