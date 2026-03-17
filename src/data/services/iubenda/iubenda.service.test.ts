jest.mock("axios");
jest.mock("axios-retry", () => {
   const mock = jest.fn();
   mock.exponentialDelay = jest.fn();
   return mock;
});
jest.mock("@/lib/constants");

import { dtestData } from "@tests";
import axios, { AxiosError, AxiosInstance } from "axios";
import axiosRetry from "axios-retry";
import { mock, mockDeep } from "jest-mock-extended";

import { getIubendaApiKey, getIubendaConsentUrl } from "@/lib/constants";

import { IubendaService } from "./iubenda.service";
import { LegalNoticesAcceptedParams } from "./types";

const TEST_API_KEY = "test-api-key";
const TEST_CONSENT_URL = "https://test.iubenda.com";

const mockPost = jest.fn();

const mockAxiosInstance = mockDeep<AxiosInstance>();

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

const buildParams = (): LegalNoticesAcceptedParams => ({
   user: dtestData.dUser(),
   acceptedAt: new Date("2025-09-27T10:00:00.000Z"),
});

describe("IubendaService tests", () => {
   let service: IubendaService;

   beforeEach(() => {
      jest.clearAllMocks();
      mockedGetApiKey.mockReturnValue(TEST_API_KEY);
      mockedGetConsentUrl.mockReturnValue(TEST_CONSENT_URL);
      mockedAxiosCreate.mockReturnValue({ post: mockPost } as never);
      service = new IubendaService();
   });

   it("constructor - test", () => {
      expect(mockedAxiosCreate).toHaveBeenCalledTimes(1);
      expect(mockedAxiosCreate).toHaveBeenCalledWith({
         baseURL: TEST_CONSENT_URL,
      });

      expect(mockedAxiosRetry).toHaveBeenCalledTimes(1);
      const [axiosInstance, config] = mockedAxiosRetry.mock.calls[0];
      expect(config?.retries).toBe(2);
      expect(config?.retryDelay).toBe(axiosRetry.exponentialDelay);
      expect(axiosInstance).toEqual({ post: mockPost });
   });

   it("onRetry - logs warning with retry count and error message - test", () => {
      const consoleWarn = jest
         .spyOn(console, "warn")
         .mockImplementation(() => {});

      const [, config] = mockedAxiosRetry.mock.calls[0];
      const error = new AxiosError("timeout");

      config?.onRetry?.(1, error, {} as never);

      expect(consoleWarn).toHaveBeenCalledWith(
         expect.stringContaining("1"),
         error.message
      );
   });

   describe("saveLegalNoticesAccepted", () => {
      it("saveLegalNoticesAccepted - success - returns true - test", async () => {
         mockPost.mockResolvedValue({ status: 200 });
         const params = buildParams();

         const result = await service.saveLegalNoticesAccepted(params);

         expect(result).toBe(true);
      });

      it("saveLegalNoticesAccepted - success - posts to /consent endpoint - test", async () => {
         mockPost.mockResolvedValue({ status: 200 });
         const params = buildParams();

         await service.saveLegalNoticesAccepted(params);

         expect(mockPost).toHaveBeenCalledWith(
            "/consent",
            expect.any(Object),
            expect.any(Object)
         );
      });

      it("saveLegalNoticesAccepted - success - sends ApiKey header - test", async () => {
         mockPost.mockResolvedValue({ status: 200 });
         const params = buildParams();

         await service.saveLegalNoticesAccepted(params);

         const [, , config] = mockPost.mock.calls[0];
         expect(config.headers.ApiKey).toBe(TEST_API_KEY);
      });

      it("saveLegalNoticesAccepted - success - sends correct subject - test", async () => {
         mockPost.mockResolvedValue({ status: 200 });
         const params = buildParams();

         await service.saveLegalNoticesAccepted(params);

         const [, payload] = mockPost.mock.calls[0];
         expect(payload.subject).toEqual({
            id: params.user.id,
            email: params.user.email,
            full_name: params.user.name,
         });
      });

      it("saveLegalNoticesAccepted - success - sends privacy_policy and terms_and_conditions as legal notices - test", async () => {
         mockPost.mockResolvedValue({ status: 200 });
         const params = buildParams();

         await service.saveLegalNoticesAccepted(params);

         const [, payload] = mockPost.mock.calls[0];
         expect(payload.legal_notices).toEqual([
            { identifier: "privacy_policy" },
            { identifier: "terms_and_conditions" },
         ]);
      });

      it("saveLegalNoticesAccepted - success - sends timestamp matching acceptedAt - test", async () => {
         mockPost.mockResolvedValue({ status: 200 });
         const params = buildParams();

         await service.saveLegalNoticesAccepted(params);

         const [, payload] = mockPost.mock.calls[0];
         expect(payload.timestamp).toBe(params.acceptedAt.toISOString());
      });

      it("saveLegalNoticesAccepted - success - proof contains registration action and acceptedAt - test", async () => {
         mockPost.mockResolvedValue({ status: 200 });
         const params = buildParams();

         await service.saveLegalNoticesAccepted(params);

         const [, payload] = mockPost.mock.calls[0];
         const proofContent = JSON.parse(payload.proofs[0].content);
         expect(proofContent.action).toBe("registration");
         expect(proofContent.source).toBe("signup_form");
         expect(proofContent.accepted_at).toBe(params.acceptedAt.toISOString());
      });

      it("saveLegalNoticesAccepted - failure - returns false - test", async () => {
         jest.spyOn(console, "error").mockImplementation(() => {});
         mockPost.mockRejectedValue(new Error("Network error"));
         const params = buildParams();

         const result = await service.saveLegalNoticesAccepted(params);

         expect(result).toBe(false);
      });

      it("saveLegalNoticesAccepted - failure - logs error containing userId - test", async () => {
         const consoleError = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});
         mockPost.mockRejectedValue(new Error("Network error"));
         const params = buildParams();

         await service.saveLegalNoticesAccepted(params);

         expect(consoleError).toHaveBeenCalledWith(
            expect.stringContaining(params.user.id),
            expect.any(Error)
         );
      });
   });
});
