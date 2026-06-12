jest.mock("@/data/actions/auth-utils");
jest.mock("@/data/services/service.factory");

import { DeepMockProxy } from "jest-mock-extended";

import { requireUser } from "@/data/actions/auth-utils";
import { ServiceFactory } from "@/data/services";
import { WorkflowLimitError } from "@/data/services/workflow";
import { WorkflowService } from "@/data/services/workflow/workflow.service";
import { SubscriptionAccessError } from "@/lib/subscription/server-guards";

import {
   createWorkflow,
   createWorkflowStep,
   deleteWorkflow,
   getWorkflow,
   getWorkflows,
   updateWorkflow,
} from "./workflow.actions";

type AuthMockedFunction = jest.MockedFunction<typeof requireUser>;

const requireUserMock = requireUser as AuthMockedFunction;

const serviceFactoryProto = ServiceFactory.prototype;
const workflowServiceMock = {
   getWorkflows: jest.fn(),
   getWorkflowById: jest.fn(),
   getWorkflowsUsage: jest.fn(),
   createWorkflow: jest.fn(),
   updateWorkflow: jest.fn(),
   deleteWorkflow: jest.fn(),
   createWorkflowStep: jest.fn(),
   updateWorkflowStep: jest.fn(),
   deleteWorkflowStep: jest.fn(),
   setStartStep: jest.fn(),
} as unknown as DeepMockProxy<WorkflowService>;

// Stub ServiceFactory#getWorkflowService
(
   ServiceFactory.prototype as { getWorkflowService?: () => WorkflowService }
).getWorkflowService = jest.fn().mockReturnValue(workflowServiceMock);

const userId = "334db648-f300-4284-8149-075ff465d750";
const workflowId = "444db648-f300-4284-8149-075ff465d750";

const baseWorkflow = {
   id: workflowId,
   title: "Test Workflow",
   description: null,
   stepCount: 0,
   updatedAt: new Date().toISOString(),
   createdAt: new Date().toISOString(),
   steps: [],
};

describe("getWorkflows", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      requireUserMock.mockResolvedValue({
         id: userId,
         name: "User",
         email: "u@test.com",
      });
   });

   it("returns workflows list", async () => {
      (workflowServiceMock.getWorkflows as jest.Mock).mockResolvedValue([
         baseWorkflow,
      ]);

      const result = await getWorkflows();
      expect(result).toEqual([baseWorkflow]);
   });

   it("returns empty array on authentication failure", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      requireUserMock.mockRejectedValue(new Error("Unauthenticated"));

      const result = await getWorkflows();
      expect(result).toEqual([]);
   });
});

describe("getWorkflow", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      requireUserMock.mockResolvedValue({
         id: userId,
         name: "User",
         email: "u@test.com",
      });
   });

   it("returns null for invalid UUID", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      const result = await getWorkflow("not-a-uuid");
      expect(result).toBeNull();
   });

   it("returns workflow by ID", async () => {
      (workflowServiceMock.getWorkflow as jest.Mock).mockResolvedValue(
         baseWorkflow
      );

      const result = await getWorkflow(workflowId);
      expect(result).toEqual(baseWorkflow);
   });
});

describe("createWorkflow", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      requireUserMock.mockResolvedValue({
         id: userId,
         name: "User",
         email: "u@test.com",
      });
   });

   it("returns success with workflow data", async () => {
      (workflowServiceMock.createWorkflow as jest.Mock).mockResolvedValue(
         baseWorkflow
      );

      const result = await createWorkflow({ title: "My Workflow" });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(baseWorkflow);
   });

   it("returns upgradeRequired when FREE user tries to create", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      (workflowServiceMock.createWorkflow as jest.Mock).mockRejectedValue(
         new SubscriptionAccessError(
            "Workflows sind nur für BASIC",
            "canUseWorkflows"
         )
      );

      const result = await createWorkflow({ title: "Workflow" });

      expect(result.success).toBe(false);
      expect(result.upgradeRequired).toBe(true);
   });

   it("returns upgradeRequired when BASIC limit reached", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      (workflowServiceMock.createWorkflow as jest.Mock).mockRejectedValue(
         new WorkflowLimitError("WORKFLOW_LIMIT_REACHED", "Limit erreicht")
      );

      const result = await createWorkflow({ title: "Workflow" });

      expect(result.success).toBe(false);
      expect(result.upgradeRequired).toBe(true);
   });

   it("returns failure on general error", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      (workflowServiceMock.createWorkflow as jest.Mock).mockRejectedValue(
         new Error("Unexpected")
      );

      const result = await createWorkflow({ title: "Workflow" });

      expect(result.success).toBe(false);
      expect(result.upgradeRequired).toBeUndefined();
   });
});

describe("updateWorkflow", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      requireUserMock.mockResolvedValue({
         id: userId,
         name: "User",
         email: "u@test.com",
      });
   });

   it("returns null for invalid UUID", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      const result = await updateWorkflow("not-a-uuid", { title: "New" });
      expect(result.success).toBe(false);
   });

   it("returns success on update", async () => {
      (workflowServiceMock.updateWorkflow as jest.Mock).mockResolvedValue({
         ...baseWorkflow,
         title: "Updated",
      });

      const result = await updateWorkflow(workflowId, { title: "Updated" });

      expect(result.success).toBe(true);
      expect(result.data?.title).toBe("Updated");
   });
});

describe("deleteWorkflow", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      requireUserMock.mockResolvedValue({
         id: userId,
         name: "User",
         email: "u@test.com",
      });
   });

   it("returns success on delete", async () => {
      (workflowServiceMock.deleteWorkflow as jest.Mock).mockResolvedValue(
         undefined
      );

      const result = await deleteWorkflow(workflowId);
      expect(result.success).toBe(true);
   });

   it("returns failure on error", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      (workflowServiceMock.deleteWorkflow as jest.Mock).mockRejectedValue(
         new Error("Not found")
      );

      const result = await deleteWorkflow(workflowId);
      expect(result.success).toBe(false);
   });
});

describe("createWorkflowStep", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      requireUserMock.mockResolvedValue({
         id: userId,
         name: "User",
         email: "u@test.com",
      });
   });

   it("returns upgradeRequired when step limit reached", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      (workflowServiceMock.createWorkflowStep as jest.Mock).mockRejectedValue(
         new WorkflowLimitError("STEP_LIMIT_REACHED", "Max steps reached")
      );

      const result = await createWorkflowStep(workflowId, {
         title: "Step",
         type: "STANDALONE",
         content: "text",
         isStart: false,
         position: 10,
         edges: [],
      });

      expect(result.success).toBe(false);
      expect(result.upgradeRequired).toBe(true);
   });
});
