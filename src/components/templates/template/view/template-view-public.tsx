import { isEmpty, map } from "es-toolkit/compat";
import { ArrowLeft, Bot, Sparkles, Tag } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { MDRenderer } from "@/components/shared/md";
import {
   DPromptTemplate,
   DPromptTemplateDescriptor,
} from "@/data/types/domain/prompt.template";

import { PromptTextDisplay } from "./prompt-text-display";

type Props = {
   descriptor: DPromptTemplateDescriptor;
   template: DPromptTemplate;
};

export const PublicTemplateView = ({ descriptor, template }: Props) => {
   const hasCategories = !isEmpty(descriptor.categories);

   return (
      <div
         className="bg-slate-50"
         data-testid="public-template-view"
      >
         {/* Page header */}
         <div className="border-b bg-white">
            <div className="container mx-auto max-w-5xl px-4 py-6">
               <Link
                  href="/p/marketplace"
                  className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
               >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Zurück zum Marketplace
               </Link>
               <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  {descriptor.title}
               </h1>
               <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                     <Bot className="h-3.5 w-3.5" />
                     {descriptor.recommendedModel}
                  </span>
                  {hasCategories &&
                     map(descriptor.categories, (cat) => (
                        <span
                           key={cat.name}
                           className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm text-slate-600"
                        >
                           <Tag className="h-3 w-3" />
                           {cat.name}
                        </span>
                     ))}
               </div>
            </div>
         </div>

         {/* Content */}
         <div className="container mx-auto max-w-5xl px-4 py-8">
            <Card
               className="shadow-sm"
               data-testid="template-view-public-form"
            >
               <CardHeader className="border-b border-slate-100 pb-5">
                  <h2 className="text-lg font-semibold text-slate-900">
                     Beschreibung
                  </h2>
                  <div className="prose prose-slate max-w-none text-slate-600">
                     <MDRenderer>{descriptor.description}</MDRenderer>
                  </div>
               </CardHeader>

               <CardContent className="pt-6">
                  <PromptTextDisplay template={template} />
               </CardContent>
            </Card>

            {/* CTA */}
            <div className="mt-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10 p-8 text-center">
               <Sparkles className="mx-auto mb-3 h-8 w-8 text-primary" />
               <h3 className="text-xl font-bold text-slate-900">
                  Vorlage verwenden
               </h3>
               <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  Erstelle ein kostenloses Konto, um diese und viele weitere
                  Vorlagen zu nutzen, anzupassen und zu verwalten.
               </p>
               <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <Button size="lg" asChild>
                     <Link href="/auth/sign-up">Kostenlos registrieren</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                     <Link href="/auth/sign-in">Anmelden</Link>
                  </Button>
               </div>
            </div>

            <div className="mt-6 flex justify-center">
               <Link
                  href="/p/marketplace"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
               >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Alle Vorlagen ansehen
               </Link>
            </div>
         </div>
      </div>
   );
};
