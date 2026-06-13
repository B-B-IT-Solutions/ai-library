import { DWorkflowStepWithOutgoingEdges } from "@/data/types/domain/workflow";

import { detectCycle } from "./utils";

const step = (
   id: string,
   toStepIds: string[] = []
): DWorkflowStepWithOutgoingEdges => ({
   id,
   outgoingEdges: toStepIds.map((toStepId) => ({ toStepId })),
});

describe("detectCycle tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("empty steps - test", () => {
      expect(() => detectCycle([], "a", [])).not.toThrow();
   });

   it("single step no edges - test", () => {
      const steps = [step("a")];
      expect(() => detectCycle(steps, "a", [])).not.toThrow();
   });

   it("two steps linear A→B - test", () => {
      const steps = [step("a", ["b"]), step("b")];
      expect(() => detectCycle(steps, "a", ["b"])).not.toThrow();
   });

   it("linear chain A→B→C - test", () => {
      const steps = [step("a", ["b"]), step("b", ["c"]), step("c")];
      expect(() => detectCycle(steps, "c", [])).not.toThrow();
   });

   it("disconnected graph no cycle - test", () => {
      const steps = [step("a", ["b"]), step("b"), step("c", ["d"]), step("d")];
      expect(() => detectCycle(steps, "c", ["d"])).not.toThrow();
   });

   it("proposed edges replace old edges, no cycle - test", () => {
      // a previously pointed to b, now we propose a→c instead
      const steps = [step("a", ["b"]), step("b"), step("c")];
      expect(() => detectCycle(steps, "a", ["c"])).not.toThrow();
   });

   it("proposed edge creates no cycle - test", () => {
      const steps = [step("a"), step("b"), step("c")];
      expect(() => detectCycle(steps, "a", ["b"])).not.toThrow();
   });

   it("self-loop throws - test", () => {
      const steps = [step("a")];
      expect(() => detectCycle(steps, "a", ["a"])).toThrow(
         "Diese Verbindung erzeugt eine Endlosschleife"
      );
   });

   it("two-node cycle A→B, B→A throws - test", () => {
      const steps = [step("a", ["b"]), step("b")];
      expect(() => detectCycle(steps, "b", ["a"])).toThrow(
         "Diese Verbindung erzeugt eine Endlosschleife"
      );
   });

   it("three-node cycle A→B→C, C→A throws - test", () => {
      const steps = [step("a", ["b"]), step("b", ["c"]), step("c")];
      expect(() => detectCycle(steps, "c", ["a"])).toThrow(
         "Diese Verbindung erzeugt eine Endlosschleife"
      );
   });

   it("proposed edges replace existing, creating cycle throws - test", () => {
      // a→b→c exists; we propose b→a (replacing b→c), creating a→b→a
      const steps = [step("a", ["b"]), step("b", ["c"]), step("c")];
      expect(() => detectCycle(steps, "b", ["a"])).toThrow(
         "Diese Verbindung erzeugt eine Endlosschleife"
      );
   });

   it("branching graph no cycle - test", () => {
      // a→b, a→c, b→d, c→d
      const steps = [
         step("a", ["b", "c"]),
         step("b", ["d"]),
         step("c", ["d"]),
         step("d"),
      ];
      expect(() => detectCycle(steps, "a", ["b", "c"])).not.toThrow();
   });

   it("edge points to unknown step id - test", () => {
      // "b" is not in steps → adj.get("b") returns undefined → ?? [] fallback
      const steps = [step("a", ["b"])];
      expect(() => detectCycle(steps, "a", ["b"])).not.toThrow();
   });

   it("branching graph with cycle throws - test", () => {
      // a→b, a→c, b→d, d→a
      const steps = [
         step("a", ["b", "c"]),
         step("b", ["d"]),
         step("c"),
         step("d"),
      ];
      expect(() => detectCycle(steps, "d", ["a"])).toThrow(
         "Diese Verbindung erzeugt eine Endlosschleife"
      );
   });
});
