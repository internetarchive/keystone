import { camelToKebab } from "./lib.js";

export function createElement(tagName, attrs = {}) {
  const finalAttrs = Object.assign({}, attrs);
  // Pop any defined children value.
  const children = attrs.children ?? [];
  delete finalAttrs.children
  // Pop any defined classList value and filter non-strings.
  const classList = (attrs.classList ?? []).filter(x => typeof(x) === "string");
  delete finalAttrs.classList
  // Pop any defined dataset.
  const dataset = attrs.dataset;
  delete finalAttrs.dataset;
  // If children and textContent are specified, move textContent into children.
  if (children.length && attrs.textContent) {
    children.unshift(attrs.textContent);
    delete finalAttrs.textContent;
  }
  // If classList and className are defined, move className into classList.
  if (classList.length && attrs.className) {
    classList.unshift(attrs.className);
    delete finalAttrs.className;
  }
  // Create the element with the specified finalAttrs.
  const el = Object.assign(document.createElement(tagName), finalAttrs);
  // Maybe set the children.
  if (children.length) {
    el.replaceChildren(...children);
  }
  // Maybe set the classes.
  if (classList.length) {
    el.classList.add(...classList);
  }
  // Maybe update the dataset.
  if (typeof(dataset) === "object") {
    Object.assign(el.dataset, dataset);
  }
  return el;
}

export function customElementsMaybeDefine(tagName, cls, ...args) {
  /* customElements.define() wrapper that first checks whether tagName
     has already been defined.
   */
  if (!customElements.get(tagName)) {
    customElements.define(tagName, cls, ...args);
  }
}

export const slugify = (s) => s.toLowerCase().replace(/[^a-zA-Z0-9\-_]/g, "-");

export function parseElementProps(el, objKeys, errorOnMissing = true) {
  /*
     Return an object with the specified objKeys that results from parsing
     an Element's attributes. In the event of a missing objOkey, you can
     specify an Array-type objKeys value with the a default value as the
     second element, i.e. [ <objKey>, <defaultValue> ]

     Example:
       el: <div first-val="1" second-val="[2,3,4]" third-val="&quot;ok&quot;"`>
       objKeys: [ "firstVal", "secondVal", "thirdVal" ]
       result: { firstVal: 1, secondVal: [2, 3, 4], thirdVal: "ok" }
   */
  const obj = {};
  const missingAttrs = [];
  for (let objKey of objKeys) {
    let defaultValue;
    if (Array.isArray(objKey)) {
      [objKey, defaultValue] = objKey;
    }
    const attrName = camelToKebab(objKey);
    if (!el.hasAttribute(attrName)) {
      if (defaultValue !== undefined) {
        obj[objKey] = defaultValue;
      } else {
        missingAttrs.push(attrName);
        obj[objKey] = undefined;
      }
    } else {
      const attrValue = el.getAttribute(attrName);
      if (attrValue === "") {
        // Interpret a present, empty attribute value as true.
        obj[objKey] = true;
      } else {
        obj[objKey] = JSON.parse(attrValue);
      }
    }
  }
  if (missingAttrs.length > 0 && errorOnMissing) {
    console.warn(el); // eslint-disable-line no-console
    throw new Error(`Element is missing required attributes: ${missingAttrs}`);
  }
  return obj;
}
