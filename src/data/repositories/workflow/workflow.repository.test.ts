import { PrismaClient } from "@prisma/client";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";

import { WorkflowRepository } from "./workflow.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const repository = new WorkflowRepository(prismaMock);
