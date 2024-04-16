export type FormFieldName = "sources" | "name" | "surtPrefixesOR" | "timestampFrom" | "timestampTo" | "statusPrefixesOR" | "mimesOR";
export type FormFieldValue = string | Array<string>;
export type ParsedFormFieldValue = string | Array<string>;
export type DecodedFormData = Record<FormFieldName, string | Array<string> | Error>;
