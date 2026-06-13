export const workflowKeys = {
   all: ["workflows"] as const,
   workflows: () => [...workflowKeys.all, "list"] as const,
   usage: () => [...workflowKeys.all, "usage"] as const,
};
