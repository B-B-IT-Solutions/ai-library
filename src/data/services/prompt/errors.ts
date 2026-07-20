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

export class ModelNameConflictError extends Error {
   constructor(public readonly modelName: string) {
      super(
         `Ein Modell mit dem Namen "${modelName}" existiert bereits. ` +
            `Bitte wähle einen anderen Namen.`
      );
      this.name = "ModelNameConflictError";
      Object.setPrototypeOf(this, ModelNameConflictError.prototype);
   }
}
