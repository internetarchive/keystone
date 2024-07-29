import { Dataset, Team } from "../../lib/types";
import { ArchSelectAdder } from "../../archSelectAdder/index";
export declare class ArchDatasetTeamsSelector extends ArchSelectAdder<Team> {
    datasetId: Dataset["id"];
    userTeams: Array<Team>;
    datasetTeams: Array<Team>;
    static styles: import("lit").CSSResult[];
    connectedCallback(): void;
    onChange(revertToPreviousState: () => void, srcEl: HTMLElement): Promise<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        "arch-dataset-teams-selector": ArchDatasetTeamsSelector;
    }
}
