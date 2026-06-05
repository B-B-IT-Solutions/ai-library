jest.mock("use-debounce", () => ({
   useDebouncedCallback: <T extends (...args: unknown[]) => unknown>(
      callback: T
   ) => {
      return (...args: Parameters<T>) => callback(...args);
   },
}));

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertChecked,
   assertInDocument,
   assertNotChecked,
   dtestData,
   renderWithRouter,
} from "@tests";

import { ModelsFilter } from "./models-filter";

const assertRendered = () => {
   const filter = screen.getByTestId("models-filter");
   assertInDocument(filter);
};

const assertModelsEmptyRendered = () => {
   const empty = screen.getByTestId("models-empty");
   assertInDocument(empty);
};

const assertOptionChecked = (option: string) => {
   const checkBox = screen.getByTestId(`model-${option}`);
   assertInDocument(checkBox);
   assertChecked(checkBox);
};

const assertOptionNotChecked = (option: string) => {
   const checkBox = screen.getByTestId(`model-${option}`);
   assertInDocument(checkBox);
   assertNotChecked(checkBox);
};

describe("ModelsFilter rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("models empty - test", async () => {
      const { container } = renderWithRouter(
         <ModelsFilter models={[]} />,
         "/",
         ""
      );

      await waitFor(() => {
         assertModelsEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("f_models mod-1 - test", async () => {
      const models = dtestData.dTemplateModels();

      const { container } = renderWithRouter(
         <ModelsFilter models={models} />,
         "/",
         "f_models=mod-1"
      );

      await waitFor(() => {
         assertRendered();
         assertOptionChecked("mod-1");
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ModelsFilter functinality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("model selected - test", async () => {
      const models = dtestData.dTemplateModels();
      const onUrlUpdateFn = jest.fn();

      renderWithRouter(
         <ModelsFilter models={models} />,
         "/",
         "",
         onUrlUpdateFn
      );

      await waitFor(() => {
         assertRendered();
         assertOptionNotChecked("mod-1");
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const mod1 = screen.getByTestId("model-mod-1");
      await userEvent.click(mod1);

      await waitFor(() => {
         assertOptionChecked("mod-1");
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
      });

      const lastCall = onUrlUpdateFn.mock.calls.at(-1)![0]!;
      expect(lastCall.queryString).toContain("f_models=mod-1");
   });

   it("model unselected - test", async () => {
      const models = dtestData.dTemplateModels();
      const onUrlUpdateFn = jest.fn();

      renderWithRouter(
         <ModelsFilter models={models} />,
         "/",
         "f_models=mod-1",
         onUrlUpdateFn
      );

      await waitFor(() => {
         assertRendered();
         assertOptionChecked("mod-1");
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const mod1 = screen.getByTestId("model-mod-1");
      await userEvent.click(mod1);

      await waitFor(() => {
         assertOptionNotChecked("mod-1");
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
      });

      const lastCall = onUrlUpdateFn.mock.calls.at(-1)![0]!;
      expect(lastCall.queryString).not.toContain("mod-1");
   });
});
