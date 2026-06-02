export const resolveDragEnd = (
   activeId: string | number,
   overId: string | number | undefined,
   fields: { id: string }[],
   onMoveField: (from: number, to: number) => void
) => {
   if (overId == null || activeId === overId) return;
   const from = fields.findIndex((f) => f.id === activeId);
   const to = fields.findIndex((f) => f.id === overId);
   if (from !== -1 && to !== -1) {
      onMoveField(from, to);
   }
};

export const borderCss = (
   hasErrors: boolean,
   hasName: boolean,
   isUsed: boolean
) => {
   if (hasErrors) {
      return "border-2 border-red-400 bg-red-50";
   }
   if (hasName) {
      if (isUsed) {
         return "border-green-200 bg-green-50";
      }
      return "border-orange-200 bg-orange-50";
   }
   return "border-slate-200 bg-slate-50";
};
