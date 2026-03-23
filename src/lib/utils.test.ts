import { ntestData } from "@tests";

import {
   cn,
   formatDateTime,
   navigateToExternalUrl,
   openExternalUrlInNewTab,
   removePort,
   resolveIpAddresse,
   stringify,
   toTestId,
} from "./utils";

describe("utils tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   test("toTestId test", async () => {
      expect(toTestId("")).toEqual("");
      expect(toTestId("Label1")).toEqual("label1");
      expect(toTestId("LABEL2")).toEqual("label2");
      expect(toTestId("LABEL 3")).toEqual("label-3");
      expect(toTestId("LABEL-4")).toEqual("label-4");
      expect(toTestId("LABEL -4")).toEqual("label-4");
      expect(toTestId("LABEL 1 / Label 5")).toEqual("label-1-label-5");
      expect(toTestId("LABEL 3 &/ Label 7")).toEqual("label-3-label-7");
      expect(toTestId("LABEL Of The Btn")).toEqual("label-of-the-btn");
      expect(toTestId(" Trimmed Text 123 ")).toEqual("trimmed-text-123");
   });

   it("cn test", async () => {
      const classes1 = "css-1 css-2 css-3";
      const classes2 = "css-4 css-5";
      const classes3 = "css-6";
      const result = cn(classes1, classes2, classes3);
      const expectedResult = `${classes1} ${classes2} ${classes3}`;

      expect(result).toEqual(expectedResult);
   });

   it("stringify test", async () => {
      const value1 = { test: "test 1" };
      const result1 = stringify(value1);
      const expectedResult1 = JSON.stringify(value1);
      expect(result1).toEqual(expectedResult1);

      const value2 = "test 1";
      const result2 = stringify(value2);
      const expectedResult2 = JSON.stringify(value2);
      expect(result2).toEqual(expectedResult2);

      const result3 = stringify(null);
      expect(result3).toBeUndefined();
   });

   test("navigateToExternalUrl test", () => {
      const originalErrorLog = console.error;
      const errorFn = jest.fn();
      console.error = errorFn;

      const url = "https://test-1-url.com";
      navigateToExternalUrl(url);

      const expectedCause = "Not implemented: navigation (except hash changes)";
      expect(errorFn).toHaveBeenCalledTimes(1);
      const error = errorFn.mock.calls[0][0];
      expect(error.message).toEqual(expectedCause);

      console.error = originalErrorLog;
   });

   test("openExternalUrlInNewTab test", () => {
      const originalWindoOpen = window.open;
      const openFn = jest.fn();
      window.open = openFn;

      const url = "https://test-123.url.com";
      openExternalUrlInNewTab(url);

      expect(openFn).toHaveBeenCalledTimes(1);
      expect(openFn).toHaveBeenCalledWith(url, "_blank", "noopener,noreferrer");

      window.open = originalWindoOpen;
   });

   it("formatDateTime test", async () => {
      const ds = "2025-11-30T14:08:39.969Z";
      const result = formatDateTime(ds);

      const expectedResult = {
         dateTime: "30. Nov. 2025, 03:08 PM",
         dateOnly: "So., 30. Nov. 2025",
         timeOnly: "03:08 PM",
      };
      expect(result).toEqual(expectedResult);
   });
});

describe("removePort tests", () => {
   it("removePort - IPv4 without port - returns ip unchanged - test", () => {
      expect(removePort("192.168.1.1")).toBe("192.168.1.1");
   });

   it("removePort - IPv4 with port - removes port - test", () => {
      expect(removePort("192.168.1.1:5678")).toBe("192.168.1.1");
   });

   it("removePort - plain IPv6 without port - returns ip unchanged - test", () => {
      expect(removePort("2001:db8::1")).toBe("2001:db8::1");
   });

   it("removePort - bracketed IPv6 with port - removes brackets and port - test", () => {
      expect(removePort("[2001:db8::1]:5678")).toBe("2001:db8::1");
   });

   it("removePort - bracketed IPv6 loopback with port - removes brackets and port - test", () => {
      expect(removePort("[::1]:5678")).toBe("::1");
   });
});

describe("resolveIpAddresse tests", () => {
   it("resolveIpAddresse - x-forwarded-for set - returns ip - test", () => {
      const headers = ntestData.headers({ "x-forwarded-for": "192.168.1.1" });
      expect(resolveIpAddresse(headers)).toBe("192.168.1.1");
   });

   it("resolveIpAddresse - x-forwarded-for multiple ips - returns first ip - test", () => {
      const headers = ntestData.headers({
         "x-forwarded-for": "192.168.1.1,10.0.0.1,172.16.0.1",
      });
      expect(resolveIpAddresse(headers)).toBe("192.168.1.1");
   });

   it("resolveIpAddresse - x-forwarded-for multiple ips with spaces - returns first ip trimmed - test", () => {
      const headers = ntestData.headers({
         "x-forwarded-for": "  192.168.1.1 , 10.0.0.1",
      });
      expect(resolveIpAddresse(headers)).toBe("192.168.1.1");
   });

   it("resolveIpAddresse - x-forwarded-for not set - x-real-ip set - returns x-real-ip - test", () => {
      const headers = ntestData.headers({ "x-real-ip": "10.0.0.1" });
      expect(resolveIpAddresse(headers)).toBe("10.0.0.1");
   });

   it("resolveIpAddresse - no headers set - returns undefined - test", () => {
      const headers = ntestData.headers();
      expect(resolveIpAddresse(headers)).toBeUndefined();
   });

   it("resolveIpAddresse - ipv6 loopback ::1 - returns undefined - test", () => {
      const headers = ntestData.headers({ "x-forwarded-for": "::1" });
      expect(resolveIpAddresse(headers)).toBeUndefined();
   });

   it("resolveIpAddresse - ipv4 loopback 127.0.0.1 - returns undefined - test", () => {
      const headers = ntestData.headers({ "x-forwarded-for": "127.0.0.1" });
      expect(resolveIpAddresse(headers)).toBeUndefined();
   });

   it("resolveIpAddresse - x-forwarded-for ipv4 with port - removes port - test", () => {
      const headers = ntestData.headers({
         "x-forwarded-for": "192.168.1.1:5678",
      });
      expect(resolveIpAddresse(headers)).toBe("192.168.1.1");
   });

   it("resolveIpAddresse - x-real-ip ipv4 with port - removes port - test", () => {
      const headers = ntestData.headers({ "x-real-ip": "10.0.0.1:9000" });
      expect(resolveIpAddresse(headers)).toBe("10.0.0.1");
   });

   it("resolveIpAddresse - x-forwarded-for bracketed ipv6 with port - removes brackets and port - test", () => {
      const headers = ntestData.headers({
         "x-forwarded-for": "[2001:db8::1]:5678",
      });
      expect(resolveIpAddresse(headers)).toBe("2001:db8::1");
   });

   it("resolveIpAddresse - x-forwarded-for ipv6 loopback with port - returns undefined - test", () => {
      const headers = ntestData.headers({
         "x-forwarded-for": "[::1]:5678",
      });
      expect(resolveIpAddresse(headers)).toBeUndefined();
   });

   it("resolveIpAddresse - x-forwarded-for ipv4 loopback with port - returns undefined - test", () => {
      const headers = ntestData.headers({
         "x-forwarded-for": "127.0.0.1:1234",
      });
      expect(resolveIpAddresse(headers)).toBeUndefined();
   });
});
