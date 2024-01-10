import { expect, fixture } from "@open-wc/testing";
import { html } from "lit";
import { breakableString } from "../lib/lib";

describe("breakableString", () => {
  it("returns a html template with <wbr> before each underscore", async () => {
    var value = "one_two";
    var el = await fixture(html`<div>${breakableString(value)}</div>`);
    expect(el.querySelectorAll("wbr").length).to.eql(1);
    expect(el.textContent?.trim()).to.eql(value);

    value = "one_two_three";
    el = await fixture(html`<div>${breakableString(value)}</div>`);
    expect(el.querySelectorAll("wbr").length).to.eql(2);
    expect(el.textContent?.trim()).to.eql(value);

    value = "one__two__four";
    el = await fixture(html`<div>${breakableString(value)}</div>`);
    expect(el.querySelectorAll("wbr").length).to.eql(4);
    expect(el.textContent?.trim()).to.eql(value);
  });

  it("returns a html template with <wbr> before each hyphen", async () => {
    var value = "one-two";
    var el = await fixture(html`<div>${breakableString(value)}</div>`);
    expect(el.querySelectorAll("wbr").length).to.eql(1);
    expect(el.textContent?.trim()).to.eql(value);

    value = "one-two-three";
    el = await fixture(html`<div>${breakableString(value)}</div>`);
    expect(el.querySelectorAll("wbr").length).to.eql(2);
    expect(el.textContent?.trim()).to.eql(value);

    value = "one--two--four";
    el = await fixture(html`<div>${breakableString(value)}</div>`);
    expect(el.querySelectorAll("wbr").length).to.eql(4);
    expect(el.textContent?.trim()).to.eql(value);
  });

  it("returns a html template with <wbr> before each period", async () => {
    var value = "one.two";
    var el = await fixture(html`<div>${breakableString(value)}</div>`);
    expect(el.querySelectorAll("wbr").length).to.eql(1);
    expect(el.textContent?.trim()).to.eql(value);

    value = "one.two.three";
    el = await fixture(html`<div>${breakableString(value)}</div>`);
    expect(el.querySelectorAll("wbr").length).to.eql(2);
    expect(el.textContent?.trim()).to.eql(value);

    value = "one..two..four";
    el = await fixture(html`<div>${breakableString(value)}</div>`);
    expect(el.querySelectorAll("wbr").length).to.eql(4);
    expect(el.textContent?.trim()).to.eql(value);
  });
});
