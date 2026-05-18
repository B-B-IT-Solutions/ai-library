export class AiLibAuthenticationError extends Error {
   constructor(message: string) {
      super(message);
      this.name = "AuthenticationError";
      Object.setPrototypeOf(this, AiLibAuthenticationError.prototype);
   }
}
