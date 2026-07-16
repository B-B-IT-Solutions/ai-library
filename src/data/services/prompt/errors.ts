export class CategoryNameConflictError extends Error {
   constructor(public readonly categoryName: string) {
      super(
         `Eine Kategorie mit dem Namen "${categoryName}" existiert bereits. ` +
            `Bitte wähle einen anderen Namen.`
      );
      this.name = "CategoryNameConflictError";
      Object.setPrototypeOf(this, CategoryNameConflictError.prototype);
   }
}
