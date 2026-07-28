import {
   ExternalLink,
   GitBranch,
   Layers,
   ListChecks,
   MousePointerClick,
   Sparkles,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/shadcn/card";
import { PublicLayoutWrapper } from "@/components/shared/wrappers/layout";
import { APP_NAME } from "@/lib/constants";

type Step = {
   icon: React.ComponentType<{ className?: string }>;
   title: string;
   description: string;
};

const steps: Step[] = [
   {
      icon: ListChecks,
      title: "1. Prompt auswählen",
      description:
         "Kuratierte Vorlage aus der Bibliothek suchen – nach Kategorie oder Stichwort.",
   },
   {
      icon: MousePointerClick,
      title: "2. Felder ausfüllen",
      description:
         "Kein Prompt-Engineering nötig: Formularfelder statt kryptischem Fließtext.",
   },
   {
      icon: ExternalLink,
      title: "3. Direkt loslegen",
      description:
         "Mit einem Klick in ChatGPT, Claude, Gemini oder Perplexity öffnen – oder in deine Library übernehmen.",
   },
];

type Highlight = {
   icon: React.ComponentType<{ className?: string }>;
   title: string;
   description: string;
};

const highlights: Highlight[] = [
   {
      icon: Sparkles,
      title: "Für Einsteiger gemacht",
      description:
         "Typisierte Formularfelder statt Textwüsten – auch ohne Prompt-Engineering-Wissen sofort startklar.",
   },
   {
      icon: GitBranch,
      title: "Nie wieder eine gute Version verlieren",
      description:
         "Jede Änderung wird versioniert. Vergleiche Stände, spring zurück – kein Wettbewerber bietet das.",
   },
   {
      icon: MousePointerClick,
      title: "Kein Copy-Paste-Chaos mehr",
      description:
         "Ausfüllen, prüfen, direkt im gewünschten KI-Tool öffnen – ganz ohne manuelles Kopieren.",
   },
   {
      icon: Layers,
      title: "Wächst mit deinem Bedarf",
      description:
         "Kuratierte Bibliothek im Abo plus einzeln kaufbare Premium-Vorlagen – so flexibel wie kein anderer Anbieter.",
   },
];

const SignUpCta = ({ label }: { label: string }) => (
   <div className="flex flex-wrap justify-center gap-4">
      <Button size="lg" asChild>
         <Link href="/auth/sign-up">{label}</Link>
      </Button>
      <Button size="lg" variant="outline" asChild>
         <Link href="/explore">Prompts entdecken</Link>
      </Button>
   </div>
);

export const RootPage = async () => {
   return (
      <PublicLayoutWrapper>
         <div
            className="min-h-[calc(100vh-3.5rem)] w-full"
            data-testid="public-page"
         >
            <div className="container mx-auto px-4 py-16 md:py-24">
               <div className="mx-auto max-w-6xl space-y-24">
                  <div className="space-y-6 text-center" data-testid="hero">
                     <div className="space-y-4">
                        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
                           KI-Prompts, die einfach funktionieren
                        </h1>
                        <p className="mx-auto max-w-3xl text-xl text-muted-foreground md:text-2xl">
                           Kein Prompt-Engineering nötig: Vorlage wählen,
                           Formularfelder ausfüllen, in ChatGPT, Claude &amp;
                           Co. öffnen. Kostenlos starten – ohne Kreditkarte.
                        </p>
                     </div>
                     <SignUpCta label="Kostenlos starten" />
                  </div>

                  <div data-testid="steps-section">
                     <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight md:text-3xl">
                        So einfach geht&apos;s
                     </h2>
                     <div className="grid gap-4 sm:grid-cols-3">
                        {steps.map(({ icon: Icon, title, description }) => (
                           <Card key={title} data-testid="step-card">
                              <CardHeader>
                                 <Icon className="mb-2 h-8 w-8 text-primary" />
                                 <CardTitle className="text-base">
                                    {title}
                                 </CardTitle>
                              </CardHeader>
                              <CardContent>
                                 <CardDescription>
                                    {description}
                                 </CardDescription>
                              </CardContent>
                           </Card>
                        ))}
                     </div>
                  </div>

                  <div data-testid="highlights-section">
                     <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight md:text-3xl">
                        Warum {APP_NAME}
                     </h2>
                     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {highlights.map(
                           ({ icon: Icon, title, description }) => (
                              <Card key={title} data-testid="highlight-card">
                                 <CardHeader>
                                    <Icon className="mb-2 h-8 w-8 text-primary" />
                                    <CardTitle className="text-base">
                                       {title}
                                    </CardTitle>
                                 </CardHeader>
                                 <CardContent>
                                    <CardDescription>
                                       {description}
                                    </CardDescription>
                                 </CardContent>
                              </Card>
                           )
                        )}
                     </div>
                  </div>

                  <div
                     className="space-y-6 text-center"
                     data-testid="final-cta"
                  >
                     <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                        Bereit, es auszuprobieren?
                     </h2>
                     <SignUpCta label="Jetzt kostenlos starten" />
                  </div>
               </div>
            </div>
         </div>
      </PublicLayoutWrapper>
   );
};

export default RootPage;
