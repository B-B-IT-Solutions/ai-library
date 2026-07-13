jest.mock("@/data/actions/prompt");
jest.mock("sonner");

jest.mock("@/components/shared/md", () => {
   const MDEditor = (
      props: DetailedHTMLProps<
         InputHTMLAttributes<HTMLInputElement>,
         HTMLInputElement
      >
   ) => (
      <div data-testid="tiptap-editor">
         <input
            value={props.value}
            onChange={props.onChange}
            placeholder={props.placeholder}
         />
      </div>
   );
   return { MDEditor };
});

import { DetailedHTMLProps, InputHTMLAttributes, MouseEvent } from "react";
import { getByTestId, screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   dtestData,
   renderWithReactQuery,
   typeIntoInput,
   typeIntoTextArea,
   typeIntoTipTap,
} from "@tests";
import mockRouter from "next-router-mock";
import { Action, ExternalToast, toast } from "sonner";

import {
   createPrompt,
   getPromptCategoriesPage,
   updatePrompt,
} from "@/data/actions/prompt";
import {
   DPrompt,
   DPromptUpdate,
   DPromptUpdateCrate,
} from "@/data/types/domain/prompt";
import { ActionResult } from "@/data/types/utils";

import { initPromptTemplate } from "./form/utils";
import { PromptEdit } from "./prompt-edit";

jest.setTimeout(10000);

const createPromptMock = createPrompt as jest.MockedFunction<
   typeof createPrompt
>;
const updatePromptMock = updatePrompt as jest.MockedFunction<
   typeof updatePrompt
>;
const getPromptCategoriesPageMock =
   getPromptCategoriesPage as jest.MockedFunction<
      typeof getPromptCategoriesPage
   >;
const toastMock = toast as jest.MockedFunction<typeof toast>;

beforeEach(() => {
   const page = dtestData.dPromptCategoriesPage();
   getPromptCategoriesPageMock.mockResolvedValue(page);
});

const assertBtnRendered = () => {
   const headerActions = screen.getByTestId("header-actions");
   const headerCancelBtn = getByTestId(headerActions, "cancel-btn");
   const headerSaveBtn = getByTestId(headerActions, "save-btn");

   const footerActions = screen.getByTestId("footer-actions");
   const footerCancelBtn = getByTestId(footerActions, "cancel-btn");
   const footerSaveBtn = getByTestId(footerActions, "save-btn");

   assertInDocument(headerActions);
   assertInDocument(headerCancelBtn);
   assertInDocument(headerSaveBtn);

   assertInDocument(footerActions);
   assertInDocument(footerCancelBtn);
   assertInDocument(footerSaveBtn);
};

const assertCancelBtnHref = (href: string) => {
   const headerActions = screen.getByTestId("header-actions");
   const headerCancelBtn = getByTestId(headerActions, "cancel-btn");

   const footerActions = screen.getByTestId("footer-actions");
   const footerCancelBtn = getByTestId(footerActions, "cancel-btn");

   assertHasAttributeWithValue(headerCancelBtn, "href", href);
   assertHasAttributeWithValue(footerCancelBtn, "href", href);
};

const assertRendered = () => {
   const editEntry = screen.getByTestId("prompt-edit");
   const breadcrumbs = screen.getByTestId("template-breadcrumb");
   const form = screen.getByTestId("prompt-edit-form");

   assertInDocument(editEntry);
   assertInDocument(breadcrumbs);
   assertInDocument(form);

   assertBtnRendered();
};

describe("PromptEdit rendering tests", () => {
   it("new entry - collection undefined - test", async () => {
      const { container } = renderWithReactQuery(
         <PromptEdit globalFields={[]} />
      );

      await waitFor(() => {
         assertRendered();
         assertCancelBtnHref("/templates");
      });

      expect(container).toMatchSnapshot();
   });

   it("new entry - collection defined - test", async () => {
      const collection = dtestData.dCollectionPreview();

      const { container } = renderWithReactQuery(
         <PromptEdit globalFields={[]} currentCollection={collection} />
      );

      await waitFor(() => {
         assertRendered();
         assertCancelBtnHref(`/collections/${collection.id}`);
      });

      expect(container).toMatchSnapshot();
   });

   it("edit existing entry - collection undefined - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      const fields = dtestData.dGlobalPromptFields();

      const { container } = renderWithReactQuery(
         <PromptEdit prompt={prompt} globalFields={fields} />
      );

      await waitFor(() => {
         assertRendered();
         assertCancelBtnHref(`/templates/${prompt.id}`);
      });

      expect(container).toMatchSnapshot();
   });

   it("edit existing entry - collection defined - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      const fields = dtestData.dGlobalPromptFields();
      const collection = dtestData.dCollectionPreview();

      const { container } = renderWithReactQuery(
         <PromptEdit
            prompt={prompt}
            globalFields={fields}
            currentCollection={collection}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertCancelBtnHref(
            `/templates/${prompt.id}?collectionId=${collection.id}`
         );
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptEdit functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("new entry - save btn clicked - success - test", async () => {
      const newPrompt = dtestData.dPrompt();
      const result: ActionResult<DPrompt> = {
         success: true,
         message: "Vorlage erfolgreich erstellt",
         data: newPrompt,
      };
      createPromptMock.mockResolvedValue(result);

      const fields = dtestData.dGlobalPromptFields();
      renderWithReactQuery(<PromptEdit globalFields={fields} />);

      await waitFor(() => {
         assertRendered();
      });

      const headerActions = screen.getByTestId("header-actions");
      const saveBtn = getByTestId(headerActions, "save-btn");
      await userEvent.click(saveBtn);

      expect(createPromptMock).not.toHaveBeenCalled();

      // Fill in required fields
      await typeIntoInput("title", "Test Template");
      await typeIntoTextArea("description", "Test Description");
      await typeIntoTipTap("tiptap-editor", "Template Content {{{{task}}");

      await userEvent.click(saveBtn);

      const expectedData: DPromptUpdate = {
         title: "Test Template",
         description: "Test Description",
         content: "Template Content {{task}}",
         categories: [],
         fields: [],
         globalFieldIds: [],
         recommendedModel: "Claude",
      };

      const expectedPayload: DPromptUpdateCrate = {
         data: expectedData,
      };

      await waitFor(() => {
         expect(createPromptMock).toHaveBeenCalledTimes(1);
         expect(createPromptMock).toHaveBeenCalledWith(expectedPayload);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.asPath).toEqual(`/templates/${newPrompt.id}`);
      });
   });

   it("new entry - collection - save btn clicked - success - test", async () => {
      const newPrompt = dtestData.dPrompt();
      const createResult: ActionResult<DPrompt> = {
         success: true,
         message: "Prompt erfolgreich erstellt",
         data: newPrompt,
      };
      createPromptMock.mockResolvedValue(createResult);

      const collection = dtestData.dCollectionPreview();
      const fields = dtestData.dGlobalPromptFields();

      renderWithReactQuery(
         <PromptEdit globalFields={fields} currentCollection={collection} />
      );

      await waitFor(() => {
         assertRendered();
      });

      await typeIntoInput("title", "Test Template");
      await typeIntoTextArea("description", "Test Description");
      await typeIntoTipTap("tiptap-editor", "Template Content {{{{task}}");

      const headerActions = screen.getByTestId("header-actions");
      const saveBtn = getByTestId(headerActions, "save-btn");
      await userEvent.click(saveBtn);

      await waitFor(() => {
         expect(createPromptMock).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(createResult.message);
         expect(mockRouter.pathname).toEqual(`/templates/${newPrompt.id}`);
         expect(mockRouter.query).toEqual({ collectionId: collection.id });
      });
   });

   it("existing entry - save btn clicked - success - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "Vorlage erfolgreich erstellt",
      };
      updatePromptMock.mockResolvedValue(result);

      const prompt = dtestData.dPromptWithContent();
      const fields = dtestData.dGlobalPromptFields();

      renderWithReactQuery(
         <PromptEdit prompt={prompt} globalFields={fields} />
      );

      await waitFor(() => {
         assertRendered();
      });

      const headerActions = screen.getByTestId("header-actions");
      const saveBtn = getByTestId(headerActions, "save-btn");

      // Fill in required fields
      await typeIntoInput("title", "Test Template");
      await typeIntoTextArea("description", "Test Description");

      await typeIntoTipTap("tiptap-editor", "Template Content {{{{task}}");

      await userEvent.click(saveBtn);

      const initValue = initPromptTemplate(prompt);
      const expectedPayload: DPromptUpdate = {
         title: initValue.title + "Test Template",
         description: initValue.description + "Test Description",
         content: initValue.content + "Template Content {{task}}",
         categories: initValue.categories,
         fields: initValue.fields,
         globalFieldIds: initValue.globalFieldIds,
         recommendedModel: initValue.recommendedModel,
      };

      await waitFor(() => {
         expect(updatePromptMock).toHaveBeenCalledTimes(1);
         expect(updatePromptMock).toHaveBeenCalledWith(
            prompt.id,
            expectedPayload
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.asPath).toEqual(`/templates/${prompt.id}`);
      });
   });

   it("existing entry - collection - save btn clicked - success - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "Vorlage erfolgreich erstellt",
      };
      updatePromptMock.mockResolvedValue(result);

      const prompt = dtestData.dPromptWithContent();
      const collection = dtestData.dCollectionPreview();
      const fields = dtestData.dGlobalPromptFields();

      renderWithReactQuery(
         <PromptEdit
            prompt={prompt}
            currentCollection={collection}
            globalFields={fields}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      const headerActions = screen.getByTestId("header-actions");
      const saveBtn = getByTestId(headerActions, "save-btn");

      // Fill in required fields
      await typeIntoInput("title", "Test Template");
      await typeIntoTextArea("description", "Test Description");

      await typeIntoTipTap("tiptap-editor", "Template Content {{{{task}}");

      await userEvent.click(saveBtn);

      const initValue = initPromptTemplate(prompt);
      const expectedPayload: DPromptUpdate = {
         title: initValue.title + "Test Template",
         description: initValue.description + "Test Description",
         content: initValue.content + "Template Content {{task}}",
         categories: initValue.categories,
         fields: initValue.fields,
         globalFieldIds: initValue.globalFieldIds,
         recommendedModel: initValue.recommendedModel,
      };

      await waitFor(() => {
         expect(updatePromptMock).toHaveBeenCalledTimes(1);
         expect(updatePromptMock).toHaveBeenCalledWith(
            prompt.id,
            expectedPayload
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.pathname).toEqual(`/templates/${prompt.id}`);
         expect(mockRouter.query).toEqual({ collectionId: collection.id });
      });
   });

   it("new entry - save btn clicked - failed - upgradeRequired - test", async () => {
      const result: ActionResult<DPrompt> = {
         success: false,
         message: "Limit erreicht. Bitte upgrade dein Abo.",
         upgradeRequired: true,
      };
      createPromptMock.mockResolvedValue(result);

      const collection = dtestData.dCollectionPreview();

      const fields = dtestData.dGlobalPromptFields();
      renderWithReactQuery(
         <PromptEdit globalFields={fields} currentCollection={collection} />
      );

      await waitFor(() => {
         assertRendered();
      });

      await typeIntoInput("title", "Test Template");
      await typeIntoTextArea("description", "Test Description");
      await typeIntoTipTap("tiptap-editor", "Template Content {{{{task}}");

      const headerActions = screen.getByTestId("header-actions");
      const saveBtn = getByTestId(headerActions, "save-btn");
      await userEvent.click(saveBtn);

      const expectedData: DPromptUpdate = {
         title: "Test Template",
         description: "Test Description",
         content: "Template Content {{task}}",
         categories: [],
         fields: [],
         globalFieldIds: [],
         recommendedModel: "Claude",
      };

      const expectedPayload: DPromptUpdateCrate = {
         data: expectedData,
         collectionId: collection.id,
      };

      const expectedToastPayload = {
         action: {
            label: "Upgrade",
            onClick: expect.any(Function),
         },
      };

      await waitFor(() => {
         expect(createPromptMock).toHaveBeenCalledTimes(1);
         expect(createPromptMock).toHaveBeenCalledWith(expectedPayload);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(
            result.message,
            expectedToastPayload
         );
         expect(mockRouter.asPath).toEqual("/");
      });

      const toastCall = toastMock.error.mock.calls[0];
      const toastOptions = toastCall[1] as ExternalToast;
      const action = toastOptions.action as Action;
      const event = null as unknown as MouseEvent<HTMLButtonElement>;
      action.onClick(event);

      expect(mockRouter.asPath).toEqual("/subscription/pricing");
   });

   it("new entry - save btn clicked - failed - test", async () => {
      const result: ActionResult<DPrompt> = {
         success: false,
         message: "Vorlage erfolgreich erstellt",
      };
      createPromptMock.mockResolvedValue(result);

      const fields = dtestData.dGlobalPromptFields();
      const collection = dtestData.dCollectionPreview();

      renderWithReactQuery(
         <PromptEdit globalFields={fields} currentCollection={collection} />
      );

      await waitFor(() => {
         assertRendered();
      });

      const headerActions = screen.getByTestId("header-actions");
      const saveBtn = getByTestId(headerActions, "save-btn");
      await userEvent.click(saveBtn);

      expect(createPromptMock).not.toHaveBeenCalled();

      // Fill in required fields
      await typeIntoInput("title", "Test Template");
      await typeIntoTextArea("description", "Test Description");

      await typeIntoTipTap("tiptap-editor", "Template Content {{{{task}}");

      await userEvent.click(saveBtn);

      const expectedData: DPromptUpdate = {
         title: "Test Template",
         description: "Test Description",
         content: "Template Content {{task}}",
         categories: [],
         fields: [],
         globalFieldIds: [],
         recommendedModel: "Claude",
      };

      const expectedPayload: DPromptUpdateCrate = {
         data: expectedData,
         collectionId: collection.id,
      };

      await waitFor(() => {
         expect(createPromptMock).toHaveBeenCalledTimes(1);
         expect(createPromptMock).toHaveBeenCalledWith(expectedPayload);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.asPath).toEqual("/");
      });
   });

   it("existing entry - save btn clicked  - failed - test", async () => {
      const result: ActionResult = {
         success: false,
         message: "Vorlage erfolgreich erstellt",
      };
      updatePromptMock.mockResolvedValue(result);

      const prompt = dtestData.dPromptWithContent();
      const fields = dtestData.dGlobalPromptFields();

      renderWithReactQuery(
         <PromptEdit prompt={prompt} globalFields={fields} />
      );

      await waitFor(() => {
         assertRendered();
      });

      // Fill in required fields
      await typeIntoInput("title", "Test Template");
      await typeIntoTextArea("description", "Test Description");

      await typeIntoTipTap("tiptap-editor", "Template Content {{{{task}}");

      const headerActions = screen.getByTestId("header-actions");
      const saveBtn = getByTestId(headerActions, "save-btn");
      await userEvent.click(saveBtn);

      const initValue = initPromptTemplate(prompt);
      const expectedPayload: DPromptUpdate = {
         title: initValue.title + "Test Template",
         description: initValue.description + "Test Description",
         content: initValue.content + "Template Content {{task}}",
         categories: initValue.categories,
         fields: initValue.fields,
         globalFieldIds: initValue.globalFieldIds,
         recommendedModel: initValue.recommendedModel,
      };

      await waitFor(() => {
         expect(updatePromptMock).toHaveBeenCalledTimes(1);
         expect(updatePromptMock).toHaveBeenCalledWith(
            prompt.id,
            expectedPayload
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.asPath).toEqual("/");
      });
   });
});
