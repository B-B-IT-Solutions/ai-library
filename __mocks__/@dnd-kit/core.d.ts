type MockDragEndEvent = {
   active: { id: string | number };
   over: { id: string | number } | null;
};

declare module "@dnd-kit/core" {
   export function triggerDragEnd(event: MockDragEndEvent): void;
}
