import * as React from "react";

export const DndContext = ({ children }: { children: React.ReactNode }) => (
   <>{children}</>
);

export const closestCenter = () => null;

export class PointerSensor {}

export const useSensor = () => null;

export const useSensors = (...args: unknown[]) => args;
