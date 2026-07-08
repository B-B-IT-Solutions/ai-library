import { FC } from "react";

import { Button } from "@/components/shadcn/button";

type IntroScreenProps = {
   onStart: () => void;
};

export const IntroScreen: FC<IntroScreenProps> = ({ onStart }) => {
   return (
      <div
         className="flex flex-col items-center text-center"
         data-testid="intro-screen"
      >
         <div className="mb-6 text-5xl">🤖</div>
         <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Wie gut hast du KI wirklich in deinen Alltag integriert?
         </h1>
         <p className="mb-8 max-w-lg text-lg text-slate-600">
            Mach den kostenlosen 2-Minuten-Check und erfahre, wo du stehst —
            und was dein nächster Schritt sein sollte.
         </p>
         <Button
            size="lg"
            onClick={onStart}
            className="px-8 text-base"
            data-testid="intro-start-button"
         >
            Jetzt Check starten →
         </Button>
         <p className="mt-4 text-sm text-slate-400">
            Dauert ca. 2 Minuten · Kostenlos · Sofort-Ergebnis
         </p>
      </div>
   );
};
