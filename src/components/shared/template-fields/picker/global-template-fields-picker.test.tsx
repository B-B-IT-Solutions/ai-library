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

      const fieldOption = screen.getAllByTestId("field-option")[0];
      await userEvent.click(fieldOption);

      await waitFor(() => {
         assertAddBtnRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

// describe("GlobalTemplateFieldsPicker functionality tests", () => {
//    it("GlobalTemplateFieldsPicker - field selected - test", async () => {
//       const fields = dtestData.dGlobalTemplateFields();
//       const selectedFieldIds = dtestData.dGlobalTemplateFieldIds(1);

//       const { container } = render(
//          <GlobalTemplateFieldsPicker
//             globalFields={fields}
//             selectedGlobalFieldIds={selectedFieldIds}
//             onAddFields={jest.fn()}
//          />
//       );

//       await waitFor(() => {
//          assertRendered();
//          assertContentNotRendered();
//       });

//       const pickerBtn = screen.getByTestId("global-template-fields-picker");
//       await userEvent.click(pickerBtn);

//       await waitFor(() => {
//          assertContentRendered();
//          assertFieldsRendered();
//       });

//       expect(container).toMatchSnapshot();
//    });
// });

// describe("GlobalTemplateFieldsPicker search tests", () => {
//    it("filters fields by name", async () => {
//       renderComponent();

//       await openPopover();

//       userEvent.type(screen.getByTestId("seach-input"), "name-1");

//       await waitFor(() => {
//          const options = screen.getAllByTestId("global-template-field-option");
//          expect(options).toHaveLength(1);
//       });
//    });

//    it("filters fields by label", async () => {
//       renderComponent();

//       await openPopover();

//       userEvent.type(screen.getByTestId("seach-input"), "label 2");

//       await waitFor(() => {
//          const options = screen.getAllByTestId("global-template-field-option");
//          expect(options).toHaveLength(1);
//       });
//    });

//    it("shows empty state when no fields match search", async () => {
//       renderComponent();

//       await openPopover();

//       userEvent.type(screen.getByTestId("seach-input"), "does-not-exist-xyz");

//       await waitFor(() => {
//          assertInDocument(screen.getByTestId("fields-empty"));
//       });
//    });
// });

// describe("GlobalTemplateFieldsPicker selection tests", () => {
//    it("already added fields are disabled", async () => {
//       const fields = dtestData.dGlobalTemplateFields(3);
//       renderComponent({
//          globalFields: fields,
//          selectedGlobalFieldIds: [fields[0].id],
//       });

//       await openPopover();

//       const options = screen.getAllByTestId("global-template-field-option");
//       expect(options[0]).toBeDisabled();
//       expect(options[1]).not.toBeDisabled();
//       expect(options[2]).not.toBeDisabled();
//    });

//    it("clicking an already added field does nothing", async () => {
//       const fields = dtestData.dGlobalTemplateFields(3);
//       const onAddFields = jest.fn();
//       renderComponent({
//          globalFields: fields,
//          selectedGlobalFieldIds: [fields[0].id],
//          onAddFields,
//       });

//       await openPopover();

//       const options = screen.getAllByTestId("global-template-field-option");
//       userEvent.click(options[0]);

//       await waitFor(() => {
//          expect(screen.queryByTestId("add-fields-btn")).not.toBeInTheDocument();
//       });
//    });

//    it("shows add button with singular label after selecting one field", async () => {
//       renderComponent();

//       await openPopover();

//       userEvent.click(screen.getAllByTestId("global-template-field-option")[0]);

//       await waitFor(() => {
//          const addBtn = screen.getByTestId("add-fields-btn");
//          assertInDocument(addBtn);
//          expect(addBtn).toHaveTextContent("1 Feld hinzufügen");
//       });
//    });

//    it("shows add button with plural label after selecting multiple fields", async () => {
//       renderComponent();

//       await openPopover();

//       const options = screen.getAllByTestId("global-template-field-option");
//       userEvent.click(options[0]);
//       userEvent.click(options[1]);

//       await waitFor(() => {
//          const addBtn = screen.getByTestId("add-fields-btn");
//          assertInDocument(addBtn);
//          expect(addBtn).toHaveTextContent("2 Felder hinzufügen");
//       });
//    });

//    it("deselects a field when clicked again", async () => {
//       renderComponent();

//       await openPopover();

//       const options = screen.getAllByTestId("global-template-field-option");
//       userEvent.click(options[0]);
//       userEvent.click(options[1]);

//       await waitFor(() => {
//          expect(screen.getByTestId("add-fields-btn")).toHaveTextContent(
//             "2 Felder hinzufügen"
//          );
//       });

//       userEvent.click(options[0]);

//       await waitFor(() => {
//          expect(screen.getByTestId("add-fields-btn")).toHaveTextContent(
//             "1 Feld hinzufügen"
//          );
//       });
//    });

//    it("hides add button when no fields are selected", async () => {
//       renderComponent();

//       await openPopover();

//       expect(screen.queryByTestId("add-fields-btn")).not.toBeInTheDocument();
//    });
// });

// describe("GlobalTemplateFieldsPicker add/close tests", () => {
//    it("calls onAddFields with selected field ids", async () => {
//       const fields = dtestData.dGlobalTemplateFields(3);
//       const onAddFields = jest.fn();
//       renderComponent({ globalFields: fields, onAddFields });

//       await openPopover();

//       userEvent.click(screen.getAllByTestId("global-template-field-option")[0]);

//       await waitFor(() => {
//          assertInDocument(screen.getByTestId("add-fields-btn"));
//       });

//       userEvent.click(screen.getByTestId("add-fields-btn"));

//       await waitFor(() => {
//          expect(onAddFields).toHaveBeenCalledTimes(1);
//          expect(onAddFields).toHaveBeenCalledWith([fields[0].id]);
//       });
//    });

//    it("closes popover after adding fields", async () => {
//       renderComponent();

//       await openPopover();

//       userEvent.click(screen.getAllByTestId("global-template-field-option")[0]);

//       await waitFor(() => {
//          assertInDocument(screen.getByTestId("add-fields-btn"));
//       });

//       userEvent.click(screen.getByTestId("add-fields-btn"));

//       await waitFor(() => {
//          assertNotInDocument(screen.queryByTestId("seach-input"));
//       });
//    });

//    it("resets search and selection when popover is closed", async () => {
//       renderComponent();

//       await openPopover();

//       userEvent.type(screen.getByTestId("seach-input"), "name-1");
//       userEvent.click(screen.getAllByTestId("global-template-field-option")[0]);

//       await waitFor(() => {
//          assertInDocument(screen.getByTestId("add-fields-btn"));
//       });

//       // Close via Escape key
//       userEvent.keyboard("{Escape}");

//       await waitFor(() => {
//          assertNotInDocument(screen.queryByTestId("seach-input"));
//       });

//       // Reopen and verify state is reset
//       await openPopover();

//       await waitFor(() => {
//          const options = screen.getAllByTestId("global-template-field-option");
//          expect(options).toHaveLength(3);
//          expect(screen.queryByTestId("add-fields-btn")).not.toBeInTheDocument();
//       });
//    });
// });
