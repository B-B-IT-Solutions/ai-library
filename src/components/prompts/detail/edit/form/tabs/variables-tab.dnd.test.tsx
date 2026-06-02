let mockMoveFieldFn: MoveFieldFnType | undefined = undefined;

type MoveFieldFnType = (from: number, to: number) => void;

type PromptVariablesProps = {
   onMoveField: MoveFieldFnType;
};

jest.mock("../sections", () => ({
   ...jest.requireActual("../sections"),
   PromptVariables: ({ onMoveField }: PromptVariablesProps) => {
      mockMoveFieldFn = jest.fn(onMoveField);
      return <div data-testid="prompt-variables" />;
   },
}));

import { act, render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { DPromptUpdate, DPromptWithContent } from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { initPromptTemplate } from "../utils";
import { VariableStatus } from "../utils/variables";

import { PromptVariablesTab } from "./variables-tab";

jest.setTimeout(10000);

type TestWrapperProps = {
   prompt?: DPromptWithContent;
   globalFields: DGlobalPromptField[];
   detectedVariables?: string[];
   variableStatus?: VariableStatus;
};

const TestWrapper = ({
   prompt,
   globalFields,
   detectedVariables = [],
   variableStatus = dtestData.dVariableStatus(),
}: TestWrapperProps) => {
   const form = useForm<DPromptUpdate>({
      defaultValues: initPromptTemplate(prompt),
   });

   const tabid = "variables-tab";
   return (
      <FormProvider {...form}>
         <Tabs defaultValue={tabid}>
            <TabsList>
               <TabsTrigger value={tabid}>Prompt</TabsTrigger>
            </TabsList>
            <PromptVariablesTab
               tabId={tabid}
               form={form}
               globalFields={globalFields}
               detectedVariables={detectedVariables}
               variableStatus={variableStatus}
            />
         </Tabs>
      </FormProvider>
   );
};

const assertRendered = () => {
   const tab = screen.getByTestId("prompt-variables-tab");
   const variables = screen.getByTestId("prompt-variables");

   assertInDocument(tab);
   assertInDocument(variables);
};

describe("PromptEditForm functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("handleMoveField - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      const globalVariables = dtestData.dGlobalPromptFields();

      render(<TestWrapper prompt={prompt} globalFields={globalVariables} />);

      await waitFor(() => {
         assertRendered();
         expect(mockMoveFieldFn).not.toHaveBeenCalled();
      });

      const capturedFn = mockMoveFieldFn!;
      await waitFor(() => {
         capturedFn(0, 1);
      });

      expect(capturedFn).toHaveBeenCalledTimes(1);
      expect(capturedFn).toHaveBeenCalledWith(0, 1);
   });
});
