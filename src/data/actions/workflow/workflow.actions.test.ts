jest.mock("@/data/services/workflow");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { requireUser } from "@/data/actions/auth-utils";
import { WorkflowLimitError, WorkflowService } from "@/data/services/workflow";
import {
   DWorkflow,
   DWorkflowsUsage,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";
import { ActionResult } from "@/data/types/utils";
import { SubscriptionAccessError } from "@/lib/subscription/server-guards";

import {
   createWorkflow,
   createWorkflowStep,
   deleteWorkflow,
   deleteWorkflowStep,
   getWorkflowForRunner,
   getWorkflows,
   getWorkflowsUsage,
   getWorkflowWithSteps,
   setStartStep,
   updateWorkflow,
   updateWorkflowStep,
} from "./workflow.actions";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const sGetWorkflows = WorkflowService.prototype.getWorkflows;
const sGetWorkflowWithSteps = WorkflowService.prototype.getWorkflowWithSteps;
const sGetWorkflowsUsage = WorkflowService.prototype.getWorkflowsUsage;
const sCreateWorkflow = WorkflowService.prototype.createWorkflow;
const sUpdateWorkflow = WorkflowService.prototype.updateWorkflow;
const sDeleteWorkflow = WorkflowService.prototype.deleteWorkflow;
const sCreateWorkflowStep = WorkflowService.prototype.createWorkflowStep;
const sUpdateWorkflowStep = WorkflowService.prototype.updateWorkflowStep;
const sDeleteWorkflowStep = WorkflowService.prototype.deleteWorkflowStep;
const sSetStartStep = WorkflowService.prototype.setStartStep;

const sGetWorkflowsMock = sGetWorkflows as jest.MockedFunction<
   typeof sGetWorkflows
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
const sUpdateWorkflowStepMock = sUpdateWorkflowStep as jest.MockedFunction<
   typeof sUpdateWorkflowStep
>;
const sDeleteWorkflowStepMock = sDeleteWorkflowStep as jest.MockedFunction<
   typeof sDeleteWorkflowStep
>;
const sSetStartStepMock = sSetStartStep as jest.MockedFunction<
   typeof sSetStartStep
>;

const workflowId = "444db648-f300-4284-8149-075ff465d750";
const stepId = "555db648-f300-4284-8149-075ff465d750";

describe("getWorkflows tests", () => {
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

      const result = await getWorkflows();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetWorkflowsMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("workflows retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const workflows = dtestData.dWorkflows();
      sGetWorkflowsMock.mockResolvedValue(workflows);

      const result = await getWorkflows();

      expect(result).toEqual(workflows);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetWorkflowsMock).toHaveBeenCalledTimes(1);
      expect(sGetWorkflowsMock).toHaveBeenCalledWith(user.id);
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

   it("workflow limit error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new WorkflowLimitError(
         "WORKFLOW_LIMIT_REACHED",
         "Limit erreicht"
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

describe("createWorkflowStep tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const data = dtestData.dWorkflowStepCreate();
      const result = await createWorkflowStep("invalid-uuid", data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Schritt konnte nicht hinzugefügt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sCreateWorkflowStepMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const data = dtestData.dWorkflowStepCreate();
      const result = await createWorkflowStep(workflowId, data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Schritt konnte nicht hinzugefügt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreateWorkflowStepMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("step limit error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new WorkflowLimitError(
         "STEP_LIMIT_REACHED",
         "Maximale Schrittanzahl erreicht"
      );
      sCreateWorkflowStepMock.mockRejectedValue(error);

      const data = dtestData.dWorkflowStepCreate();
      const result = await createWorkflowStep(workflowId, data);

      const expectedResult: ActionResult = {
         success: false,
         message: error.message,
         upgradeRequired: true,
      };

      expect(result).toEqual(expectedResult);
      expect(sCreateWorkflowStepMock).toHaveBeenCalledTimes(1);
      expect(sCreateWorkflowStepMock).toHaveBeenCalledWith(
         user.id,
         workflowId,
         data
      );
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("db error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("db error");
      sCreateWorkflowStepMock.mockRejectedValue(error);

      const data = dtestData.dWorkflowStepCreate();
      const result = await createWorkflowStep(workflowId, data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Schritt konnte nicht hinzugefügt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(sCreateWorkflowStepMock).toHaveBeenCalledTimes(1);
      expect(sCreateWorkflowStepMock).toHaveBeenCalledWith(
         user.id,
         workflowId,
         data
      );
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("step created - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const workflow = dtestData.dWorkflowWithSteps();
      sCreateWorkflowStepMock.mockResolvedValue(workflow);

      const data = dtestData.dWorkflowStepCreate();
      const result = await createWorkflowStep(workflowId, data);

      const expectedResult: ActionResult<DWorkflowWithSteps> = {
         success: true,
         message: "Schritt erfolgreich hinzugefügt",
         data: workflow,
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreateWorkflowStepMock).toHaveBeenCalledTimes(1);
      expect(sCreateWorkflowStepMock).toHaveBeenCalledWith(
         user.id,
         workflowId,
         data
      );
   });
});

describe("updateWorkflowStep tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid stepId - test", async () => {
      const data = dtestData.dWorkflowStepUpdate();
      const result = await updateWorkflowStep("invalid-uuid", workflowId, data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Schritt konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sUpdateWorkflowStepMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("invalid workflowId - test", async () => {
      const data = dtestData.dWorkflowStepUpdate();
      const result = await updateWorkflowStep(stepId, "invalid-uuid", data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Schritt konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sUpdateWorkflowStepMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const data = dtestData.dWorkflowStepUpdate();
      const result = await updateWorkflowStep(stepId, workflowId, data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Schritt konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdateWorkflowStepMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("cycle error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("Diese Verbindung erzeugt eine Endlosschleife");
      sUpdateWorkflowStepMock.mockRejectedValue(error);

      const data = dtestData.dWorkflowStepUpdate();
      const result = await updateWorkflowStep(stepId, workflowId, data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Diese Verbindung erzeugt eine Endlosschleife",
      };

      expect(result).toEqual(expectedResult);
      expect(sUpdateWorkflowStepMock).toHaveBeenCalledTimes(1);
      expect(sUpdateWorkflowStepMock).toHaveBeenCalledWith(
         user.id,
         stepId,
         workflowId,
         data
      );
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("db error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("db error");
      sUpdateWorkflowStepMock.mockRejectedValue(error);

      const data = dtestData.dWorkflowStepUpdate();
      const result = await updateWorkflowStep(stepId, workflowId, data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Schritt konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(sUpdateWorkflowStepMock).toHaveBeenCalledTimes(1);
      expect(sUpdateWorkflowStepMock).toHaveBeenCalledWith(
         user.id,
         stepId,
         workflowId,
         data
      );
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("step updated - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const workflow = dtestData.dWorkflowWithSteps();
      sUpdateWorkflowStepMock.mockResolvedValue(workflow);

      const data = dtestData.dWorkflowStepUpdate();
      const result = await updateWorkflowStep(stepId, workflowId, data);

      const expectedResult: ActionResult<DWorkflowWithSteps> = {
         success: true,
         message: "Schritt erfolgreich aktualisiert",
         data: workflow,
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdateWorkflowStepMock).toHaveBeenCalledTimes(1);
      expect(sUpdateWorkflowStepMock).toHaveBeenCalledWith(
         user.id,
         stepId,
         workflowId,
         data
      );
   });
});

describe("deleteWorkflowStep tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid stepId - test", async () => {
      const result = await deleteWorkflowStep("invalid-uuid", workflowId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Schritt konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sDeleteWorkflowStepMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("invalid workflowId - test", async () => {
      const result = await deleteWorkflowStep(stepId, "invalid-uuid");

      const expectedResult: ActionResult = {
         success: false,
         message: "Schritt konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sDeleteWorkflowStepMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const result = await deleteWorkflowStep(stepId, workflowId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Schritt konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDeleteWorkflowStepMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("db error");
      sDeleteWorkflowStepMock.mockRejectedValue(error);

      const result = await deleteWorkflowStep(stepId, workflowId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Schritt konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(sDeleteWorkflowStepMock).toHaveBeenCalledTimes(1);
      expect(sDeleteWorkflowStepMock).toHaveBeenCalledWith(
         user.id,
         stepId,
         workflowId
      );
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("step deleted - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const workflow = dtestData.dWorkflowWithSteps();
      sDeleteWorkflowStepMock.mockResolvedValue(workflow);

      const result = await deleteWorkflowStep(stepId, workflowId);

      const expectedResult: ActionResult<DWorkflowWithSteps> = {
         success: true,
         message: "Schritt erfolgreich gelöscht",
         data: workflow,
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDeleteWorkflowStepMock).toHaveBeenCalledTimes(1);
      expect(sDeleteWorkflowStepMock).toHaveBeenCalledWith(
         user.id,
         stepId,
         workflowId
      );
   });
});

describe("setStartStep tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid workflowId - test", async () => {
      const result = await setStartStep("invalid-uuid", stepId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Startschritt konnte nicht gesetzt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sSetStartStepMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("invalid stepId - test", async () => {
      const result = await setStartStep(workflowId, "invalid-uuid");

      const expectedResult: ActionResult = {
         success: false,
         message: "Startschritt konnte nicht gesetzt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sSetStartStepMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const result = await setStartStep(workflowId, stepId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Startschritt konnte nicht gesetzt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sSetStartStepMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("db error");
      sSetStartStepMock.mockRejectedValue(error);

      const result = await setStartStep(workflowId, stepId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Startschritt konnte nicht gesetzt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(sSetStartStepMock).toHaveBeenCalledTimes(1);
      expect(sSetStartStepMock).toHaveBeenCalledWith(
         user.id,
         workflowId,
         stepId
      );
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("start step set - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sSetStartStepMock.mockResolvedValue();

      const result = await setStartStep(workflowId, stepId);

      const expectedResult: ActionResult = {
         success: true,
         message: "Startschritt gesetzt",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sSetStartStepMock).toHaveBeenCalledTimes(1);
      expect(sSetStartStepMock).toHaveBeenCalledWith(
         user.id,
         workflowId,
         stepId
      );
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
