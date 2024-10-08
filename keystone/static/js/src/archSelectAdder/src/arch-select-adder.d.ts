import { LitElement, TemplateResult } from "lit";
export declare class ArchSelectAdder<T> extends LitElement {
    emptyOptionsPlaceholder: TemplateResult;
    deselectButtonText: string;
    headingLevel: number;
    labelGetter: (obj: T) => string;
    options: Array<T>;
    optionsSortCompareFn: undefined | ((a: T, b: T) => number);
    readOnlyMessage: undefined | TemplateResult;
    selectedOptions: Array<T>;
    selectedOptionsTitle: string;
    selectCtaText: string;
    valueGetter: (obj: T) => string;
    availableOptions: Array<T>;
    disabled: boolean;
    static shadowRootOptions: {
        delegatesFocus: boolean;
        mode: ShadowRootMode;
        slotAssignment?: SlotAssignmentMode | undefined;
        customElements?: CustomElementRegistry | undefined;
    };
    private sortByLabel;
    private heading;
    render(): TemplateResult<1 | 2>;
    updateAvailableOptions(): void;
    private selectOption;
    private get revertFn();
    private deselectOption;
    private selectHandler;
    /**
     * @param {() => void} revertFn - revert to the previous selected option state
     * @param {HTMLElement} srcEl - the interactive element that triggered the change
     */
    onChange(revertFn: () => void, srcEl: HTMLElement): void;
}
