import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { GlobalTemplateFieldsPicker } from "./global-template-fields-picker";

const assertRendered = async () => {
   const picker = screen.getByTestId("global-template-fields-picker");
   assertInDocument(picker);
};

const assertContentRendered = async () => {
   const header = screen.getByTestId("picker-header");
   const fieldSearch = screen.getByTestId("field-search");
   const searchInput = screen.getByTestId("search-input");
   const fieldsList = screen.getByTestId("fields-list");

   assertInDocument(header);
   assertInDocument(fieldSearch);
   assertInDocument(searchInput);
   assertInDocument(fieldsList);
};

const assertContentNotRendered = async () => {
   const header = screen.queryByTestId("picker-header");
   const fieldSearch = screen.queryByTestId("field-search");
   const searchInput = screen.queryByTestId("search-input");
   const fieldsList = screen.queryByTestId("fields-list");

   assertNotInDocument(header);
   assertNotInDocument(fieldSearch);
   assertNotInDocument(searchInput);
   assertNotInDocument(fieldsList);
};

const assertFieldsRendered = async () => {
   const fieldOptions = screen.getAllByTestId("field-option");
   const empty = screen.queryByTestId("fields-empty");

   expect(fieldOptions).toHaveLength(3);
   assertNotInDocument(empty);
};

const assertFieldsEmptyRendered = async () => {
   const empty = screen.getByTestId("fields-empty");
   const fieldOptions = screen.queryAllByTestId("field-option");

   assertInDocument(empty);
   expect(fieldOptions).toHaveLength(0);
};

const assertAddBtnRendered = async () => {
   const addBtn = screen.getByTestId("add-fields-btn");
   assertInDocument(addBtn);
};

const assertAddBtnNotRendered = async () => {
   const addBtn = screen.queryByTestId("add-fields-btn");
   assertNotInDocument(addBtn);
};

describe("GlobalTemplateFieldsPicker rendering tests", () => {
   it("GlobalTemplateFieldsPicker - open false - test", async () => {
      const fields = dtestData.dGlobalTemplateFields();
      const selectedFieldIds = dtestData.dGlobalTemplateFieldIds(1);

      const { container } = render(
         <GlobalTemplateFieldsPicker
            globalFields={fields}
            selectedGlobalFieldIds={selectedFieldIds}
            onAddFields={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertContentNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("GlobalTemplateFieldsPicker - open true - fields empty - test", async () => {
      const { container } = render(
         <GlobalTemplateFieldsPicker
            globalFields={[]}
            selectedGlobalFieldIds={[]}
            onAddFields={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertContentNotRendered();
      });

      const pickerBtn = screen.getByTestId("global-template-fields-picker");
      await userEvent.click(pickerBtn);

      await waitFor(() => {
         assertContentRendered();
         assertFieldsEmptyRendered();
         assertAddBtnNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("GlobalTemplateFieldsPicker - open true - with fields - test", async () => {
      const fields = dtestData.dGlobalTemplateFields();
      const selectedFieldIds = dtestData.dGlobalTemplateFieldIds(1);

      const { container } = render(
         <GlobalTemplateFieldsPicker
            globalFields={fields}
            selectedGlobalFieldIds={selectedFieldIds}
            onAddFields={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertContentNotRendered();
      });

      const pickerBtn = screen.getByTestId("global-template-fields-picker");
      await userEvent.click(pickerBtn);

      await waitFor(() => {
         assertContentRendered();
         assertFieldsRendered();
         assertAddBtnNotRendered();
      });

      const fieldOptions = screen.getAllByTestId("field-option");
      expect(fieldOptions[0]).toBeDisabled();
      expect(fieldOptions[1]).not.toBeDisabled();
      expect(fieldOptions[2]).not.toBeDisabled();

      expect(container).toMatchSnapshot();
   });

   it("GlobalTemplateFieldsPicker - open true - field selected - test", async () => {
      const fields = dtestData.dGlobalTemplateFields();

      const { container } = render(
         <GlobalTemplateFieldsPicker
            globalFields={fields}
            selectedGlobalFieldIds={[]}
            onAddFields={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertContentNotRendered();
      });

      const pickerBtn = screen.getByTestId("global-template-fields-picker");
      await userEvent.click(pickerBtn);

      await waitFor(() => {
         assertContentRendered();
         assertFieldsRendered();
         assertAddBtnNotRendered();
      });

      const fieldOptions = screen.getAllByTestId("field-option");
      expect(fieldOptions[0]).not.toBeDisabled();
      expect(fieldOptions[1]).not.toBeDisabled();
      expect(fieldOptions[2]).not.toBeDisabled();

      const fieldOption = screen.getAllByTestId("field-option")[0];
      await userEvent.click(fieldOption);

      await waitFor(() => {
         assertAddBtnRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("GlobalTemplateFieldsPicker functionality tests", () => {
   it("GlobalTemplateFieldsPicker - field selected - test", async () => {
      const fields = dtestData.dGlobalTemplateFields();
      const addFieldsFn = jest.fn();

      render(
         <GlobalTemplateFieldsPicker
            globalFields={fields}
            selectedGlobalFieldIds={[]}
            onAddFields={addFieldsFn}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertContentNotRendered();
      });

      const pickerBtn = screen.getByTestId("global-template-fields-picker");
      await userEvent.click(pickerBtn);

      await waitFor(() => {
         assertFieldsRendered();
         assertContentRendered();
         expect(addFieldsFn).not.toHaveBeenCalled();
      });

      const fieldOption1 = screen.getAllByTestId("field-option")[0];
      await userEvent.click(fieldOption1);

      await waitFor(() => {
         expect(addFieldsFn).not.toHaveBeenCalled();
      });

      const fieldOption2 = screen.getAllByTestId("field-option")[1];
      await userEvent.click(fieldOption2);

      await waitFor(() => {
         expect(addFieldsFn).not.toHaveBeenCalled();
      });

      const addBtn = screen.getByTestId("add-fields-btn");
      await userEvent.click(addBtn);

      const expectedPayload: string[] = [fields[0].id, fields[1].id];

      await waitFor(() => {
         assertContentNotRendered();
         expect(addFieldsFn).toHaveBeenCalledTimes(1);
         expect(addFieldsFn).toHaveBeenCalledWith(expectedPayload);
      });
   });
   it("GlobalTemplateFieldsPicker - field unselected - test", async () => {
      const fields = dtestData.dGlobalTemplateFields();
      const selectedFieldIds = dtestData.dGlobalTemplateFieldIds(1);
      const addFieldsFn = jest.fn();

      render(
         <GlobalTemplateFieldsPicker
            globalFields={fields}
            selectedGlobalFieldIds={selectedFieldIds}
            onAddFields={addFieldsFn}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertContentNotRendered();
      });

      const pickerBtn = screen.getByTestId("global-template-fields-picker");
      await userEvent.click(pickerBtn);

      await waitFor(() => {
         assertFieldsRendered();
         assertContentRendered();
         expect(addFieldsFn).not.toHaveBeenCalled();
      });

      const fieldOption1 = screen.getAllByTestId("field-option")[1];
      await userEvent.click(fieldOption1);

      await waitFor(() => {
         expect(addFieldsFn).not.toHaveBeenCalled();
      });

      const fieldOption2 = screen.getAllByTestId("field-option")[2];
      await userEvent.click(fieldOption2);

      await waitFor(() => {
         expect(addFieldsFn).not.toHaveBeenCalled();
      });

      await userEvent.click(fieldOption1);

      await waitFor(() => {
         expect(addFieldsFn).not.toHaveBeenCalled();
      });

      const addBtn = screen.getByTestId("add-fields-btn");
      await userEvent.click(addBtn);

      const expectedPayload: string[] = [fields[2].id];

      await waitFor(() => {
         assertContentNotRendered();
         expect(addFieldsFn).toHaveBeenCalledTimes(1);
         expect(addFieldsFn).toHaveBeenCalledWith(expectedPayload);
      });
   });

   it("GlobalTemplateFieldsPicker - field search - test", async () => {
      const fields = dtestData.dGlobalTemplateFields();
      const selectedFieldIds = dtestData.dGlobalTemplateFieldIds(1);

      render(
         <GlobalTemplateFieldsPicker
            globalFields={fields}
            selectedGlobalFieldIds={selectedFieldIds}
            onAddFields={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertContentNotRendered();
      });

      const pickerBtn = screen.getByTestId("global-template-fields-picker");
      await userEvent.click(pickerBtn);

      await waitFor(() => {
         assertFieldsRendered();
         assertContentRendered();
      });

      const fieldOptions1 = screen.getAllByTestId("field-option");
      expect(fieldOptions1).toHaveLength(3);

      const field1 = fields[0];
      const input = screen.getByTestId("search-input");

      await userEvent.type(input, field1.name);

      const fieldOptions2 = screen.getAllByTestId("field-option");
      expect(fieldOptions2).toHaveLength(1);

      await userEvent.clear(input);

      const fieldOptions3 = screen.getAllByTestId("field-option");
      expect(fieldOptions3).toHaveLength(3);

      await userEvent.type(input, field1.label);

      const fieldOptions4 = screen.getAllByTestId("field-option");
      expect(fieldOptions4).toHaveLength(1);
   });

   it("GlobalTemplateFieldsPicker - open/close - test", async () => {
      const fields = dtestData.dGlobalTemplateFields();
      const selectedFieldIds = dtestData.dGlobalTemplateFieldIds(1);
      const addFieldsFn = jest.fn();

      render(
         <GlobalTemplateFieldsPicker
            globalFields={fields}
            selectedGlobalFieldIds={selectedFieldIds}
            onAddFields={addFieldsFn}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertContentNotRendered();
      });

      const pickerBtn = screen.getByTestId("global-template-fields-picker");
      await userEvent.click(pickerBtn);

      await waitFor(() => {
         assertFieldsRendered();
         assertContentRendered();
         expect(addFieldsFn).not.toHaveBeenCalled();
      });

      await userEvent.keyboard("{Escape}");

      await waitFor(() => {
         assertContentNotRendered();
      });
   });
});
