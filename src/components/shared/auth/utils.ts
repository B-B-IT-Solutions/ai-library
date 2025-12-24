export type PasswordStrength = "weak" | "medium" | "strong" | null;

export const getPasswordStrength = (password: string): PasswordStrength => {
   if (!password) {
      return null;
   }
   if (password.length < 6) {
      return "weak";
   }

   let strength = 0;
   if (password.length >= 8) {
      strength++;
   }
   if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      strength++;
   }
   if (/\d/.test(password)) {
      strength++;
   }
   if (/[^a-zA-Z\d]/.test(password)) {
      strength++;
   }

   if (strength <= 1) {
      return "weak";
   }
   if (strength <= 2) {
      return "medium";
   }
   return "strong";
};
