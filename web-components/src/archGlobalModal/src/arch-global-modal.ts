import { css } from "lit";
import { customElement } from "lit/decorators.js";

import { GlobalModalDetail } from "../../lib/types";

import { ArchModal } from "../../archModal";

@customElement("arch-global-modal")
export class ArchGlobalModal extends ArchModal {
  static styles = [
    ...ArchModal.styles,
    css`
      h2[slot="heading"].error {
        color: #f00;
      }
    `,
  ];

  private static NotificationModalEventName = "show-notification-modal";
  private static ErrorModalEventName = "show-error-modal";

  connectedCallback() {
    super.connectedCallback();
    this.hideSubmitButton = true;
    this.cancelButtonText = "Close";
    document.addEventListener(
      ArchGlobalModal.ErrorModalEventName,
      this.errorHandler.bind(this),
      true
    );
    document.addEventListener(
      ArchGlobalModal.NotificationModalEventName,
      this.notificationHandler.bind(this),
      true
    );
  }

  private get headingEl(): HTMLElement {
    return (this.shadowRoot as ShadowRoot).querySelector(
      "h2[slot=heading]"
    ) as HTMLElement;
  }

  private get contentSlot(): HTMLElement {
    return (this.shadowRoot as ShadowRoot).querySelector(
      "slot[name=content]"
    ) as HTMLElement;
  }

  private errorHandler(e: Event) {
    const { message, elementToFocusOnClose } = (
      e as CustomEvent<GlobalModalDetail>
    ).detail;
    this.elementToFocusOnClose = elementToFocusOnClose;
    this.title = `⚠ Error`;
    this.contentSlot.innerHTML = message;
    this.headingEl.classList.add("error");
    this.open = true;
  }

  private notificationHandler(e: Event) {
    const { message, elementToFocusOnClose, title } = (
      e as CustomEvent<GlobalModalDetail>
    ).detail;
    this.elementToFocusOnClose = elementToFocusOnClose;
    this.title = title;
    this.contentSlot.innerHTML = message;
    this.headingEl.classList.remove("error");
    this.open = true;
  }

  private static show(
    eventName: string,
    title: string,
    message: string,
    elementToFocusOnClose: HTMLElement
  ) {
    document.dispatchEvent(
      new CustomEvent(eventName, {
        bubbles: true,
        composed: true,
        detail: { title, message, elementToFocusOnClose },
      })
    );
  }

  static showNotification(
    title: string,
    message: string,
    elementToFocusOnClose: HTMLElement
  ) {
    this.show(
      ArchGlobalModal.NotificationModalEventName,
      title,
      message,
      elementToFocusOnClose
    );
  }

  static showError(
    title: string,
    message: string,
    elementToFocusOnClose: HTMLElement
  ) {
    this.show(
      ArchGlobalModal.ErrorModalEventName,
      title,
      message,
      elementToFocusOnClose
    );
  }
}

// Injects the tag into the global name space
declare global {
  interface HTMLElementTagNameMap {
    "arch-global-modal": ArchGlobalModal;
  }
}
