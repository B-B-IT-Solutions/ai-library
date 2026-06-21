export type RunnerAction =
   | { type: "ADVANCE"; toEdgeId: string }
   | { type: "GO_BACK" }
   | { type: "RESTART"; startEdgeId: string };

export const runnerReducer = (
   state: RunnerState,
   action: RunnerAction
): RunnerState => {
   switch (action.type) {
      case "ADVANCE":
         return state.advance(action.toEdgeId);
      case "GO_BACK":
         return state.goBack();
      case "RESTART":
         return state.restart(action.startEdgeId);
   }
};

export class RunnerState {
   constructor(
      readonly currentEdgeId: string,
      readonly previousEdgeIds: ReadonlyArray<string> = []
   ) {}

   get canGoBack(): boolean {
      return this.previousEdgeIds.length > 0;
   }

   get stepCount(): number {
      return this.previousEdgeIds.length + 1;
   }

   advance(toEdgeId: string): RunnerState {
      return new RunnerState(toEdgeId, [
         ...this.previousEdgeIds,
         this.currentEdgeId,
      ]);
   }

   goBack(): RunnerState {
      const previousEdgeIds = [...this.previousEdgeIds];
      const currentEdgeId = previousEdgeIds.pop() ?? this.currentEdgeId;
      return new RunnerState(currentEdgeId, previousEdgeIds);
   }

   restart(startEdgeId: string): RunnerState {
      return new RunnerState(startEdgeId);
   }
}
