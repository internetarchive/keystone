import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import { CollectionSelectedDetail } from "../../lib/types";

import {
  humanBytes,
  timestampStringToYearMonthString,
} from "../../lib/helpers";
import { EventHelpers } from "@internetarchive/ads-library";

@customElement("collection-surveyor-cart")
export class CollectionSurveyorCart extends LitElement {
  @property({ type: Object })
  collectionsInCart: { [collectionName: string]: CollectionSelectedDetail } =
    {};

  private get totalCollectionSizeSelected(): number {
    // sum collectionSize (bytes) from each selected collection
    const collectionSum = Object.values(this.collectionsInCart).reduce(
      (current, acc) => current + Number(acc.collectionSize),
      0
    );

    return collectionSum;
  }

  handleRemoveCollectionFromCart(collectionName: string) {
    this.emitEvent("collection-removed-from-cart", { collectionName });
  }

  private emitEvent(eventName: string, detail = {}) {
    this.dispatchEvent(
      EventHelpers.createEvent(eventName, detail ? { detail } : {})
    );
  }

  render() {
    return html`
      <div class="cart-container">
        <div class="collections-cart">
          <h3>Collections Selected</h3>
          <ul>
            ${Object.entries(this.collectionsInCart).map(
              ([collectionName, value]) => html`
                <li>
                  <a
                    class="collectionName"
                    href="https://archive-it.org/collections/${value.collectionId}"
                    target="_blank"
                    >${collectionName}</a
                  >, Organization: ${value.organizationName}, Archived Since:
                  ${timestampStringToYearMonthString(value.createdDt)},
                  Collection Size: ${humanBytes(Number(value.collectionSize))}
                  <button
                    @click=${() =>
                      this.handleRemoveCollectionFromCart(collectionName)}
                  >
                    remove
                  </button>
                </li>
              `
            )}
          </ul>
          <h4>
            Total Collection Size Selected:
            <span class="totalSizeSelected"
              >${humanBytes(this.totalCollectionSizeSelected)}</span
            >
          </h4>
        </div>
      </div>
    `;
  }

  static styles = css`
    .cart-container {
      padding: 20px 50px;
    }
    .collections-cart {
      padding: 20px;
      border-radius: 6px;
      background-color: rgb(255, 255, 255);
      box-shadow: rgb(136, 136, 136) 1px 1px 6px;
    }
    .totalSizeSelected {
      font-weight: normal;
    }
    button {
      background: none;
      border: none;
      cursor: pointer;
      color: red;
      text-decoration: underline;
    }
    li {
      margin: 0.6em 0;
      line-height: 1.25;
    }
    .collectionName {
      font-weight: bold;
    }
    a {
      color: #c9540a;
    }
  `;
}
