import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument } from "@tests";

import { VariableStatus } from "../utils/variables";

import { DetectedVariables } from "./detected-variables";

const assertRendered = () => {
   const section = screen.getByTestId("detected-variables");
   assertInDocument(section);
};

const assertUndefinedVariablesRendered = () => {
   const variables = screen.getByTestId("undefined-variables");
   assertInDocument(variables);
};

const assertUndefinedVariablesNotRendered = () => {
   const variables = screen.queryByTestId("undefined-variables");
   assertNotInDocument(variables);
};

describe("DetectedVariables rendering tests", () => {
   it("DetectedVariables - detectedVariables empty - tests", () => {
      const vs: VariableStatus = {
         undefined: [],
         used: [],
         unused: [],
      };
      const { container } = render(
         <DetectedVariables
            detectedVariables={[]}
            variableStatus={vs}
            onAddVariable={jest.fn()}
            onSyncAll={jest.fn()}
         />
      );

      expect(container.firstChild).toBeNull();
   });

   it("DetectedVariables - detectedVariables - undefined empty - tests", () => {
      const detectedVariables = ["name", "email"];
      const vs: VariableStatus = {
         undefined: [],
         used: ["name", "email"],
         unused: [],
      };
      const { container } = render(
         <DetectedVariables
            detectedVariables={detectedVariables}
            variableStatus={vs}
            onAddVariable={jest.fn()}
            onSyncAll={jest.fn()}
         />
      );

      assertRendered();
      assertUndefinedVariablesNotRendered();
      expect(container).toMatchSnapshot();
   });

   it("DetectedVariables - detectedVariables - undefined - tests", () => {
      const detectedVariables = ["name", "age"];
      const vs: VariableStatus = {
         undefined: ["age"],
         used: ["name"],
         unused: [],
      };
      const { container } = render(
         <DetectedVariables
            detectedVariables={detectedVariables}
            variableStatus={vs}
            onAddVariable={jest.fn()}
            onSyncAll={jest.fn()}
         />
      );

      assertRendered();
      assertUndefinedVariablesRendered();
      expect(container).toMatchSnapshot();
   });
});

describe("DetectedVariables functionality tests", () => {
   it("DetectedVariables - add btn clicked - test", async () => {
      const detectedVariables = ["age"];
      const vs: VariableStatus = {
         undefined: ["age"],
         used: [],
         unused: [],
      };

      const addVarialbeFn = jest.fn();

      render(
         <DetectedVariables
            detectedVariables={detectedVariables}
            variableStatus={vs}
            onAddVariable={addVarialbeFn}
            onSyncAll={jest.fn()}
         />
      );

      assertRendered();
      expect(addVarialbeFn).not.toHaveBeenCalled();

      const addButton = screen.getByTestId("add-btn");
      await userEvent.click(addButton);

      expect(addVarialbeFn).toHaveBeenCalledTimes(1);
      expect(addVarialbeFn).toHaveBeenCalledWith("age");
   });

   it("DetectedVariables - sync all btn clicked - test", async () => {
      const syncAllFn = jest.fn();
      render(
         <DetectedVariables
            detectedVariables={["name", "age", "address"]}
            variableStatus={{
               undefined: ["age", "address"],
               used: ["name"],
               unused: [],
            }}
            onAddVariable={jest.fn()}
            onSyncAll={syncAllFn}
         />
      );

      assertRendered();
      expect(syncAllFn).not.toHaveBeenCalled();

      const syncAllBtn = screen.getByTestId("sync-all-btn");
      await userEvent.click(syncAllBtn);

      expect(syncAllFn).toHaveBeenCalledTimes(1);
   });
});
