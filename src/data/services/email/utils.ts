export const emailVerificationHtml = (
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

export const emailVerificationText = (
   senderName: string,
   userName: string,
   verificationUrl: string
): string => {
   return `Hallo ${userName},\n\nWillkommen bei ${senderName}! Bitte bestätige deine E-Mail-Adresse:\n\n${verificationUrl}\n\nDieser Link ist 24 Stunden gültig.\n\nFalls du kein Konto erstellt hast, kannst du diese E-Mail ignorieren.`;
};

export const passwordResetHtml = (
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

export const passwordResetText = (
   senderName: string,
   userName: string,
   resetUrl: string
): string => {
   return `Hallo ${userName},\n\nDu hast eine Zurücksetzung deines Passworts bei ${senderName} angefordert.\n\n${resetUrl}\n\nDieser Link ist 1 Stunde gültig.\n\nFalls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren.`;
};
