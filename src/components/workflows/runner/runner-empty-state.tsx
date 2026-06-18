"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";

type Props = {
   workflowId: string;
   message: string;
};

export const RunnerEmptyState = ({ workflowId, message }: Props) => (
   <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <AlertTriangle className="h-12 w-12 text-yellow-500" />
      <h2 className="text-xl font-semibold">{message}</h2>
      <Button asChild>
         <Link href={`/workflows/${workflowId}/edit`}>Zum Editor</Link>
      </Button>
   </div>
);
