/**
 * Detects whether adding edges from `fromStepId` → `newToStepIds`
 * would create a cycle in the workflow's step graph.
 */
export const detectCycle = (
   steps: Array<{ id: string; outgoingEdges: Array<{ toStepId: string }> }>,
   fromStepId: string,
   newToStepIds: string[]
): void => {
   // Build adjacency map with the proposed new edges merged in
   const adj = new Map<string, string[]>();
   for (const s of steps) {
      adj.set(
         s.id,
         s.id === fromStepId
            ? newToStepIds
            : s.outgoingEdges.map((e) => e.toStepId)
      );
   }

   // DFS from every node (handles disconnected graph)
   const visited = new Set<string>();
   const inStack = new Set<string>();

   const dfs = (nodeId: string): boolean => {
      if (inStack.has(nodeId)) return true; // cycle!
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      inStack.add(nodeId);

      for (const neighbour of adj.get(nodeId) ?? []) {
         if (dfs(neighbour)) return true;
      }

      inStack.delete(nodeId);
      return false;
   };

   for (const s of steps) {
      if (!visited.has(s.id)) {
         if (dfs(s.id)) {
            throw new Error("Diese Verbindung erzeugt eine Endlosschleife");
         }
      }
   }
};
