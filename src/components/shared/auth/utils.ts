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

export const getStrengthColor = (strength: PasswordStrength) => {
   switch (strength) {
      case "weak":
         return "bg-red-500";
      case "medium":
         return "bg-yellow-500";
      case "strong":
         return "bg-green-500";
   }
};

export const getStrengthWidth = (strength: PasswordStrength) => {
   switch (strength) {
      case "weak":
         return "w-1/3";
      case "medium":
         return "w-2/3";
      case "strong":
         return "w-full";
   }
};
