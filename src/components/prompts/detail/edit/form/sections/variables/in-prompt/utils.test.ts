import { borderCss, resolveDragEnd } from "./utils";

describe("resolveDragEnd tests", () => {
   const fields = [{ id: "a" }, { id: "b" }, { id: "c" }];

   it("moves from index 0 to index 1 - test", () => {
      const onMoveField = jest.fn();
      resolveDragEnd("a", "b", fields, onMoveField);
      expect(onMoveField).toHaveBeenCalledWith(0, 1);
   });

   it("moves from last to first index - test", () => {
      const onMoveField = jest.fn();
      resolveDragEnd("c", "a", fields, onMoveField);
      expect(onMoveField).toHaveBeenCalledWith(2, 0);
   });

   it("same active and over id - does not call onMoveField - test", () => {
      const onMoveField = jest.fn();
      resolveDragEnd("a", "a", fields, onMoveField);
      expect(onMoveField).not.toHaveBeenCalled();
   });

   it("overId undefined - does not call onMoveField - test", () => {
      const onMoveField = jest.fn();
      resolveDragEnd("a", undefined, fields, onMoveField);
      expect(onMoveField).not.toHaveBeenCalled();
   });

   it("activeId not in fields - does not call onMoveField - test", () => {
      const onMoveField = jest.fn();
      resolveDragEnd("unknown", "b", fields, onMoveField);
      expect(onMoveField).not.toHaveBeenCalled();
   });

   it("overId not in fields - does not call onMoveField - test", () => {
      const onMoveField = jest.fn();
      resolveDragEnd("a", "unknown", fields, onMoveField);
      expect(onMoveField).not.toHaveBeenCalled();
   });
});

describe("borderCss tests", () => {
   const expectErrorBorder = "border-2 border-red-400 bg-red-50";
   const expectIsUsedBorder = "border-green-200 bg-green-50";
   const expectIsNotUsedBorder = "border-orange-200 bg-orange-50";
   const expectNewVaribaleBorder = "border-slate-200 bg-slate-50";

   it("hasErrors true - test", () => {
      const result = borderCss(true, true, true);
      expect(result).toEqual(expectErrorBorder);
   });

   it("hasErrors false - hasName false - test", () => {
      const result = borderCss(false, false, false);
      expect(result).toEqual(expectNewVaribaleBorder);
   });

   it("hasErrors false - hasName true - isUsed true - test", () => {
      const result = borderCss(false, true, true);
      expect(result).toEqual(expectIsUsedBorder);
   });

   it("hasErrors false - hasName true - isUsed false - test", () => {
      const result = borderCss(false, true, false);
      expect(result).toEqual(expectIsNotUsedBorder);
   });
});
