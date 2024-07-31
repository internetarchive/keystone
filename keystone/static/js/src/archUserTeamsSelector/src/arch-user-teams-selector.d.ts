import { PropertyValues } from "lit";
import { MinimalTeam } from "../../lib/types";
import { ArchSelectAdder } from "../../archSelectAdder/index";
export declare class ArchUserTeamsSelector extends ArchSelectAdder<MinimalTeam> {
    accountTeams: Array<MinimalTeam>;
    userTeams: Array<MinimalTeam>;
    readOnly: boolean;
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    willUpdate(changedProperties: PropertyValues): void;
    reset(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "arch-user-teams-selector": ArchUserTeamsSelector;
    }
}
