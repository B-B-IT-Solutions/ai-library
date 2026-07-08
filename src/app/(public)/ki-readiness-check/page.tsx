import type { Metadata } from "next";

import { SurveyContainer } from "@/components/survey/SurveyContainer";

export const metadata: Metadata = {
   title: "KI-Readiness-Check — Wie gut hast du KI integriert?",
   description:
      "Mach den kostenlosen 2-Minuten-Check und erfahre, wo du stehst — und was dein nächster Schritt sein sollte.",
   alternates: {
      canonical: "/ki-readiness-check",
   },
};

const KiReadinessCheckPage = () => {
   return <SurveyContainer />;
};

export default KiReadinessCheckPage;
