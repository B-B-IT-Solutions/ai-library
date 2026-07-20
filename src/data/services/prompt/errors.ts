export class NameConflictError extends Error {
   constructor(type: string, name: string) {
      super(
         `"${type}" mit dem Namen "${name}" existiert bereits. ` +
            `Bitte wähle einen anderen Namen.`
      );
      this.name = "NameConflictError";
      Object.setPrototypeOf(this, NameConflictError.prototype);
   }
}
