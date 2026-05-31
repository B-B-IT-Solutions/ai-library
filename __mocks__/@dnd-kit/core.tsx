import * as React from "react";

type MockDragEndEvent = {
   active: { id: string | number };
   over: { id: string | number } | null;
};

let _onDragEnd: ((event: MockDragEndEvent) => void) | undefined;

export const DndContext = ({
   children,
   onDragEnd,
}: {
   children: React.ReactNode;
   onDragEnd?: (event: MockDragEndEvent) => void;
}) => {
   _onDragEnd = onDragEnd;
   return <>{children}</>;
};

export const triggerDragEnd = (event: MockDragEndEvent) => _onDragEnd?.(event);

export const closestCenter = () => null;

export class PointerSensor {}

export const useSensor = () => null;

export const useSensors = (...args: unknown[]) => args;
