import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import "@spectrum-web-components/theme/sp-theme.js";
import "@spectrum-web-components/theme/src/themes.js";
import "@spectrum-web-components/dialog/sp-dialog-base.js";
import "@spectrum-web-components/dialog/sp-dialog.js";
import "@spectrum-web-components/overlay/overlay-trigger.js";
import "@spectrum-web-components/underlay/sp-underlay.js";

import { ModalMixin } from "../../lib/webservices/src/mixins/modal";

import styles from "./styles";

@customElement("arch-modal")
export class ArchModal extends ModalMixin(LitElement) {
  /* Generic ARCH Modal Component w/ default cancel/submit confirmation buttons.

     - Properties provided by ModalMixin
     @property() elementToFocusOnClose: undefined | HTMLElement = undefined;
     @property({ type: String }) themeColor: "lightest" | "light" | "dark" | "darkest" = "light";
     @property({ type: String }) themeScale: "medium" | "large" = "medium";
     @property({ type: String }) modalSize: "s" | "m" | "l" = "s";
     @property({ type: String }) scrollable = false;
     @property({ type: String }) dismissable = true;
     @property({ type: Boolean }) open = false;

     - Provided Slots
     contents: the main content of the modal
     buttons: the cancel/submit buttons container
  */
  @property({ type: Boolean }) hideCancelButton = false;
  @property({ type: Boolean }) hideSubmitButton = false;
  @property({ type: String }) cancelButtonClass = "";
  @property({ type: String }) cancelButtonText = "Cancel";
  @property({ type: String }) submitButtonClass = "primary";
  @property({ type: String }) submitButtonText = "Ok";
  @property({ type: String }) title = "";

  static styles = styles;

  renderDialogContent() {
    const {
      cancelButtonClass,
      cancelButtonText,
      hideCancelButton,
      hideSubmitButton,
      submitButtonClass,
      submitButtonText,
      title,
    } = this;
    return html`
      <h2 slot="heading">${title}</h2>
      <slot name="content"></slot>
      <slot name="buttons">
        <div class="buttons-wrapper">
          ${hideCancelButton
            ? html``
            : html`<button
                class="${cancelButtonClass}"
                @click=${() => (this.open = false)}
                ?hidden=${hideCancelButton}
              >
                ${cancelButtonText}
              </button>`}
          ${hideSubmitButton
            ? html``
            : html`<button
                type="button"
                class="${submitButtonClass}"
                @click=${this.submit}
              >
                ${submitButtonText}
              </button>`}
        </div>
      </slot>
    `;
  }

  submit() {
    /* Emit a submit event and close the dialog. */
    this.dispatchEvent(new Event("submit", { bubbles: true, composed: true }));
    this.open = false;
  }
}

// Injects the tag into the global name space
declare global {
  interface HTMLElementTagNameMap {
    "arch-modal": ArchModal;
  }
}
