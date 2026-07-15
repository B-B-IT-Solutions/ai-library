export class CategoryNameConflictError extends Error {
   constructor(public readonly conflictingCategoryName: string) {
      super(
         `Eine Kategorie mit dem Namen "${conflictingCategoryName}" existiert bereits. ` +
            `Bitte wähle einen anderen Namen.`
      );
      this.name = "CategoryNameConflictError";
      Object.setPrototypeOf(this, CategoryNameConflictError.prototype);
   }
}
