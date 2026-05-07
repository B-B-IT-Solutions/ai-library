import {
   emailVerificationHtml,
   emailVerificationText,
   passwordResetHtml,
   passwordResetText,
} from "./utils";

const expectedEmailVerificationHtml = (
   senderName: string,
   userName: string,
   verificationUrl: string
): string => {
   return `<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
  <h2>Hallo ${userName},</h2>
  <p>Willkommen bei ${senderName}! Bitte bestätige deine E-Mail-Adresse, um dein Konto zu aktivieren.</p>
  <p style="margin:32px 0">
    <a href="${verificationUrl}" style="background:#000;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">
      E-Mail bestätigen
    </a>
  </p>
  <p style="color:#666;font-size:14px">Dieser Link ist 24 Stunden gültig.</p>
  <p style="color:#666;font-size:14px">Falls du kein Konto bei ${senderName} erstellt hast, kannst du diese E-Mail ignorieren.</p>
</body>
</html>`;
};

const expectedEmailVerificationText = (
   senderName: string,
   userName: string,
   verificationUrl: string
): string => {
   return `Hallo ${userName},\n\nWillkommen bei ${senderName}! Bitte bestätige deine E-Mail-Adresse:\n\n${verificationUrl}\n\nDieser Link ist 24 Stunden gültig.\n\nFalls du kein Konto erstellt hast, kannst du diese E-Mail ignorieren.`;
};

const expectedPasswordResetHtml = (
   senderName: string,
   userName: string,
   resetUrl: string
): string => {
   return `<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
  <h2>Hallo ${userName},</h2>
  <p>Du hast eine Zurücksetzung deines Passworts bei ${senderName} angefordert.</p>
  <p style="margin:32px 0">
    <a href="${resetUrl}" style="background:#000;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">
      Passwort zurücksetzen
    </a>
  </p>
  <p style="color:#666;font-size:14px">Dieser Link ist 1 Stunde gültig.</p>
  <p style="color:#666;font-size:14px">Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren.</p>
</body>
</html>`;
};

const expectedPasswordResetText = (
   senderName: string,
   userName: string,
   resetUrl: string
): string => {
   return `Hallo ${userName},\n\nDu hast eine Zurücksetzung deines Passworts bei ${senderName} angefordert.\n\n${resetUrl}\n\nDieser Link ist 1 Stunde gültig.\n\nFalls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren.`;
};

describe("email verification tests", () => {
   it("emailVerificationHtml - test", async () => {
      const senderName = "Vision Notes";
      const userName = "Test User";
      const verificationUrl = "https://example.com/verify?token=abc123";

      const result = emailVerificationHtml(
         senderName,
         userName,
         verificationUrl
      );
      const expectedResult = expectedEmailVerificationHtml(
         senderName,
         userName,
         verificationUrl
      );

      expect(result).toEqual(expectedResult);
   });

   it("emailVerificationText - test", async () => {
      const senderName = "Vision Notes";
      const userName = "Test User";
      const verificationUrl = "https://example.com/verify?token=abc123";

      const result = emailVerificationText(
         senderName,
         userName,
         verificationUrl
      );
      const expectedResult = expectedEmailVerificationText(
         senderName,
         userName,
         verificationUrl
      );

      expect(result).toEqual(expectedResult);
   });
});

describe("password reset tests", () => {
   it("passwordResetHtml - test", async () => {
      const senderName = "Vision Notes";
      const userName = "Test User";
      const resetUrl = "https://example.com/verify?token=abc123";

      const result = passwordResetHtml(senderName, userName, resetUrl);
      const expectedResult = expectedPasswordResetHtml(
         senderName,
         userName,
         resetUrl
      );

      expect(result).toEqual(expectedResult);
   });

   it("passwordResetText - test", async () => {
      const senderName = "Vision Notes";
      const userName = "Test User";
      const resetUrl = "https://example.com/verify?token=abc123";

      const result = passwordResetText(senderName, userName, resetUrl);
      const expectedResult = expectedPasswordResetText(
         senderName,
         userName,
         resetUrl
      );

      expect(result).toEqual(expectedResult);
   });
});
