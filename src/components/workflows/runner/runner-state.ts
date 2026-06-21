export type RunnerAction =
   | { type: "ADVANCE"; toEdgeId: string }
   | { type: "GO_BACK" }
   | { type: "RESTART" };

export const runnerReducer = (
   state: RunnerState,
   action: RunnerAction
): RunnerState => {
   switch (action.type) {
      case "ADVANCE": return state.advance(action.toEdgeId);
      case "GO_BACK": return state.goBack();
      case "RESTART": return state.restart();
   }
};

export class RunnerState {
   constructor(
      readonly currentEdgeId: string,
      readonly previousEdgeIds: ReadonlyArray<string> = [],
      private readonly startEdgeId: string = currentEdgeId
   ) {}

   get canGoBack(): boolean {
      return this.previousEdgeIds.length > 0;
   }

   get stepCount(): number {
      return this.previousEdgeIds.length + 1;
   }

   advance(toEdgeId: string): RunnerState {
      return new RunnerState(toEdgeId, [...this.previousEdgeIds, this.currentEdgeId], this.startEdgeId);
   }

   goBack(): RunnerState {
      const previousEdgeIds = [...this.previousEdgeIds];
      const currentEdgeId = previousEdgeIds.pop() ?? this.currentEdgeId;
      return new RunnerState(currentEdgeId, previousEdgeIds, this.startEdgeId);
   }

   restart(): RunnerState {
      return new RunnerState(this.startEdgeId, [], this.startEdgeId);
   }
}
