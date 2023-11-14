import { LitElement, TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: any[]) => T;

// Subclasses in lit, and typescript more generally, need to
// be explicit about the possibler types of superclasses
// and what the mixin adds to its interface
// more details at:
// https://lit.dev/docs/composition/mixins/#when-a-mixin-adds-new-publicprotected-api
export declare class ModalMixinInterface {
  _closeDialog(): void;
  _preCloseDialogEvent(): void;
  _postCloseDialogEvent(): void;
  _renderDialogContent(): TemplateResult;
  modalSize: string;
  scrollable: boolean;
}

export const ModalMixin = <T extends Constructor<LitElement>>(
  superClass: T
) => {
  class ModalMixinClass extends superClass {
    @property({ type: String }) modalSize: "s" | "m" | "l" = "s";
    @property({ type: String }) scrollable = false;

    connectedCallback() {
      super.connectedCallback();
      // https://opensource.adobe.com/spectrum-web-components/components/overlay-trigger/api/
      // spectrum overlay trigger fires the sp-opened event when the overlay has
      // finished opening.
      this.addEventListener("sp-opened", () =>
        ModalMixinClass._ensureScrollable()
      );

      // spectrum overlay trigger fires the sp-closed event when the dialog has
      // been dismissed via Escape key or Close button
      this.addEventListener("sp-closed", () => {
        this._closeDialog();
        this._postCloseDialogEvent();
      });
    }

    render(): TemplateResult {
      return html`
        <sp-theme color="light">
          <overlay-trigger type="modal" placement="none">
            <sp-dialog-base
              underlay
              slot="click-content"
              dismissable
              ?scrollable=${this.scrollable}
            >
              <sp-dialog size="${this.modalSize}" dismissable>
                ${this._renderDialogContent()}
              </sp-dialog>
            </sp-dialog-base>
            <slot name="trigger" slot="trigger"></slot>
          </overlay-trigger>
        </sp-theme>
      `;
    }

    private static _ensureScrollable() {
      /* Apply an 'overflow-y: auto' style to the modal div for all sp-dialog-base
         elements that specify the 'scrollable' attribute. It's necessary to use
         document.querySelectorAll() instead of this.querySelector() because of the
         way that the spectrum dialog component moves DOM nodes around.
      */
      const spDialogBaseEls = Array.from(
        document.querySelectorAll("sp-dialog-base[scrollable]")
      );
      // Set 'overflow-y: "auto' on each modal div.
      for (const el of spDialogBaseEls) {
        const modalDiv = (el.shadowRoot as ShadowRoot).querySelector(
          ":host > div.modal"
        ) as HTMLDivElement;
        modalDiv.style.overflowY = "auto";
      }
    }

    // This will be overridden by subclasses to insert the actual
    // content into the dialog
    _renderDialogContent(): TemplateResult {
      return html``;
    }

    _closeDialog(): void {
      this._preCloseDialogEvent();
      const dialog = document.querySelector("active-overlay sp-dialog");
      if (dialog) {
        const dispatched = dialog.dispatchEvent(
          new Event("close", { bubbles: true, composed: true })
        );
        if (dispatched) {
          this._postCloseDialogEvent();
        }
      }
    }

    // Hooks to add extra behavior when closing a modal

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    _preCloseDialogEvent(): void {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    _postCloseDialogEvent(): void {}
  }

  return ModalMixinClass as Constructor<ModalMixinInterface> & T;
};
