export class CategoryNameConflictError extends Error {
   constructor(public readonly conflictingCategoryName: string) {
      super(
         `Eine Kategorie mit dem Namen "${conflictingCategoryName}" existiert bereits. ` +
            `Nutze stattdessen „Zusammenführen“, um beide Kategorien zu vereinen.`
      );
      this.name = "CategoryNameConflictError";
      Object.setPrototypeOf(this, CategoryNameConflictError.prototype);
   }
}
