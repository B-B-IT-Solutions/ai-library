import { runnerReducer, RunnerState } from "./runner-state";

describe("RunnerState", () => {
   it("initial state - correct values - test", () => {
      const state = new RunnerState("edge-1");
      expect(state.currentEdgeId).toBe("edge-1");
      expect(state.previousEdgeIds).toEqual([]);
      expect(state.canGoBack).toBe(false);
      expect(state.stepCount).toBe(1);
   });

   it("advance - moves to next edge and pushes current to history - test", () => {
      const state = new RunnerState("edge-1").advance("edge-2");
      expect(state.currentEdgeId).toBe("edge-2");
      expect(state.previousEdgeIds).toEqual(["edge-1"]);
      expect(state.canGoBack).toBe(true);
      expect(state.stepCount).toBe(2);
   });

   it("advance multiple times - builds history correctly - test", () => {
      const state = new RunnerState("edge-1")
         .advance("edge-2")
         .advance("edge-3");
      expect(state.currentEdgeId).toBe("edge-3");
      expect(state.previousEdgeIds).toEqual(["edge-1", "edge-2"]);
      expect(state.stepCount).toBe(3);
   });

   it("goBack - returns to previous edge - test", () => {
      const state = new RunnerState("edge-1").advance("edge-2").goBack();
      expect(state.currentEdgeId).toBe("edge-1");
      expect(state.previousEdgeIds).toEqual([]);
      expect(state.canGoBack).toBe(false);
   });

   it("goBack on initial state - stays on current - test", () => {
      const state = new RunnerState("edge-1").goBack();
      expect(state.currentEdgeId).toBe("edge-1");
      expect(state.previousEdgeIds).toEqual([]);
   });

   it("restart - resets to new start edge - test", () => {
      const state = new RunnerState("edge-1")
         .advance("edge-2")
         .advance("edge-3")
         .restart("edge-1");
      expect(state.currentEdgeId).toBe("edge-1");
      expect(state.previousEdgeIds).toEqual([]);
      expect(state.canGoBack).toBe(false);
      expect(state.stepCount).toBe(1);
   });

   it("advance is immutable - original state unchanged - test", () => {
      const original = new RunnerState("edge-1");
      original.advance("edge-2");
      expect(original.currentEdgeId).toBe("edge-1");
      expect(original.previousEdgeIds).toEqual([]);
   });
});

describe("runnerReducer", () => {
   it("ADVANCE - delegates to advance - test", () => {
      const state = new RunnerState("edge-1");
      const next = runnerReducer(state, {
         type: "ADVANCE",
         toEdgeId: "edge-2",
      });
      expect(next.currentEdgeId).toBe("edge-2");
      expect(next.previousEdgeIds).toEqual(["edge-1"]);
   });

   it("GO_BACK - delegates to goBack - test", () => {
      const state = new RunnerState("edge-1").advance("edge-2");
      const next = runnerReducer(state, { type: "GO_BACK" });
      expect(next.currentEdgeId).toBe("edge-1");
      expect(next.previousEdgeIds).toEqual([]);
   });

   it("RESTART - delegates to restart - test", () => {
      const state = new RunnerState("edge-1")
         .advance("edge-2")
         .advance("edge-3");
      const next = runnerReducer(state, {
         type: "RESTART",
         startEdgeId: "edge-1",
      });
      expect(next.currentEdgeId).toBe("edge-1");
      expect(next.previousEdgeIds).toEqual([]);
   });
});
