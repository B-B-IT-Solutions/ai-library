"use server";

import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { WorkflowLimitError } from "@/data/services/workflow";
import { DbClient } from "@/data/types/db/common";
import {
   DWorkflow,
   DWorkflowStepCreate,
   DWorkflowStepUpdate,
   DWorkflowsUsage,
   DWorkflowUpdate,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";
import { ActionResult } from "@/data/types/utils";
import { SubscriptionAccessError } from "@/lib/subscription/server-guards";

export const getWorkflows = async (): Promise<DWorkflow[]> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getWorkflows(user.id);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const getWorkflowWithSteps = async (
   workflowId: string
): Promise<DWorkflowWithSteps | null> => {
   try {
      if (!isValidUuid(workflowId)) {
         throw new Error("Invalid Workflow-ID.");
      }
      const user = await requireUser();
      const service = getService();
      return await service.getWorkflowWithSteps(user.id, workflowId);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

export const getWorkflowsUsage = async (): Promise<DWorkflowsUsage> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getWorkflowsUsage(user.id);
   } catch (error) {
      console.error(formatError(error));
      return { current: 0, limit: 0 };
   }
};

export const createWorkflow = async (
   data: DWorkflowUpdate
): Promise<ActionResult<DWorkflow>> => {
   try {
      const user = await requireUser();
      const service = getService();
      const workflow = await service.createWorkflow(user.id, data);
      return {
         success: true,
         message: "Workflow erfolgreich erstellt",
         data: workflow,
      };
   } catch (error) {
      console.error(formatError(error));
      if (error instanceof SubscriptionAccessError) {
         return {
            success: false,
            message: error.message,
            upgradeRequired: true,
         };
      }
      if (error instanceof WorkflowLimitError) {
         return {
            success: false,
            message: error.message,
            upgradeRequired: error.code === "WORKFLOW_LIMIT_REACHED",
         };
      }
      return {
         success: false,
         message: "Workflow konnte nicht erstellt werden",
      };
   }
};

export const updateWorkflow = async (
   workflowId: string,
   data: DWorkflowUpdate
): Promise<ActionResult<DWorkflow>> => {
   try {
      if (!isValidUuid(workflowId)) {
         throw new Error("Invalid Workflow-ID.");
      }
      const user = await requireUser();
      const service = getService();
      const workflow = await service.updateWorkflow(user.id, workflowId, data);
      return {
         success: true,
         message: "Workflow erfolgreich aktualisiert",
         data: workflow,
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Workflow konnte nicht aktualisiert werden",
      };
   }
};

export const deleteWorkflow = async (
   workflowId: string
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(workflowId)) {
         throw new Error("Invalid Workflow-ID.");
      }
      const user = await requireUser();
      const service = getService();
      await service.deleteWorkflow(user.id, workflowId);
      return { success: true, message: "Workflow erfolgreich gelöscht" };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Workflow konnte nicht gelöscht werden",
      };
   }
};

export const createWorkflowStep = async (
   workflowId: string,
   data: DWorkflowStepCreate
): Promise<ActionResult<DWorkflowWithSteps>> => {
   try {
      if (!isValidUuid(workflowId)) {
         throw new Error("Invalid Workflow-ID.");
      }
      const user = await requireUser();
      const service = getService();
      const workflow = await service.createWorkflowStep(
         user.id,
         workflowId,
         data
      );
      return {
         success: true,
         message: "Schritt erfolgreich hinzugefügt",
         data: workflow,
      };
   } catch (error) {
      console.error(formatError(error));
      if (error instanceof WorkflowLimitError) {
         return {
            success: false,
            message: error.message,
            upgradeRequired: error.code === "STEP_LIMIT_REACHED",
         };
      }
      return {
         success: false,
         message: "Schritt konnte nicht hinzugefügt werden",
      };
   }
};

export const updateWorkflowStep = async (
   stepId: string,
   workflowId: string,
   data: DWorkflowStepUpdate
): Promise<ActionResult<DWorkflowWithSteps>> => {
   try {
      if (!isValidUuid(stepId)) {
         throw new Error("Invalid Schritt-ID.");
      }
      if (!isValidUuid(workflowId)) {
         throw new Error("Invalid Workflow-ID.");
      }
      const user = await requireUser();
      const service = getService();
      const workflow = await service.updateWorkflowStep(
         user.id,
         stepId,
         workflowId,
         data
      );
      return {
         success: true,
         message: "Schritt erfolgreich aktualisiert",
         data: workflow,
      };
   } catch (error) {
      console.error(formatError(error));
      const msg = formatError(error);
      if (msg.includes("Endlosschleife")) {
         return {
            success: false,
            message: "Diese Verbindung erzeugt eine Endlosschleife",
         };
      }
      return {
         success: false,
         message: "Schritt konnte nicht aktualisiert werden",
      };
   }
};

export const deleteWorkflowStep = async (
   stepId: string,
   workflowId: string
): Promise<ActionResult<DWorkflowWithSteps>> => {
   try {
      if (!isValidUuid(stepId)) {
         throw new Error("Invalid Schritt-ID.");
      }
      if (!isValidUuid(workflowId)) {
         throw new Error("Invalid Workflow-ID.");
      }
      const user = await requireUser();
      const service = getService();
      const workflow = await service.deleteWorkflowStep(
         user.id,
         stepId,
         workflowId
      );
      return {
         success: true,
         message: "Schritt erfolgreich gelöscht",
         data: workflow,
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Schritt konnte nicht gelöscht werden",
      };
   }
};

export const setStartStep = async (
   workflowId: string,
   stepId: string
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(workflowId)) {
         throw new Error("Invalid Workflow-ID.");
      }
      if (!isValidUuid(stepId)) {
         throw new Error("Invalid Schritt-ID.");
      }
      const user = await requireUser();
      const service = getService();
      await service.setStartStep(user.id, workflowId, stepId);
      return {
         success: true,
         message: "Startschritt gesetzt",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Startschritt konnte nicht gesetzt werden",
      };
   }
};

export const getWorkflowForRunner = async (
   workflowId: string
): Promise<DWorkflowWithSteps | null> => {
   try {
      if (!isValidUuid(workflowId)) {
         throw new Error("Invalid Workflow-ID.");
      }
      const user = await requireUser();
      const service = getService();
      return await service.getWorkflowWithSteps(user.id, workflowId);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

const getService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getWorkflowService();
};
