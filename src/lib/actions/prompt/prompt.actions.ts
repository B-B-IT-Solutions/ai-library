import { DPrompt } from "@/data/domain/prompt";
import { getPrompts as getPPrompts } from "@/db/queries/prompt";
import { toDPrompts } from "./prompt.mapper";

export const getPrompts = async (): Promise<DPrompt[]> => {
   const data = await getPPrompts();
   return toDPrompts(data);
};
