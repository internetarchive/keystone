import{i as t,_ as e,a as o}from"./chunk-lit-element.js";import{A as s}from"./chunk-arch-modal.js";import"./chunk-scale-large.js";import"./chunk-styles.js";import"./chunk-state.js";import"./chunk-sizedMixin.js";var n;let i=n=class extends s{connectedCallback(){super.connectedCallback(),this.hideSubmitButton=!0,this.cancelButtonText="Close",document.addEventListener(n.ErrorModalEventName,this.errorHandler.bind(this),!0),document.addEventListener(n.NotificationModalEventName,this.notificationHandler.bind(this),!0)}get headingEl(){return this.shadowRoot.querySelector("h2[slot=heading]")}get contentSlot(){return this.shadowRoot.querySelector("slot[name=content]")}errorHandler(t){const{message:e,elementToFocusOnClose:o}=t.detail;this.elementToFocusOnClose=o,this.title="⚠ Error",this.contentSlot.innerHTML=e,this.headingEl.classList.add("error"),this.open=!0}notificationHandler(t){const{message:e,elementToFocusOnClose:o,title:s}=t.detail;this.elementToFocusOnClose=o,this.title=s,this.contentSlot.innerHTML=e,this.headingEl.classList.remove("error"),this.open=!0}static show(t,e,o,s){document.dispatchEvent(new CustomEvent(t,{bubbles:!0,composed:!0,detail:{title:e,message:o,elementToFocusOnClose:s}}))}static showNotification(t,e,o){this.show(n.NotificationModalEventName,t,e,o)}static showError(t,e,o){this.show(n.ErrorModalEventName,t,e,o)}};i.styles=[...s.styles,t`
      h2[slot="heading"].error {
        color: #f00;
      }
    `],i.NotificationModalEventName="show-notification-modal",i.ErrorModalEventName="show-error-modal",i=n=e([o("arch-global-modal")],i);export{i as ArchGlobalModal};
//# sourceMappingURL=arch-global-modal.js.map