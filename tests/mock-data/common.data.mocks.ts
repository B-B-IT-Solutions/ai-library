import {
   MutationObserverLoadingResult,
   UseMutationResult,
} from "@tanstack/react-query";
import SMTPTransport from "nodemailer/lib/smtp-transport";

type MediaQueryFn = (query: string) => MediaQueryList;

export const createMatchMedia = (matches: boolean): MediaQueryFn => {
   return () => {
      return {
         matches,
         addEventListener: jest.fn(),
         removeEventListener: jest.fn(),
         addListener: jest.fn(),
         removeListener: jest.fn(),
      } as unknown as MediaQueryList;
   };
};

export const useMutationResultMock = (
   mutateFn = jest.fn()
): UseMutationResult => {
   return {
      mutate: mutateFn,
      mutateAsync: jest.fn(),
      data: undefined,
      error: null,
      variables: undefined,
      isError: false,
      isIdle: true,
      isPaused: false,
      isPending: false,
      submittedAt: 1771843764739,
      isSuccess: false,
      status: "idle",
      reset: jest.fn(),
      failureCount: 0,
      failureReason: null,
      context: undefined,
   };
};

export const useMutationObserverLoadingResult = (
   mutateFn = jest.fn()
): MutationObserverLoadingResult => {
   return {
      mutate: async () => mutateFn(),
      data: undefined,
      variables: undefined,
      error: null,
      isError: false,
      isIdle: false,
      isPending: true,
      isSuccess: false,
      status: "pending",
      context: undefined,
      reset: jest.fn(),
      failureCount: 0,
      failureReason: new Error(""),
      isPaused: false,
      submittedAt: 1771920253399,
   };
};

export const uuid = (index = 1) => {
   const encoder = new TextEncoder();
   return encoder.encode(`mock-uuid-${index}`);
};

export const sentMessageInfo = (index = 1): SMTPTransport.SentMessageInfo => {
   return {
      envelope: {
         from: "from@email.com",
         to: ["to@email.com"],
      },
      messageId: `message-id-${index}`,
      accepted: [],
      rejected: [],
      pending: [],
      response: `respons ${index}`,
   };
};
