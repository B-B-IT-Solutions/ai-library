import z from "zod";

export const signInSchema = z.object({
   email: z.email("Invalid email address"),
   password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = z
   .object({
      name: z.string().min(3, "Name must be at least 3 characters"),
      email: z.email("Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z
         .string()
         .min(6, "Confirm password must be at least 6 characters"),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
   });

export const updateProfileSchema = z.object({
   name: z.string().min(3, "Name must be at least 3 characters"),
});

export const updatePasswordSchema = z
   .object({
      currentPassword: z.string().min(1, "Aktuelles Passwort ist erforderlich"),
      newPassword: z
         .string()
         .min(6, "Neues Passwort muss mindestens 6 Zeichen lang sein"),
      confirmPassword: z
         .string()
         .min(1, "Passwort bestätigen ist erforderlich"),
   })
   .refine((data) => data.newPassword !== data.currentPassword, {
      message: "Neues Passwort muss sich vom aktuellen unterscheiden",
      path: ["newPassword"],
   })
   .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwörter stimmen nicht überein",
      path: ["confirmPassword"],
   });

export const deleteAccountSchema = z.object({
   password: z.string().min(1, "Passwort ist erforderlich"),
});
