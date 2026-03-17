type IubendaConsentSubject = {
   id: string;
   email: string;
   full_name?: string;
};

type IubendaConsentPayload = {
   subject: IubendaConsentSubject;
   legal_notices: { identifier: string }[];
   proofs: { content: string; form: string }[];
   timestamp: string;
};

export async function recordIubendaConsent(params: {
   userId: string;
   email: string;
   fullName: string;
   consentAcceptedAt: Date;
}): Promise<void> {
   const apiKey = process.env.IUBENDA_API_KEY;
   if (!apiKey) {
      console.warn(
         "[iubenda] IUBENDA_API_KEY not set – skipping consent recording"
      );
      return;
   }

   const payload: IubendaConsentPayload = {
      subject: {
         id: params.userId,
         email: params.email,
         full_name: params.fullName,
      },
      legal_notices: [
         { identifier: "privacy_policy" },
         { identifier: "terms_and_conditions" },
      ],
      proofs: [
         {
            content: JSON.stringify({
               action: "registration",
               source: "signup_form",
               accepted_at: params.consentAcceptedAt.toISOString(),
            }),
            form: "Registrierungsformular – Checkbox: AGB und Datenschutzerklärung",
         },
      ],
      timestamp: params.consentAcceptedAt.toISOString(),
   };

   try {
      const response = await fetch("https://consent.iubenda.com/consent", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            ApiKey: apiKey,
         },
         body: JSON.stringify(payload),
      });

      if (!response.ok) {
         const body = await response.text();
         console.error(
            `[iubenda] Consent recording failed (${response.status}): ${body}`
         );
      }
   } catch (error) {
      console.error("[iubenda] Consent recording request failed:", error);
   }
}
