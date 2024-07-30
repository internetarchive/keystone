import { expect } from "@open-wc/testing";
import { isoStringToDateString } from "../lib/helpers";

describe("isoStringToDateString()", () => {
  describe("a timestamp string is passed in", () => {
    it("renders a short month digit day,  year", () => {
      const timestamp = new Date("12/22/2022").toISOString();
      expect(isoStringToDateString(timestamp)).to.eq("Dec 22, 2022");
    });
  });
  describe("a date object is passed in", () => {
    it("renders a short month digit day,  year", () => {
      const timestamp = new Date("12/22/2022");
      expect(isoStringToDateString(timestamp)).to.eq("Dec 22, 2022");
    });
  });
  describe("a non-timestamp string is passed in", () => {
    it("renders an Invalid Dare string", () => {
      const timestamp = "not what it was expecting";
      expect(isoStringToDateString(timestamp)).to.eq("Invalid Date");
    });
  });
  describe("a timestamp string and includeTime option are passed in", () => {
    it("renders a short month digit day, year and time ", () => {
      const timestamp = new Date("12/22/2022 05:00:01 AM PST").toISOString();
      expect(isoStringToDateString(timestamp, true)).to.eq(
        "Dec 22, 2022, 5:00 AM PST"
      );
    });
  });
  describe("a date object and includeTime option are passed in", () => {
    it("renders a short month digit day, year and time ", () => {
      const timestamp = new Date("12/22/2022 05:00:01 AM PST");
      expect(isoStringToDateString(timestamp, true)).to.eq(
        "Dec 22, 2022, 5:00 AM PST"
      );
    });
  });
});
