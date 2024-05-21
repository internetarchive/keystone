import { PropertyValues } from "lit";
import { MinimalUser } from "../../lib/types";
import { ArchSelectAdder } from "../../archSelectAdder/index";
export declare class ArchTeamMembersSelector extends ArchSelectAdder<MinimalUser> {
    accountUsers: Array<MinimalUser>;
    teamMembers: Array<MinimalUser>;
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    willUpdate(changedProperties: PropertyValues): void;
    reset(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "arch-team-members-selector": ArchTeamMembersSelector;
    }
}
