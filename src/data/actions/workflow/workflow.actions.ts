"use server";

import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import { EMPTY_PAGE } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DWorkflow,
   DWorkflowsPage,
   DWorkflowsPageQuery,
   DWorkflowsUsage,
   DWorkflowUpdate,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";
import { ActionResult } from "@/data/types/utils";
import { SubscriptionAccessError } from "@/lib/subscription/server-guards";

export const getWorkflowsPage = async (
   query?: DWorkflowsPageQuery
): Promise<DWorkflowsPage> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getWorkflowsPage(user.id, query);
   } catch (error) {
      console.error(formatError(error));
      return EMPTY_PAGE;
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
