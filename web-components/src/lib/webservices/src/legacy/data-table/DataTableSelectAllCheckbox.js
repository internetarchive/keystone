import {
  createElement,
  customElementsMaybeDefine,
} from "../lib/domLib.js";

export default class DataTableSelectAllCheckbox extends HTMLElement {
  connectedCallback() {
    this.state = {
      numHits: 0,
      numSelected: 0,
    };

    this.replaceChildren(
      createElement("input", {
        type: "checkbox", className: "select-all", ariaLabel: "Select All Rows"
      }),
      createElement("span", {classList: ["fa", "fa-caret-down"]}),

      createElement("ui5-popover", {
        placementType: "Bottom",
        horizontalAlign: "Left",
        children: [
          createElement("div", {className: "popover-content", children: [createElement("ol")]})
        ],
      }),

      createElement("ui5-popover", {
        placementType: "Top",
        horizontalAlign: "Left",
        className: "loading",
        modal: true,
        hideBackdrop: true,
        style: "--sapGroup_ContentBackground: #888;",
        textContent: "Selection Loading...",
      }),
    );

    const ol = this.querySelector("ol");
    const [optionPopover, loadingPopover] = this.querySelectorAll(
      ":scope > ui5-popover"
    );
    this.refs = {
      input: this.querySelector(":scope > input"),
      ol,
      popover: optionPopover,
      loading: loadingPopover,
    };
    this.updateOptions();

    this.addEventListener("click", this.clickHandler.bind(this));
    ol.addEventListener("click", this.itemClickHandler.bind(this));

    // Prevent loading popover clicks from triggering the option popover.
    loadingPopover.addEventListener("click", (e) => e.stopPropagation());
  }

  updateOptions() {
    const { numHits, numSelected } = this.state;
    const { ol } = this.refs;
    ol.replaceChildren();
    if (!numHits && !numSelected) {
      ol.appendChild(createElement("li", {
        className: "nothing-to-do", textContent: "Nothing to select or clear"
      }));
      return;
    }
    if (numHits) {
      ol.append(
        createElement("li", {
          textContent: "Select All on this Page",
          dataset: {action: "SELECT_PAGE"},
        }),
        createElement("li", {
          dataset: {action: "SELECT_ALL"},
          children: [
            "Select All ",
            createElement("span", {className: "num-hits", textContent: numHits}),
            " Items"
          ],
        }),
      );
    }
    if (numSelected) {
      ol.appendChild(
        createElement("li", {
          dataset: {action: "SELECT_NONE"},
          children: [
            "Clear Selection (",
            createElement("span", {className: "num-selected", textContent: numSelected}),
            ")",
          ]
        })
      );
    }
  }

  set indeterminate(x) {
    /* this.refs.input.indeterminate proxy */
    const { input } = this.refs;
    input.indeterminate = x;
  }

  set checked(x) {
    /* this.refs.input.checked proxy */
    const { input } = this.refs;
    input.checked = x;
  }

  set numHits(x) {
    const { state } = this;
    state.numHits = x;
    this.updateOptions();
  }

  set numSelected(x) {
    const { state } = this;
    state.numSelected = x;
    this.updateOptions();
  }

  set loading(x) {
    const { loading } = this.refs;
    if (x) {
      loading.showAt(this);
    } else {
      loading.close();
    }
  }

  clickHandler(e) {
    /* Open or close the popover. */
    const { input, popover } = this.refs;
    e.preventDefault();
    e.stopPropagation();
    if (popover.open) {
      popover.close();
    } else {
      popover.showAt(input);
    }
  }

  itemClickHandler(e) {
    const { action } = e.target.dataset;
    if (action) {
      this.dispatchEvent(
        new CustomEvent("submit", {
          detail: { action },
          bubbles: true,
        })
      );
    }
    // Let the event bubble up to the clickHandle which will close the popover.
  }
}

customElementsMaybeDefine(
  "data-table-select-all-checkbox",
  DataTableSelectAllCheckbox
);
