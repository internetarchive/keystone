
type ClassListType = Array<string>;
type ChildrenType = Array<HTMLElement>;
type DatasetType = Record<string, string>;

export function createElement(
  tagName: string,
  attrs: Record<string, string | number | ClassListType, ChildrenType | DatasetType>,
): HTMLElement;
