import { LitElement, TemplateResult, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { DefaultSelectElementPromptText } from "../../lib/constants";

@customElement("arch-select-adder")
export class ArchSelectAdder<T> extends LitElement {
  @property() emptyOptionsPlaceholder: TemplateResult = html``;
  @property({ type: String }) deselectButtonText = "remove";
  @property({ type: Number }) headingLevel = 3;
  @property() labelGetter!: (obj: T) => string;
  @property({ type: Array }) options!: Array<T>;
  @property() optionsSortCompareFn: undefined | ((a: T, b: T) => number) =
    undefined;
  @property() readOnlyMessage: undefined | TemplateResult = undefined;
  @property({ type: Array }) selectedOptions!: Array<T>;
  @property({ type: Array }) selectedOptionsTitle = "Selected Options";
  @property({ type: String }) selectCtaText = "Select value to add";
  @property() valueGetter!: (obj: T) => string;

  @state() availableOptions: Array<T> = [];
  @state() disabled = false;

  // Set delegatesFocus=true so that we can restore focus to the job button
  // on arch-global-modal close.
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  private sortByLabel(a: T, b: T) {
    /* Default optionsSortCompareFn */
    const { labelGetter } = this;
    const aLabel = labelGetter(a);
    const bLabel = labelGetter(b);
    if (aLabel > bLabel) {
      return 1;
    } else if (aLabel < bLabel) {
      return -1;
    } else {
      return 0;
    }
  }

  private heading(text: string): TemplateResult {
    const { headingLevel } = this;
    switch (headingLevel) {
      case 1:
        return html`<h1>${text}</h1>`;
        break;
      case 2:
        return html`<h2>${text}</h2>`;
        break;
      case 3:
        return html`<h3>${text}</h3>`;
        break;
      case 4:
        return html`<h4>${text}</h4>`;
        break;
      case 5:
        return html`<h5>${text}</h5>`;
        break;
      case 6:
        return html`<h6>${text}</h6>`;
        break;
      default:
        return html``;
    }
  }

  render() {
    const {
      deselectButtonText,
      disabled,
      emptyOptionsPlaceholder,
      labelGetter,
      options,
      selectCtaText,
      readOnlyMessage,
      selectedOptions,
      selectedOptionsTitle,
      valueGetter,
    } = this;

    if (options.length === 0) {
      return emptyOptionsPlaceholder;
    }

    this.updateAvailableOptions();

    return html`
      ${selectedOptions.length === 0
        ? html``
        : html`
            ${this.heading(selectedOptionsTitle)}
            <ul>
              ${selectedOptions.map(
                (x) =>
                  html`<li>
                    ${labelGetter(x)}
                    ${readOnlyMessage
                      ? html``
                      : html`
                          <button
                            ?disabled=${disabled}
                            @click=${(e: Event) =>
                              this.deselectOption(
                                e.target as HTMLButtonElement,
                                x
                              )}
                          >
                            ${deselectButtonText}
                          </button>
                        `}
                  </li>`
              )}
            </ul>
          `}
      ${readOnlyMessage
        ? readOnlyMessage
        : this.availableOptions.length === 0
        ? html``
        : html`
            <label>
              ${selectCtaText}
              <select ?disabled=${disabled} @change=${this.selectHandler}>
                <option selected value>
                  ${DefaultSelectElementPromptText}
                </option>
                ${this.availableOptions.map(
                  (x) =>
                    html`<option value="${valueGetter(x)}">
                      ${labelGetter(x)}
                    </option>`
                )}
              </select>
            </label>
          `}
    `;
  }

  updateAvailableOptions() {
    const { options, optionsSortCompareFn, selectedOptions, valueGetter } =
      this;
    const selectedValues = new Set(selectedOptions.map(valueGetter));
    this.availableOptions = options
      .filter((x) => !selectedValues.has(valueGetter(x)))
      .sort(optionsSortCompareFn ?? this.sortByLabel.bind(this));
  }

  private selectOption(option: T) {
    this.selectedOptions.push(option);
    this.updateAvailableOptions();
  }

  private get revertFn() {
    /* Return a function that can be used to revert to the current state. */
    const currentSelectedOptions = [...this.selectedOptions];
    return () => {
      this.selectedOptions = currentSelectedOptions;
      this.updateAvailableOptions();
    };
  }

  private deselectOption(buttonEl: HTMLButtonElement, option: T) {
    const { revertFn, valueGetter } = this;
    const optionValue = valueGetter(option);
    this.selectedOptions = this.selectedOptions.filter(
      (x) => valueGetter(x) !== optionValue
    );
    this.updateAvailableOptions();
    this.onChange(revertFn, buttonEl);
  }

  private selectHandler(e: Event) {
    const { options, revertFn, valueGetter } = this;
    const selectEl = e.target as HTMLSelectElement;
    const optionValue = selectEl.value;
    // Ignore the first placeholder option.
    if (optionValue === "") {
      return;
    }
    this.selectOption(
      options.find((x) => String(valueGetter(x)) === optionValue) as T
    );
    // Ensure that the first, placeholder option is reselected.
    (selectEl.children[0] as HTMLOptionElement).selected = true;
    this.onChange(revertFn, selectEl);
  }

  /**
   * @param {() => void} revertFn - revert to the previous selected option state
   * @param {HTMLElement} srcEl - the interactive element that triggered the change
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onChange(revertFn: () => void, srcEl: HTMLElement) {}
}
