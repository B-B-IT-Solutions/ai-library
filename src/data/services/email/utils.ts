import { APP_NAME } from "@/lib/constants";

export const buildHtml = (name: string, url: string): string => {
   return `<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
  <h2>Hallo ${name},</h2>
  <p>Willkommen bei ${APP_NAME}! Bitte bestätige deine E-Mail-Adresse, um dein Konto zu aktivieren.</p>
  <p style="margin:32px 0">
    <a href="${url}" style="background:#000;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">
      E-Mail bestätigen
    </a>
  </p>
  <p style="color:#666;font-size:14px">Dieser Link ist 24 Stunden gültig.</p>
  <p style="color:#666;font-size:14px">Falls du kein Konto bei ${APP_NAME} erstellt hast, kannst du diese E-Mail ignorieren.</p>
</body>
</html>`;
};

export const buildText = (name: string, url: string): string => {
   return `Hallo ${name},\n\nWillkommen bei ${APP_NAME}! Bitte bestätige deine E-Mail-Adresse:\n\n${url}\n\nDieser Link ist 24 Stunden gültig.\n\nFalls du kein Konto erstellt hast, kannst du diese E-Mail ignorieren.`;
};
