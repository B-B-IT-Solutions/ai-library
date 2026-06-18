jest.mock("@/data/services/workflow");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { requireUser } from "@/data/actions/auth-utils";
import { EMPTY_PAGE } from "@/data/actions/utils";
import { WorkflowService } from "@/data/services/workflow";
import { DWorkflow, DWorkflowsUsage } from "@/data/types/domain/workflow";
import { ActionResult } from "@/data/types/utils";
import { SubscriptionAccessError } from "@/lib/subscription/server-guards";

import {
   createWorkflow,
   deleteWorkflow,
   getWorkflowForRunner,
   getWorkflowsPage,
   getWorkflowsUsage,
   getWorkflowWithSteps,
   updateWorkflow,
} from "./workflow.actions";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const sGetWorkflowsPage = WorkflowService.prototype.getWorkflowsPage;
const sGetWorkflowWithSteps = WorkflowService.prototype.getWorkflowWithSteps;
const sGetWorkflowsUsage = WorkflowService.prototype.getWorkflowsUsage;
const sCreateWorkflow = WorkflowService.prototype.createWorkflow;
const sUpdateWorkflow = WorkflowService.prototype.updateWorkflow;
const sDeleteWorkflow = WorkflowService.prototype.deleteWorkflow;

const sGetWorkflowsPageMock = sGetWorkflowsPage as jest.MockedFunction<
   typeof sGetWorkflowsPage
>;
const sGetWorkflowWithStepsMock = sGetWorkflowWithSteps as jest.MockedFunction<
   typeof sGetWorkflowWithSteps
>;
const sGetWorkflowsUsageMock = sGetWorkflowsUsage as jest.MockedFunction<
   typeof sGetWorkflowsUsage
>;
const sCreateWorkflowMock = sCreateWorkflow as jest.MockedFunction<
   typeof sCreateWorkflow
>;
const sUpdateWorkflowMock = sUpdateWorkflow as jest.MockedFunction<
   typeof sUpdateWorkflow
>;
const sDeleteWorkflowMock = sDeleteWorkflow as jest.MockedFunction<
   typeof sDeleteWorkflow
>;
const sCreateWorkflowStepMock = sCreateWorkflowStep as jest.MockedFunction<
   typeof sCreateWorkflowStep
>;

const workflowId = "444db648-f300-4284-8149-075ff465d750";

describe("getWorkflowsPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const result = await getWorkflowsPage();

      expect(result).toEqual(EMPTY_PAGE);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetWorkflowsPageMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("service error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("DB error");
      sGetWorkflowsPageMock.mockRejectedValue(error);

      const result = await getWorkflowsPage();

      expect(result).toEqual(EMPTY_PAGE);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("workflows retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const page = dtestData.dWorkflowsPage(1);
      sGetWorkflowsPageMock.mockResolvedValue(page);

      const query = dtestData.dWorkflowsPageQuery();

      const result = await getWorkflowsPage(query);

      expect(result).toEqual(page);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetWorkflowsPageMock).toHaveBeenCalledTimes(1);
      expect(sGetWorkflowsPageMock).toHaveBeenCalledWith(user.id, query);
   });
});

describe("getWorkflowWithSteps tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const result = await getWorkflowWithSteps("invalid-uuid");

      expect(result).toBeNull();
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sGetWorkflowWithStepsMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid Workflow-ID.");
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const result = await getWorkflowWithSteps(workflowId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetWorkflowWithStepsMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("workflow null - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sGetWorkflowWithStepsMock.mockResolvedValue(null);

      const result = await getWorkflowWithSteps(workflowId);

      expect(result).toBeNull();
      expect(sGetWorkflowWithStepsMock).toHaveBeenCalledTimes(1);
      expect(sGetWorkflowWithStepsMock).toHaveBeenCalledWith(
         user.id,
         workflowId
      );
   });

   it("workflow retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const workflow = dtestData.dWorkflowWithSteps();
      sGetWorkflowWithStepsMock.mockResolvedValue(workflow);

      const result = await getWorkflowWithSteps(workflowId);

      expect(result).toEqual(workflow);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetWorkflowWithStepsMock).toHaveBeenCalledTimes(1);
      expect(sGetWorkflowWithStepsMock).toHaveBeenCalledWith(
         user.id,
         workflowId
      );
   });
});

describe("getWorkflowsUsage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const result = await getWorkflowsUsage();

      const expectedResult: DWorkflowsUsage = { current: 0, limit: 0 };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetWorkflowsUsageMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("usage retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const usage = dtestData.dWorkflowsUsage();
      sGetWorkflowsUsageMock.mockResolvedValue(usage);

      const result = await getWorkflowsUsage();

      expect(result).toEqual(usage);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetWorkflowsUsageMock).toHaveBeenCalledTimes(1);
      expect(sGetWorkflowsUsageMock).toHaveBeenCalledWith(user.id);
   });
});

describe("createWorkflow tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const data = dtestData.dWorkflowUpdate();
      const result = await createWorkflow(data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Workflow konnte nicht erstellt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreateWorkflowMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("subscription error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new SubscriptionAccessError(
         "Nur für BASIC",
         "canUseWorkflows"
      );
      sCreateWorkflowMock.mockRejectedValue(error);

      const data = dtestData.dWorkflowUpdate();
      const result = await createWorkflow(data);

      const expectedResult: ActionResult = {
         success: false,
         message: error.message,
         upgradeRequired: true,
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreateWorkflowMock).toHaveBeenCalledTimes(1);
      expect(sCreateWorkflowMock).toHaveBeenCalledWith(user.id, data);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("db error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("db error");
      sCreateWorkflowMock.mockRejectedValue(error);

      const data = dtestData.dWorkflowUpdate();
      const result = await createWorkflow(data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Workflow konnte nicht erstellt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreateWorkflowMock).toHaveBeenCalledTimes(1);
      expect(sCreateWorkflowMock).toHaveBeenCalledWith(user.id, data);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("workflow created - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const workflow = dtestData.dWorkflow();
      sCreateWorkflowMock.mockResolvedValue(workflow);

      const data = dtestData.dWorkflowUpdate();
      const result = await createWorkflow(data);

      const expectedResult: ActionResult<DWorkflow> = {
         success: true,
         message: "Workflow erfolgreich erstellt",
         data: workflow,
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreateWorkflowMock).toHaveBeenCalledTimes(1);
      expect(sCreateWorkflowMock).toHaveBeenCalledWith(user.id, data);
   });
});

describe("updateWorkflow tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const data = dtestData.dWorkflowUpdate();
      const result = await updateWorkflow("invalid-uuid", data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Workflow konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sUpdateWorkflowMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const data = dtestData.dWorkflowUpdate();
      const result = await updateWorkflow(workflowId, data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Workflow konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdateWorkflowMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("db error");
      sUpdateWorkflowMock.mockRejectedValue(error);

      const data = dtestData.dWorkflowUpdate();
      const result = await updateWorkflow(workflowId, data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Workflow konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(sUpdateWorkflowMock).toHaveBeenCalledTimes(1);
      expect(sUpdateWorkflowMock).toHaveBeenCalledWith(
         user.id,
         workflowId,
         data
      );
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("workflow updated - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const workflow = dtestData.dWorkflow();
      sUpdateWorkflowMock.mockResolvedValue(workflow);

      const data = dtestData.dWorkflowUpdate();
      const result = await updateWorkflow(workflowId, data);

      const expectedResult: ActionResult<DWorkflow> = {
         success: true,
         message: "Workflow erfolgreich aktualisiert",
         data: workflow,
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdateWorkflowMock).toHaveBeenCalledTimes(1);
      expect(sUpdateWorkflowMock).toHaveBeenCalledWith(
         user.id,
         workflowId,
         data
      );
   });
});

describe("deleteWorkflow tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const result = await deleteWorkflow("invalid-uuid");

      const expectedResult: ActionResult = {
         success: false,
         message: "Workflow konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sDeleteWorkflowMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const result = await deleteWorkflow(workflowId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Workflow konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDeleteWorkflowMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("db error");
      sDeleteWorkflowMock.mockRejectedValue(error);

      const result = await deleteWorkflow(workflowId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Workflow konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(sDeleteWorkflowMock).toHaveBeenCalledTimes(1);
      expect(sDeleteWorkflowMock).toHaveBeenCalledWith(user.id, workflowId);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("workflow deleted - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sDeleteWorkflowMock.mockResolvedValue();

      const result = await deleteWorkflow(workflowId);

      const expectedResult: ActionResult = {
         success: true,
         message: "Workflow erfolgreich gelöscht",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDeleteWorkflowMock).toHaveBeenCalledTimes(1);
      expect(sDeleteWorkflowMock).toHaveBeenCalledWith(user.id, workflowId);
   });
});

describe("getWorkflowForRunner tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const result = await getWorkflowForRunner("invalid-uuid");

      expect(result).toBeNull();
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sGetWorkflowWithStepsMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid Workflow-ID.");
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const result = await getWorkflowForRunner(workflowId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetWorkflowWithStepsMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("workflow retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const workflow = dtestData.dWorkflowWithSteps();
      sGetWorkflowWithStepsMock.mockResolvedValue(workflow);

      const result = await getWorkflowForRunner(workflowId);

      expect(result).toEqual(workflow);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetWorkflowWithStepsMock).toHaveBeenCalledTimes(1);
      expect(sGetWorkflowWithStepsMock).toHaveBeenCalledWith(
         user.id,
         workflowId
      );
   });
});
