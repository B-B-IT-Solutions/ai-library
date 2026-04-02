import { PrismaClient } from "@prisma/client";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";

import { LibraryRepository } from "./library.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const libraryRepository = new LibraryRepository(prismaMock);
