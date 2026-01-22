import { z } from "zod";

export const updateProfileSchema = z.object({
   name: z.string().min(3, "Name muss mindestens 3 Zeichen lang sein"),
});

export const changePasswordSchema = z
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

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
