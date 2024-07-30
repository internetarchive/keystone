import { LitElement, TemplateResult, html } from "lit";
import { property, query } from "lit/decorators.js";

/* Add these imports to the module in which you're using this mixin */
// import "@spectrum-web-components/theme/sp-theme.js";
// import "@spectrum-web-components/theme/src/themes.js";
// import "@spectrum-web-components/dialog/sp-dialog-base.js";
// import "@spectrum-web-components/dialog/sp-dialog.js";
// import "@spectrum-web-components/overlay/overlay-trigger.js";
// import "@spectrum-web-components/underlay/sp-underlay.js";

import { Overlay } from "@spectrum-web-components/overlay";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: any[]) => T;

// Subclasses in lit, and typescript more generally, need to
// be explicit about the possibler types of superclasses
// and what the mixin adds to its interface
// more details at:
// https://lit.dev/docs/composition/mixins/#when-a-mixin-adds-new-publicprotected-api
export declare class ModalMixinInterface {
  renderDialogContent(): TemplateResult;
  themeColor: string;
  themeScale: string;
  modalSize: string;
  scrollable: boolean;
  dismissable: boolean;
  open: boolean;
  elementToFocusOnClose: undefined | HTMLElement;
}

export const ModalMixin = <T extends Constructor<LitElement>>(
  superClass: T
) => {
  class ModalMixinClass extends superClass {
    @property({ type: String }) themeColor:
      | "lightest"
      | "light"
      | "dark"
      | "darkest" = "light";
    @property({ type: String }) themeScale: "medium" | "large" = "medium";
    @property({ type: String }) modalSize: "s" | "m" | "l" = "s";
    @property({ type: String }) scrollable = false;
    @property({ type: String }) dismissable = true;

    @query('slot[name=trigger] > button[name="dummy-trigger"]')
    dummyTriggerEl!: HTMLElement;

    private _elementToFocusOnClose: undefined | HTMLElement = undefined;
    private _open = false;

    @property()
    set elementToFocusOnClose(el: undefined | HTMLElement) {
      this._elementToFocusOnClose = el;
      if (!el) {
        return;
      }
      // Log a warning if the element has, or is within, a shadow root that's configured
      // with delegatesFocus == false.
      const elRoot = el.getRootNode();
      if (
        (el.shadowRoot && !el.shadowRoot.delegatesFocus) ||
        (el.shadowRoot === null &&
          elRoot instanceof ShadowRoot &&
          !elRoot.delegatesFocus)
      ) {
        console.warn([
          "Can not restore focus to element on modal close because it lives within a shadow root that's configured with delegatesFocus=false",
          el,
        ]);
      }
      // Assuming that the trigger slot has not been overidden, fix the
      // position of the dummy trigger <button> element at an identical location to
      // the specified element so that the browser won't scroll when the button
      // element momentarily receives focus.
      const { dummyTriggerEl } = this;
      if (dummyTriggerEl) {
        const { left, top } = el.getBoundingClientRect();
        dummyTriggerEl.style.left = `${left}px`;
        dummyTriggerEl.style.top = `${top}px`;
      }
    }

    get elementToFocusOnClose() {
      return this._elementToFocusOnClose;
    }

    @property({ type: Boolean })
    set open(open: boolean) {
      /* Handle an external / non-overlay-trigger-based open request */
      const overlay = this.spOverlay;
      if (overlay) {
        this._open = open;
        overlay.open = open;
      }
    }

    get open() {
      return this._open;
    }

    private get spOverlay(): null | Overlay {
      const thisShadow = this.shadowRoot;
      const overlayTrigger =
        thisShadow && thisShadow.querySelector("overlay-trigger");
      const overlayShadow = overlayTrigger && overlayTrigger.shadowRoot;
      return overlayShadow && overlayShadow.querySelector("sp-overlay");
    }

    connectedCallback() {
      super.connectedCallback();
      // https://opensource.adobe.com/spectrum-web-components/components/overlay-trigger/api/
      // spectrum overlay trigger fires the sp-opened event when the overlay has
      // finished opening.
      this.addEventListener("sp-opened", () => {
        this._open = true;
        ModalMixinClass.ensureScrollable();
      });

      // spectrum overlay trigger fires the sp-closed event when the dialog has
      // been dismissed via Escape key or Close button
      this.addEventListener("sp-closed", () => {
        this._open = false;
      });
    }

    render(): TemplateResult {
      return html`
        <sp-theme scale=${this.themeScale} color=${this.themeColor}>
          <overlay-trigger type="modal">
            <sp-dialog-base
              underlay
              slot="click-content"
              ?scrollable=${this.scrollable}
            >
              <sp-dialog
                size="${this.modalSize}"
                ?dismissable=${this.dismissable}
              >
                ${this.renderDialogContent()}
              </sp-dialog>
            </sp-dialog-base>
            <slot name="trigger" slot="trigger">
              <button
                name="dummy-trigger"
                style="position: fixed; padding: 0; z-index: -1"
                @focus=${this.customFocusHandler}
              ></button>
            </slot>
          </overlay-trigger>
        </sp-theme>
      `;
    }

    private static ensureScrollable() {
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

    private customFocusHandler(e: Event) {
      /* Transfer focus from the default hidden button trigger element to any
         specified elementToFocusOnClose */
      // Focus events are non-cancellable, so specifying
      // eventOptions({ capture: true }) and e.preventDefault has no effect.
      e.stopPropagation();
      const { elementToFocusOnClose } = this;
      if (elementToFocusOnClose) {
        elementToFocusOnClose.focus();
      }
    }

    // This will be overridden by subclasses to insert the actual
    // content into the dialog
    renderDialogContent(): TemplateResult {
      return html``;
    }
  }

  return ModalMixinClass as Constructor<ModalMixinInterface> & T;
};
