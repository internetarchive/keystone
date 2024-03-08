import { SolrData } from "../../lib/types";
export declare const MAX_SOLR_ROWS = 14000;
export declare function constructFinalSearchTerm(searchTerm: string, parsedFilters: string[]): string;
export declare function callSearchApi(finalSearchTerm: string, rowCount: number): Promise<SolrData>;
