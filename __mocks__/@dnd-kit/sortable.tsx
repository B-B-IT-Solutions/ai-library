import * as React from "react";

export const SortableContext = ({
   children,
}: {
   children: React.ReactNode;
}) => <>{children}</>;

export const verticalListSortingStrategy = () => null;

export const useSortable = (_: { id: string }) => ({
   attributes: {},
   listeners: {},
   setNodeRef: () => {},
   transform: null,
   transition: undefined,
   isDragging: false,
});

export const arrayMove = <T,>(arr: T[], from: number, to: number): T[] => {
   const result = [...arr];
   const [item] = result.splice(from, 1);
   result.splice(to, 0, item);
   return result;
};
