export {
   assertInDocument,
   assertNotInDocument,
   assertChecked,
   assertNotChecked,
   assertVisbile,
   assertNotVisible,
   assertHasClass,
   assertHasNoClass,
   assertHasAttributeWithValue,
   assertHasAttributeWithValueContaining,
   assertHasAttribute,
   assertHasNoAttribute,
   assertHasStyle,
   assertHasNoStyle,
   assertStringifyEqual,
} from "./assert.utils";

export {
   renderAsyncRSC,
   renderWithRouter,
   renderWithSidebar,
   renderWithTooltip,
   renderHookWithReactQuery,
   renderWithReactQuery,
   getElementById,
   clearInput,
   typeIntoInput,
   typeIntoTextArea,
   typeIntoTipTap,
} from "./test.utils";

export * as adtestData from "./mock-data/admin.data.mocks";
export * as aptestData from "./mock-data/admin.persistence.data.mocks";
export * as ptestData from "./mock-data/persistence.data.mocks";
export * as dtestData from "./mock-data/domain.data.mocks";
export * as ctestData from "./mock-data/common.data.mocks";
export * as ntestData from "./mock-data/next.data.mocks";
export * as stripeTestData from "./mock-data/stripe.data.mocks";

export type { AuthMockedFunction, UuidV4MockedFunction } from "./test.types";
