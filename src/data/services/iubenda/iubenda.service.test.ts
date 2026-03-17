jest.mock("axios");
jest.mock("axios-retry");
jest.mock("@/lib/constants");

import { dtestData } from "@tests";
import axios, { AxiosError, AxiosInstance } from "axios";
import axiosRetry from "axios-retry";

import { getIubendaApiKey, getIubendaConsentUrl } from "@/lib/constants";

import { IubendaService } from "./iubenda.service";
import { IubendaConsentPayload, LegalNoticesAcceptedParams } from "./types";

const TEST_API_KEY = "test-api-key";
const TEST_CONSENT_URL = "https://test.iubenda.com";

const mockPost = jest.fn();

const mockAxiosInstance: AxiosInstance = {
   post: mockPost,
} as unknown as AxiosInstance;

const mockedAxiosCreate = axios.create as jest.MockedFunction<
   typeof axios.create
>;
const mockedAxiosRetry = axiosRetry as jest.MockedFunction<typeof axiosRetry>;
const mockedGetApiKey = getIubendaApiKey as jest.MockedFunction<
   typeof getIubendaApiKey
>;
const mockedGetConsentUrl = getIubendaConsentUrl as jest.MockedFunction<
   typeof getIubendaConsentUrl
>;

const buildParams = (index = 1): LegalNoticesAcceptedParams => ({
   user: dtestData.dUser(index),
   acceptedAt: new Date("2025-09-27T10:00:00.000Z"),
});

describe("IubendaService - constructor - tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockedGetApiKey.mockReturnValue(TEST_API_KEY);
      mockedGetConsentUrl.mockReturnValue(TEST_CONSENT_URL);
      mockedAxiosCreate.mockReturnValue(mockAxiosInstance);
   });

   it("constructor - test", () => {
      const consoleWarn = jest.spyOn(console, "warn").mockImplementation();

      const service = new IubendaService();

      expect(service).toBeDefined();
      expect(mockedAxiosCreate).toHaveBeenCalledTimes(1);
      expect(mockedAxiosCreate).toHaveBeenCalledWith({
         baseURL: TEST_CONSENT_URL,
      });

      expect(mockedAxiosRetry).toHaveBeenCalledTimes(1);
      const [axiosInstance, config] = mockedAxiosRetry.mock.calls[0];
      expect(axiosInstance).toEqual(mockAxiosInstance);
      expect(config?.retries).toBe(2);
      expect(config?.retryDelay).toBe(axiosRetry.exponentialDelay);

      const error = new AxiosError("timeout");
      config?.onRetry?.(1, error, {} as never);

      expect(consoleWarn).toHaveBeenCalledWith(
         expect.stringContaining("1"),
         error.message
      );
   });
});

describe("saveLegalNoticesAccepted - tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockedGetApiKey.mockReturnValue(TEST_API_KEY);
      mockedGetConsentUrl.mockReturnValue(TEST_CONSENT_URL);
      mockedAxiosCreate.mockReturnValue(mockAxiosInstance);
   });

   it("saveLegalNoticesAccepted - success true - test", async () => {
      mockPost.mockResolvedValue({ status: 200 });
      const params = buildParams(1);

      const service = new IubendaService();
      const result = await service.saveLegalNoticesAccepted(params);

      const expectedPayload: IubendaConsentPayload = {
         subject: {
            id: params.user.id,
            email: params.user.email,
            full_name: params.user.name,
         },
         legal_notices: [
            { identifier: "privacy_policy" },
            { identifier: "terms_and_conditions" },
         ],
         proofs: [
            {
               content: JSON.stringify({
                  action: "registration",
                  source: "signup_form",
                  accepted_at: params.acceptedAt.toISOString(),
               }),
               form: "Registrierungsformular – Checkbox: AGB und Datenschutzerklärung",
            },
         ],
         timestamp: params.acceptedAt.toISOString(),
      };

      expect(result).toBe(true);
      expect(mockPost).toHaveBeenCalledTimes(1);
      const [url, payload, config] = mockPost.mock.calls[0];
      expect(url).toEqual("/consent");
      expect(payload).toEqual(expectedPayload);
      expect(config.headers.ApiKey).toBe(TEST_API_KEY);
   });

   it("saveLegalNoticesAccepted - success false - test", async () => {
      mockPost.mockRejectedValue(new Error("Network error"));
      const consoleError = jest.spyOn(console, "error").mockImplementation();
      const params = buildParams(123);

      const service = new IubendaService();
      const result = await service.saveLegalNoticesAccepted(params);

      const expectedPayload: IubendaConsentPayload = {
         subject: {
            id: params.user.id,
            email: params.user.email,
            full_name: params.user.name,
         },
         legal_notices: [
            { identifier: "privacy_policy" },
            { identifier: "terms_and_conditions" },
         ],
         proofs: [
            {
               content: JSON.stringify({
                  action: "registration",
                  source: "signup_form",
                  accepted_at: params.acceptedAt.toISOString(),
               }),
               form: "Registrierungsformular – Checkbox: AGB und Datenschutzerklärung",
            },
         ],
         timestamp: params.acceptedAt.toISOString(),
      };

      expect(result).toBe(false);
      expect(mockPost).toHaveBeenCalledTimes(1);
      const [url, payload, config] = mockPost.mock.calls[0];
      expect(url).toEqual("/consent");
      expect(payload).toEqual(expectedPayload);
      expect(config.headers.ApiKey).toBe(TEST_API_KEY);
      expect(consoleError).toHaveBeenCalledWith(
         expect.stringContaining(params.user.id),
         expect.any(Error)
      );
   });
});
