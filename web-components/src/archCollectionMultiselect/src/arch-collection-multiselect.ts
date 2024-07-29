import { html, LitElement, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import ArchAPI from "../../lib/ArchAPI";
import { CollectionIdNamePairs } from "../../lib/types";

@customElement("arch-collection-multiselect")
export class ArchCollectionMultiselect extends LitElement {
  @property({ type: Number }) accountId!: number;
  @property({ type: String }) label!: string;
  @property({ type: String }) name!: string;
  @property({ type: Array }) preselectedIds: Array<number> = [];

  @state() private _collectionIdNamePairs: CollectionIdNamePairs | undefined =
    undefined;
  @state() private _numTotal!: number;
  @state() private _numSelected!: number;
  @state() allSelected!: boolean;

  async connectedCallback() {
    super.connectedCallback();
    // Fetch the set of collection [id, name] pairs if necessary.
    if (this._collectionIdNamePairs === undefined) {
      this._collectionIdNamePairs = await ArchAPI.allCollectionIdNamePairs(
        this.accountId
      );
      this._numTotal = this._collectionIdNamePairs.length;
      // If preselectedIds is empty, select all.
      if (this.preselectedIds.length === 0) {
        this.preselectedIds = this._collectionIdNamePairs.map(([id]) => id);
      }
      this._numSelected = this.preselectedIds.length;
      this.allSelected = this._numSelected === this._numTotal;
    }
  }

  createRenderRoot() {
    /* Disable the shadow root for this component so that it will be registered
       by the parent <form>.
       https://stackoverflow.com/a/55213037 */
    return this;
  }

  render(): TemplateResult {
    const collectionIdNamePairs = this._collectionIdNamePairs ?? [];

    return html`
      <label for="${this.name}">
        ${this.label}
        <span style="float: right; font-size: 0.9em;">
          (${this._numSelected} selected)
        </span>
      </label>
      <select
        name="${this.name}"
        multiple
        style="min-height: 8rem;"
        @change=${(e: Event) => this._changeHandler(e)}
      >
        ${(collectionIdNamePairs ?? []).map(
          ([id, name]) => html`
            <option value="${id}" ?selected=${this.preselectedIds.includes(id)}>
              ${name}
            </option>
          `
        )}
      </select>
    `;
  }

  private _changeHandler(e: Event) {
    /* Update this._numSelected based on the number of
       currently-selected options, and select all if no options are selected
       because a viewer user needs to have at least one authorized collection.
    */
    const target = e.target as HTMLElement;
    let numSelected = target.querySelectorAll("option:checked").length;
    // If no options are selected, select all.
    if (numSelected === 0) {
      const optionEls = Array.from(target.querySelectorAll("option"));
      optionEls.forEach((el) => (el.selected = true));
      numSelected = optionEls.length;
    }
    this._numSelected = numSelected;
    this.allSelected = numSelected === this._numTotal;
  }
}
