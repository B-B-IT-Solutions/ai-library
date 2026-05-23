import { isEmpty, map } from "es-toolkit/compat";
import { Bot, Sparkles, Tag } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { BreadcrumbLinkProps } from "@/components/shared/breadcrumbs";
import { MDRenderer } from "@/components/shared/md";
import { DCollection } from "@/data/types/domain/collection";
import { DPrompt, DPromptWithContent } from "@/data/types/domain/prompt";
import { TemplateBreadcrumb } from "../../breadcrumbs";

import { PromptText } from "./form";

type Props = {
   descriptor: DPrompt;
   template: DPromptWithContent;
   collection?: DCollection | null;
};

export const PublicTemplateView = ({
   descriptor,
   template,
   collection,
}: Props) => {
   const hasCategories = !isEmpty(descriptor.categories);
   const isCollection = !!collection?.publicToken;

   const breadcrumbRoot: BreadcrumbLinkProps = {
      href: isCollection
         ? `/preview/collections/${collection.publicToken}`
         : "/preview/marketplace",
      label: isCollection ? collection.name : "Bibliothek",
   };

   return (
      <div className="bg-slate-50" data-testid="public-template-view">
         {/* Page header */}
         <div className="border-b bg-white">
            <div className="container mx-auto max-w-5xl px-4 py-6">
               <div className="mb-4">
                  <TemplateBreadcrumb
                     variant="view"
                     label={descriptor.title}
                     root={breadcrumbRoot}
                  />
               </div>
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
            <Card className="shadow-sm" data-testid="template-view-public-form">
               <CardHeader className="border-b border-slate-100 pb-5">
                  <h2 className="text-lg font-semibold text-slate-900">
                     Beschreibung
                  </h2>
                  <div className="prose prose-slate max-w-none text-slate-600">
                     <MDRenderer>{descriptor.description}</MDRenderer>
                  </div>
               </CardHeader>

               <CardContent className="pt-6">
                  <PromptText prompt={template} />
               </CardContent>
            </Card>

            {/* CTA */}
            <div className="mt-8 rounded-2xl border border-primary/20 bg-linear-to-br from-primary/5 via-background to-primary/10 p-8 text-center">
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
         </div>
      </div>
   );
};
