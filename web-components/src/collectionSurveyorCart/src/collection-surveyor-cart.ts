import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import { CollectionSelectedDetail } from "../../lib/types";

import { humanBytes } from "../../lib/webservices/src/lib/helpers";
import { EventHelpers } from "../../lib/eventHelpers";

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
        <div class="collections-cart ">
          <h3>Collections Selected:</h3>
          <ul>
            ${Object.entries(this.collectionsInCart).map(
              ([collectionName, value]) => html`
                <li>
                  ${collectionName}, Collection ID: ${value.collectionId},
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
          <h3>
            Total Collection Size Selected:
            <span class="totalSizeSelected"
              >${humanBytes(this.totalCollectionSizeSelected)}</span
            >
          </h3>
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
  `;
}
